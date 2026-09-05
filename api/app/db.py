"""SQLite database: users, predictions, feedback. One file, zero external services."""

from __future__ import annotations

import os
import sqlite3
import threading
from contextlib import contextmanager
from pathlib import Path

DB_PATH = Path(os.environ.get("DATABASE_PATH", Path(__file__).resolve().parents[2] / "foodgenome.db"))

_local = threading.local()

SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    at TEXT NOT NULL DEFAULT (datetime('now')),
    user_id TEXT,
    email TEXT,
    food_class TEXT NOT NULL,
    title TEXT NOT NULL,
    confidence REAL NOT NULL,
    set_size INTEGER NOT NULL,
    candidates TEXT NOT NULL,
    abstained INTEGER NOT NULL,
    ms INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_predictions_user ON predictions(user_id, at DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_at ON predictions(at DESC);

CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    at TEXT NOT NULL DEFAULT (datetime('now')),
    user_id TEXT,
    email TEXT,
    food_class TEXT NOT NULL,
    helpful INTEGER NOT NULL,
    note TEXT
);
CREATE INDEX IF NOT EXISTS idx_feedback_at ON feedback(at DESC);
"""


def get_conn() -> sqlite3.Connection:
    """One connection per thread; FastAPI's threadpool means this is what keeps
    sqlite3 (which forbids cross-thread use by default) safe without a lock."""
    conn = getattr(_local, "conn", None)
    if conn is None:
        DB_PATH.parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA foreign_keys=ON")
        _local.conn = conn
    return conn


def init_db() -> None:
    conn = get_conn()
    conn.executescript(SCHEMA)
    conn.commit()


@contextmanager
def cursor():
    conn = get_conn()
    cur = conn.cursor()
    try:
        yield cur
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cur.close()


init_db()
