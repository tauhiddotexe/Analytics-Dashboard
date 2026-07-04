# PROJECT_CONTEXT.md

# Project Context

## Project Name
Blackcoffer Visualization Dashboard

---

## Overview

This project is a take-home assignment for the Software Engineer (Full-stack) Associate role at Blackcoffer.

The objective is to build a Business Intelligence (BI) Dashboard that transforms the provided `jsondata.json` dataset into meaningful, interactive visualizations.

The dashboard should allow users to explore the dataset using charts, graphs, filters, and summary statistics.

The application must use **only the provided dataset**.

---

# Objective

Build a modern full-stack analytics dashboard that:

- Imports the provided JSON dataset into Supabase.
- Exposes the data through FastAPI APIs.
- Visualizes the data using interactive charts.
- Allows users to filter data dynamically.
- Generates useful business insights from the dataset.

---

# Problem Statement

Raw JSON files are difficult for humans to analyze.

Users need an interface where they can answer questions such as:

- Which countries have the highest activity?
- Which topics appear the most?
- Which regions have the highest relevance?
- How does intensity change over time?
- Which sectors dominate the dataset?

Instead of manually reading thousands of records, the dashboard provides instant visual insights.

---

# Real-world Use Case

This project represents a Business Intelligence Dashboard similar to tools such as:

- Tableau
- Microsoft Power BI
- Google Looker Studio

Organizations use dashboards like this for:

- Business Analytics
- Market Research
- Trend Analysis
- Executive Reporting
- Decision Support
- Government Data Analysis
- Financial Reporting

---

# Assignment Requirements

The dashboard must:

- Use the provided JSON data only.
- Store the data inside Supabase.
- Read data through a backend API.
- Display interactive charts.
- Support dynamic filtering.
- Produce meaningful insights.

---

# Required Visualizations

The dashboard should visualize:

- Intensity
- Likelihood
- Relevance
- Year
- Country
- Region
- City
- Topics

---

# Required Filters

The dashboard should include filters for:

- End Year
- Topics
- Sector
- Region
- PEST
- Source
- SWOT
- Country
- City

Additional filters may be added if useful.

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Axios

## Backend

- FastAPI
- Python
- Pydantic
- SQLAlchemy
- Uvicorn

## Database

- Supabase PostgreSQL

## Development Tools

- Git
- VS Code
- Postman
- Supabase Dashboard

---

# High-Level Architecture

```
jsondata.json
        │
        ▼
 Import Script
        │
        ▼
 Supabase Database
        │
        ▼
 FastAPI Backend
        │
        ▼
 REST APIs
        │
        ▼
 React Dashboard
        │
        ▼
 Charts + Filters + Insights
```

---

# Scope

## Included

- JSON import
- Database
- Backend APIs
- Interactive Dashboard
- Charts
- Filters
- Responsive UI

## Excluded

- Authentication
- User Accounts
- File Upload
- Admin Panel
- AI Features
- Real-time Updates
- Generic JSON Support

---

# Success Criteria

The project is considered complete when:

- Data imports successfully.
- APIs return correct filtered results.
- Dashboard renders interactive charts.
- All required filters work.
- UI is clean and responsive.
- Code is modular and maintainable.
- The architecture is easy to explain during the interview.

---

# Design Principles

The project should prioritize:

- Simplicity
- Readability
- Scalability
- Maintainability
- Performance
- Clean UI/UX

# Development Philosophy

This project will be developed incrementally.

Each feature will be implemented, tested, and reviewed before moving to the next.

The focus is on producing production-quality code rather than simply completing the assignment.