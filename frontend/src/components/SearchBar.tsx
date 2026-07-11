import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchSearch } from '../api';
import type { SearchResult } from '../types';
import { IconSearch, IconDocument } from '../lib/icons';

interface SearchBarProps {
  onSelect: (result: SearchResult) => void;
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (timer.current) clearTimeout(timer.current);
    if (value.length < 2) { setResults([]); setOpen(false); return; }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try { const data = await fetchSearch(value); setResults(data); setOpen(data.length > 0); }
      catch { setResults([]); }
      finally { setLoading(false); }
    }, 300);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full sm:max-w-md">
      <div className="flex items-center rounded-[10px] border border-[#e5e5ea] bg-[#f5f5f7] px-3 py-2 text-sm transition-all focus-within:border-[#007aff] focus-within:shadow-[0_0_0_3px_rgba(0,122,255,0.15)]">
        <IconSearch size={16} className="mr-2 shrink-0 text-[#86868b]" />
        <input
          className="w-full bg-transparent text-[#1d1d1f] placeholder-[#86868b] outline-none text-sm"
          type="search"
          placeholder="Search titles, insights..."
          aria-label="Search records"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
        />
        {loading && <span className="ml-2 h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-[#c7c7cc] border-t-[#007aff]" />}
      </div>
      {open && results.length > 0 && (
        <ul className="absolute top-full z-50 mt-1.5 w-full overflow-hidden rounded-[12px] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-[#e5e5ea]" role="listbox">
          {results.slice(0, 8).map((r) => (
            <li key={r.id}>
              <button
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7]"
                role="option"
                aria-selected={false}
                onClick={() => { onSelect(r); setOpen(false); setQuery(''); }}
              >
                <IconDocument size={14} className="shrink-0 text-[#c7c7cc]" />
                <span className="flex-1 truncate font-medium">{r.title}</span>
                {r.sector && <span className="hidden shrink-0 text-[11px] text-[#86868b] sm:inline">{r.sector}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
