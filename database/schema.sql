CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS pestles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS swots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS insights (
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
    sector_id UUID REFERENCES sectors(id),
    topic_id UUID REFERENCES topics(id),
    region_id UUID REFERENCES regions(id),
    country_id UUID REFERENCES countries(id),
    city_id UUID REFERENCES cities(id),
    pestle_id UUID REFERENCES pestles(id),
    source_id UUID REFERENCES sources(id),
    swot_id UUID REFERENCES swots(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_insights_end_year ON insights(end_year);
CREATE INDEX IF NOT EXISTS idx_insights_country ON insights(country_id);
CREATE INDEX IF NOT EXISTS idx_insights_region ON insights(region_id);
CREATE INDEX IF NOT EXISTS idx_insights_topic ON insights(topic_id);
CREATE INDEX IF NOT EXISTS idx_insights_sector ON insights(sector_id);
CREATE INDEX IF NOT EXISTS idx_insights_source ON insights(source_id);
CREATE INDEX IF NOT EXISTS idx_insights_pestle ON insights(pestle_id);
CREATE INDEX IF NOT EXISTS idx_insights_city ON insights(city_id);
CREATE INDEX IF NOT EXISTS idx_insights_swot ON insights(swot_id);
CREATE INDEX IF NOT EXISTS idx_insights_intensity ON insights(intensity);
CREATE INDEX IF NOT EXISTS idx_insights_likelihood ON insights(likelihood);
CREATE INDEX IF NOT EXISTS idx_insights_relevance ON insights(relevance);
CREATE INDEX IF NOT EXISTS idx_insights_published ON insights(published);
