from datetime import datetime
from typing import Generic, TypeVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


DataT = TypeVar("DataT")


class ApiResponse(BaseModel, Generic[DataT]):
    success: bool = True
    data: DataT


class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    errors: list[str] = Field(default_factory=list)


class SummaryResponse(BaseModel):
    total_records: int
    average_intensity: float | None
    average_likelihood: float | None
    average_relevance: float | None
    countries: int
    topics: int
    regions: int


class FilterOptions(BaseModel):
    end_years: list[int]
    topics: list[str]
    sectors: list[str]
    regions: list[str]
    countries: list[str]
    cities: list[str]
    sources: list[str]
    pestle: list[str]
    swot: list[str]


class RecordItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    insight: str | None
    url: str | None
    intensity: int | None
    likelihood: int | None
    relevance: int | None
    impact: int | None
    start_year: int | None
    end_year: int | None
    added: datetime | None
    published: datetime | None
    sector: str | None
    topic: str | None
    region: str | None
    country: str | None
    city: str | None
    pestle: str | None
    source: str | None
    swot: str | None


class PaginatedRecords(BaseModel):
    page: int
    limit: int
    total: int
    items: list[RecordItem]


class ChartPoint(BaseModel):
    label: str
    value: float


class YearlyPoint(BaseModel):
    year: int
    count: int
    average_intensity: float | None
    average_likelihood: float | None
    average_relevance: float | None
