'''
Makanak price API (Flask): health, ML prediction, session auth, saved valuations.

HTTP contract for the Vite + React app (dev: http://localhost:5173):

  Base URL: set VITE_API_URL to http://localhost:<DEFAULT_PORT> (see DEFAULT_PORT).

  The frontend must send credentials on API calls, e.g. fetch(url, { credentials: 'include' }).

  GET /health
    Response 200: { "status": "ok" }

  POST /predict
    Headers: Content-Type: application/json
    Body: model fields (see README). Optional "save": true persists a row when the user is logged in.
    Response 200: predicted_price_egp, explanation, and if saved: saved, valuation_id

  Auth: POST /auth/signup, /auth/login, /auth/logout, GET /auth/me
  Valuations: GET /valuations, GET /valuations/<id>, DELETE /valuations/<id> (login required)
'''
from __future__ import annotations

import os
from datetime import datetime, timezone

import numpy as np
from flask import Flask, jsonify, request, session
from flask_cors import CORS

import db as db_mod
from auth import auth_bp
from model_service import predict_price, to_float
from valuations import valuations_bp

DEFAULT_PORT = 5050

# Session cookies are host-only for the API origin (e.g. localhost:5050). Use the same
# hostname for VITE_API_URL as the page (localhost vs 127.0.0.1) so the browser sends cookies.
# SameSite=Lax allows cross-origin credentialed requests between localhost ports in modern browsers.
app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get(
    "FLASK_SECRET_KEY",
    "dev-only-set-FLASK_SECRET_KEY-for-production",
)
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = False  # OK for local HTTP; use HTTPS + True in production

CORS(
    app,
    origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    supports_credentials=True,
    methods=["GET", "POST", "OPTIONS", "DELETE"],
    allow_headers=["Content-Type", "Accept"],
)

app.register_blueprint(auth_bp)
app.register_blueprint(valuations_bp)

db_mod.init_db()


def _optional_float_for_db(value):
    x = to_float(value)
    if x is None or (isinstance(x, float) and np.isnan(x)):
        return None
    return float(x)


def _optional_str(value):
    if value is None:
        return None
    s = str(value).strip()
    return s if s else None


@app.get("/health")
def health():
    return jsonify({"status": "ok"})

@app.post("/predict")
def predict():
    raw = request.get_json(silent=True) or {}
    payload = dict(raw)
    save_requested = bool(payload.pop("save", False))

    if "area_sqm" not in payload:
        return jsonify({"error": "area_sqm is required"}), 400
    area = to_float(payload.get("area_sqm"))
    if area is None or (isinstance(area, float) and np.isnan(area)) or area <= 0:
        return jsonify({"error": "area_sqm must be a positive number"}), 400

    price_egp, explanation = predict_price(payload)

    body = {
        "predicted_price_egp": price_egp,
        "explanation": explanation,
    }

    user_id = session.get("user_id")
    if save_requested and user_id:
        created_at = datetime.now(timezone.utc).isoformat()
        vid = db_mod.insert_valuation(
            int(user_id),
            area_sqm=_optional_float_for_db(payload.get("area_sqm")),
            bedrooms=_optional_float_for_db(payload.get("bedrooms")),
            bathrooms=_optional_float_for_db(payload.get("bathrooms")),
            amenities_count=_optional_float_for_db(payload.get("amenities_count")),
            location_text=_optional_str(payload.get("location_text")),
            district=_optional_str(payload.get("district")),
            type_=_optional_str(payload.get("type")),
            ownership=_optional_str(payload.get("ownership")),
            furnished=_optional_str(payload.get("furnished")),
            payment_option=_optional_str(payload.get("payment_option")),
            completion_status=_optional_str(payload.get("completion_status")),
            predicted_price_egp=price_egp,
            created_at=created_at,
        )
        body["saved"] = True
        body["valuation_id"] = vid

    return jsonify(body)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=DEFAULT_PORT, debug=True)
