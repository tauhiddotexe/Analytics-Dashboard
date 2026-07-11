import type { ReactNode } from 'react';
import { IconChart } from '../lib/icons';

interface ChartShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  chartColor?: string;
}

export function ChartShell({ title, subtitle, children }: ChartShellProps) {
  return (
    <section className="card-apple overflow-hidden group">
      <div className="flex items-start justify-between px-4 pt-4 pb-2 sm:px-5 sm:pt-5 sm:pb-2">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-[#1d1d1f]">{title}</h3>
          {subtitle && <p className="mt-0.5 text-[12px] text-[#86868b]">{subtitle}</p>}
        </div>
        <IconChart size={14} className="text-[#c7c7cc] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="h-[220px] px-2 pb-2 sm:h-[300px] sm:px-3 sm:pb-3">{children}</div>
    </section>
  );
}
