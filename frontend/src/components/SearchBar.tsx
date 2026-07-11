import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchSearch } from '../api';
import type { SearchResult } from '../types';

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
      <div className="flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition-colors focus-within:border-[#1e40af] focus-within:ring-1 focus-within:ring-[#1e40af]/20">
        <svg className="mr-2 h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input
          className="w-full bg-transparent text-slate-700 placeholder-slate-400 outline-none text-sm"
          type="search"
          placeholder="Search titles, insights..."
          aria-label="Search records"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
        />
        {loading && <span className="ml-2 h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />}
      </div>
      {open && results.length > 0 && (
        <ul className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg" role="listbox">
          {results.slice(0, 8).map((r) => (
            <li key={r.id}>
              <button
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                role="option"
                aria-selected={false}
                onClick={() => { onSelect(r); setOpen(false); setQuery(''); }}
              >
                <span className="flex-1 truncate font-medium">{r.title}</span>
                {r.sector && <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">{r.sector}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
