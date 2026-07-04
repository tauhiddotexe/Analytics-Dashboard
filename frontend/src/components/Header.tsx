import { type ReactNode } from 'react';

interface HeaderProps {
  children: ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl sm:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
        Blackcoffer BI
      </p>
      <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Global insights dashboard
          </h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Interactive visual analytics for the provided JSON dataset. All database
            access, filters, pagination, and aggregations are handled by FastAPI.
          </p>
        </div>
        <div className="rounded-2xl bg-white/10 px-5 py-4 text-sm text-slate-200 ring-1 ring-white/15">
          API base{' '}
          <span className="block font-mono text-cyan-200">/api/v1</span>
        </div>
      </div>
      {children}
    </header>
  );
}
