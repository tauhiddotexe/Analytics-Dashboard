import { useMemo } from 'react';
import type { PaginatedRecords, RecordItem } from '../types';

interface RecordsTableProps {
  records: PaginatedRecords | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TOPIC_COLORS: Record<string, string> = {
  oil: '#dc2626', gas: '#dc2626', energy: '#d97706', renewable: '#059669',
  climate: '#0891b2', economy: '#7c3aed', policy: '#2563eb', technology: '#0891b2',
  water: '#0d9488', food: '#d97706', health: '#db2777', transportation: '#7c3aed',
  tourism: '#2563eb', education: '#059669', agriculture: '#059669',
  security: '#dc2626', conflict: '#dc2626', trade: '#d97706', finance: '#059669', regulation: '#7c3aed',
};

function getTopicColor(topic: string | null): string {
  if (!topic) return '#94a3b8';
  const key = Object.keys(TOPIC_COLORS).find((k) => topic.toLowerCase().includes(k));
  return key ? TOPIC_COLORS[key] : '#6366f1';
}

function scorePill(v: number | null): { label: string; className: string } {
  if (v === null || v === undefined) return { label: '\u2014', className: 'text-slate-300' };
  if (v >= 14) return { label: String(v), className: 'text-emerald-600 font-bold' };
  if (v >= 8) return { label: String(v), className: 'text-amber-600 font-bold' };
  return { label: String(v), className: 'text-slate-500' };
}

function formatDate(d: string | null): string {
  if (!d) return '\u2014';
  try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return d; }
}

function RecordRow({ item, index }: { item: RecordItem; index: number }) {
  const tc = useMemo(() => getTopicColor(item.topic), [item.topic]);

  return (
    <tr className="even:bg-slate-50/50 hover:bg-slate-100 transition-colors">
      <td className="px-2 py-2.5 text-center text-xs text-slate-300 tabular-nums sm:px-3">{index + 1}</td>
      <td className="max-w-[180px] px-2 py-2.5 sm:max-w-xs sm:px-3">
        <span className="text-sm font-medium text-slate-800">
          {item.url ? (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#1e40af] transition-colors">{item.title}</a>
          ) : item.title}
        </span>
        <span className="ml-2 hidden text-xs text-slate-400 sm:inline">{item.sector ?? ''}</span>
      </td>
      <td className="hidden px-2 py-2.5 md:table-cell md:px-3">
        <span className="line-clamp-1 text-xs text-slate-500">{item.insight ?? '\u2014'}</span>
      </td>
      <td className="px-2 py-2.5 sm:px-3">
        {item.topic ? (
          <span className="inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold truncate max-w-[70px] sm:max-w-none" style={{ backgroundColor: `${tc}18`, color: tc }}>
            {item.topic}
          </span>
        ) : <span className="text-xs text-slate-300">\u2014</span>}
      </td>
      <td className="hidden px-2 py-2.5 md:table-cell md:px-3">
        <span className="text-xs text-slate-600">{item.country ?? '\u2014'}</span>
      </td>
      <td className="px-2 py-2.5 sm:px-3">
        <span className="text-xs text-slate-600">{item.region ?? '\u2014'}</span>
      </td>
      <td className="px-2 py-2.5 whitespace-nowrap sm:px-3">
        <div className="flex items-center gap-2 text-xs">
          <span className={scorePill(item.intensity).className}>I:{scorePill(item.intensity).label}</span>
          <span className={scorePill(item.likelihood).className}>L:{scorePill(item.likelihood).label}</span>
          <span className={scorePill(item.relevance).className}>R:{scorePill(item.relevance).label}</span>
        </div>
      </td>
      <td className="hidden px-2 py-2.5 text-xs text-slate-400 sm:table-cell sm:px-3">{formatDate(item.added)}</td>
    </tr>
  );
}

function PageButton({ p, current, onClick }: { p: number; current: number; onClick: (p: number) => void }) {
  return (
    <button
      className={`h-7 min-w-7 rounded-lg text-xs font-bold transition-colors ${p === current ? 'bg-[#1e40af] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
      onClick={() => onClick(p)}
      aria-current={p === current ? 'page' : undefined}
      aria-label={`Page ${p}`}
    >
      {p}
    </button>
  );
}

export function RecordsTable({ records, page, totalPages, onPageChange }: RecordsTableProps) {
  const items = records?.items ?? [];

  const pageButtons = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];
    const add = (p: number) => { if (!pages.includes(p) && p >= 1 && p <= totalPages) pages.push(p); };
    add(1);
    if (totalPages <= 7) {
      for (let i = 2; i <= totalPages; i++) add(i);
    } else {
      const s = Math.max(2, Math.min(page - 1, totalPages - 4));
      const e = Math.min(totalPages - 1, Math.max(page + 1, 5));
      if (s > 2) pages.push('ellipsis');
      for (let i = s; i <= e; i++) add(i);
      if (e < totalPages - 1) pages.push('ellipsis');
      add(totalPages);
    }
    return pages;
  }, [page, totalPages]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-[#1e40af] text-xs font-bold text-white sm:h-7 sm:w-7">R</div>
          <h2 className="text-sm font-bold text-slate-800">Records</h2>
          {records && <span className="text-xs text-slate-400">({records.total})</span>}
        </div>
        <span className="text-xs text-slate-400">{page} / {totalPages}</span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <svg className="mb-2 h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm text-slate-500">No records found</p>
          <p className="text-xs text-slate-400">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[550px] w-full text-left" role="table">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="w-8 px-2 py-2.5 text-center sm:px-3 sm:w-10" scope="col">#</th>
                <th className="px-2 py-2.5 sm:px-3" scope="col">Title</th>
                <th className="hidden px-2 py-2.5 md:table-cell md:px-3" scope="col">Insight</th>
                <th className="px-2 py-2.5 sm:px-3" scope="col">Topic</th>
                <th className="hidden px-2 py-2.5 md:table-cell md:px-3" scope="col">Country</th>
                <th className="px-2 py-2.5 sm:px-3" scope="col">Region</th>
                <th className="px-2 py-2.5 sm:px-3" scope="col">Scores</th>
                <th className="hidden px-2 py-2.5 sm:table-cell sm:px-3" scope="col">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, i) => <RecordRow key={item.id} item={item} index={i + (page - 1) * records!.limit} />)}
            </tbody>
          </table>
        </div>
      )}

      {items.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 px-3 py-2 sm:px-4 sm:py-3">
          <span className="hidden text-xs text-slate-400 sm:inline">Page {page} of {totalPages}</span>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              className="rounded border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 sm:rounded-lg sm:px-3 sm:py-1.5"
              disabled={page <= 1}
              onClick={() => onPageChange(Math.max(1, page - 1))}
              aria-label="Previous page"
            >
              Prev
            </button>
            <div className="hidden gap-1 sm:flex sm:gap-2">
              {pageButtons.map((p, i) =>
                p === 'ellipsis' ? (
                  <span key={`e${i}`} className="self-center px-1 text-xs text-slate-300">...</span>
                ) : (
                  <PageButton key={p} p={p} current={page} onClick={onPageChange} />
                )
              )}
            </div>
            <span className="text-xs text-slate-400 sm:hidden">{page} / {totalPages}</span>
            <button
              className="rounded border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 sm:rounded-lg sm:px-3 sm:py-1.5"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
