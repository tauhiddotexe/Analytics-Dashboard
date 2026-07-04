import { useState } from 'react';
import type { DashboardFilters, FilterOptions } from '../types';

interface FilterPanelProps {
  filters: DashboardFilters;
  filterOptions: FilterOptions | null;
  onFilterChange: (key: keyof DashboardFilters, value: string) => void;
  onReset: () => void;
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
      {label}
      <select
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}

export function FilterPanel({ filters, filterOptions, onFilterChange, onReset }: FilterPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const years = filterOptions?.end_years.map(String) ?? [];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <button
        className="mb-4 flex w-full items-center justify-between text-left"
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
        aria-controls="filter-grid"
      >
        <h2 className="text-xl font-black text-slate-900">Server-side filters</h2>
        <span className="text-sm text-slate-400 transition-transform data-[open=true]:rotate-180">
          {collapsed ? '\u25BC' : '\u25B2'}
        </span>
      </button>
      {!collapsed && (
        <>
          <div id="filter-grid" className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <FilterSelect label="End year" value={filters.end_year ?? ''} options={years} onChange={(v) => onFilterChange('end_year', v)} />
            <FilterSelect label="Topic" value={filters.topic ?? ''} options={filterOptions?.topics ?? []} onChange={(v) => onFilterChange('topic', v)} />
            <FilterSelect label="Sector" value={filters.sector ?? ''} options={filterOptions?.sectors ?? []} onChange={(v) => onFilterChange('sector', v)} />
            <FilterSelect label="Region" value={filters.region ?? ''} options={filterOptions?.regions ?? []} onChange={(v) => onFilterChange('region', v)} />
            <FilterSelect label="Country" value={filters.country ?? ''} options={filterOptions?.countries ?? []} onChange={(v) => onFilterChange('country', v)} />
            <FilterSelect label="City" value={filters.city ?? ''} options={filterOptions?.cities ?? []} onChange={(v) => onFilterChange('city', v)} />
            <FilterSelect label="Source" value={filters.source ?? ''} options={filterOptions?.sources ?? []} onChange={(v) => onFilterChange('source', v)} />
            <FilterSelect label="PESTLE" value={filters.pestle ?? ''} options={filterOptions?.pestle ?? []} onChange={(v) => onFilterChange('pestle', v)} />
            <FilterSelect label="SWOT" value={filters.swot ?? ''} options={filterOptions?.swot ?? []} onChange={(v) => onFilterChange('swot', v)} />
          </div>
          <button
            className="cursor-pointer rounded-full bg-slate-900 px-5 py-2 text-sm font-bold text-white transition hover:bg-primary"
            onClick={onReset}
          >
            Reset filters
          </button>
        </>
      )}
    </section>
  );
}
