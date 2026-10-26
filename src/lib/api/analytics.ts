import { apiFetch, apiFetchWithMeta } from './client';
import type {
  AnalyticsDateRange,
  AnalyticsSummaryResponse,
  AnalyticsTrendsResponse,
  AnalyticsRatingsBreakdownResponse,
  AnalyticsCampaignPerformanceResponse,
  AnalyticsRecentFeedbackItem,
  AnalyticsRecentFeedbackResponse,
} from './types';

/**
 * Retrieves the high-level business analytics summary for the selected period.
 * Strictly uses authentic platform data with semantic distinctions.
 */
export async function getAnalyticsSummary(
  range: AnalyticsDateRange = '30d',
): Promise<AnalyticsSummaryResponse> {
  return apiFetch<AnalyticsSummaryResponse>(`/dashboard/summary?range=${range}`);
}

/**
 * Retrieves daily time-series trends for feedback, average rating, scans, and review link clicks.
 * Backend guarantees zero-event days are populated for uninterrupted visual charts.
 */
export async function getAnalyticsTrends(
  range: AnalyticsDateRange = '30d',
): Promise<AnalyticsTrendsResponse> {
  return apiFetch<AnalyticsTrendsResponse>(`/dashboard/feedback-trends?range=${range}`);
}

/**
 * Retrieves star rating breakdown (1 to 5 stars) with counts and percentages.
 */
export async function getRatingsBreakdown(
  range: AnalyticsDateRange = '30d',
): Promise<AnalyticsRatingsBreakdownResponse> {
  return apiFetch<AnalyticsRatingsBreakdownResponse>(`/dashboard/ratings-breakdown?range=${range}`);
}

/**
 * Retrieves per-campaign performance metrics (period scans, period feedbacks, Google review clicks).
 */
export async function getCampaignPerformance(
  range: AnalyticsDateRange = '30d',
): Promise<AnalyticsCampaignPerformanceResponse> {
  return apiFetch<AnalyticsCampaignPerformanceResponse>(`/dashboard/qr-performance?range=${range}`);
}

/**
 * Retrieves recent feedback previews without PII.
 */
export async function getRecentFeedbackPreview(query?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<AnalyticsRecentFeedbackResponse> {
  const params = new URLSearchParams();
  if (query?.page) params.append('page', String(query.page));
  if (query?.limit) params.append('limit', String(query.limit));
  if (query?.status) params.append('status', query.status);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const result = await apiFetchWithMeta<AnalyticsRecentFeedbackItem[]>(
    `/dashboard/recent-feedback${queryString}`,
  );

  const meta = result.meta || {};
  return {
    feedbacks: result.data || [],
    total: typeof meta.total === 'number' ? meta.total : 0,
    page: typeof meta.page === 'number' ? meta.page : 1,
    limit: typeof meta.limit === 'number' ? meta.limit : 5,
    totalPages: typeof meta.totalPages === 'number' ? meta.totalPages : 1,
  };
}
