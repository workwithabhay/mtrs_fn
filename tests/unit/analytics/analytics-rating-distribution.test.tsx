import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnalyticsRatingDistribution } from '@/components/analytics/analytics-rating-distribution';
import type { AnalyticsRatingsBreakdownResponse } from '@/lib/api/types';

const mockRatings: AnalyticsRatingsBreakdownResponse = {
  period: { range: '30d', startDate: '2026-09-24', endDate: '2026-10-24' },
  totalRatings: 30,
  averageRating: 4.67,
  breakdown: [
    { star: 1, count: 1, percentage: 3.3 },
    { star: 2, count: 1, percentage: 3.3 },
    { star: 3, count: 3, percentage: 10.0 },
    { star: 4, count: 7, percentage: 23.3 },
    { star: 5, count: 18, percentage: 60.0 },
  ],
};

describe('AnalyticsRatingDistribution Component', () => {
  it('renders overall average rating score and total reviews count', () => {
    render(<AnalyticsRatingDistribution ratings={mockRatings} />);

    expect(screen.getByText('4.7')).toBeInTheDocument();
    expect(screen.getByText(/based on 30 verified customer reviews/i)).toBeInTheDocument();
  });

  it('renders 1 to 5 star distribution progress bars with accessible roles and labels', () => {
    render(<AnalyticsRatingDistribution ratings={mockRatings} />);

    expect(screen.getByRole('progressbar', { name: /5 stars rating distribution/i })).toHaveAttribute(
      'aria-valuenow',
      '60',
    );
    expect(screen.getByRole('progressbar', { name: /1 stars rating distribution/i })).toHaveAttribute(
      'aria-valuenow',
      '3.3',
    );
    expect(screen.getByText('60.0%')).toBeInTheDocument();
    expect(screen.getByText('(18)')).toBeInTheDocument();
  });

  it('renders truthful empty state when no customer ratings exist', () => {
    const emptyRatings: AnalyticsRatingsBreakdownResponse = {
      period: { range: '30d', startDate: '2026-09-24', endDate: '2026-10-24' },
      totalRatings: 0,
      averageRating: 0,
      breakdown: [
        { star: 1, count: 0, percentage: 0 },
        { star: 2, count: 0, percentage: 0 },
        { star: 3, count: 0, percentage: 0 },
        { star: 4, count: 0, percentage: 0 },
        { star: 5, count: 0, percentage: 0 },
      ],
    };

    render(<AnalyticsRatingDistribution ratings={emptyRatings} />);

    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('No customer ratings in this period')).toBeInTheDocument();
    expect(screen.getByText('No star ratings received yet for the selected timeframe.')).toBeInTheDocument();
  });
});
