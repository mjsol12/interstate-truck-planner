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

- [ ] Geocode location strings to coordinates
- [ ] Integrate OSRM public API for driving routes
- [ ] Implement HOS calculator (70/8 rules, rest periods)
- [ ] Plan fuel stops every 1,000 miles
- [ ] Render route polyline and stop markers on map
- [ ] Draw filled ELD daily log sheets (multi-day trips)
- [ ] Deploy frontend (Vercel) and backend (Render/Railway/etc.)
- [ ] Record 3–5 minute Loom walkthrough

## Deliverables

- Live hosted version
- GitHub repository
- Loom video walkthrough
