"""Load the trained bundle and run feature engineering + prediction."""

from __future__ import annotations

import joblib
import numpy as np
import pandas as pd

BUNDLE = joblib.load("models/dubizzle_price_model.joblib")
PIPELINE = BUNDLE["pipeline"]
TOP_DISTRICTS = set(BUNDLE["top_districts"])


def to_float(x):
    try:
        if x is None or x == "":
            return np.nan
        return float(x)
    except Exception:
        return np.nan


def normalize_yes_no(x):
    if x is None:
        return "Unknown"
    s = str(x).strip().lower()
    if s in ["yes", "y", "true", "1"]:
        return "Yes"
    if s in ["no", "n", "false", "0"]:
        return "No"
    return str(x).strip()


def build_features(payload: dict) -> dict:
    """
    Build the exact feature columns expected by the model.
    We re-create the engineered fields used in training.
    """
    area_sqm = to_float(payload.get("area_sqm"))
    bedrooms = to_float(payload.get("bedrooms"))
    bathrooms = to_float(payload.get("bathrooms"))
    amenities_count = to_float(payload.get("amenities_count"))
    amenities_count = 0.0 if np.isnan(amenities_count) else float(amenities_count)

    location_text = str(payload.get("location_text", "") or "")
    is_compound = 1 if "compound" in location_text.lower() else 0

    bedrooms_f = 0.0 if np.isnan(bedrooms) else float(bedrooms)
    bathrooms_f = 0.0 if np.isnan(bathrooms) else float(bathrooms)

    rooms_total = bedrooms_f + bathrooms_f

    if np.isnan(area_sqm) or area_sqm <= 0:
        rooms_per_100sqm = np.nan
        amenities_density = np.nan
        area_squared = np.nan
    else:
        rooms_per_100sqm = (rooms_total / area_sqm) * 100.0
        amenities_density = amenities_count / area_sqm
        area_squared = area_sqm**2

    district = (payload.get("district") or "Unknown").strip()
    district_grouped = district if district in TOP_DISTRICTS else "Other"

    row = {
        "district_grouped": district_grouped,
        "type": (payload.get("type") or "Unknown").strip(),
        "ownership": (payload.get("ownership") or "Unknown").strip(),
        "furnished": normalize_yes_no(payload.get("furnished")),
        "payment_option": (payload.get("payment_option") or "Unknown").strip(),
        "completion_status": (payload.get("completion_status") or "Unknown").strip(),
    }

    row.update(
        {
            "area_sqm": area_sqm,
            "area_squared": area_squared,
            "bedrooms_f": bedrooms_f,
            "bathrooms_f": bathrooms_f,
            "rooms_total": rooms_total,
            "rooms_per_100sqm": rooms_per_100sqm,
            "amenities_count": amenities_count,
            "amenities_density": amenities_density,
            "is_compound": is_compound,
        }
    )

    return row


def predict_price(payload: dict) -> tuple[float, dict]:
    """
    Returns (predicted_price_egp, explanation dict).
    Caller must validate area_sqm before calling.
    """
    features = build_features(payload)
    X_input = pd.DataFrame([features])
    pred_log = PIPELINE.predict(X_input)[0]
    pred_egp = float(np.expm1(pred_log))

    explanation = {
        "district_grouped": features["district_grouped"],
        "is_compound": bool(features["is_compound"]),
        "amenities_count": features["amenities_count"],
        "bedrooms": features["bedrooms_f"],
        "bathrooms": features["bathrooms_f"],
        "area_sqm": features["area_sqm"],
    }

    price_egp = float(round(pred_egp, 0))
    return price_egp, explanation
