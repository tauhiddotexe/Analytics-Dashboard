import type { ReactNode } from 'react';
import type { Summary } from '../types';

interface HeaderProps {
  children: ReactNode;
  summary: Summary | null;
  className?: string;
}

export function Header({ children, summary, className }: HeaderProps) {
  return (
    <header className={`card-apple px-5 py-4 sm:px-6 sm:py-5 ${className ?? ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#007aff] text-sm font-semibold text-white shadow-sm">
            B
          </div>
          <div>
            <span className="text-[11px] font-medium tracking-wide text-[#86868b] uppercase">Blackcoffer BI</span>
            <h1 className="mt-0.5 text-xl font-bold tracking-tight text-[#1d1d1f] sm:text-2xl">
              Global insights dashboard
            </h1>
          </div>
        </div>
        <div className="w-full sm:w-auto sm:min-w-[240px]">{children}</div>
      </div>
      {summary && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[#e5e5ea] pt-4 sm:gap-3">
          {[
            { label: 'Records', value: summary.total_records.toLocaleString() },
            { label: 'Countries', value: summary.countries.toLocaleString() },
            { label: 'Topics', value: summary.topics.toLocaleString() },
            { label: 'Regions', value: summary.regions.toLocaleString() },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-1.5 rounded-lg bg-[#f5f5f7] px-3 py-1.5">
              <span className="text-[11px] font-medium text-[#86868b]">{stat.label}</span>
              <span className="text-[11px] font-semibold text-[#1d1d1f]">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
