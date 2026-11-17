'''
Makanak price API (Flask): health, ML prediction, session auth, saved valuations.

HTTP contract for the Vite + React app (dev: http://localhost:5173):

  Base URL: set VITE_API_URL to http://localhost:<DEFAULT_PORT> locally (see DEFAULT_PORT),
  or to /api in production, where Vercel serves this API under the frontend's origin.

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

import logging
import os
from datetime import datetime, timezone

import numpy as np
from flask import Flask, jsonify, request, session
from flask_cors import CORS

import db as db_mod
from auth import auth_bp
from model_service import predict_price, to_float
from valuations import valuations_bp

log = logging.getLogger(__name__)

DEFAULT_PORT = 5050

# On Vercel the frontend and this API share one origin: the platform rewrites
# /api/* to this service and the service still receives the original path.
# The middleware below strips that prefix so the routes stay mount-agnostic.
API_PATH_PREFIX = os.environ.get("API_PATH_PREFIX", "/api").rstrip("/")

IS_SERVERLESS = bool(os.environ.get("VERCEL"))


class StripPathPrefix:
    """Serve the app under ``prefix`` without changing any route decorator."""

    def __init__(self, wsgi_app, prefix: str):
        self.wsgi_app = wsgi_app
        self.prefix = prefix

    def __call__(self, environ, start_response):
        path = environ.get("PATH_INFO", "")
        if self.prefix and (path == self.prefix or path.startswith(self.prefix + "/")):
            environ["SCRIPT_NAME"] = environ.get("SCRIPT_NAME", "") + self.prefix
            environ["PATH_INFO"] = path[len(self.prefix):] or "/"
        return self.wsgi_app(environ, start_response)


def _env_flag(name: str, default: bool) -> bool:
    raw = os.environ.get(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


app = Flask(__name__)

secret_key = os.environ.get("FLASK_SECRET_KEY")
if not secret_key:
    if IS_SERVERLESS:
        raise RuntimeError(
            "FLASK_SECRET_KEY must be set in production; without it every "
            "deployment would invalidate all existing login sessions."
        )
    secret_key = "dev-only-set-FLASK_SECRET_KEY-for-production"
app.config["SECRET_KEY"] = secret_key

# Same-origin in production, so SameSite=Lax is enough and keeps the cookie
# out of cross-site requests. Secure is on everywhere except local HTTP.
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = os.environ.get("SESSION_COOKIE_SAMESITE", "Lax")
app.config["SESSION_COOKIE_SECURE"] = _env_flag("SESSION_COOKIE_SECURE", IS_SERVERLESS)

if API_PATH_PREFIX:
    app.wsgi_app = StripPathPrefix(app.wsgi_app, API_PATH_PREFIX)

# Only needed when the frontend is served from a different origin (local Vite
# dev server, or a separate deployment). In production the app and the API
# share one origin, so no origin is allowed to send credentialed cross-site
# requests unless CORS_ORIGINS says so explicitly.
_default_cors = "" if IS_SERVERLESS else "http://localhost:5173,http://127.0.0.1:5173"
_cors_origins = [
    o.strip() for o in os.environ.get("CORS_ORIGINS", _default_cors).split(",") if o.strip()
]
if _cors_origins:
    CORS(
        app,
        origins=_cors_origins,
        supports_credentials=True,
        methods=["GET", "POST", "OPTIONS", "DELETE"],
        allow_headers=["Content-Type", "Accept"],
    )

app.register_blueprint(auth_bp)
app.register_blueprint(valuations_bp)

if _env_flag("AUTO_INIT_DB", True):
    try:
        db_mod.init_db()
    except Exception:  # pragma: no cover - never let schema setup break /health
        log.exception("init_db failed; database-backed routes may be unavailable")


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
