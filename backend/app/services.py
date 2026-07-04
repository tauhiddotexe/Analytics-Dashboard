from typing import Literal

from sqlalchemy import Select, String, and_, cast, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models import City, Country, Insight, Pestle, Region, Sector, Source, Swot, Topic
from app.schemas import ChartPoint, FilterOptions, PaginatedRecords, RecordItem, SummaryResponse, YearlyPoint

GroupBy = Literal["country", "region", "topic", "sector", "year"]
Metric = Literal["count", "intensity", "likelihood", "relevance"]

DIMENSIONS = {
    "sector": (Sector, Insight.sector),
    "topic": (Topic, Insight.topic),
    "region": (Region, Insight.region),
    "country": (Country, Insight.country),
    "city": (City, Insight.city),
    "source": (Source, Insight.source),
    "pestle": (Pestle, Insight.pestle),
    "swot": (Swot, Insight.swot),
}


def _record_to_schema(item: Insight) -> RecordItem:
    return RecordItem(
        id=item.id,
        title=item.title,
        insight=item.insight,
        url=item.url,
        intensity=item.intensity,
        likelihood=item.likelihood,
        relevance=item.relevance,
        impact=item.impact,
        start_year=item.start_year,
        end_year=item.end_year,
        added=item.added,
        published=item.published,
        sector=item.sector.name if item.sector else None,
        topic=item.topic.name if item.topic else None,
        region=item.region.name if item.region else None,
        country=item.country.name if item.country else None,
        city=item.city.name if item.city else None,
        pestle=item.pestle.name if item.pestle else None,
        source=item.source.name if item.source else None,
        swot=item.swot.name if item.swot else None,
    )


def apply_filters(stmt: Select[tuple], filters: dict[str, str | int | None], skip_joins: set[str] | None = None) -> Select[tuple]:
    conditions = []
    skipped = skip_joins or set()
    if filters.get("end_year") is not None:
        conditions.append(Insight.end_year == filters["end_year"])

    for key, value in filters.items():
        if key == "end_year" or value in (None, "") or key not in DIMENSIONS:
            continue
        model, relationship = DIMENSIONS[key]
        if key not in skipped:
            stmt = stmt.join(relationship, isouter=True)
        conditions.append(model.name == value)

    if conditions:
        stmt = stmt.where(and_(*conditions))
    return stmt


async def get_summary(db: AsyncSession, filters: dict[str, str | int | None]) -> SummaryResponse:
    stmt = select(
        func.count(Insight.id),
        func.avg(Insight.intensity),
        func.avg(Insight.likelihood),
        func.avg(Insight.relevance),
        func.count(func.distinct(Insight.country_id)),
        func.count(func.distinct(Insight.topic_id)),
        func.count(func.distinct(Insight.region_id)),
    ).select_from(Insight)
    result = await db.execute(apply_filters(stmt, filters))
    total, avg_intensity, avg_likelihood, avg_relevance, countries, topics, regions = result.one()
    return SummaryResponse(
        total_records=total,
        average_intensity=round(float(avg_intensity), 2) if avg_intensity is not None else None,
        average_likelihood=round(float(avg_likelihood), 2) if avg_likelihood is not None else None,
        average_relevance=round(float(avg_relevance), 2) if avg_relevance is not None else None,
        countries=countries,
        topics=topics,
        regions=regions,
    )


async def get_records(db: AsyncSession, page: int, limit: int, filters: dict[str, str | int | None]) -> PaginatedRecords:
    count_stmt = apply_filters(select(func.count(func.distinct(Insight.id))).select_from(Insight), filters)
    total = (await db.execute(count_stmt)).scalar_one()

    stmt = select(Insight).options(
        joinedload(Insight.sector),
        joinedload(Insight.topic),
        joinedload(Insight.region),
        joinedload(Insight.country),
        joinedload(Insight.city),
        joinedload(Insight.pestle),
        joinedload(Insight.source),
        joinedload(Insight.swot),
    )
    stmt = apply_filters(stmt, filters).order_by(Insight.added.desc().nullslast()).offset((page - 1) * limit).limit(limit)
    items = (await db.execute(stmt)).scalars().all()
    return PaginatedRecords(page=page, limit=limit, total=total, items=[_record_to_schema(item) for item in items])


