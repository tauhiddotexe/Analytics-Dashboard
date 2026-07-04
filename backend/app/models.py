from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class NamedDimensionMixin:
    id: Mapped[UUID] = mapped_column(PgUUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)


class Sector(NamedDimensionMixin, Base):
    __tablename__ = "sectors"


class Topic(NamedDimensionMixin, Base):
    __tablename__ = "topics"


class Region(NamedDimensionMixin, Base):
    __tablename__ = "regions"


class Country(NamedDimensionMixin, Base):
    __tablename__ = "countries"


class City(NamedDimensionMixin, Base):
    __tablename__ = "cities"


class Pestle(NamedDimensionMixin, Base):
    __tablename__ = "pestles"


class Source(NamedDimensionMixin, Base):
    __tablename__ = "sources"


class Swot(NamedDimensionMixin, Base):
    __tablename__ = "swots"


class Insight(Base):
    __tablename__ = "insights"


    id: Mapped[UUID] = mapped_column(PgUUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    title: Mapped[str] = mapped_column(Text, nullable=False)
    insight: Mapped[str | None] = mapped_column(Text)
    url: Mapped[str | None] = mapped_column(Text)
    intensity: Mapped[int | None] = mapped_column(Integer)
    likelihood: Mapped[int | None] = mapped_column(Integer)
    relevance: Mapped[int | None] = mapped_column(Integer)
    impact: Mapped[int | None] = mapped_column(Integer)
    start_year: Mapped[int | None] = mapped_column(Integer)
    end_year: Mapped[int | None] = mapped_column(Integer)
    added: Mapped[datetime | None] = mapped_column(DateTime)
    published: Mapped[datetime | None] = mapped_column(DateTime)
    sector_id: Mapped[UUID | None] = mapped_column(ForeignKey("sectors.id"))
    topic_id: Mapped[UUID | None] = mapped_column(ForeignKey("topics.id"))
    region_id: Mapped[UUID | None] = mapped_column(ForeignKey("regions.id"))
    country_id: Mapped[UUID | None] = mapped_column(ForeignKey("countries.id"))
    city_id: Mapped[UUID | None] = mapped_column(ForeignKey("cities.id"))
    pestle_id: Mapped[UUID | None] = mapped_column(ForeignKey("pestles.id"))
    source_id: Mapped[UUID | None] = mapped_column(ForeignKey("sources.id"))
    swot_id: Mapped[UUID | None] = mapped_column(ForeignKey("swots.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    sector: Mapped[Sector | None] = relationship()
    topic: Mapped[Topic | None] = relationship()
    region: Mapped[Region | None] = relationship()
    country: Mapped[Country | None] = relationship()
    city: Mapped[City | None] = relationship()
    pestle: Mapped[Pestle | None] = relationship()
    source: Mapped[Source | None] = relationship()
    swot: Mapped[Swot | None] = relationship()
