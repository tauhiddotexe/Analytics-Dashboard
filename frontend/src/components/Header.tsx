import type { ReactNode } from 'react';
import type { Summary } from '../types';
import { IconDatabase, IconGlobe, IconStar, IconTarget } from '../lib/icons';

interface HeaderProps {
  children: ReactNode;
  summary: Summary | null;
  className?: string;
}

const STATS_CONFIG = [
  { label: 'Records', icon: IconDatabase, color: '#007aff', bg: 'rgba(0,122,255,0.1)' },
  { label: 'Countries', icon: IconGlobe, color: '#af52de', bg: 'rgba(175,82,222,0.1)' },
  { label: 'Topics', icon: IconStar, color: '#ff9500', bg: 'rgba(255,149,0,0.1)' },
  { label: 'Regions', icon: IconTarget, color: '#34c759', bg: 'rgba(52,199,89,0.1)' },
];

export function Header({ children, summary, className }: HeaderProps) {
  return (
    <header className={`relative overflow-hidden rounded-[14px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${className ?? ''}`}>
      <div className="h-1 bg-gradient-to-r from-[#007aff] via-[#af52de] to-[#ff9500]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#007aff]/[0.02] via-transparent to-transparent pointer-events-none" />
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#007aff]/[0.03] blur-3xl pointer-events-none" />
      <div className="absolute -left-20 top-10 h-32 w-32 rounded-full bg-[#af52de]/[0.03] blur-3xl pointer-events-none" />

      <div className="relative px-5 py-4 sm:px-7 sm:py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#007aff] to-[#5856d6] shadow-sm">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7M4 7c0-2 1-3 3-3h10c2 0 3 1 3 3M4 7h16" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] font-semibold tracking-[0.12em] text-[#86868b] uppercase">Blackcoffer BI</span>
              <div className="flex items-baseline gap-3">
                <h1 className="text-xl font-bold tracking-tight text-[#1d1d1f] sm:text-2xl">Global insights dashboard</h1>
                <span className="hidden text-[11px] text-[#86868b] sm:inline">Real-time analytics &amp; intelligence</span>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-auto sm:min-w-[260px]">{children}</div>
        </div>

        {summary && (
          <div className="mt-5 flex flex-wrap gap-2 border-t border-[#e5e5ea] pt-4 sm:gap-2.5">
            {STATS_CONFIG.map(({ label, icon: Icon, color, bg }) => (
              <div
                key={label}
                className="inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 transition-all duration-200 hover:shadow-sm"
                style={{ backgroundColor: bg }}
              >
                <Icon size={12} color={color} />
                <span className="text-[11px] font-medium text-[#86868b]">{label}</span>
                <span className="text-[11px] font-semibold text-[#1d1d1f]">
                  {summary[label.toLowerCase() as keyof Summary]?.toLocaleString() ?? '0'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
