import axios from 'axios';
import type { ApiResponse, ChartPoint, DashboardFilters, FilterOptions, PaginatedRecords, SearchResult, Summary, YearlyPoint } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    'VITE_API_URL is not defined. Set it in your .env file or environment.',
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

function cleanParams(filters: DashboardFilters, extras: Record<string, string | number | undefined> = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...filters, ...extras })) {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  }
  return params;
}

async function getData<T>(url: string, params?: URLSearchParams): Promise<T> {
  const response = await api.get<ApiResponse<T>>(url, { params });
  return response.data.data;
}

export function fetchSummary(filters: DashboardFilters): Promise<Summary> {
  return getData('/dashboard/summary', cleanParams(filters));
}

export function fetchFilters(): Promise<FilterOptions> {
  return getData('/filters');
}

export function fetchRecords(filters: DashboardFilters, page: number, limit: number): Promise<PaginatedRecords> {
  return getData('/records', cleanParams(filters, { page, limit }));
}

export function fetchMetricChart(metric: 'intensity' | 'likelihood' | 'relevance', groupBy: string, filters: DashboardFilters): Promise<ChartPoint[]> {
  return getData(`/charts/${metric}`, cleanParams(filters, { group_by: groupBy }));
}

export function fetchYearly(filters: DashboardFilters): Promise<YearlyPoint[]> {
  return getData('/charts/yearly', cleanParams(filters));
}

export function fetchDistribution(dimension: 'countries' | 'regions' | 'topics' | 'sectors', metric: string, filters: DashboardFilters): Promise<ChartPoint[]> {
  return getData(`/charts/${dimension}`, cleanParams(filters, { metric }));
}

export function fetchSearch(q: string, limit = 20): Promise<SearchResult[]> {
  return getData('/search', new URLSearchParams({ q, limit: String(limit) }));
}
