import { useMemo, useRef, useState } from 'react';
import type { PaginatedRecords, RecordItem } from '../types';
import {
  IconDocument, IconChevronLeft, IconChevronRight, IconDatabase,
  IconBolt, IconTarget, IconStar, IconGlobe, IconCalendar,
  IconFlame, IconLeafAlt, IconCloud, IconDollar, IconShield,
  IconChart, IconHeart, IconBook, IconMap, IconBuilding,
  IconLink, IconTag, IconLocation,
} from '../lib/icons';

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

const TOPIC_ICONS: Record<string, typeof IconFlame> = {
  oil: IconFlame, gas: IconFlame, energy: IconFlame,
  renewable: IconLeafAlt, agriculture: IconLeafAlt,
  climate: IconCloud, water: IconCloud,
  economy: IconDollar, finance: IconDollar, trade: IconDollar,
  policy: IconShield, regulation: IconShield, security: IconShield, conflict: IconShield,
  technology: IconChart,
  health: IconHeart,
  education: IconBook,
  transportation: IconMap,
  tourism: IconGlobe,
  food: IconLeafAlt,
};

function getTopicMeta(topic: string | null): { color: string; Icon: typeof IconFlame } {
  if (!topic) return { color: '#c7c7cc', Icon: IconTag };
  const key = Object.keys(TOPIC_COLORS).find((k) => topic.toLowerCase().includes(k));
  const color = key ? TOPIC_COLORS[key] : '#5856d6';
  const Icon = key && TOPIC_ICONS[key] ? TOPIC_ICONS[key] : IconTag;
  return { color, Icon };
}

function formatDate(d: string | null): string {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return d; }
}

function ScoreMeter({ icon: Icon, value, max = 20 }: { icon: typeof IconBolt; value: number | null; max?: number }) {
  const pct = value !== null && value !== undefined ? Math.min(value / max, 1) : 0;
  const barColor = pct >= 0.7 ? '#34c759' : pct >= 0.4 ? '#ff9500' : '#c7c7cc';
  return (
    <div className="flex items-center gap-2">
      <Icon size={10} className="shrink-0 text-[#c7c7cc]" strokeWidth={2} />
      <span className="text-[10px] font-medium text-[#86868b] w-3 tabular-nums">{value ?? '–'}</span>
      <div className="h-1.5 flex-1 min-w-[36px] rounded-full bg-[#f0f0f2] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct * 100}%`, backgroundColor: barColor }} />
      </div>
    </div>
  );
}

