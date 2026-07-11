export function LoadingSkeleton() {
  return (
    <div className="space-y-5" role="status" aria-label="Loading">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3.5">
            <div className="h-2 w-16 animate-pulse-subtle rounded bg-slate-200 sm:h-3 sm:w-20" />
            <div className="mt-1.5 h-5 w-12 animate-pulse-subtle rounded bg-slate-100 sm:mt-2 sm:h-7 sm:w-16" />
            <div className="mt-1.5 h-0.5 w-6 animate-pulse-subtle rounded bg-slate-100 sm:mt-2 sm:w-8" />
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-slate-200 bg-white p-3 sm:p-4">
            <div className="h-3 w-28 animate-pulse-subtle rounded bg-slate-200 sm:h-4 sm:w-36" />
            <div className="mt-1 h-2 w-20 animate-pulse-subtle rounded bg-slate-100 sm:h-3 sm:w-24" />
            <div className="mt-3 h-[180px] animate-pulse-subtle rounded bg-slate-100 sm:h-[260px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
