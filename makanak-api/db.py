"""SQLite helpers for users and saved valuations."""

from __future__ import annotations

import sqlite3
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / "app.db"


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    with connect() as conn:
        conn.executescript(
            """
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
        )
        conn.commit()


def row_to_dict(row: sqlite3.Row) -> dict[str, Any]:
    return {k: row[k] for k in row.keys()}


# --- users ---


def create_user(name: str, email: str, password_hash: str, created_at: str) -> int:
    with connect() as conn:
        cur = conn.execute(
            """
            INSERT INTO users (name, email, password_hash, created_at)
            VALUES (?, ?, ?, ?)
            """,
            (name, email, password_hash, created_at),
        )
        conn.commit()
        return int(cur.lastrowid)


def get_user_by_email(email: str) -> dict[str, Any] | None:
    with connect() as conn:
        cur = conn.execute("SELECT * FROM users WHERE email = ?", (email,))
        row = cur.fetchone()
    return row_to_dict(row) if row else None


def get_user_by_id(user_id: int) -> dict[str, Any] | None:
    with connect() as conn:
        cur = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = cur.fetchone()
    return row_to_dict(row) if row else None


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
    with connect() as conn:
        cur = conn.execute(
            """
            INSERT INTO valuations (
                user_id, area_sqm, bedrooms, bathrooms, amenities_count,
                location_text, district, type, ownership, furnished,
                payment_option, completion_status, predicted_price_egp, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
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
            ),
        )
        conn.commit()
        return int(cur.lastrowid)


def list_valuations_for_user(user_id: int) -> list[dict[str, Any]]:
    with connect() as conn:
        cur = conn.execute(
            """
            SELECT * FROM valuations
            WHERE user_id = ?
            ORDER BY datetime(created_at) DESC, id DESC
            """,
            (user_id,),
        )
        rows = cur.fetchall()
    return [row_to_dict(r) for r in rows]


def get_valuation_for_user(valuation_id: int, user_id: int) -> dict[str, Any] | None:
    with connect() as conn:
        cur = conn.execute(
            """
            SELECT * FROM valuations
            WHERE id = ? AND user_id = ?
            """,
            (valuation_id, user_id),
        )
        row = cur.fetchone()
    return row_to_dict(row) if row else None


def delete_valuation_for_user(valuation_id: int, user_id: int) -> bool:
    with connect() as conn:
        cur = conn.execute(
            "DELETE FROM valuations WHERE id = ? AND user_id = ?",
            (valuation_id, user_id),
        )
        conn.commit()
        return cur.rowcount > 0