async def get_filter_options(db: AsyncSession) -> FilterOptions:
    async def names(model: type) -> list[str]:
        rows = await db.execute(select(model.name).order_by(model.name))
        return list(rows.scalars().all())

    end_year_rows = await db.execute(select(Insight.end_year).where(Insight.end_year.is_not(None)).distinct().order_by(Insight.end_year))
    return FilterOptions(
        end_years=list(end_year_rows.scalars().all()),
        topics=await names(Topic),
        sectors=await names(Sector),
        regions=await names(Region),
        countries=await names(Country),
        cities=await names(City),
        sources=await names(Source),
        pestle=await names(Pestle),
        swot=await names(Swot),
    )


def _group_expression(group_by: GroupBy):
    if group_by == "year":
        return Insight.end_year, Insight.end_year
    model, relationship = DIMENSIONS[group_by]
    return model.name, relationship


async def get_metric_chart(db: AsyncSession, metric: Literal["intensity", "likelihood", "relevance"], group_by: GroupBy, filters: dict[str, str | int | None]) -> list[ChartPoint]:
    label_expr, join_target = _group_expression(group_by)
    value_expr = getattr(Insight, metric)
    stmt = select(label_expr.label("label"), func.avg(value_expr).label("value")).select_from(Insight)
    if group_by != "year":
        stmt = stmt.join(join_target, isouter=True)
    skip_joins = set() if group_by == "year" else {group_by}
    stmt = apply_filters(stmt, filters, skip_joins).where(label_expr.is_not(None)).group_by(label_expr).order_by(func.avg(value_expr).desc().nullslast()).limit(20)
    rows = await db.execute(stmt)
    return [ChartPoint(label=str(label), value=round(float(value), 2)) for label, value in rows if value is not None]


async def get_distribution(db: AsyncSession, dimension: Literal["countries", "regions", "topics", "sectors"], metric: Metric, filters: dict[str, str | int | None]) -> list[ChartPoint]:
    mapping = {"countries": "country", "regions": "region", "topics": "topic", "sectors": "sector"}
    group_key = mapping[dimension]
    label_expr, join_target = _group_expression(group_key)  # type: ignore[arg-type]
    value_expr = func.count(Insight.id) if metric == "count" else func.avg(getattr(Insight, metric))
    stmt = select(label_expr.label("label"), value_expr.label("value")).select_from(Insight).join(join_target, isouter=True)
    stmt = apply_filters(stmt, filters, {group_key}).where(label_expr.is_not(None)).group_by(label_expr).order_by(value_expr.desc().nullslast()).limit(20)
    rows = await db.execute(stmt)
    return [ChartPoint(label=str(label), value=round(float(value), 2)) for label, value in rows if value is not None]


async def get_yearly(db: AsyncSession, filters: dict[str, str | int | None]) -> list[YearlyPoint]:
    stmt = select(
        Insight.end_year,
        func.count(Insight.id),
        func.avg(Insight.intensity),
        func.avg(Insight.likelihood),
        func.avg(Insight.relevance),
    ).where(Insight.end_year.is_not(None))
    stmt = apply_filters(stmt, filters).group_by(Insight.end_year).order_by(Insight.end_year)
    rows = await db.execute(stmt)
    return [
        YearlyPoint(
            year=year,
            count=count,
            average_intensity=round(float(avg_i), 2) if avg_i is not None else None,
            average_likelihood=round(float(avg_l), 2) if avg_l is not None else None,
            average_relevance=round(float(avg_r), 2) if avg_r is not None else None,
        )
        for year, count, avg_i, avg_l, avg_r in rows
    ]


async def search_records(db: AsyncSession, query: str, limit: int) -> list[RecordItem]:
    pattern = f"%{query}%"
    stmt = (
        select(Insight)
        .options(joinedload(Insight.sector), joinedload(Insight.topic), joinedload(Insight.region), joinedload(Insight.country), joinedload(Insight.city), joinedload(Insight.pestle), joinedload(Insight.source), joinedload(Insight.swot))
        .where(or_(Insight.title.ilike(pattern), Insight.insight.ilike(pattern), cast(Insight.impact, String).ilike(pattern)))
        .order_by(Insight.added.desc().nullslast())
        .limit(limit)
    )
    items = (await db.execute(stmt)).scalars().all()
    return [_record_to_schema(item) for item in items]