function MobileRecordCard({ item, index }: { item: RecordItem; index: number }) {
  const { color: tc, Icon: TopicIcon } = getTopicMeta(item.topic);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative pl-3">
      <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full transition-opacity duration-300" style={{ backgroundColor: tc, opacity: expanded ? 0.7 : 0.35 }} />
      <div
        className="card-apple px-4 py-3.5 cursor-pointer active:scale-[0.99] transition-all duration-200"
        onClick={() => setExpanded((e) => !e)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-[#c7c7cc] tabular-nums shrink-0">{index + 1}</span>
              <span className="text-sm font-medium text-[#1d1d1f] leading-snug line-clamp-2 flex items-center gap-1.5">
                {item.url && <IconLink size={11} className="shrink-0 text-[#c7c7cc]" />}
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#007aff] transition-colors" onClick={(e) => e.stopPropagation()}>{item.title}</a>
                ) : item.title}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              {item.topic && (
                <span className="inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 text-[9px] font-semibold leading-none" style={{ backgroundColor: `${tc}14`, color: tc }}>
                  <TopicIcon size={9} strokeWidth={2} />
                  {item.topic}
                </span>
              )}
              {item.country && (
                <span className="inline-flex items-center gap-1 text-[10px] text-[#86868b]">
                  <IconGlobe size={9} className="text-[#c7c7cc]" />{item.country}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[10px] text-[#c7c7cc]">
                <IconCalendar size={9} />{formatDate(item.added)}
              </span>
            </div>
          </div>
          <IconChevronRight size={12} className={`shrink-0 text-[#c7c7cc] transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
        </div>
        <div className={`overflow-hidden transition-all duration-300 ease-out ${expanded ? 'max-h-60 mt-3' : 'max-h-0'}`}>
          <div className="border-t border-[#e5e5ea] pt-3 space-y-3">
            {item.insight && <p className="text-[11px] text-[#86868b] leading-relaxed">{item.insight}</p>}
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-0.5">
                <span className="text-[9px] font-medium text-[#86868b]">Intensity</span>
                <ScoreMeter icon={IconBolt} value={item.intensity} />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-medium text-[#86868b]">Likelihood</span>
                <ScoreMeter icon={IconTarget} value={item.likelihood} />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-medium text-[#86868b]">Relevance</span>
                <ScoreMeter icon={IconStar} value={item.relevance} />
              </div>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#86868b]">
              {item.region && <span className="inline-flex items-center gap-1"><IconMap size={9} className="text-[#c7c7cc]" />{item.region}</span>}
              {item.city && <span className="inline-flex items-center gap-1"><IconLocation size={9} className="text-[#c7c7cc]" />{item.city}</span>}
              {item.source && <span className="inline-flex items-center gap-1"><IconBuilding size={9} className="text-[#c7c7cc]" />{item.source}</span>}
              {item.sector && <span className="inline-flex items-center gap-1"><IconTag size={9} className="text-[#c7c7cc]" />{item.sector}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopRow({ item, index }: { item: RecordItem; index: number }) {
  const { color: tc, Icon: TopicIcon } = getTopicMeta(item.topic);

  return (
    <tr className="border-b border-[#e5e5ea] last:border-b-0 hover:bg-[#f5f5f7] transition-colors">
      <td className="px-4 py-3.5 text-center text-[11px] text-[#c7c7cc] tabular-nums w-10 align-top pt-4">{index + 1}</td>
      <td className="px-4 py-3.5 max-w-[220px] sm:max-w-xs">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-[#1d1d1f] leading-snug line-clamp-2 inline-flex items-center gap-1.5">
            {item.url && <IconLink size={11} className="shrink-0 text-[#c7c7cc]" strokeWidth={2} />}
            {item.url ? (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#007aff] transition-colors">{item.title}</a>
            ) : item.title}
          </span>
          {item.insight && <span className="text-[11px] text-[#86868b] line-clamp-1 mt-0.5">{item.insight}</span>}
          <div className="flex items-center gap-2 mt-1">
            {item.sector && <span className="inline-flex items-center gap-1 text-[10px] text-[#c7c7cc]"><IconTag size={9} />{item.sector}</span>}
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 align-top pt-4">
        {item.topic ? (
          <span className="inline-flex items-center gap-1.5 rounded-[4px] px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${tc}14`, color: tc }}>
            <TopicIcon size={10} strokeWidth={2} />
            {item.topic}
          </span>
        ) : <span className="text-xs text-[#c7c7cc]">—</span>}
      </td>
      <td className="hidden lg:table-cell px-4 py-3.5 align-top pt-4">
        {item.country ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] text-[#86868b]">
            <IconGlobe size={10} className="shrink-0 text-[#c7c7cc]" />{item.country}
          </span>
        ) : <span className="text-[11px] text-[#c7c7cc]">—</span>}
      </td>
      <td className="hidden lg:table-cell px-4 py-3.5 align-top pt-4">
        {item.region ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] text-[#86868b]">
            <IconMap size={10} className="shrink-0 text-[#c7c7cc]" />{item.region}
          </span>
        ) : <span className="text-[11px] text-[#c7c7cc]">—</span>}
      </td>
      <td className="px-4 py-3.5 min-w-[130px] align-top pt-4">
        <div className="flex flex-col gap-1">
          <ScoreMeter icon={IconBolt} value={item.intensity} />
          <ScoreMeter icon={IconTarget} value={item.likelihood} />
          <ScoreMeter icon={IconStar} value={item.relevance} />
        </div>
      </td>
      <td className="hidden sm:table-cell px-4 py-3.5 whitespace-nowrap align-top pt-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-[#c7c7cc]">
          <IconCalendar size={10} />{formatDate(item.added)}
        </span>
      </td>
    </tr>
  );
}

