import asyncio
import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.models import City, Country, Insight, Pestle, Region, Sector, Source, Swot, Topic

DATASET_PATH = Path(__file__).resolve().parents[2] / "docs" / "jsondata.json"
DATE_FORMAT = "%B, %d %Y %H:%M:%S"
DIMENSION_MODELS = {
    "sector": Sector,
    "topic": Topic,
    "region": Region,
    "country": Country,
    "city": City,
    "pestle": Pestle,
    "source": Source,
    "swot": Swot,
}


def clean_string(value: Any) -> str | None:
    if value is None:
        return None
    text_value = str(value).strip()
    return text_value or None


def clean_int(value: Any) -> int | None:
    if value in (None, ""):
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def clean_date(value: Any) -> datetime | None:
    text_value = clean_string(value)
    if text_value is None:
        return None
    try:
        return datetime.strptime(text_value, DATE_FORMAT)
    except ValueError:
        return None


async def get_or_create_dimension(db: AsyncSession, model: type, name: str | None, cache: dict[str, dict[str, Any]]) -> Any | None:
    if name is None:
        return None
    cache_key = model.__tablename__
    table_cache = cache.setdefault(cache_key, {})
    if name in table_cache:
        return table_cache[name]

    existing = (await db.execute(select(model).where(model.name == name))).scalar_one_or_none()
    if existing is not None:
        table_cache[name] = existing
        return existing

    instance = model(name=name)
    db.add(instance)
    await db.flush()
    table_cache[name] = instance
    return instance


async def create_tables() -> None:
    from app.core.database import Base, engine as async_engine
    from app.models import City, Country, Insight, Pestle, Region, Sector, Source, Swot, Topic  # noqa: F401
    try:
        async with async_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception:
        pass


async def clear_existing_data(db: AsyncSession) -> None:
    await db.execute(delete(Insight))
    for model in (Sector, Topic, Region, Country, City, Pestle, Source, Swot):
        await db.execute(delete(model))


async def import_dataset() -> None:
    with DATASET_PATH.open("r", encoding="utf-8") as file:
        records: list[dict[str, Any]] = json.load(file)

    imported = 0
    skipped = 0
    cache: dict[str, dict[str, Any]] = {}

    await create_tables()
    async with AsyncSessionLocal() as db:
        await clear_existing_data(db)
        for record in records:
            title = clean_string(record.get("title"))
            if title is None:
                skipped += 1
                continue

            dimensions = {
                key: await get_or_create_dimension(db, model, clean_string(record.get(key)), cache)
                for key, model in DIMENSION_MODELS.items()
            }
            db.add(
                Insight(
                    title=title,
                    insight=clean_string(record.get("insight")),
                    url=clean_string(record.get("url")),
                    intensity=clean_int(record.get("intensity")),
                    likelihood=clean_int(record.get("likelihood")),
                    relevance=clean_int(record.get("relevance")),
                    impact=clean_int(record.get("impact")),
                    start_year=clean_int(record.get("start_year")),
                    end_year=clean_int(record.get("end_year")),
                    added=clean_date(record.get("added")),
                    published=clean_date(record.get("published")),
                    sector=dimensions["sector"],
                    topic=dimensions["topic"],
                    region=dimensions["region"],
                    country=dimensions["country"],
                    city=dimensions["city"],
                    pestle=dimensions["pestle"],
                    source=dimensions["source"],
                    swot=dimensions["swot"],
                )
            )
            imported += 1

        await db.commit()

    print(f"Imported {imported} records; skipped {skipped} records.")


if __name__ == "__main__":
    asyncio.run(import_dataset())
