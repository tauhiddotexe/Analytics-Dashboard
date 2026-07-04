from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import GroupByParam, MetricParam, dashboard_filters
from app.core.database import get_db
from app.schemas import ApiResponse, ChartPoint, FilterOptions, PaginatedRecords, RecordItem, SummaryResponse, YearlyPoint
from app.services import get_distribution, get_filter_options, get_metric_chart, get_records, get_summary, get_yearly, search_records

router = APIRouter(prefix="/api/v1")
DbDep = Annotated[AsyncSession, Depends(get_db)]
Filters = Annotated[dict[str, str | int | None], Depends(dashboard_filters)]


@router.get("/health", response_model=ApiResponse[dict[str, str]], tags=["health"])
async def health(db: DbDep) -> ApiResponse[dict[str, str]]:
    await db.execute(text("SELECT 1"))
    return ApiResponse(data={"status": "healthy"})


@router.get("/dashboard/summary", response_model=ApiResponse[SummaryResponse], tags=["dashboard"])
async def dashboard_summary(db: DbDep, filters: Filters) -> ApiResponse[SummaryResponse]:
    return ApiResponse(data=await get_summary(db, filters))


@router.get("/records", response_model=ApiResponse[PaginatedRecords], tags=["records"])
async def records(
    db: DbDep,
    filters: Filters,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
) -> ApiResponse[PaginatedRecords]:
    return ApiResponse(data=await get_records(db, page, limit, filters))


@router.get("/filters", response_model=ApiResponse[FilterOptions], tags=["filters"])
async def filters(db: DbDep) -> ApiResponse[FilterOptions]:
    return ApiResponse(data=await get_filter_options(db))


@router.get("/charts/intensity", response_model=ApiResponse[list[ChartPoint]], tags=["charts"])
async def intensity_chart(db: DbDep, filters: Filters, group_by: GroupByParam = "country") -> ApiResponse[list[ChartPoint]]:
    return ApiResponse(data=await get_metric_chart(db, "intensity", group_by, filters))


@router.get("/charts/likelihood", response_model=ApiResponse[list[ChartPoint]], tags=["charts"])
async def likelihood_chart(db: DbDep, filters: Filters, group_by: GroupByParam = "region") -> ApiResponse[list[ChartPoint]]:
    return ApiResponse(data=await get_metric_chart(db, "likelihood", group_by, filters))


@router.get("/charts/relevance", response_model=ApiResponse[list[ChartPoint]], tags=["charts"])
async def relevance_chart(db: DbDep, filters: Filters, group_by: GroupByParam = "sector") -> ApiResponse[list[ChartPoint]]:
    return ApiResponse(data=await get_metric_chart(db, "relevance", group_by, filters))


@router.get("/charts/yearly", response_model=ApiResponse[list[YearlyPoint]], tags=["charts"])
async def yearly_chart(db: DbDep, filters: Filters) -> ApiResponse[list[YearlyPoint]]:
    return ApiResponse(data=await get_yearly(db, filters))


@router.get("/charts/{dimension}", response_model=ApiResponse[list[ChartPoint]], tags=["charts"])
async def distribution_chart(
    dimension: Literal["countries", "regions", "topics", "sectors"],
    db: DbDep,
    filters: Filters,
    metric: MetricParam = "count",
) -> ApiResponse[list[ChartPoint]]:
    return ApiResponse(data=await get_distribution(db, dimension, metric, filters))


@router.get("/search", response_model=ApiResponse[list[RecordItem]], tags=["search"])
async def search(
    db: DbDep,
    q: str = Query(min_length=1, max_length=100),
    limit: int = Query(default=20, ge=1, le=50),
) -> ApiResponse[list[RecordItem]]:
    return ApiResponse(data=await search_records(db, q.strip(), limit))
