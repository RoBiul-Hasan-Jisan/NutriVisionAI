"""Self-contained email/password authentication: PBKDF2 hashing + JWT sessions.

No external identity provider. Accounts live in the local SQLite database.
"""

from __future__ import annotations

import hashlib
import logging
import os
import secrets
import time
import uuid

import jwt
from fastapi import HTTPException, Request

from .db import cursor

log = logging.getLogger("foodgenome.auth")

# Accounts allowed into the admin console.
ADMIN_EMAILS = {
    e.strip().lower()
    for e in os.environ.get("ADMIN_EMAILS", "").split(",")
    if e.strip()
}

JWT_SECRET = os.environ.get("JWT_SECRET", "")
if not JWT_SECRET:
    # Falls back to a random secret so the app still boots locally, but every
    # restart invalidates existing sessions. Set JWT_SECRET in production.
    JWT_SECRET = secrets.token_hex(32)
    log.warning("JWT_SECRET not set — using an ephemeral key; sessions will not "
                "survive a restart. Set JWT_SECRET in your environment.")

JWT_ALGORITHM = "HS256"
TOKEN_TTL_SECONDS = 30 * 24 * 3600  # 30 days
PBKDF2_ITERATIONS = 260_000


class User:
    def __init__(self, uid: str, email: str | None, name: str | None):
        self.uid = uid
        self.email = (email or "").lower() or None
        self.name = name
        self.picture = None

    @property
    def is_admin(self) -> bool:
        return bool(self.email and self.email in ADMIN_EMAILS)

    def as_dict(self) -> dict:
        return {
            "uid": self.uid,
            "email": self.email,
            "name": self.name,
            "admin": self.is_admin,
        }


# ── password hashing ───────────────────────────────────────────────────


def _hash_password(password: str, salt: str) -> str:
    return hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), bytes.fromhex(salt), PBKDF2_ITERATIONS
    ).hex()


def _verify_password(password: str, salt: str, expected_hash: str) -> bool:
    return secrets.compare_digest(_hash_password(password, salt), expected_hash)


# ── tokens ──────────────────────────────────────────────────────────────


def _issue_token(uid: str) -> str:
    payload = {"sub": uid, "iat": int(time.time()), "exp": int(time.time()) + TOKEN_TTL_SECONDS}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def _decode_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get("sub")
    except jwt.PyJWTError as exc:
        log.info("token rejected: %s", type(exc).__name__)
        return None


# ── account management ─────────────────────────────────────────────────


def register(email: str, password: str, name: str | None) -> tuple[User, str]:
    email = email.strip().lower()
    if len(password) < 6:
        raise HTTPException(400, "Passwords need at least six characters.")
    with cursor() as cur:
        cur.execute("SELECT id FROM users WHERE email = ?", (email,))
        if cur.fetchone():
            raise HTTPException(409, "That email already has an account — sign in instead.")
        uid = uuid.uuid4().hex
        salt = secrets.token_hex(16)
        password_hash = _hash_password(password, salt)
        cur.execute(
            "INSERT INTO users (id, email, name, password_hash, salt) VALUES (?, ?, ?, ?, ?)",
            (uid, email, name, password_hash, salt),
        )
    user = User(uid=uid, email=email, name=name)
    return user, _issue_token(uid)


def login(email: str, password: str) -> tuple[User, str]:
    email = email.strip().lower()
    with cursor() as cur:
        cur.execute(
            "SELECT id, email, name, password_hash, salt FROM users WHERE email = ?", (email,)
        )
        row = cur.fetchone()
    if not row or not _verify_password(password, row["salt"], row["password_hash"]):
        raise HTTPException(401, "That email and password do not match an account.")
    user = User(uid=row["id"], email=row["email"], name=row["name"])
    return user, _issue_token(user.uid)


def _load_user(uid: str) -> User | None:
    with cursor() as cur:
        cur.execute("SELECT id, email, name FROM users WHERE id = ?", (uid,))
        row = cur.fetchone()
    if not row:
        return None
    return User(uid=row["id"], email=row["email"], name=row["name"])


# ── request-level dependencies ─────────────────────────────────────────


def current_user(request: Request) -> User | None:
    """The verified caller, or None when no usable token was presented."""
    header = request.headers.get("authorization", "")
    if not header.lower().startswith("bearer "):
        return None
    token = header[7:].strip()
    if not token:
        return None
    uid = _decode_token(token)
    if not uid:
        return None
    return _load_user(uid)


def require_user(request: Request) -> User:
    """A signed-in caller, or 401."""
    user = current_user(request)
    if not user:
        raise HTTPException(401, "Sign in to use this endpoint.")
    return user


def require_admin(request: Request) -> User:
    user = require_user(request)
    if not user.is_admin:
        raise HTTPException(403, "This console is restricted.")
    return user
