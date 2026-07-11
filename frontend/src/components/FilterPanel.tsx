import { useMemo, useState } from 'react';
import type { DashboardFilters, FilterOptions } from '../types';

interface FilterPanelProps {
  filters: DashboardFilters;
  filterOptions: FilterOptions | null;
  onFilterChange: (key: keyof DashboardFilters, value: string) => void;
  onReset: () => void;
}

const FILTER_KEYS: { key: keyof DashboardFilters; label: string; optionsKey?: keyof FilterOptions }[] = [
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
  const [collapsed, setCollapsed] = useState(true);
  const activeCount = useMemo(() => Object.values(filters).filter((v) => v !== undefined && v !== '').length, [filters]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3">
        <button className="flex items-center gap-1.5 text-sm" onClick={() => setCollapsed((c) => !c)} aria-expanded={!collapsed}>
          <svg className={`h-3 w-3 text-slate-400 transition-transform ${collapsed ? '' : 'rotate-90'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-xs font-semibold text-slate-700 sm:text-sm">Filters</span>
          {activeCount > 0 && (
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#1e40af] text-[10px] font-bold text-white sm:h-5 sm:w-5 sm:text-[11px]">
              {activeCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button className="text-[10px] font-medium text-slate-500 hover:text-slate-700 transition-colors sm:text-xs" onClick={onReset}>
              Clear
            </button>
          )}
          <button
            className="flex items-center gap-1 text-[10px] font-medium text-slate-500 hover:text-slate-700 transition-colors sm:text-xs"
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? 'Show' : 'Hide'}
            <svg className={`h-3 w-3 transition-transform ${collapsed ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="border-t border-slate-100 px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {FILTER_KEYS.map(({ key, label, optionsKey }) => {
              let options: string[];
              if (key === 'end_year') options = (filterOptions?.end_years ?? []).map(String);
              else if (optionsKey) options = (filterOptions?.[optionsKey] ?? []) as string[];
              else {
                const optKey = `${key}s` as keyof FilterOptions;
                options = (filterOptions?.[optKey] ?? []) as string[];
              }
              return (
                <label key={key} className="grid gap-0.5 sm:gap-1">
                  <span className="text-[10px] font-medium text-slate-500 sm:text-xs">{label}</span>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 transition-colors hover:border-slate-300 focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]/20 outline-none sm:px-2.5 sm:py-2 sm:text-sm"
                    value={filters[key] ?? ''}
                    onChange={(e) => onFilterChange(key, e.target.value)}
                    aria-label={label}
                  >
                    <option value="">All</option>
                    {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
