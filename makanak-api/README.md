# Makanak API

Flask service for the thesis demo: **Dubizzle price prediction** (`POST /predict`), **health** (`GET /health`), **session auth**, and **per-user saved valuations** (SQLite).

## Base URL and port

In `app.py`, **`DEFAULT_PORT = 5050`**. The API base URL in development is:

- **`http://localhost:5050`** (or `http://127.0.0.1:5050`)

Use the **same hostname** in `VITE_API_URL` as the page you open in the browser (`localhost` vs `127.0.0.1`). Session cookies are set for the API host only; mixing hosts can hide cookies from credentialed `fetch` calls.

## Run locally

```bash
pip install -r requirements.txt
.venv/bin/python app.py
```

(or activate `.venv` and run `python app.py`).

On first start, **`app.db`** (SQLite) is created in the project root with `users` and `valuations` tables.

### Environment

| Variable | Purpose |
|----------|---------|
| `FLASK_SECRET_KEY` | Secret for signing session cookies. Defaults to a dev placeholder in code; set a random value for anything beyond local demos. |

### CORS and cookies (frontend)

- CORS allows **`http://localhost:5173`** and **`http://127.0.0.1:5173`** with **`supports_credentials=True`**.
- The SPA must send **`credentials: 'include'`** on `fetch` (or axios `withCredentials: true`) so the session cookie is stored and sent.
- **Session cookies:** `HttpOnly`, `SameSite=Lax`, **not** `Secure` (fine for local HTTP). For a public HTTPS deployment, set `SESSION_COOKIE_SECURE=True` and serve over HTTPS.

## Frontend (Vite + React)

In `.env.development`:

```bash
VITE_API_URL=http://localhost:5050
```

Call `${import.meta.env.VITE_API_URL}/...` with **credentials included** on all authenticated flows and on `/predict` when using `save: true`.

## API overview

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Liveness |
| POST | `/predict` | No* | Price prediction; optional save if logged in |
| POST | `/auth/signup` | No | Register + session |
| POST | `/auth/login` | No | Login + session |
| POST | `/auth/logout` | No | Clear session |
| GET | `/auth/me` | No | Current user or `authenticated: false` |
| GET | `/valuations` or `/valuations/` | Yes | List saved valuations, newest first |
| GET | `/valuations/<id>` | Yes | One valuation (own only) |
| DELETE | `/valuations/<id>` | Yes | Delete own valuation |

\*Unauthenticated users get the same prediction JSON; **`save: true` is ignored** if there is no session.

### `GET /health`

- **200:** `{ "status": "ok" }`

### `POST /predict`

- **Headers:** `Content-Type: application/json`
- **Body:** JSON with required **`area_sqm`** (positive number) and optional model fields: `bedrooms`, `bathrooms`, `amenities_count`, `location_text`, `district`, `type`, `ownership`, `furnished`, `payment_option`, `completion_status` (see `model_service.build_features()`).
- **Optional:** `"save": true` — if the user **is logged in**, the inputs and predicted price are stored; the response then includes **`"saved": true`** and **`"valuation_id": <int>`**. If not logged in, prediction still succeeds and no save occurs (no error).
- **200:** `{ "predicted_price_egp", "explanation", ... }`
- **400:** `{ "error": "..." }`

### `POST /auth/signup`

Body: `{ "name", "email", "password" }`. Email is trimmed and lowercased. Password rules: at least 8 characters, at least one letter, one number.

- **201:** `{ "user": { "id", "name", "email", "created_at" } }` (session created)
- **400:** missing fields or password policy: `{ "error": "Password must be at least 8 characters and contain at least one letter and one number." }`
- **409:** duplicate email

### `POST /auth/login`

Body: `{ "email", "password" }`.

- **200:** `{ "user": { ... } }`
- **400:** missing fields
- **401:** invalid credentials

### `POST /auth/logout`

- **200:** `{ "success": true }`

### `GET /auth/me`

- **200 (guest):** `{ "authenticated": false }`
- **200 (logged in):** `{ "authenticated": true, "user": { "id", "name", "email", "created_at" } }`

### `GET /valuations`

- **200:** `{ "valuations": [ { ... }, ... ] }`
- **401:** not logged in

### `GET /valuations/<id>`

- **200:** `{ "valuation": { ... } }`
- **401:** not logged in
- **404:** missing or not owned

### `DELETE /valuations/<id>`

- **200:** `{ "success": true }`
- **401:** not logged in
- **404:** missing or not owned

## Test with curl

```bash
curl -s -c cookies.txt -b cookies.txt http://localhost:5050/health
```

Signup (saves session cookie in `cookies.txt` if you pass `-c` / `-b`):

```bash
curl -s -c cookies.txt -b cookies.txt -X POST http://localhost:5050/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass1234"}'
```

Predict with save:

```bash
curl -s -c cookies.txt -b cookies.txt -X POST http://localhost:5050/predict \
  -H "Content-Type: application/json" \
  -d '{"area_sqm":120,"bedrooms":3,"bathrooms":1,"amenities_count":0,"location_text":"Cairo, Maadi","save":true}'
```

## Dependencies

`requirements.txt` includes **Flask**, **flask-cors**, **werkzeug** (password hashing), **joblib**, **numpy**, **pandas**, **scikit-learn**, etc.

## Project layout (thesis demo)

- `app.py` — Flask app, CORS, sessions, `/health`, `/predict`
- `db.py` — SQLite schema + small helpers
- `auth.py` — `/auth/*` blueprint
- `valuations.py` — `/valuations/*` blueprint
- `model_service.py` — joblib bundle load, feature engineering, prediction
