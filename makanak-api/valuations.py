"""Saved valuation history routes."""

from __future__ import annotations

from datetime import datetime, timezone

from flask import Blueprint, jsonify, session

import db as db_mod
from auth import login_required_json

valuations_bp = Blueprint("valuations", __name__, url_prefix="/valuations")


def valuation_json(row: dict) -> dict:
    return {
        "id": row["id"],
        "user_id": row["user_id"],
        "area_sqm": row["area_sqm"],
        "bedrooms": row["bedrooms"],
        "bathrooms": row["bathrooms"],
        "amenities_count": row["amenities_count"],
        "location_text": row["location_text"],
        "district": row["district"],
        "type": row["type"],
        "ownership": row["ownership"],
        "furnished": row["furnished"],
        "payment_option": row["payment_option"],
        "completion_status": row["completion_status"],
        "predicted_price_egp": row["predicted_price_egp"],
        "created_at": row["created_at"],
    }


@valuations_bp.get("/", strict_slashes=False)
@login_required_json
def list_valuations():
    user_id = int(session["user_id"])
    rows = db_mod.list_valuations_for_user(user_id)
    return jsonify({"valuations": [valuation_json(r) for r in rows]})


@valuations_bp.get("/<int:valuation_id>")
@login_required_json
def get_valuation(valuation_id: int):
    user_id = int(session["user_id"])
    row = db_mod.get_valuation_for_user(valuation_id, user_id)
    if not row:
        return jsonify({"error": "Valuation not found."}), 404
    return jsonify({"valuation": valuation_json(row)})


@valuations_bp.delete("/<int:valuation_id>")
@login_required_json
def delete_valuation(valuation_id: int):
    user_id = int(session["user_id"])
    deleted = db_mod.delete_valuation_for_user(valuation_id, user_id)
    if not deleted:
        return jsonify({"error": "Valuation not found."}), 404
    return jsonify({"success": True})
