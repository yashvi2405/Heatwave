# 🌡️ Heatwave Monitoring System

A full-stack PERN (PostgreSQL, Express, React, Node.js) application that tracks
temperature/humidity, predicts heatwaves, and raises alerts.

---

## 📁 Project Structure

```
heatwave-monitoring-system/
├── client/                 # React frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Prediction.jsx
│   │   │   ├── Alerts.jsx
│   │   │   └── Login.jsx
│   │   ├── api.js          # Axios calls to the backend
│   │   ├── App.jsx         # React Router setup
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
│
├── server/                 # Express backend
│   ├── routes/
│   │   ├── predict.js      # POST /predict
│   │   ├── data.js         # GET /data
│   │   ├── alerts.js       # GET /alerts
│   │   └── login.js        # POST /login
│   ├── db.js                # PostgreSQL connection pool
│   ├── index.js             # App entry point
│   ├── package.json
│   └── .env.example
│
├── database/                # SQL scripts
│   ├── schema.sql           # Creates tables
│   └── seed.sql              # Sample data
│
└── README.md
```

---

## ⚙️ Prerequisites

- Node.js v18+ and npm
- PostgreSQL v13+ installed and running

---

## 🚀 Setup & Run Instructions

### 1. Create the database

```bash
# Open the psql shell (adjust user as needed)
psql -U postgres

# Inside psql:
CREATE DATABASE heatwave_db;
\q
```

Load the schema and sample data:

```bash
psql -U postgres -d heatwave_db -f database/schema.sql
psql -U postgres -d heatwave_db -f database/seed.sql
```

### 2. Start the backend server

```bash
cd server
cp .env.example .env
# Edit .env with your PostgreSQL credentials (PGUSER, PGPASSWORD, etc.)

npm install
npm start
# or: npm run dev   (auto-restarts with nodemon)
```

The API will run at **http://localhost:5000**.

### 3. Start the frontend

Open a new terminal:

```bash
cd client
cp .env.example .env
# Defaults to VITE_API_URL=http://localhost:5000 — change if needed

npm install
npm run dev
```

The React app will run at **http://localhost:5173**.

### 4. Login credentials (seeded)

- **Username:** `admin`
- **Password:** `admin123`

---

## 🔌 API Reference & Sample Responses

### `POST /predict`
Request:
```json
{ "temperature": 42.5, "humidity": 28, "location": "Mumbai" }
```
Response:
```json
{
  "success": true,
  "input": { "temperature": 42.5, "humidity": 28, "location": "Mumbai" },
  "prediction": {
    "heatwave": true,
    "level": "High",
    "message": "High heatwave risk. Temperature is 42.5°C, above the 40°C threshold. Low humidity increases the risk further."
  }
}
```

### `GET /data`
Response:
```json
{
  "success": true,
  "count": 7,
  "data": [
    { "id": 1, "temperature": "32.50", "humidity": "55.00", "location": "Mumbai", "date": "2026-07-22T00:00:00.000Z" }
  ]
}
```

### `GET /alerts`
Response:
```json
{
  "success": true,
  "count": 2,
  "alerts": [
    { "id": 2, "message": "Temperature reached 43.2°C - Severe heatwave conditions detected", "level": "Severe", "date": "2026-07-27T00:00:00.000Z" }
  ]
}
```

### `POST /login`
Request:
```json
{ "username": "admin", "password": "admin123" }
```
Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "username": "admin", "role": "admin" }
}
```

All error responses use the shape `{ "error": "message" }` with an appropriate HTTP status code (400/401/404/500).

---

## 🧪 Selenium Testing Hooks

These IDs are available in the frontend for automated UI testing:

| Element | ID | Page |
|---|---|---|
| Temperature input | `#temp` | Prediction |
| Humidity input | `#humidity` | Prediction |
| Predict button | `#predict` | Prediction |
| Result container | `#result` | Prediction |
| Result level text | `#result-level` | Prediction |
| Result message text | `#result-message` | Prediction |
| Username input | `#username` | Login |
| Password input | `#password` | Login |
| Login button | `#login-btn` | Login |
| Alerts list | `#alerts-list` | Alerts |

Example Selenium (Python) snippet:
```python
driver.get("http://localhost:5173/prediction")
driver.find_element(By.ID, "temp").send_keys("45")
driver.find_element(By.ID, "predict").click()
result_text = driver.find_element(By.ID, "result").text
assert "Heatwave" in result_text
```

---

## 🧠 Prediction Logic (beginner-friendly, rule-based)

- `temperature > 40°C` → Heatwave predicted
  - `>= 45°C` → **Severe**
  - `>= 42°C` → **High**
  - otherwise → **Moderate**
  - humidity `< 30%` bumps risk up further
- `35–40°C` → **Moderate** watch (approaching threshold)
- Below that → **Low** / normal conditions

Every prediction is saved to `weather_data`, and a heatwave prediction also creates a row in `alerts`.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, React Router v6, Tailwind CSS, Recharts, Axios
- **Backend:** Node.js, Express, pg (node-postgres), bcryptjs, jsonwebtoken, cors, dotenv
- **Database:** PostgreSQL

---

## 📝 Notes

- This project is intentionally kept simple/beginner-friendly — no ORM, no complex state management, plain REST + fetch/axios.
- For production, use HTTPS, stronger secret management, and rate-limiting on `/login`.
