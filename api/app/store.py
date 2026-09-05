"""Durable storage for predictions and feedback, backed by the local SQLite database."""

from __future__ import annotations

import json
import logging
from collections import defaultdict
from datetime import datetime, timedelta, timezone

from .db import cursor

log = logging.getLogger("foodgenome.store")

SCAN_LIMIT = 5000


class Store:
    """Thin, synchronous wrapper around the SQLite tables. Local disk writes are
    cheap enough that there is no need for the background queue a networked
    database would want."""

    name = "sqlite"
    enabled = True
    error: str | None = None

    # ── writes ──────────────────────────────────────────────────────────

    def record_prediction(self, *, session: str | None, email: str | None,
                          food_class: str, title: str,
                          confidence: float, set_size: int, candidates: list[str],
                          abstained: bool, ms: int) -> None:
        with cursor() as cur:
            cur.execute(
                """INSERT INTO predictions
                   (user_id, email, food_class, title, confidence, set_size,
                    candidates, abstained, ms)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (session, email, food_class, title, round(confidence, 5), set_size,
                 json.dumps(candidates), int(abstained), ms),
            )

    def record_feedback(self, *, session: str | None, email: str | None, food_class: str,
                        helpful: bool, note: str | None) -> None:
        with cursor() as cur:
            cur.execute(
                """INSERT INTO feedback (user_id, email, food_class, helpful, note)
                   VALUES (?, ?, ?, ?, ?)""",
                (session, email, food_class, int(helpful), (note or "")[:200] or None),
            )

    # ── reads ───────────────────────────────────────────────────────────

    def history(self, session: str, limit: int = 40) -> dict:
        """One account's own record."""
        with cursor() as cur:
            cur.execute(
                "SELECT * FROM predictions WHERE user_id = ? ORDER BY at DESC LIMIT ?",
                (session, limit),
            )
            predictions = [_row_to_dict(r) for r in cur.fetchall()]

        counts: dict[str, int] = defaultdict(int)
        for row in predictions:
            counts[row.get("title", "—")] += 1

        return {
            "enabled": True,
            "predictions": predictions,
            "questions": [],
            "summary": {
                "predictions": len(predictions),
                "questions": 0,
                "abstained": sum(1 for r in predictions if r.get("abstained")),
                "spend_usd": 0,
                "most_analysed": sorted(counts.items(), key=lambda kv: -kv[1])[:5],
            },
        }

    def erase(self, session: str) -> dict:
        """Delete everything belonging to one account."""
        with cursor() as cur:
            cur.execute("DELETE FROM predictions WHERE user_id = ?", (session,))
            predictions_deleted = cur.rowcount
            cur.execute("DELETE FROM feedback WHERE user_id = ?", (session,))
            feedback_deleted = cur.rowcount
        return {
            "enabled": True,
            "deleted": {"predictions": predictions_deleted, "questions": 0,
                        "feedback": feedback_deleted},
        }

    def analytics(self, days: int = 14) -> dict:
        """Aggregates for the admin console: volume, dishes, reliability."""
        since = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()

        with cursor() as cur:
            cur.execute("SELECT * FROM predictions WHERE at >= ? ORDER BY at DESC LIMIT ?",
                        (since, SCAN_LIMIT))
            predictions = [_row_to_dict(r) for r in cur.fetchall()]
            cur.execute("SELECT * FROM feedback WHERE at >= ? ORDER BY at DESC LIMIT ?",
                        (since, SCAN_LIMIT))
            feedback = [_row_to_dict(r) for r in cur.fetchall()]
            cur.execute("SELECT COUNT(*) AS n FROM predictions")
            total_predictions = cur.fetchone()["n"]
            cur.execute("SELECT COUNT(*) AS n FROM feedback")
            total_feedback = cur.fetchone()["n"]

        # Day buckets for volume and reliability.
        by_day: dict[str, dict] = {}
        for row in predictions:
            day = row["at"][:10]
            bucket = by_day.setdefault(day, {
                "day": day, "predictions": 0, "abstained": 0,
                "confidence": 0.0, "set_size": 0, "ms": 0,
            })
            bucket["predictions"] += 1
            bucket["abstained"] += 1 if row.get("abstained") else 0
            bucket["confidence"] += row.get("confidence", 0.0)
            bucket["set_size"] += row.get("set_size", 0)
            bucket["ms"] += row.get("ms", 0)
        daily = []
        for bucket in sorted(by_day.values(), key=lambda b: b["day"]):
            n = bucket["predictions"]
            daily.append({
                "day": bucket["day"],
                "predictions": n,
                "abstained": bucket["abstained"],
                "mean_confidence": round(bucket["confidence"] / n, 4),
                "mean_set_size": round(bucket["set_size"] / n, 3),
                "mean_ms": round(bucket["ms"] / n),
            })

        dishes: dict[str, dict] = {}
        for row in predictions:
            bucket = dishes.setdefault(row.get("title", "—"), {
                "title": row.get("title", "—"), "count": 0, "confidence": 0.0, "abstained": 0,
            })
            bucket["count"] += 1
            bucket["confidence"] += row.get("confidence", 0.0)
            bucket["abstained"] += 1 if row.get("abstained") else 0
        top_dishes = sorted(dishes.values(), key=lambda d: -d["count"])[:12]
        for bucket in top_dishes:
            bucket["mean_confidence"] = round(bucket.pop("confidence") / bucket["count"], 4)

        # Per account.
        people: dict[str, dict] = {}
        for row in predictions:
            uid = row.get("user_id") or "anonymous"
            person = people.setdefault(uid, {
                "uid": uid, "email": row.get("email"), "predictions": 0,
                "abstained": 0, "questions": 0, "confidence": 0.0,
                "first_seen": row["at"], "last_seen": row["at"], "dishes": {},
            })
            person["predictions"] += 1
            person["abstained"] += 1 if row.get("abstained") else 0
            person["confidence"] += row.get("confidence", 0.0)
            person["first_seen"] = min(person["first_seen"], row["at"])
            person["last_seen"] = max(person["last_seen"], row["at"])
            title = row.get("title", "—")
            person["dishes"][title] = person["dishes"].get(title, 0) + 1
        users = []
        for person in sorted(people.values(), key=lambda p: -p["predictions"]):
            n = person["predictions"]
            person["mean_confidence"] = round(person.pop("confidence") / n, 4)
            person["top_dishes"] = sorted(
                person.pop("dishes").items(), key=lambda kv: -kv[1]
            )[:5]
            users.append(person)

        return {
            "enabled": True,
            "backend": self.name,
            "users": users,
            "days": days,
            "scanned": {
                "predictions": len(predictions),
                "questions": 0,
                "limit": SCAN_LIMIT,
            },
            "totals": {
                "predictions": total_predictions,
                "questions": 0,
                "feedback": total_feedback,
                "sessions": len({r.get("user_id") for r in predictions if r.get("user_id")}),
                "abstained": sum(1 for r in predictions if r.get("abstained")),
                "thumbs_down": sum(1 for r in feedback if not r.get("helpful", True)),
            },
            "daily": daily,
            "spend": [],
            "top_dishes": top_dishes,
            "review_queue": [r for r in predictions if r.get("abstained")][:20],
            "negative_feedback": [r for r in feedback if not r.get("helpful", True)][:20],
            "dropped_writes": 0,
        }


def _row_to_dict(row) -> dict:
    d = dict(row)
    if "candidates" in d and isinstance(d["candidates"], str):
        d["candidates"] = json.loads(d["candidates"])
    if "abstained" in d:
        d["abstained"] = bool(d["abstained"])
    if "helpful" in d:
        d["helpful"] = bool(d["helpful"])
    at = d.get("at")
    if isinstance(at, str) and " " in at and "T" not in at:
        # sqlite's default datetime() format -> ISO 8601.
        d["at"] = at.replace(" ", "T") + "+00:00"
    return d


STORE = Store()
