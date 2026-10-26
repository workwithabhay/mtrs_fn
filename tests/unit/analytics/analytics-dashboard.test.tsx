import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard';
import * as analyticsApi from '@/lib/api/analytics';

const mockSummary = {
  period: { range: '30d' as const, startDate: '2026-09-24T00:00:00.000Z', endDate: '2026-10-24T00:00:00.000Z' },
  feedbacks: { total: 50, periodTotal: 15, newCount: 3, reviewedCount: 8, resolvedCount: 4 },
  ratings: { averageRating: 4.8, totalRatings: 12 },
  engagement: { totalScansAllTime: 200, periodScans: 60, googleReviewClicks: 25, activeCampaignsCount: 2 },
  semanticNotes: {
    scans: 'Raw QR scan events recorded by the platform (not unique visitors).',
    googleReviewClicks: 'Raw clicks on external review link.',
  },
};

const mockTrends = {
  period: { range: '30d' as const, startDate: '2026-09-24T00:00:00.000Z', endDate: '2026-10-24T00:00:00.000Z' },
  trends: [
    { date: '2026-10-20', scanCount: 5, feedbackCount: 2, averageRating: 5.0, googleReviewClicks: 1 },
    { date: '2026-10-21', scanCount: 8, feedbackCount: 3, averageRating: 4.6, googleReviewClicks: 2 },
  ],
};

const mockRatings = {
  period: { range: '30d' as const, startDate: '2026-09-24T00:00:00.000Z', endDate: '2026-10-24T00:00:00.000Z' },
  totalRatings: 12,
  averageRating: 4.8,
  breakdown: [
    { star: 5, count: 10, percentage: 83.3 },
    { star: 4, count: 2, percentage: 16.7 },
    { star: 3, count: 0, percentage: 0 },
    { star: 2, count: 0, percentage: 0 },
    { star: 1, count: 0, percentage: 0 },
  ],
};

const mockCampaigns = {
  period: { range: '30d' as const, startDate: '2026-09-24T00:00:00.000Z', endDate: '2026-10-24T00:00:00.000Z' },
  campaigns: [
    {
      campaignId: 'camp_1',
      title: 'Dining Room QR',
      heading: 'Please leave feedback',
      status: 'active' as const,
      publicToken: 'tok_dining',
      totalScansAllTime: 100,
      periodScans: 30,
      periodFeedbacks: 8,
      periodGoogleReviewClicks: 6,
      createdAt: '2026-10-01T12:00:00.000Z',
    },
  ],
};

describe('AnalyticsDashboard Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading skeleton then loads summary, trends, ratings, and campaign performance', async () => {
    vi.spyOn(analyticsApi, 'getAnalyticsSummary').mockResolvedValue(mockSummary);
    vi.spyOn(analyticsApi, 'getAnalyticsTrends').mockResolvedValue(mockTrends);
    vi.spyOn(analyticsApi, 'getRatingsBreakdown').mockResolvedValue(mockRatings);
    vi.spyOn(analyticsApi, 'getCampaignPerformance').mockResolvedValue(mockCampaigns);

    render(<AnalyticsDashboard />);

    expect(screen.getByRole('status', { name: /loading analytics data/i })).toBeInTheDocument();

    expect(await screen.findByText('Analytics & Performance')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument(); // Period scans
    expect(screen.getByText('Activity Trends')).toBeInTheDocument();
    expect(screen.getByText('Rating Distribution')).toBeInTheDocument();
    expect(screen.getAllByText('Dining Room QR')[0]).toBeInTheDocument();
  });

  it('switches date range and re-fetches analytics data for the new period', async () => {
    const summarySpy = vi.spyOn(analyticsApi, 'getAnalyticsSummary').mockResolvedValue(mockSummary);
    vi.spyOn(analyticsApi, 'getAnalyticsTrends').mockResolvedValue(mockTrends);
    vi.spyOn(analyticsApi, 'getRatingsBreakdown').mockResolvedValue(mockRatings);
    vi.spyOn(analyticsApi, 'getCampaignPerformance').mockResolvedValue(mockCampaigns);

    render(<AnalyticsDashboard />);

    expect(await screen.findByText('Analytics & Performance')).toBeInTheDocument();

    const sevenDaysBtn = screen.getByRole('button', { name: /last 7 days/i });
    fireEvent.click(sevenDaysBtn);

    await waitFor(() => {
      expect(summarySpy).toHaveBeenCalledWith('7d');
    });
  });

  it('handles error state gracefully with a retry button', async () => {
    vi.spyOn(analyticsApi, 'getAnalyticsSummary').mockRejectedValue(new Error('Network connection timeout'));
    vi.spyOn(analyticsApi, 'getAnalyticsTrends').mockResolvedValue(mockTrends);
    vi.spyOn(analyticsApi, 'getRatingsBreakdown').mockResolvedValue(mockRatings);
    vi.spyOn(analyticsApi, 'getCampaignPerformance').mockResolvedValue(mockCampaigns);

    render(<AnalyticsDashboard />);

    expect(await screen.findByText('Unable to Load Analytics')).toBeInTheDocument();
    expect(screen.getByText('Network connection timeout')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /try again/i });
    expect(retryBtn).toBeInTheDocument();
  });
});
