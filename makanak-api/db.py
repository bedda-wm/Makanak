"""Storage for users and saved valuations.

Two backends, one API:

* **SQLite** (default) for local development — file at ``makanak-api/app.db``.
* **PostgreSQL** when ``DATABASE_URL`` is set (e.g. Neon on Vercel), because
  serverless filesystems are ephemeral and read-only.

Queries below are written with ``?`` placeholders and translated to ``%s`` for
PostgreSQL. Column types and the ``RETURNING``/``lastrowid`` difference are the
only other things that vary; everything above this module sees one interface.
"""

from __future__ import annotations

import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Iterator

ROOT = Path(__file__).resolve().parent
DB_PATH = Path(os.environ.get("SQLITE_PATH") or (ROOT / "app.db"))

DATABASE_URL = (os.environ.get("DATABASE_URL") or "").strip()
USE_POSTGRES = DATABASE_URL.startswith(("postgres://", "postgresql://"))

if USE_POSTGRES:  # pragma: no cover - import depends on deployment target
    import psycopg
    from psycopg.rows import dict_row

    #: Raised when a UNIQUE constraint fails (duplicate email).
    IntegrityError: type[Exception] | tuple[type[Exception], ...] = psycopg.errors.UniqueViolation
else:
    IntegrityError = sqlite3.IntegrityError


SCHEMA_SQLITE = """
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS valuations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    area_sqm REAL,
    bedrooms REAL,
    bathrooms REAL,
    amenities_count REAL,
    location_text TEXT,
    district TEXT,
    type TEXT,
    ownership TEXT,
    furnished TEXT,
    payment_option TEXT,
    completion_status TEXT,
    predicted_price_egp REAL NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
"""

SCHEMA_POSTGRES = """
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS valuations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    area_sqm DOUBLE PRECISION,
    bedrooms DOUBLE PRECISION,
    bathrooms DOUBLE PRECISION,
    amenities_count DOUBLE PRECISION,
    location_text TEXT,
    district TEXT,
    type TEXT,
    ownership TEXT,
    furnished TEXT,
    payment_option TEXT,
    completion_status TEXT,
    predicted_price_egp DOUBLE PRECISION NOT NULL,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS valuations_user_id_idx ON valuations (user_id);
"""


@contextmanager
def connect() -> Iterator[Any]:
    """Open a connection, commit on success, roll back on error, always close.

    Serverless invocations are short-lived, so each unit of work gets its own
    connection rather than a long-lived pool. Point ``DATABASE_URL`` at a
    pooled endpoint (Neon's ``-pooler`` host) in production.
    """
    if USE_POSTGRES:
        conn = psycopg.connect(DATABASE_URL, row_factory=dict_row, connect_timeout=10)
    else:
        DB_PATH.parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def _sql(query: str) -> str:
    """Translate ``?`` placeholders to ``%s`` on PostgreSQL."""
    return query.replace("?", "%s") if USE_POSTGRES else query


def _rows(cur) -> list[dict[str, Any]]:
    return [row_to_dict(r) for r in cur.fetchall()]


def _one(cur) -> dict[str, Any] | None:
    row = cur.fetchone()
    return row_to_dict(row) if row else None


def init_db() -> None:
    """Create tables if they do not exist. Safe to call repeatedly."""
    with connect() as conn:
        if USE_POSTGRES:
            with conn.cursor() as cur:
                cur.execute(SCHEMA_POSTGRES)
        else:
            conn.executescript(SCHEMA_SQLITE)


def row_to_dict(row: Any) -> dict[str, Any]:
    if isinstance(row, dict):
        return dict(row)
    return {k: row[k] for k in row.keys()}


# --- users ---


def create_user(name: str, email: str, password_hash: str, created_at: str) -> int:
    query = """
        INSERT INTO users (name, email, password_hash, created_at)
        VALUES (?, ?, ?, ?)
    """
    with connect() as conn:
        if USE_POSTGRES:
            with conn.cursor() as cur:
                cur.execute(_sql(query + " RETURNING id"), (name, email, password_hash, created_at))
                return int(cur.fetchone()["id"])
        cur = conn.execute(query, (name, email, password_hash, created_at))
        return int(cur.lastrowid)


def get_user_by_email(email: str) -> dict[str, Any] | None:
    return _fetch_one("SELECT * FROM users WHERE email = ?", (email,))


def get_user_by_id(user_id: int) -> dict[str, Any] | None:
    return _fetch_one("SELECT * FROM users WHERE id = ?", (user_id,))


# --- valuations ---


def insert_valuation(
    user_id: int,
    *,
    area_sqm: float | None,
    bedrooms: float | None,
    bathrooms: float | None,
    amenities_count: float | None,
    location_text: str | None,
    district: str | None,
    type_: str | None,
    ownership: str | None,
    furnished: str | None,
    payment_option: str | None,
    completion_status: str | None,
    predicted_price_egp: float,
    created_at: str,
) -> int:
    query = """
        INSERT INTO valuations (
            user_id, area_sqm, bedrooms, bathrooms, amenities_count,
            location_text, district, type, ownership, furnished,
            payment_option, completion_status, predicted_price_egp, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    params = (
        user_id,
        area_sqm,
        bedrooms,
        bathrooms,
        amenities_count,
        location_text,
        district,
        type_,
        ownership,
        furnished,
        payment_option,
        completion_status,
        predicted_price_egp,
        created_at,
    )
    with connect() as conn:
        if USE_POSTGRES:
            with conn.cursor() as cur:
                cur.execute(_sql(query + " RETURNING id"), params)
                return int(cur.fetchone()["id"])
        cur = conn.execute(query, params)
        return int(cur.lastrowid)


def list_valuations_for_user(user_id: int) -> list[dict[str, Any]]:
    # created_at holds ISO-8601 UTC strings, so lexical ordering is chronological.
    order_by = "created_at DESC, id DESC" if USE_POSTGRES else "datetime(created_at) DESC, id DESC"
    return _fetch_all(
        f"SELECT * FROM valuations WHERE user_id = ? ORDER BY {order_by}",
        (user_id,),
    )


def get_valuation_for_user(valuation_id: int, user_id: int) -> dict[str, Any] | None:
    return _fetch_one(
        "SELECT * FROM valuations WHERE id = ? AND user_id = ?",
        (valuation_id, user_id),
    )


def delete_valuation_for_user(valuation_id: int, user_id: int) -> bool:
    query = "DELETE FROM valuations WHERE id = ? AND user_id = ?"
    with connect() as conn:
        if USE_POSTGRES:
            with conn.cursor() as cur:
                cur.execute(_sql(query), (valuation_id, user_id))
                return cur.rowcount > 0
        cur = conn.execute(query, (valuation_id, user_id))
        return cur.rowcount > 0


# --- internals ---


def _fetch_one(query: str, params: tuple) -> dict[str, Any] | None:
    with connect() as conn:
        if USE_POSTGRES:
            with conn.cursor() as cur:
                cur.execute(_sql(query), params)
                return _one(cur)
        return _one(conn.execute(query, params))


def _fetch_all(query: str, params: tuple) -> list[dict[str, Any]]:
    with connect() as conn:
        if USE_POSTGRES:
            with conn.cursor() as cur:
                cur.execute(_sql(query), params)
                return _rows(cur)
        return _rows(conn.execute(query, params))
