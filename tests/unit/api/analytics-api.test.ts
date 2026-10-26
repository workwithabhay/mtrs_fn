import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as client from '@/lib/api/client';
import {
  getAnalyticsSummary,
  getAnalyticsTrends,
  getRatingsBreakdown,
  getCampaignPerformance,
  getRecentFeedbackPreview,
} from '@/lib/api/analytics';

describe('Analytics API Client Module', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('calls /dashboard/summary with date range query parameter', async () => {
    const mockSummary = {
      period: { range: '30d', startDate: '2026-09-24', endDate: '2026-10-24' },
      feedbacks: { total: 42, periodTotal: 12, newCount: 3, reviewedCount: 5, resolvedCount: 4 },
      ratings: { averageRating: 4.8, totalRatings: 10 },
      engagement: { totalScansAllTime: 120, periodScans: 35, googleReviewClicks: 15, activeCampaignsCount: 2 },
      semanticNotes: {
        scans: 'Raw QR scan events recorded by the platform (not unique visitors).',
        googleReviewClicks: 'Raw clicks on the external Google Review link recorded by platform.',
      },
    };

    const spy = vi.spyOn(client, 'apiFetch').mockResolvedValue(mockSummary);

    const result = await getAnalyticsSummary('30d');

    expect(spy).toHaveBeenCalledWith('/dashboard/summary?range=30d');
    expect(result.ratings.averageRating).toBe(4.8);
    expect(result.engagement.totalScansAllTime).toBe(120);
  });

  it('calls /dashboard/feedback-trends with requested date range', async () => {
    const mockTrends = {
      period: { range: '7d', startDate: '2026-10-17', endDate: '2026-10-24' },
      trends: [
        { date: '2026-10-17', feedbackCount: 2, averageRating: 5.0, scanCount: 8, googleReviewClicks: 3 },
      ],
    };

    const spy = vi.spyOn(client, 'apiFetch').mockResolvedValue(mockTrends);

    const result = await getAnalyticsTrends('7d');

    expect(spy).toHaveBeenCalledWith('/dashboard/feedback-trends?range=7d');
    expect(result.trends).toHaveLength(1);
    expect(result.trends[0].scanCount).toBe(8);
  });

  it('calls /dashboard/ratings-breakdown with range', async () => {
    const mockBreakdown = {
      period: { range: '90d', startDate: '2026-07-26', endDate: '2026-10-24' },
      totalRatings: 25,
      averageRating: 4.6,
      breakdown: [
        { star: 5, count: 18, percentage: 72.0 },
        { star: 4, count: 5, percentage: 20.0 },
        { star: 3, count: 1, percentage: 4.0 },
        { star: 2, count: 1, percentage: 4.0 },
        { star: 1, count: 0, percentage: 0.0 },
      ],
    };

    const spy = vi.spyOn(client, 'apiFetch').mockResolvedValue(mockBreakdown);

    const result = await getRatingsBreakdown('90d');

    expect(spy).toHaveBeenCalledWith('/dashboard/ratings-breakdown?range=90d');
    expect(result.breakdown).toHaveLength(5);
    expect(result.averageRating).toBe(4.6);
  });

  it('calls /dashboard/qr-performance with range', async () => {
    const mockPerformance = {
      period: { range: '30d', startDate: '2026-09-24', endDate: '2026-10-24' },
      campaigns: [
        {
          campaignId: 'camp_1',
          title: 'Patio Table',
          heading: 'Rate Your Meal',
          status: 'active' as const,
          publicToken: 'token_123',
          totalScansAllTime: 50,
          periodScans: 20,
          periodFeedbacks: 5,
          periodGoogleReviewClicks: 4,
          createdAt: '2026-10-01T12:00:00.000Z',
        },
      ],
    };

    const spy = vi.spyOn(client, 'apiFetch').mockResolvedValue(mockPerformance);

    const result = await getCampaignPerformance('30d');

    expect(spy).toHaveBeenCalledWith('/dashboard/qr-performance?range=30d');
    expect(result.campaigns[0].title).toBe('Patio Table');
    expect(result.campaigns[0].periodFeedbacks).toBe(5);
  });

  it('calls /dashboard/recent-feedback with query pagination and status parameters', async () => {
    const mockRecent = {
      data: [
        {
          id: 'fb_1',
          rating: 5,
          status: 'new' as const,
          textPreview: 'Wonderful meal!',
          hasText: true,
          campaignTitle: 'Bar',
          createdAt: '2026-10-24T16:00:00.000Z',
        },
      ],
      meta: {
        total: 1,
        page: 1,
        limit: 5,
        totalPages: 1,
      },
    };

    const spy = vi.spyOn(client, 'apiFetchWithMeta').mockResolvedValue(mockRecent);

    const result = await getRecentFeedbackPreview({ page: 1, limit: 5, status: 'new' });

    expect(spy).toHaveBeenCalledWith('/dashboard/recent-feedback?page=1&limit=5&status=new');
    expect(result.feedbacks).toHaveLength(1);
    expect(result.total).toBe(1);
  });
});