export function RecordsTable({ records, page, totalPages, onPageChange }: RecordsTableProps) {
  const items = records?.items ?? [];
  const bodyRef = useRef<HTMLDivElement>(null);

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

  function handlePageChange(p: number) {
    onPageChange(p);
    bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <section className="card-apple overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#007aff]">
            <IconDocument size={14} className="text-white" strokeWidth={2} />
          </div>
          <h2 className="text-sm font-semibold text-[#1d1d1f]">Records</h2>
          {records && <span className="text-[11px] font-medium text-[#86868b] bg-[#f5f5f7] rounded-[6px] px-2 py-0.5 tabular-nums flex items-center gap-1"><IconDatabase size={10} />{records.total.toLocaleString()}</span>}
        </div>
        <span className="text-[11px] text-[#86868b] tabular-nums">{page} / {totalPages}</span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#86868b]">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f5f7]">
            <IconDocument size={28} className="text-[#c7c7cc]" strokeWidth={1} />
          </div>
          <p className="text-sm font-medium text-[#1d1d1f]">No records match your filters</p>
          <p className="text-xs text-[#86868b] mt-0.5">Try adjusting or clearing your filter selections</p>
        </div>
      ) : (
        <>
          <div className="hidden sm:block overflow-x-auto" ref={bodyRef}>
            <table className="min-w-[700px] w-full text-left" role="table">
              <thead>
                <tr className="text-[10px] font-semibold uppercase tracking-wider text-[#86868b] bg-[#f5f5f7]">
                  <th className="px-4 py-3 text-center w-10" scope="col">#</th>
                  <th className="px-4 py-3" scope="col">
                    <span className="inline-flex items-center gap-1.5"><IconDocument size={10} />Title</span>
                  </th>
                  <th className="px-4 py-3" scope="col">
                    <span className="inline-flex items-center gap-1.5"><IconTag size={10} />Topic</span>
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3" scope="col">
                    <span className="inline-flex items-center gap-1.5"><IconGlobe size={10} />Country</span>
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3" scope="col">
                    <span className="inline-flex items-center gap-1.5"><IconMap size={10} />Region</span>
                  </th>
                  <th className="px-4 py-3" scope="col">
                    <span className="inline-flex items-center gap-1.5"><IconBolt size={10} />Scores</span>
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3" scope="col">
                    <span className="inline-flex items-center gap-1.5"><IconCalendar size={10} />Added</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5ea]">
                {items.map((item, i) => <DesktopRow key={item.id} item={item} index={i + (page - 1) * records!.limit} />)}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-2 px-3 py-2">
            {items.map((item, i) => <MobileRecordCard key={item.id} item={item} index={i + (page - 1) * records!.limit} />)}
          </div>
        </>
      )}

      {items.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#e5e5ea] px-4 py-3 sm:px-5 bg-white">
          <div className="flex items-center gap-1.5">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#e5e5ea] text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7] disabled:opacity-30 disabled:pointer-events-none"
              disabled={page <= 1}
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              aria-label="Previous page"
            >
              <IconChevronLeft size={14} />
            </button>
            <div className="hidden sm:flex items-center gap-1">
              {pageButtons.map((p, i) =>
                p === 'ellipsis' ? (
                  <span key={`e${i}`} className="w-4 text-center text-[10px] text-[#c7c7cc]">...</span>
                ) : (
                  <button
                    key={p}
                    className={`h-8 min-w-8 rounded-[8px] text-[11px] font-semibold transition-all duration-200 ${
                      p === page
                        ? 'bg-[#007aff] text-white shadow-sm scale-105'
                        : 'text-[#86868b] hover:bg-[#f5f5f7]'
                    }`}
                    onClick={() => handlePageChange(p)}
                    aria-current={p === page ? 'page' : undefined}
                    aria-label={`Page ${p}`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#e5e5ea] text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7] disabled:opacity-30 disabled:pointer-events-none"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
              aria-label="Next page"
            >
              <IconChevronRight size={14} />
            </button>
          </div>
          <span className="text-[10px] text-[#86868b] tabular-nums">Page {page} of {totalPages}</span>
        </div>
      )}
    </section>
  );
}
