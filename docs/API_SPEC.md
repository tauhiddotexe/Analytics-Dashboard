# API_SPEC.md

# API Specification

## Overview

This document defines the REST API for the **Blackcoffer Visualization Dashboard**.

The backend serves as the only interface between the frontend and the Supabase database. All dashboard data, filters, and visualizations are fetched through these APIs.

**Base URL**

```
/api/v1
```

---

# API Design Principles

- RESTful architecture
- JSON request/response format
- Stateless APIs
- Consistent response structure
- Query parameter-based filtering
- Pagination support
- Proper HTTP status codes

---

# Authentication

Authentication is **not required** for this assignment.

---

# Standard Response Format

## Success Response

```json
{
    "success": true,
    "data": {}
}
```

## Error Response

```json
{
    "success": false,
    "message": "Invalid request",
    "errors": []
}
```

---

# Health Check

## GET `/health`

Returns the application health.

### Response

```json
{
    "success": true,
    "data": {
        "status": "healthy"
    }
}
```

---

# Dashboard Summary

## GET `/dashboard/summary`

Returns dashboard KPI cards.

### Response

```json
{
    "success": true,
    "data": {
        "total_records": 1275,
        "average_intensity": 4.7,
        "average_likelihood": 3.5,
        "average_relevance": 5.2,
        "countries": 48,
        "topics": 31,
        "regions": 12
    }
}
```

---

# Records

## GET `/records`

Returns paginated records.

### Query Parameters

| Parameter | Type | Required | Description |
|------------|------|----------|-------------|
| page | Integer | No | Default 1 |
| limit | Integer | No | Default 20 |
| end_year | Integer | No | Filter by End Year |
| topic | String | No | Filter by Topic |
| sector | String | No | Filter by Sector |
| region | String | No | Filter by Region |
| country | String | No | Filter by Country |
| city | String | No | Filter by City |
| source | String | No | Filter by Source |
| pestle | String | No | Filter by PESTLE |
| swot | String | No | Filter by SWOT |

### Example

```
GET /records?country=India&topic=Energy&page=1&limit=20
```

### Response

```json
{
    "success": true,
    "data": {
        "page": 1,
        "limit": 20,
        "total": 1275,
        "items": []
    }
}
```

---

# Filter Options

## GET `/filters`

Returns unique values used to populate dropdown filters.

### Response

```json
{
    "success": true,
    "data": {
        "end_years": [],
        "topics": [],
        "sectors": [],
        "regions": [],
        "countries": [],
        "cities": [],
        "sources": [],
        "pestle": [],
        "swot": []
    }
}
```

---

# Chart APIs

Each chart endpoint supports the same dashboard filters.

---

## GET `/charts/intensity`

Returns aggregated intensity values.

### Query Parameters

| Parameter | Description |
|------------|-------------|
| group_by | country, region, topic, sector, year |

### Response

```json
{
    "success": true,
    "data": [
        {
            "label": "India",
            "value": 8.2
        }
    ]
}
```

---

## GET `/charts/likelihood`

Returns aggregated likelihood values.

### Query Parameters

- group_by

---

## GET `/charts/relevance`

Returns aggregated relevance values.

### Query Parameters

- group_by

---

## GET `/charts/yearly`

Returns year-wise trends.

### Response

```json
{
    "success": true,
    "data": [
        {
            "year": 2020,
            "count": 55,
            "average_intensity": 6.1,
            "average_likelihood": 3.8,
            "average_relevance": 4.2
        }
    ]
}
```

---

## GET `/charts/countries`

Returns country distribution.

### Query Parameters

| Parameter | Description |
|------------|-------------|
| metric | count, intensity, likelihood, relevance |

---

## GET `/charts/regions`

Returns region distribution.

---

## GET `/charts/topics`

Returns topic distribution.

---

## GET `/charts/sectors`

Returns sector distribution.

---

# Search

## GET `/search`

Searches across title, insight and impact.

### Query Parameters

| Parameter | Type | Description |
|------------|------|-------------|
| q | String | Search keyword |

### Example

```
GET /search?q=oil
```

---

# Filtering Rules

All endpoints should support combined filters.

Example:

```
country=India
region=Asia
topic=Energy
sector=Oil
end_year=2025
```

Only matching records should be returned.

---

# Pagination

Paginated endpoints should return:

```json
{
    "page": 1,
    "limit": 20,
    "total": 1275,
    "items": []
}
```

---

# HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request |
| 404 | Resource Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

# Backend Responsibilities

The backend should:

- Read data from Supabase
- Apply filters
- Aggregate chart data
- Handle pagination
- Validate requests
- Return consistent JSON responses

---

# Future API Enhancements

These are outside the assignment scope but may be added later:

- Export dashboard as CSV
- Export charts as PNG/PDF
- Saved filter presets
- Authentication
- User preferences
- Caching
- Rate limiting

---

# Notes

- All APIs return JSON.
- The frontend must communicate only with the FastAPI backend.
- The frontend should never query Supabase directly.
- APIs should remain stable and predictable to simplify frontend integration.