import { useMemo } from 'react';
import type { PaginatedRecords, RecordItem } from '../types';

interface RecordsTableProps {
  records: PaginatedRecords | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TOPIC_COLORS: Record<string, string> = {
  oil: '#ff3b30', gas: '#ff3b30', energy: '#ff9500', renewable: '#34c759',
  climate: '#5ac8fa', economy: '#af52de', policy: '#007aff', technology: '#5ac8fa',
  water: '#34c759', food: '#ff9500', health: '#ff2d55', transportation: '#af52de',
  tourism: '#007aff', education: '#34c759', agriculture: '#34c759',
  security: '#ff3b30', conflict: '#ff3b30', trade: '#ff9500', finance: '#34c759', regulation: '#af52de',
};

function getTopicColor(topic: string | null): string {
  if (!topic) return '#c7c7cc';
  const key = Object.keys(TOPIC_COLORS).find((k) => topic.toLowerCase().includes(k));
  return key ? TOPIC_COLORS[key] : '#5856d6';
}

function scorePill(v: number | null): { label: string; className: string } {
  if (v === null || v === undefined) return { label: '\u2014', className: 'text-[#c7c7cc]' };
  if (v >= 14) return { label: String(v), className: 'text-[#34c759] font-semibold' };
  if (v >= 8) return { label: String(v), className: 'text-[#ff9500] font-semibold' };
  return { label: String(v), className: 'text-[#86868b]' };
}

function formatDate(d: string | null): string {
  if (!d) return '\u2014';
  try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return d; }
}

function RecordRow({ item, index }: { item: RecordItem; index: number }) {
  const tc = useMemo(() => getTopicColor(item.topic), [item.topic]);

  return (
    <tr className="apple-separator last:border-b-0 hover:bg-[#f5f5f7] transition-colors">
      <td className="px-3 py-3 text-center text-[11px] text-[#c7c7cc] tabular-nums sm:px-4">{index + 1}</td>
      <td className="max-w-[180px] px-3 py-3 sm:max-w-xs sm:px-4">
        <span className="text-sm font-medium text-[#1d1d1f]">
          {item.url ? (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#007aff] transition-colors">{item.title}</a>
          ) : item.title}
        </span>
        <span className="ml-2 hidden text-[11px] text-[#86868b] sm:inline">{item.sector ?? ''}</span>
      </td>
      <td className="hidden px-3 py-3 md:table-cell md:px-4">
        <span className="line-clamp-1 text-[12px] text-[#86868b]">{item.insight ?? '\u2014'}</span>
      </td>
      <td className="px-3 py-3 sm:px-4">
        {item.topic ? (
          <span className="inline-block rounded-[6px] px-2 py-0.5 text-[11px] font-semibold truncate max-w-[70px] sm:max-w-none" style={{ backgroundColor: `${tc}14`, color: tc }}>
            {item.topic}
          </span>
        ) : <span className="text-xs text-[#c7c7cc]">\u2014</span>}
      </td>
      <td className="hidden px-3 py-3 md:table-cell md:px-4">
        <span className="text-[12px] text-[#86868b]">{item.country ?? '\u2014'}</span>
      </td>
      <td className="px-3 py-3 sm:px-4">
        <span className="text-[12px] text-[#86868b]">{item.region ?? '\u2014'}</span>
      </td>
      <td className="px-3 py-3 whitespace-nowrap sm:px-4">
        <div className="flex items-center gap-2 text-[11px]">
          <span className={scorePill(item.intensity).className}>I:{scorePill(item.intensity).label}</span>
          <span className={scorePill(item.likelihood).className}>L:{scorePill(item.likelihood).label}</span>
          <span className={scorePill(item.relevance).className}>R:{scorePill(item.relevance).label}</span>
        </div>
      </td>
      <td className="hidden px-3 py-3 text-[11px] text-[#c7c7cc] sm:table-cell sm:px-4">{formatDate(item.added)}</td>
    </tr>
  );
}

function PageButton({ p, current, onClick }: { p: number; current: number; onClick: (p: number) => void }) {
  return (
    <button
      className={`h-7 min-w-7 rounded-lg text-xs font-semibold transition-all ${p === current ? 'bg-[#007aff] text-white' : 'text-[#86868b] hover:bg-[#f5f5f7]'}`}
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
    <section className="card-apple overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#007aff] text-xs font-semibold text-white">R</div>
          <h2 className="text-sm font-semibold text-[#1d1d1f]">Records</h2>
          {records && <span className="text-[11px] text-[#86868b]">({records.total})</span>}
        </div>
        <span className="text-[11px] text-[#86868b]">{page} / {totalPages}</span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-[#86868b]">
          <svg className="mb-2 h-8 w-8 text-[#c7c7cc]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm text-[#86868b]">No records found</p>
          <p className="text-xs text-[#c7c7cc]">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[550px] w-full text-left" role="table">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] bg-[#f5f5f7]">
                <th className="w-8 px-3 py-3 text-center sm:px-4 sm:w-10" scope="col">#</th>
                <th className="px-3 py-3 sm:px-4" scope="col">Title</th>
                <th className="hidden px-3 py-3 md:table-cell md:px-4" scope="col">Insight</th>
                <th className="px-3 py-3 sm:px-4" scope="col">Topic</th>
                <th className="hidden px-3 py-3 md:table-cell md:px-4" scope="col">Country</th>
                <th className="px-3 py-3 sm:px-4" scope="col">Region</th>
                <th className="px-3 py-3 sm:px-4" scope="col">Scores</th>
                <th className="hidden px-3 py-3 sm:table-cell sm:px-4" scope="col">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5ea]">
              {items.map((item, i) => <RecordRow key={item.id} item={item} index={i + (page - 1) * records!.limit} />)}
            </tbody>
          </table>
        </div>
      )}

      {items.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between apple-separator px-4 py-2.5 sm:px-5 sm:py-3">
          <span className="hidden text-[11px] text-[#86868b] sm:inline">Page {page} of {totalPages}</span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              className="rounded-[8px] border border-[#e5e5ea] px-2.5 py-1.5 text-[11px] font-medium text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7] disabled:opacity-40 sm:rounded-lg sm:px-3 sm:py-1.5"
              disabled={page <= 1}
              onClick={() => onPageChange(Math.max(1, page - 1))}
              aria-label="Previous page"
            >
              Prev
            </button>
            <div className="hidden gap-1 sm:flex sm:gap-1.5">
              {pageButtons.map((p, i) =>
                p === 'ellipsis' ? (
                  <span key={`e${i}`} className="self-center px-1 text-xs text-[#c7c7cc]">...</span>
                ) : (
                  <PageButton key={p} p={p} current={page} onClick={onPageChange} />
                )
              )}
            </div>
            <span className="text-xs text-[#86868b] sm:hidden">{page} / {totalPages}</span>
            <button
              className="rounded-[8px] border border-[#e5e5ea] px-2.5 py-1.5 text-[11px] font-medium text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7] disabled:opacity-40 sm:rounded-lg sm:px-3 sm:py-1.5"
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
