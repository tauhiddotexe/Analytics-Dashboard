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
import { WorldMap } from './charts/WorldMap';
import { TopicsBarChart } from './charts/TopicsBarChart';
import type { ChartPoint, DashboardFilters, FilterOptions, PaginatedRecords, SearchResult, Summary, YearlyPoint } from './types';

const emptyFilters: DashboardFilters = {};

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
    fetchFilters()
      .then(setFilterOptions)
      .catch(() => setError('Unable to load filter options.'));
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
        if (active) setError('Dashboard data could not be loaded.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [filters, page]);

  function updateFilter(key: keyof DashboardFilters, value: string) {
    startTransition(() => {
      setPage(1);
      setFilters((current) => ({ ...current, [key]: value || undefined }));
    });
  }

  function handleSearchSelect(result: SearchResult) {
    setFilters({ sector: result.sector ?? undefined });
    setPage(1);
    recordsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const totalPages = records ? Math.max(1, Math.ceil(records.total / records.limit)) : 1;

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-10">
        <Header summary={summary} className="animate-spring-in">
          <SearchBar onSelect={handleSearchSelect} />
        </Header>

        <div className="mt-6 space-y-6">
          <div className="animate-slide-up" style={{ animationDelay: '60ms' }}>
            <FilterPanel
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={updateFilter}
              onReset={() => { startTransition(() => { setPage(1); setFilters(emptyFilters); }); }}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-[#ff3b30] animate-slide-up" role="alert">
              <span className="font-bold">•</span>
              {error}
            </div>
          )}

          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Total records', value: summary?.total_records ?? 0, color: 'var(--color-chart-1)' },
                  { label: 'Average intensity', value: summary?.average_intensity ?? 0, decimals: 1 as const, color: 'var(--color-chart-1)' },
                  { label: 'Average likelihood', value: summary?.average_likelihood ?? 0, decimals: 1 as const, color: 'var(--color-chart-2)' },
                  { label: 'Average relevance', value: summary?.average_relevance ?? 0, decimals: 1 as const, color: 'var(--color-chart-3)' },
                ].map((kpi, i) => (
                  <div key={kpi.label} className="animate-spring-in" style={{ animationDelay: `${100 + i * 80}ms` }}>
                    <KpiCard label={kpi.label} value={kpi.value} decimals={kpi.decimals} color={kpi.color} />
                  </div>
                ))}
              </section>

              <section className="grid gap-5 xl:grid-cols-2">
                {([
                  { title: 'Intensity by country', subtitle: 'Average intensity score per country', chart: <IntensityBarChart data={intensity} />, chartColor: 'var(--color-chart-1)' },
                  { title: 'Likelihood by region', subtitle: 'Average likelihood score per region', chart: <LikelihoodHorizontalChart data={likelihood} />, chartColor: 'var(--color-chart-2)' },
                  { title: 'Relevance by sector', subtitle: 'Average relevance score by sector', chart: <RelevanceRadarChart data={relevance} />, chartColor: 'var(--color-chart-3)' },
                  { title: 'Yearly trends', subtitle: 'Record volume and metric averages over time', chart: <YearlyComposedChart data={yearly} />, chartColor: 'var(--color-chart-6)' },
                  { title: 'Country distribution', subtitle: 'Records by country (choropleth)', chart: <WorldMap data={countries} />, chartColor: 'var(--color-chart-5)' },
                  { title: 'Top topics', subtitle: 'Most frequent topics by record count', chart: <TopicsBarChart data={topics} />, chartColor: 'var(--color-chart-4)' },
                ] as const).map((item, i) => (
                  <div key={item.title} className="animate-spring-in" style={{ animationDelay: `${300 + i * 100}ms` }}>
                    <ChartShell title={item.title} subtitle={item.subtitle} chartColor={item.chartColor}>
                      {item.chart}
                    </ChartShell>
                  </div>
                ))}
              </section>

              <div ref={recordsRef} className="animate-spring-in" style={{ animationDelay: '800ms' }}>
                <RecordsTable
                  records={records}
                  page={page}
                  totalPages={totalPages}
                  onPageChange={(p) => startTransition(() => setPage(p))}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
