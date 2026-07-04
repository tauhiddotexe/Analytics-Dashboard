export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface DashboardFilters {
  end_year?: string;
  topic?: string;
  sector?: string;
  region?: string;
  country?: string;
  city?: string;
  source?: string;
  pestle?: string;
  swot?: string;
}

export interface FilterOptions {
  end_years: number[];
  topics: string[];
  sectors: string[];
  regions: string[];
  countries: string[];
  cities: string[];
  sources: string[];
  pestle: string[];
  swot: string[];
}

export interface Summary {
  total_records: number;
  average_intensity: number | null;
  average_likelihood: number | null;
  average_relevance: number | null;
  countries: number;
  topics: number;
  regions: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface YearlyPoint {
  year: number;
  count: number;
  average_intensity: number | null;
  average_likelihood: number | null;
  average_relevance: number | null;
}

export interface RecordItem {
  id: string;
  title: string;
  insight: string | null;
  url: string | null;
  intensity: number | null;
  likelihood: number | null;
  relevance: number | null;
  impact: number | null;
  start_year: number | null;
  end_year: number | null;
  added: string | null;
  published: string | null;
  sector: string | null;
  topic: string | null;
  region: string | null;
  country: string | null;
  city: string | null;
  pestle: string | null;
  source: string | null;
  swot: string | null;
}

export interface PaginatedRecords {
  page: number;
  limit: number;
  total: number;
  items: RecordItem[];
}

export interface SearchResult {
  id: string;
  title: string;
  sector: string | null;
  topic: string | null;
  region: string | null;
  country: string | null;
  intensity: number | null;
  likelihood: number | null;
  relevance: number | null;
}

export interface ChartConfig {
  metric: 'intensity' | 'likelihood' | 'relevance';
  groupBy: string;
  label: string;
}
