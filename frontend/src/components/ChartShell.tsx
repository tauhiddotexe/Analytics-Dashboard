import type { ReactNode } from 'react';

interface ChartShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  chartColor?: string;
}

export function ChartShell({ title, subtitle, children, chartColor = '#2563eb' }: ChartShellProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="h-1" style={{ backgroundColor: chartColor }} />
      <div className="px-3 pt-3 pb-1 sm:px-4 sm:pt-4 sm:pb-2">
        <h3 className="text-xs font-semibold text-slate-800 sm:text-sm">{title}</h3>
        {subtitle && <p className="mt-0.5 text-[10px] text-slate-400 sm:text-xs">{subtitle}</p>}
      </div>
      <div className="h-[220px] px-1 pb-1 sm:h-[280px] sm:px-2 sm:pb-2">{children}</div>
    </section>
  );
}
