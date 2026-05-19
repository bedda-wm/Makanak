# Makanak 🏠

Makanak is a machine learning-powered real estate valuation platform for the Egyptian market.  
It predicts property prices based on user inputs and allows users to explore similar listings on Dubizzle.

---

## 🚀 Features

- Property price prediction using a trained ML model
- Flask backend API
- React (Vite) frontend
- User authentication (signup/login)
- Saved valuation history
- Dubizzle search link generation for similar listings

---

## 🧠 Tech Stack

### Backend

- Flask
- Scikit-learn (ML model)
- SQLite
- Joblib

### Frontend

- React (Vite)
- Fetch API
- Tailwind / CSS

---

## 📁 Project Structure

makanak/

├── makanak/ # frontend

├── makanak-api/ # backend

├── README.md

---

# ⚙️ Backend Setup (Flask API)

## 1. Navigate to backend

cd makanak-api

## 2. Create virtual environment

python3 -m venv .venv

## 3. Activate environment

### Mac/Linux

source .venv/bin/activate

### Windows

.venv\Scripts\activate

## 4. Install dependencies

pip install -r requirements.txt

(If requirements.txt is missing, run:)

pip install flask joblib scikit-learn pandas numpy
pip freeze > requirements.txt

## 5. Run backend

python app.py

Server will run on:

http://127.0.0.1:5050

---

# 💻 Frontend Setup (React)

## 1. Navigate to frontend

cd makanak

## 2. Install dependencies

npm install

## 3. Run development server

npm run dev

Frontend will run on:

http://localhost:5173

---

# 🔗 API Endpoints

### Auth

- POST `/auth/signup`
- POST `/auth/login`
- POST `/auth/logout`
- GET `/auth/me`

### Predictions

- POST `/predict`

### Valuations

- GET `/valuations`
- GET `/valuations/:id`

---

# 🧪 Example Prediction Request

```json
{
  "area_sqm": 190,
  "bedrooms": 3,
  "bathrooms": 2,
  "amenities_count": 6,
  "location_text": "Sheikh Zayed",
  "district": "Sheikh Zayed",
  "type": "Apartment",
  "ownership": "Primary",
  "furnished": "Yes",
  "payment_option": "Cash",
  "completion_status": "Ready"
}

📊 Machine Learning Model

Algorithm: HistGradientBoostingRegressor
Target: Log-transformed property price
Features:
Area
Bedrooms & Bathrooms
District
Amenities
Compound detection
Monotonic constraints ensure realistic predictions

🌍 Similar Listings Feature

After each valuation, the app generates a Dubizzle search link based on:

Predicted price ± 500,000 EGP
Area ± 20 sqm
Same bedrooms & bathrooms
Same district

🛠️ Notes

This project is for educational purposes
Data was scraped from Dubizzle listings
Predictions are estimates, not exact valuations
```
