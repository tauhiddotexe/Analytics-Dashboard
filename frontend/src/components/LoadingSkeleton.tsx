export function LoadingSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading dashboard data">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="h-3 w-20 rounded-full bg-slate-200" />
            <div className="mt-4 h-8 w-24 rounded-full bg-slate-200" />
            <div className="mt-4 h-1.5 w-full rounded-full bg-slate-200" />
          </div>
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 h-4 w-40 rounded-full bg-slate-200" />
            <div className="h-72 rounded-2xl bg-slate-100" />
          </div>
        ))}
      </section>
    </div>
  );
}
