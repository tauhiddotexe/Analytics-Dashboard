import { type ReactNode } from 'react';

interface ChartShellProps {
  title: string;
  children: ReactNode;
}

export function ChartShell({ title, children }: ChartShellProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-black tracking-tight text-slate-900">
        {title}
      </h2>
      <div className="h-80">{children}</div>
    </section>
  );
}
