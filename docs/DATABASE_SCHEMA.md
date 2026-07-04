# Database Schema

The dataset contains one record per insight/event with fields like:

- end_year
- intensity
- sector
- topic
- insight
- url
- region
- start_year
- impact
- added
- published
- country
- relevance
- pestle
- source
- title
- likelihood
- city (if present)
- swot (if present)

For better querying and filtering, use a normalized relational schema.

---

# ER Diagram

```text
                 +-----------+
                 |  Sectors  |
                 +-----------+
                      |
                      |
+---------+      +-----------+      +---------+
| Topics  |------| Insights  |------| Sources |
+---------+      +-----------+      +---------+
                      |
        +-------------+--------------+
        |      |      |      |       |
        |      |      |      |       |
   Regions Countries Cities Pestles SWOT
```

---

# Tables

## insights

```sql
CREATE TABLE insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title TEXT NOT NULL,
    insight TEXT,
    url TEXT,

    intensity INTEGER,
    likelihood INTEGER,
    relevance INTEGER,
    impact INTEGER,

    start_year INTEGER,
    end_year INTEGER,

    added TIMESTAMP,
    published TIMESTAMP,

    sector_id UUID,
    topic_id UUID,
    region_id UUID,
    country_id UUID,
    city_id UUID,
    pestle_id UUID,
    source_id UUID,
    swot_id UUID,

    created_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (sector_id) REFERENCES sectors(id),
    FOREIGN KEY (topic_id) REFERENCES topics(id),
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (country_id) REFERENCES countries(id),
    FOREIGN KEY (city_id) REFERENCES cities(id),
    FOREIGN KEY (pestle_id) REFERENCES pestles(id),
    FOREIGN KEY (source_id) REFERENCES sources(id),
    FOREIGN KEY (swot_id) REFERENCES swots(id)
);
```

---

## sectors

```sql
CREATE TABLE sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL
);
```

Example values:

- Energy
- Retail
- Manufacturing
- Government
- Construction

---

## topics

```sql
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL
);
```

Example values:

- oil
- economy
- gas
- market
- population

---

## regions

```sql
CREATE TABLE regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL
);
```

Example values:

- World
- Africa
- Northern America
- Eastern Europe
- Western Africa

---

## countries

```sql
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) UNIQUE NOT NULL
);
```

Example values:

- United States of America
- Russia
- Canada
- Ukraine
- Nigeria

---

## cities

```sql
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) UNIQUE NOT NULL
);
```

> Many records contain empty city values, but the table is useful for dashboard filtering.

---

## pestles

```sql
CREATE TABLE pestles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);
```

Example values:

- Economic
- Political
- Environmental
- Technological
- Social
- Industries

---

## sources

```sql
CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL
);
```

Example values:

- PR Newswire
- Maplecroft
- CNNMoney
- HBR
- CSIS

---

## swots

```sql
CREATE TABLE swots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);
```

Example values:

- Strength
- Weakness
- Opportunity
- Threat

---

# Relationships

| Parent Table | Child Table | Relationship |
|--------------|-------------|--------------|
| sectors | insights | One-to-Many |
| topics | insights | One-to-Many |
| regions | insights | One-to-Many |
| countries | insights | One-to-Many |
| cities | insights | One-to-Many |
| pestles | insights | One-to-Many |
| sources | insights | One-to-Many |
| swots | insights | One-to-Many |

---

# Recommended Indexes

```sql
CREATE INDEX idx_insights_end_year
ON insights(end_year);

CREATE INDEX idx_insights_country
ON insights(country_id);

CREATE INDEX idx_insights_region
ON insights(region_id);

CREATE INDEX idx_insights_topic
ON insights(topic_id);

CREATE INDEX idx_insights_sector
ON insights(sector_id);

CREATE INDEX idx_insights_source
ON insights(source_id);

CREATE INDEX idx_insights_pestle
ON insights(pestle_id);

CREATE INDEX idx_insights_city
ON insights(city_id);

CREATE INDEX idx_insights_intensity
ON insights(intensity);

CREATE INDEX idx_insights_likelihood
ON insights(likelihood);

CREATE INDEX idx_insights_relevance
ON insights(relevance);
```

---

# Why this Schema?

- Eliminates duplicate values (Country, Topic, Sector, etc.)
- Enables fast filtering for dashboard controls
- Reduces storage requirements
- Supports future expansion with additional datasets
- Optimized for analytics and aggregation queries
- Ideal for PostgreSQL/Supabase or MongoDB-backed APIs