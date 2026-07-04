from typing import Annotated, Literal

from fastapi import Query


FiltersDep = Annotated[dict[str, str | int | None], Query()]


def dashboard_filters(
    end_year: int | None = Query(default=None, ge=1900, le=2200),
    topic: str | None = Query(default=None, max_length=100),
    sector: str | None = Query(default=None, max_length=100),
    region: str | None = Query(default=None, max_length=100),
    country: str | None = Query(default=None, max_length=150),
    city: str | None = Query(default=None, max_length=150),
    source: str | None = Query(default=None, max_length=255),
    pestle: str | None = Query(default=None, max_length=50),
    swot: str | None = Query(default=None, max_length=50),
) -> dict[str, str | int | None]:
    return {
        "end_year": end_year,
        "topic": topic,
        "sector": sector,
        "region": region,
        "country": country,
        "city": city,
        "source": source,
        "pestle": pestle,
        "swot": swot,
    }


GroupByParam = Annotated[Literal["country", "region", "topic", "sector", "year"], Query()]
MetricParam = Annotated[Literal["count", "intensity", "likelihood", "relevance"], Query()]
