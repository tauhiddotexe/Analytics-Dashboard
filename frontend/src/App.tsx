import { startTransition, useEffect, useRef, useState } from 'react';
import { fetchDistribution, fetchFilters, fetchMetricChart, fetchRecords, fetchSummary, fetchYearly } from './api';
import { ChartShell } from './components/ChartShell';
import { FilterPanel } from './components/FilterPanel';
import { Header } from './components/Header';
import { KpiCard } from './components/KpiCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { RecordsTable } from './components/RecordsTable';
import { SearchBar } from './components/SearchBar';
import { IntensityBarChart } from './charts/IntensityBarChart';
import { LikelihoodHorizontalChart } from './charts/LikelihoodHorizontalChart';
import { RelevanceRadarChart } from './charts/RelevanceRadarChart';
import { YearlyComposedChart } from './charts/YearlyComposedChart';
import { CountryTreemap } from './charts/CountryTreemap';
import { TopicsBarChart } from './charts/TopicsBarChart';
import type { ChartPoint, DashboardFilters, FilterOptions, PaginatedRecords, SearchResult, Summary, YearlyPoint } from './types';

const emptyFilters: DashboardFilters = {};

function formatNumber(value: number | null | undefined): string {
  return value === null || value === undefined ? 'N/A' : value.toLocaleString();
}

function App() {
  const [filters, setFilters] = useState<DashboardFilters>(emptyFilters);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [records, setRecords] = useState<PaginatedRecords | null>(null);
  const [intensity, setIntensity] = useState<ChartPoint[]>([]);
  const [likelihood, setLikelihood] = useState<ChartPoint[]>([]);
  const [relevance, setRelevance] = useState<ChartPoint[]>([]);
  const [yearly, setYearly] = useState<YearlyPoint[]>([]);
  const [countries, setCountries] = useState<ChartPoint[]>([]);
  const [topics, setTopics] = useState<ChartPoint[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recordsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFilters().then(setFilterOptions).catch(() => setError('Unable to load filter options. Check the API server and database connection.'));
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    Promise.all([
      fetchSummary(filters),
      fetchRecords(filters, page, 12),
      fetchMetricChart('intensity', 'country', filters),
      fetchMetricChart('likelihood', 'region', filters),
      fetchMetricChart('relevance', 'sector', filters),
      fetchYearly(filters),
      fetchDistribution('countries', 'count', filters),
      fetchDistribution('topics', 'count', filters),
    ])
      .then(([summaryData, recordData, intensityData, likelihoodData, relevanceData, yearlyData, countryData, topicData]) => {
        if (!active) return;
        setSummary(summaryData);
        setRecords(recordData);
        setIntensity(intensityData);
        setLikelihood(likelihoodData);
        setRelevance(relevanceData);
        setYearly(yearlyData);
        setCountries(countryData);
        setTopics(topicData);
      })
      .catch(() => {
        if (active) setError('Dashboard data could not be loaded. Verify backend setup and Supabase credentials.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [filters, page]);

  function updateFilter(key: keyof DashboardFilters, value: string) {
    startTransition(() => {
      setPage(1);
      setFilters((current) => ({ ...current, [key]: value }));
    });
  }

  function handleSearchSelect(result: SearchResult) {
    setFilters({ sector: result.sector ?? undefined });
    setPage(1);
    recordsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const totalPages = records ? Math.max(1, Math.ceil(records.total / records.limit)) : 1;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Header>
          <div className="mt-6">
            <SearchBar onSelect={handleSearchSelect} />
          </div>
        </Header>

        <div className="mt-6 space-y-6">
          <FilterPanel
            filters={filters}
            filterOptions={filterOptions}
            onFilterChange={updateFilter}
            onReset={() => { setPage(1); setFilters(emptyFilters); }}
          />

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard label="Total records" value={formatNumber(summary?.total_records)} accent="bg-indigo-500" />
                <KpiCard label="Average intensity" value={formatNumber(summary?.average_intensity)} accent="bg-cyan-500" />
                <KpiCard label="Average likelihood" value={formatNumber(summary?.average_likelihood)} accent="bg-emerald-500" />
                <KpiCard label="Average relevance" value={formatNumber(summary?.average_relevance)} accent="bg-amber-500" />
              </section>

              <section className="grid gap-6 xl:grid-cols-2">
                <ChartShell title="Average intensity by country">
                  <IntensityBarChart data={intensity} />
                </ChartShell>
                <ChartShell title="Likelihood by region">
                  <LikelihoodHorizontalChart data={likelihood} />
                </ChartShell>
                <ChartShell title="Relevance by sector">
                  <RelevanceRadarChart data={relevance} />
                </ChartShell>
                <ChartShell title="Yearly trends">
                  <YearlyComposedChart data={yearly} />
                </ChartShell>
                <ChartShell title="Country distribution">
                  <CountryTreemap data={countries} />
                </ChartShell>
                <ChartShell title="Top topics">
                  <TopicsBarChart data={topics} />
                </ChartShell>
              </section>

              <div ref={recordsRef}>
                <RecordsTable
                  records={records}
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
