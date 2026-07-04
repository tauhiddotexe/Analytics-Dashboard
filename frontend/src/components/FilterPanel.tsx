import { useMemo, useState } from 'react';
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

const FILTER_CONFIG: { key: keyof DashboardFilters; label: string; optionsKey?: keyof FilterOptions }[] = [
  { key: 'end_year', label: 'End year' },
  { key: 'topic', label: 'Topic' },
  { key: 'sector', label: 'Sector' },
  { key: 'region', label: 'Region' },
  { key: 'country', label: 'Country' },
  { key: 'city', label: 'City' },
  { key: 'source', label: 'Source' },
  { key: 'pestle', label: 'Pestle', optionsKey: 'pestle' },
  { key: 'swot', label: 'SWOT', optionsKey: 'swot' },
];

export function FilterPanel({ filters, filterOptions, onFilterChange, onReset }: FilterPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const activeCount = useMemo(() => Object.values(filters).filter((v) => v !== undefined && v !== '').length, [filters]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <button
        className="flex w-full items-center justify-between text-left"
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
        aria-controls="filter-grid"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-black text-slate-900">Server-side filters</h2>
          {activeCount > 0 && (
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-white">
              {activeCount}
            </span>
          )}
        </div>
        <svg
          className={`h-4 w-4 text-slate-400 transition-transform ${collapsed ? '' : 'rotate-180'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {!collapsed && (
        <div className="mt-4">
          <div id="filter-grid" className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {FILTER_CONFIG.map(({ key, label, optionsKey }) => {
              let options: string[];
              if (key === 'end_year') {
                options = (filterOptions?.end_years ?? []).map(String);
              } else if (optionsKey) {
                options = (filterOptions?.[optionsKey] ?? []) as string[];
              } else {
                const optKey = `${key}s` as keyof FilterOptions;
                options = (filterOptions?.[optKey] ?? []) as string[];
              }
              return (
                <FilterSelect
                  key={key}
                  label={label}
                  value={filters[key] ?? ''}
                  options={options}
                  onChange={(v) => onFilterChange(key, v)}
                />
              );
            })}
          </div>
          <button
            className="cursor-pointer rounded-full bg-slate-900 px-5 py-2 text-sm font-bold text-white transition hover:bg-primary disabled:opacity-40"
            onClick={onReset}
            disabled={activeCount === 0}
          >
            Reset filters
          </button>
        </div>
      )}
    </section>
  );
}
