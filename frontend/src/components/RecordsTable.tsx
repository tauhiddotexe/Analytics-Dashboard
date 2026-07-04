import type { PaginatedRecords } from '../types';

interface RecordsTableProps {
  records: PaginatedRecords | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function scoreColor(value: number | null): string {
  if (value === null || value === undefined) return 'text-slate-300';
  if (value >= 14) return 'text-emerald-600';
  if (value >= 8) return 'text-amber-600';
  return 'text-slate-500';
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function RecordsTable({ records, page, totalPages, onPageChange }: RecordsTableProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-black text-slate-900">Records</h2>
        <p className="text-sm font-semibold text-slate-500">
          Page {page} of {totalPages} &middot; {records?.total ?? 0} matches
        </p>
      </div>

      {(records?.items ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <svg className="mb-3 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm font-medium">No records match the current filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm" role="table">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="sticky top-0 bg-white px-3 py-3 font-semibold" scope="col">Title</th>
                <th className="sticky top-0 bg-white px-3 py-3 font-semibold" scope="col">Insight</th>
                <th className="sticky top-0 bg-white px-3 py-3 font-semibold" scope="col">Sector</th>
                <th className="sticky top-0 bg-white px-3 py-3 font-semibold" scope="col">Topic</th>
                <th className="sticky top-0 bg-white px-3 py-3 font-semibold" scope="col">Country</th>
                <th className="sticky top-0 bg-white px-3 py-3 font-semibold" scope="col">Region</th>
                <th className="sticky top-0 bg-white px-3 py-3 font-semibold" scope="col">I / L / R</th>
                <th className="sticky top-0 bg-white px-3 py-3 font-semibold" scope="col">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records!.items.map((item) => (
                <tr key={item.id} className="align-top transition hover:bg-indigo-50/50">
                  <td className="max-w-xs px-3 py-3">
                    <div className="font-semibold text-slate-900">
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 transition hover:text-primary"
                        >
                          {item.title}
                          <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        item.title
                      )}
                    </div>
                  </td>
                  <td className="max-w-xs px-3 py-3 text-slate-500">
                    <span className="line-clamp-2 text-xs">{item.insight ?? '—'}</span>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{item.sector ?? 'N/A'}</td>
                  <td className="px-3 py-3">
                    <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {item.topic ?? 'N/A'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{item.country ?? 'N/A'}</td>
                  <td className="px-3 py-3 text-slate-600">{item.region ?? 'N/A'}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex gap-1.5 font-bold">
                      <span className={scoreColor(item.intensity)}>{item.intensity ?? '-'}</span>
                      <span className="text-slate-300">/</span>
                      <span className={scoreColor(item.likelihood)}>{item.likelihood ?? '-'}</span>
                      <span className="text-slate-300">/</span>
                      <span className={scoreColor(item.relevance)}>{item.relevance ?? '-'}</span>
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-400">{formatDate(item.added)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-5 flex justify-end gap-3">
        <button
          className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          aria-label="Previous page"
        >
          Previous
        </button>
        <button
          className="cursor-pointer rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-primary disabled:opacity-40 disabled:hover:bg-slate-900"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </section>
  );
}
