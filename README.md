# Blackcoffer Visualization Dashboard

Full-stack BI dashboard that imports the provided `docs/jsondata.json` dataset into Supabase PostgreSQL, serves analytics through FastAPI, and renders interactive React visualizations with Recharts.

## Stack

- Backend: FastAPI, SQLAlchemy async, Pydantic, Uvicorn
- Database: Supabase PostgreSQL
- Frontend: React, TypeScript, Vite, Tailwind CSS, Recharts, Axios

## Project Structure

```text
backend/          FastAPI API and JSON import script
database/         Supabase/PostgreSQL schema
docs/             Requirements and source dataset
frontend/         React dashboard
```

## Environment

Create backend env file from the example:

```bash
cp backend/.env.example backend/.env
```

Set `backend/.env`:

```env
DATABASE_URL=postgresql+asyncpg://postgres:password@db.project-ref.supabase.co:5432/postgres
ALLOWED_ORIGINS=http://localhost:5173
APP_ENV=development
```

Create frontend env file from the example:

```bash
cp frontend/.env.example frontend/.env
```

Set `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Do not commit real `.env` files or Supabase credentials.

## Database Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run `database/schema.sql`.

The schema creates 8 dimension tables and the `insights` fact table, with indexes for filters and chart aggregations.

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
```

Import the dataset after configuring `DATABASE_URL` and running the schema:

```bash
python scripts/import_json.py
```

Run the API:

```bash
uvicorn app.main:app --reload
```

API docs are available at `http://localhost:8000/docs`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Verification

Frontend production build:

```bash
cd frontend
npm run build
```

Backend syntax/OpenAPI check:

```bash
cd backend
python -c "from app.main import app; print(len(app.openapi()['paths']))"
```

## API

Base URL: `/api/v1`

Implemented endpoints:

- `GET /health`
- `GET /dashboard/summary`
- `GET /records`
- `GET /filters`
- `GET /charts/intensity`
- `GET /charts/likelihood`
- `GET /charts/relevance`
- `GET /charts/yearly`
- `GET /charts/countries`
- `GET /charts/regions`
- `GET /charts/topics`
- `GET /charts/sectors`
- `GET /search`

All dashboard filters are server-side query parameters.
