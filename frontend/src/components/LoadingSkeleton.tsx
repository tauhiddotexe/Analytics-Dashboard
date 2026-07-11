export function LoadingSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card-apple px-4 py-4 sm:px-5 sm:py-5">
            <div className="h-2.5 w-16 animate-pulse-subtle rounded bg-[#e5e5ea] sm:w-20" />
            <div className="mt-2 h-7 w-14 animate-pulse-subtle rounded bg-[#e8e8ed] sm:h-8 sm:w-18" />
            <div className="mt-2.5 h-1 w-8 animate-pulse-subtle rounded bg-[#e8e8ed]" />
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card-apple p-4 sm:p-5">
            <div className="h-3.5 w-32 animate-pulse-subtle rounded bg-[#e5e5ea] sm:h-4 sm:w-40" />
            <div className="mt-1.5 h-2.5 w-24 animate-pulse-subtle rounded bg-[#e8e8ed] sm:h-3 sm:w-32" />
            <div className="mt-3 h-[180px] animate-pulse-subtle rounded bg-[#f0f0f2] sm:h-[260px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
