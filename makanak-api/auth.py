"""Session-based auth routes."""

from __future__ import annotations

import re
import sqlite3
from datetime import datetime, timezone
from functools import wraps

from flask import Blueprint, jsonify, request, session
from werkzeug.security import check_password_hash, generate_password_hash

import db as db_mod

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

PASSWORD_POLICY_ERROR = (
    "Password must be at least 8 characters and contain at least one letter and one number."
)


def password_is_valid(password: str) -> bool:
    if not password or len(password) < 8:
        return False
    if not re.search(r"[A-Za-z]", password):
        return False
    if not re.search(r"\d", password):
        return False
    return True


def public_user(u: dict) -> dict:
    return {
        "id": u["id"],
        "name": u["name"],
        "email": u["email"],
        "created_at": u["created_at"],
    }


def login_required_json(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        if not session.get("user_id"):
            return jsonify({"error": "Authentication required."}), 401
        return f(*args, **kwargs)

    return wrapped


@auth_bp.post("/signup")
def signup():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password")

    if not name or not email or password is None or password == "":
        return jsonify({"error": "name, email, and password are required."}), 400

    if not password_is_valid(str(password)):
        return jsonify({"error": PASSWORD_POLICY_ERROR}), 400

    password_hash = generate_password_hash(str(password))
    created_at = datetime.now(timezone.utc).isoformat()

    try:
        user_id = db_mod.create_user(name, email, password_hash, created_at)
    except sqlite3.IntegrityError:
        return jsonify({"error": "An account with this email already exists."}), 409

    session.clear()
    session["user_id"] = user_id
    user = db_mod.get_user_by_id(user_id)
    return jsonify({"user": public_user(user)}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password")

    if not email or password is None or password == "":
        return jsonify({"error": "email and password are required."}), 400

    user = db_mod.get_user_by_email(email)
    if not user or not check_password_hash(user["password_hash"], str(password)):
        return jsonify({"error": "Invalid email or password."}), 401

    session.clear()
    session["user_id"] = user["id"]
    return jsonify({"user": public_user(user)})


@auth_bp.post("/logout")
def logout():
    session.clear()
    return jsonify({"success": True})


@auth_bp.get("/me")
def me():
    uid = session.get("user_id")
    if not uid:
        return jsonify({"authenticated": False})

    user = db_mod.get_user_by_id(int(uid))
    if not user:
        session.clear()
        return jsonify({"authenticated": False})

    return jsonify({"authenticated": True, "user": public_user(user)})
