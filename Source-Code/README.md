# Digital Personality Twins for Adaptive Software Systems

---

## Team Details

| Roll Number | Name |
|---|---|
| 2210992079 | Pratibha |
| 2210991892 | Mansi Garg |
| 2210991859 | Lovisha Goyal |
| 2210992244 | Samridhi Sharma |

- **Type:** Research
- **Current Status:** Paper Submitted

---

## Project Overview

A full-stack intelligent search engine that learns your **search personality** based on how you interact with results — powered by a KMeans ML model, React, Node.js, and MongoDB.

---

## What It Does

1. You search a topic → Wikipedia results appear
2. You click a result → the system tracks:
   - **Decision Time** — how long you took to click (seconds)
   - **Scroll Depth** — how far down you scrolled before clicking (%)
   - **Click Position** — which result number you clicked
3. These are sent to a Python ML model (KMeans clustering)
4. The model classifies you as one of 3 personality types
5. Your **Insights page** shows charts and history of your behavior

---

## Personality Types

| Personality | Emoji | Behavior |
|---|---|---|
| **Explorer** | 🧭 | Scrolls deep, takes moderate time — reads thoroughly |
| **Focused**  | 🎯 | Decides fast, low scroll — knows what they want |
| **Casual**   | ☕ | Slowest decision, low scroll — relaxed browser |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS, Recharts, React Router |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| ML Model | Python, Flask, scikit-learn (KMeans) |
| Data Source | Wikipedia API |

---

## Project Structure

```
adaptive-search-system/
├── frontend/          # React app
│   └── src/
│       ├── pages/
│       │   ├── Home.js        # Search page
│       │   └── Insights.js    # Analytics dashboard
│       └── components/
│           ├── Hero.js        # Hero + search bar
│           ├── Navbar.js      # Navigation
│           └── ResultCard.js  # Individual result
│
├── backend/           # Node.js API
│   ├── routes/
│   │   ├── search.js  # Wikipedia proxy
│   │   └── log.js     # Behavior logging + ML call
│   └── models/
│       └── Behavior.js
│
└── ml-model/          # Python Flask ML API
    ├── predict_api.py  # Flask server
    ├── train_model.py  # KMeans training script
    └── dataset.csv     # Training data
```

---

## How to Run

### Prerequisites
- Node.js, Python 3, MongoDB running locally

### 1. ML Model (Port 6000)
```bash
cd ml-model
pip install flask joblib numpy pandas scikit-learn
python predict_api.py
```

### 2. Backend (Port 5000)
```bash
cd backend
npm install
node server.js
```

### 3. Frontend (Port 3000)
```bash
cd frontend
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## How the ML Model Works

- Trained on 2000+ user behavior records using **KMeans (3 clusters)**
- Features: `linksOpened`, `decisionTime`, `scrollDepth`, `clickPosition`
- Cluster averages from training data:

| Cluster | Avg Decision Time | Avg Scroll Depth | Label |
|---|---|---|---|
| 0 | 53s | 80% | Explorer |
| 1 | 23s | 33% | Focused |
| 2 | 76s | 30% | Casual |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/search?q=query` | Search Wikipedia |
| POST | `/api/log` | Log behavior + get personality |
| GET | `/api/behaviors?userId=x` | Get user's past behaviors |
