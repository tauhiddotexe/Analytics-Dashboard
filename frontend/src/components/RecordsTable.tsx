import type { PaginatedRecords } from '../types';

interface RecordsTableProps {
  records: PaginatedRecords | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
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
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm" role="table">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3 font-semibold" scope="col">Title</th>
              <th className="px-3 py-3 font-semibold" scope="col">Sector</th>
              <th className="px-3 py-3 font-semibold" scope="col">Topic</th>
              <th className="px-3 py-3 font-semibold" scope="col">Country</th>
              <th className="px-3 py-3 font-semibold" scope="col">Region</th>
              <th className="px-3 py-3 font-semibold" scope="col">I / L / R</th>
              <th className="px-3 py-3 font-semibold" scope="col">Year</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(records?.items ?? []).length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-12 text-center text-slate-400">
                  No records match the current filters.
                </td>
              </tr>
            ) : (
              (records?.items ?? []).map((item) => (
                <tr key={item.id} className="align-top transition hover:bg-slate-50">
                  <td className="max-w-md px-3 py-3 font-semibold text-slate-900">{item.title}</td>
                  <td className="px-3 py-3 text-slate-600">{item.sector ?? 'N/A'}</td>
                  <td className="px-3 py-3 text-slate-600">{item.topic ?? 'N/A'}</td>
                  <td className="px-3 py-3 text-slate-600">{item.country ?? 'N/A'}</td>
                  <td className="px-3 py-3 text-slate-600">{item.region ?? 'N/A'}</td>
                  <td className="px-3 py-3 font-bold text-slate-800">{item.intensity ?? '-'} / {item.likelihood ?? '-'} / {item.relevance ?? '-'}</td>
                  <td className="px-3 py-3 text-slate-600">{item.end_year ?? 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-5 flex justify-end gap-3">
        <button
          className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          aria-label="Previous page"
        >
          Previous
        </button>
        <button
          className="cursor-pointer rounded-full bg-slate-900 px-4 py-2 font-bold text-white transition hover:bg-primary disabled:opacity-40 disabled:hover:bg-slate-900"
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
