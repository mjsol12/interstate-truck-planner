# ELD Trip Planner

Full-stack assessment app for planning truck trips with route instructions, rest stops, and FMCSA-compliant ELD daily log sheets.

## Stack

- **Backend:** Django 5 + Django REST Framework (SQLite)
- **Frontend:** React 18 + TypeScript + Vite + Material UI + Leaflet (OpenStreetMap)

## Prerequisites

- Python 3.11+
- Node.js 18+
- npm

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env   # or copy manually on Windows
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://localhost:8000`.

Verify: `GET http://localhost:8000/api/health/` returns `{"status":"ok"}`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # optional; defaults work with Vite proxy
npm run dev
```

Frontend runs at `http://localhost:5173`.

### Makefile shortcuts (Git Bash / macOS / Linux)

```bash
make install    # set up both backend venv and frontend deps
make migrate    # run Django migrations
make run-backend
make run-frontend
```

## Project Structure

```
backend/
  config/           Django project settings
  apps/core/        Health check endpoint
  apps/trips/       Trip models, API, services (route + HOS stubs)
frontend/
  src/api/          Axios client and trip endpoints
  src/components/   AppLayout, MapView
  src/pages/        Home, TripPlanner, LogSheets
  src/theme/        MUI theme
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health/` | Health check |
| GET | `/api/trips/analytics/` | Fleet analytics dashboard data |
| GET | `/api/trips/` | List trips |
| POST | `/api/trips/` | Create trip (stub response) |
| GET | `/api/trips/<id>/` | Get trip by ID |

### POST /api/trips/ example

```json
{
  "current_location": "Chicago, IL",
  "pickup_location": "Dallas, TX",
  "dropoff_location": "Los Angeles, CA",
  "current_cycle_used_hrs": 10
}
```

## Assessment Objective

Build an app that takes trip details and outputs:

- **Map** showing route, stops, and rest breaks (Leaflet + OSM + OSRM planned)
- **Daily ELD log sheets** filled out for the trip duration

### Assumptions

- Property-carrying driver, 70 hrs / 8 days
- No adverse driving conditions
- Fueling at least once every 1,000 miles
- 1 hour for pickup and 1 hour for dropoff

## Next Steps (implementation checklist)

- [x] Geocode location strings to coordinates
- [x] Integrate OSRM public API for driving routes
- [x] Implement HOS calculator (70/8 rules, rest periods)
- [x] Plan fuel stops every 1,000 miles
- [x] Render route polyline and stop markers on map
- [x] Draw filled ELD daily log sheets (multi-day trips)
- [x] Deploy config (`frontend/vercel.json`, `render.yaml`)
- [ ] Deploy frontend (Vercel) and backend (Render) — see below
- [ ] Record 3–5 minute Loom walkthrough

## Deploy (free tier)

### 1. Backend — Render

1. Push the repo to GitHub.
2. In [Render](https://dashboard.render.com/), **New → Blueprint** and connect the repo (uses `render.yaml`).
3. After the first deploy, open the web service **Environment** and set:
   - `CORS_ALLOWED_ORIGINS` = your Vercel URL (e.g. `https://your-app.vercel.app`)
4. Note the service URL, e.g. `https://eld-trip-planner-api.onrender.com`.
5. Verify: `GET https://<your-service>.onrender.com/api/health/` → `{"status":"ok"}`.

Free tier sleeps after ~15 minutes idle; first request may take 30–60s to wake.

### 2. Frontend — Vercel

1. In [Vercel](https://vercel.com/), **Add New Project** → import the GitHub repo.
2. Set **Root Directory** to `frontend`.
3. Add environment variable:
   - `VITE_API_BASE_URL` = `https://<your-render-service>.onrender.com/api`
4. Deploy. `frontend/vercel.json` handles SPA routing.

### 3. Optional: Postgres on Render

Add a Render Postgres instance and set `DATABASE_URL` on the web service. Without it, SQLite is used (fine for demos; data may not persist across redeploys on free tier).

## Deliverables

- Live hosted version
- GitHub repository
- Loom video walkthrough
