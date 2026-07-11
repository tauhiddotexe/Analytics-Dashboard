import type { ReactNode } from 'react';
import type { Summary } from '../types';

interface HeaderProps {
  children: ReactNode;
  summary: Summary | null;
  className?: string;
}

export function Header({ children, summary, className }: HeaderProps) {
  return (
    <header className={`rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-5 sm:py-4 ${className ?? ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1e40af] text-xs font-bold text-white shadow-sm sm:h-8 sm:w-8 sm:text-sm">
            B
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-800 sm:text-sm">Blackcoffer BI</span>
            <h1 className="mt-0.5 text-base font-bold tracking-tight text-slate-900 sm:mt-1 sm:text-xl">
              Global insights dashboard
            </h1>
          </div>
        </div>
        <div className="w-full sm:w-auto">{children}</div>
      </div>
      {summary && (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3 sm:mt-4 sm:gap-3 sm:pt-4">
          {[
            { label: 'Records', value: summary.total_records.toLocaleString(), color: 'bg-[#2563eb]' },
            { label: 'Countries', value: summary.countries.toLocaleString(), color: 'bg-[#7c3aed]' },
            { label: 'Topics', value: summary.topics.toLocaleString(), color: 'bg-[#dc2626]' },
            { label: 'Regions', value: summary.regions.toLocaleString(), color: 'bg-[#0891b2]' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-1.5 rounded-lg bg-[#f8fafc] px-2 py-1 sm:px-3 sm:py-1.5">
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full sm:h-2 sm:w-2 ${stat.color}`} />
              <span className="text-[10px] text-slate-500 sm:text-xs">{stat.label}</span>
              <span className="text-[10px] font-bold text-slate-800 sm:text-xs">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
