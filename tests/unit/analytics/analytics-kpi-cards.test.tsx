import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnalyticsKpiCards } from '@/components/analytics/analytics-kpi-cards';
import type { AnalyticsSummaryResponse } from '@/lib/api/types';

const mockSummary: AnalyticsSummaryResponse = {
  period: { range: '30d', startDate: '2026-09-24T00:00:00.000Z', endDate: '2026-10-24T00:00:00.000Z' },
  feedbacks: {
    total: 85,
    periodTotal: 24,
    newCount: 6,
    reviewedCount: 14,
    resolvedCount: 4,
  },
  ratings: {
    averageRating: 4.75,
    totalRatings: 20,
  },
  engagement: {
    totalScansAllTime: 320,
    periodScans: 98,
    googleReviewClicks: 42,
    activeCampaignsCount: 3,
  },
  semanticNotes: {
    scans: 'Raw QR scan events recorded by the platform (not unique visitors).',
    googleReviewClicks: 'Raw clicks on external review link.',
  },
};

describe('AnalyticsKpiCards Component', () => {
  it('renders period scans, feedback count, average rating, and google review taps correctly', () => {
    render(<AnalyticsKpiCards summary={mockSummary} />);

    expect(screen.getByText('98')).toBeInTheDocument(); // Period Scans
    expect(screen.getByText(/320/)).toBeInTheDocument(); // All-time scans
    expect(screen.getByText('24')).toBeInTheDocument(); // Period feedback
    expect(screen.getByText(/(85 all-time)/i)).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument(); // Formatted rating
    expect(screen.getByText('/ 5.0')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument(); // Review clicks
  });

  it('renders semantic notes distinguishing raw scans and external clicks', () => {
    render(<AnalyticsKpiCards summary={mockSummary} />);

    expect(screen.getByText(/Raw scan events \(not unique visitors\)/i)).toBeInTheDocument();
    expect(screen.getByText(/External review link taps, not verified posted reviews/i)).toBeInTheDocument();
  });

  it('handles zero ratings state truthfully without displaying NaN or fabricated values', () => {
    const zeroRatingSummary: AnalyticsSummaryResponse = {
      ...mockSummary,
      ratings: {
        averageRating: 0,
        totalRatings: 0,
      },
    };

    render(<AnalyticsKpiCards summary={zeroRatingSummary} />);

    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('No ratings submitted in period')).toBeInTheDocument();
  });
});
