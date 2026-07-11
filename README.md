# Blackcoffer Visualization Dashboard

> Full-stack Business Intelligence dashboard — transform raw JSON data into interactive visual insights.

**🔗 Live Demo:** [https://analytics-dashboard-eta-nine.vercel.app](https://analytics-dashboard-eta-nine.vercel.app)

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-20232A?style=flat&logo=typescript&logoColor=3178C6)
![FastAPI](https://img.shields.io/badge/FastAPI-20232A?style=flat&logo=fastapi&logoColor=009688)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-20232A?style=flat&logo=postgresql&logoColor=4169E1)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-20232A?style=flat&logo=tailwindcss&logoColor=06B6D4)
![Supabase](https://img.shields.io/badge/Supabase-20232A?style=flat&logo=supabase&logoColor=3FCF8E)
![Recharts](https://img.shields.io/badge/Recharts-20232A?style=flat&logo=recharts&logoColor=22B5BF)

---

## Overview

This dashboard ingests a 1,200+ record JSON dataset into Supabase PostgreSQL, serves analytics through a FastAPI REST layer, and renders an Apple-inspired UI with six interactive chart types, dynamic filtering, search, and paginated data exploration.

Built as a take-home assignment for **Blackcoffer**, demonstrating full-stack engineering with production-quality code, a normalized relational schema, and a polished user interface.

---

## Features

- **6 interactive charts** — lollipop, horizontal bar, radar, composed time-series, choropleth world map, and topic bars
- **9 server-side filters** — end year, topic, sector, region, country, city, source, PESTLE, SWOT
- **Full-text search** — across titles, insights, and impacts with instant dropdown results
- **Paginated records** — configurable page size, smooth navigation, mobile expandable cards
- **Responsive design** — adaptive layout from mobile to wide desktop
- **Apple-inspired UI** — SF Pro typography, SF Colors, spring animations, translucent materials, iOS-native card system with 16 SVG icons
- **Animated counters** — spring-eased number transitions on all KPI cards
- **Dark data-aware choropleth** — world map with quantile-based coloring and country alias resolution

---

## Charts

| Chart | Type | Insight |
|-------|------|---------|
| Intensity by Country | Lollipop | Top 12 countries by average intensity |
| Likelihood by Region | Horizontal Bar | Likelihood distribution across regions |
| Relevance by Sector | Radar | Multi-dimensional relevance scores |
| Yearly Trends | Composed (Bar + Line) | Record volume + metric averages over time |
| Country Distribution | Choropleth Map | Geographic spread of records |
| Top Topics | Horizontal Bar | Most frequent topics by count |

---

## Tech Stack

### Frontend

| Library | Purpose |
|---------|---------|
| React 19 + TypeScript | Component architecture |
| Vite | Build tooling and HMR |
| Tailwind CSS v4 | Utility-first styling |
| Recharts | Charting library |
| react-simple-maps | World choropleth |
| Framer Motion | Animation primitives |
| GSAP | Advanced animation |
| Phosphor Icons | Icon library |

### Backend

| Library | Purpose |
|---------|---------|
| FastAPI | Async REST framework |
| SQLAlchemy 2.0 (async) | ORM and query building |
| Pydantic v2 | Request/response validation |
| psycopg3 | PostgreSQL driver |
| Uvicorn | ASGI server |

### Database

| Service | Usage |
|---------|-------|
| Supabase PostgreSQL | Hosted relational database |
| Normalized schema | 9 tables with foreign keys and indexes |

---

## Architecture

```
docs/jsondata.json
        │
        ▼
  backend/scripts/import_json.py    Data ingestion script
        │
        ▼
  Supabase PostgreSQL               Relational database (9 tables)
        │
        ▼
  FastAPI Backend                   REST API (13 endpoints)
        │
        ▼
  React Frontend                    Interactive dashboard
```

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- A Supabase project

### 1. Database

```bash
# Run the schema in the Supabase SQL editor
database/schema.sql
```

### 2. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS / Linux

python -m pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your Supabase DATABASE_URL
# DATABASE_URL=postgresql+asyncpg://postgres:password@db.project-ref.supabase.co:5432/postgres

# Import the dataset
python scripts/import_json.py

# Start the API server
uvicorn app.main:app --reload
```

API docs available at `http://localhost:8000/docs` (or the deployed `/docs` endpoint).

### 3. Frontend

```bash
cd frontend
npm install

# Configure environment
cp .env.example .env
# VITE_API_URL=http://localhost:8000/api/v1

# Start dev server
npm run dev
```

Open `http://localhost:5173`.

### 4. Production Deployments

| Service | URL |
|---------|-----|
| **Frontend** (Vercel) | [https://analytics-dashboard-eta-nine.vercel.app](https://analytics-dashboard-eta-nine.vercel.app) |
| **Backend** (Render) | Set via Render environment `VITE_API_URL` in Vercel project settings |

The backend requires these environment variables on Render:

| Variable | Example |
|----------|---------|
| `DATABASE_URL` | `postgresql+psycopg://...` |
| `ALLOWED_ORIGINS` | `http://localhost:5173,https://analytics-dashboard-eta-nine.vercel.app` |
| `APP_ENV` | `production` |

The frontend requires this environment variable on Vercel:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-render-app.onrender.com/api/v1` |

---

## Project Structure

```
analytics-dashboard/
├── backend/
│   ├── app/
│   │   ├── api/           # Route handlers
│   │   │   ├── charts.py
│   │   │   ├── dashboard.py
│   │   │   ├── filters.py
│   │   │   ├── records.py
│   │   │   └── search.py
│   │   ├── core/          # Config, database, dependencies
│   │   ├── main.py        # FastAPI application entry
│   │   ├── models.py      # SQLAlchemy ORM models
│   │   ├── schemas.py     # Pydantic schemas
│   │   └── services.py    # Business logic
│   ├── scripts/
│   │   └── import_json.py # Dataset ingestion
│   ├── requirements.txt
│   └── .env.example
├── database/
│   └── schema.sql         # PostgreSQL schema
├── docs/
│   ├── PROJECT_CONTEXT.md
│   ├── API_SPEC.md
│   ├── DATABASE_SCHEMA.md
│   ├── SECURITY_REQUIREMENTS.md
│   └── TASKS.md
├── frontend/
│   ├── src/
│   │   ├── api.ts                # API client
│   │   ├── App.tsx               # Root component
│   │   ├── styles.css            # Design system
│   │   ├── types.ts              # TypeScript types
│   │   ├── lib/
│   │   │   └── icons.tsx         # SVG icon system
│   │   ├── hooks/
│   │   │   ├── useAnimatedCounter.ts
│   │   │   └── useGsapAnimation.ts
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── KpiCard.tsx
│   │   │   ├── ChartShell.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── RecordsTable.tsx
│   │   │   └── LoadingSkeleton.tsx
│   │   └── charts/
│   │       ├── IntensityBarChart.tsx
│   │       ├── LikelihoodHorizontalChart.tsx
│   │       ├── RelevanceRadarChart.tsx
│   │       ├── YearlyComposedChart.tsx
│   │       ├── WorldMap.tsx
│   │       └── TopicsBarChart.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## API Reference

Base URL: `/api/v1`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/dashboard/summary` | GET | KPI summary statistics |
| `/records` | GET | Paginated records (page, limit, filters) |
| `/filters` | GET | Unique filter option values |
| `/charts/intensity` | GET | Intensity by group (country, region, topic, sector, year) |
| `/charts/likelihood` | GET | Likelihood by group |
| `/charts/relevance` | GET | Relevance by group |
| `/charts/yearly` | GET | Year-wise trends |
| `/charts/countries` | GET | Country distribution |
| `/charts/regions` | GET | Region distribution |
| `/charts/topics` | GET | Topic distribution |
| `/charts/sectors` | GET | Sector distribution |
| `/search` | GET | Full-text search across titles and insights |

All endpoints accept standard filter query parameters: `end_year`, `topic`, `sector`, `region`, `country`, `city`, `source`, `pestle`, `swot`.

---

## Dataset

The dashboard uses a 1,200+ record JSON dataset containing global news and research insights with fields including:

- **Temporal**: `end_year`, `added`, `published`
- **Thematic**: `topic`, `sector`, `pestle`, `source`
- **Geographic**: `country`, `region`, `city`
- **Metrics**: `intensity` (0–20), `likelihood` (0–20), `relevance` (0–20)
- **Text**: `title`, `insight`, `impact`
- **Other**: `url`, `start_year`, `swot`

---

## Design System

- **Font**: SF Pro / Inter system font stack with negative letter-spacing
- **Colors**: Neutral palette (`#f5f5f7` background, `#ffffff` cards, `#1d1d1f` text) with Apple SF System Colors for data
- **Cards**: 14px border radius, minimal shadow (`0 1px 3px rgba(0,0,0,0.04)`), spring hover lift
- **Animations**: Critically-damped spring curve (`cubic-bezier(0.16, 1, 0.3, 1)`) with full `prefers-reduced-motion` support
- **Icons**: 16 custom SVG icon components for records, topics, scores, filters, navigation, and empty states

---

## License

MIT
