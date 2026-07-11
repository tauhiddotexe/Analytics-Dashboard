import { useMemo, useState } from 'react';
import type { DashboardFilters, FilterOptions } from '../types';
import { IconSliders, IconChevronRight, IconChevronDown, IconRefresh } from '../lib/icons';

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
    <section className="card-apple">
      <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5">
        <button className="flex items-center gap-2 text-sm" onClick={() => setCollapsed((c) => !c)} aria-expanded={!collapsed}>
          <IconSliders size={13} className="text-[#86868b]" />
          <span className="text-xs font-semibold text-[#1d1d1f] sm:text-sm">Filters</span>
          {activeCount > 0 && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#007aff] text-[10px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <button className="flex items-center gap-1 text-[11px] font-medium text-[#007aff] hover:text-[#0056cc] transition-colors" onClick={onReset}>
              <IconRefresh size={11} />
              Clear
            </button>
          )}
          <button
            className="flex items-center gap-1 text-[11px] font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors"
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? 'Show' : 'Hide'}
            <IconChevronDown size={11} className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="border-t border-[#e5e5ea] px-4 py-3 sm:px-5 sm:py-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {FILTER_KEYS.map(({ key, label, optionsKey }) => {
              let options: string[];
              if (key === 'end_year') options = (filterOptions?.end_years ?? []).map(String);
              else if (optionsKey) options = (filterOptions?.[optionsKey] ?? []) as string[];
              else {
                const optKey = `${key}s` as keyof FilterOptions;
                options = (filterOptions?.[optKey] ?? []) as string[];
              }
              return (
                <label key={key} className="grid gap-1">
                  <span className="text-[10px] font-medium text-[#86868b] tracking-wide uppercase">{label}</span>
                  <select
                    className="w-full rounded-[10px] border border-[#e5e5ea] bg-white px-2.5 py-2 text-xs text-[#1d1d1f] transition-all hover:border-[#c7c7cc] focus:border-[#007aff] focus:shadow-[0_0_0_3px_rgba(0,122,255,0.15)] outline-none sm:text-sm appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2386868b%22%20stroke-width%3D%222.5%22%3E%3Cpath%20d%3D%22M19%209l-7%207-7-7%22/%3E%3C/svg%3E')] bg-[length:10px] bg-[right_10px_center] bg-no-repeat pr-8"
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
