import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnalyticsTrendChart } from '@/components/analytics/analytics-trend-chart';
import type { AnalyticsDailyTrendPoint } from '@/lib/api/types';

const mockTrends: AnalyticsDailyTrendPoint[] = [
  { date: '2026-10-21', scanCount: 10, feedbackCount: 3, averageRating: 4.5, googleReviewClicks: 2 },
  { date: '2026-10-22', scanCount: 15, feedbackCount: 5, averageRating: 5.0, googleReviewClicks: 4 },
  { date: '2026-10-23', scanCount: 0, feedbackCount: 0, averageRating: null, googleReviewClicks: 0 },
  { date: '2026-10-24', scanCount: 12, feedbackCount: 4, averageRating: 4.8, googleReviewClicks: 3 },
];

describe('AnalyticsTrendChart Component', () => {
  it('renders SVG trend chart with accessible title and description', () => {
    render(<AnalyticsTrendChart trends={mockTrends} />);

    expect(screen.getByRole('img', { name: /activity trend chart/i })).toBeInTheDocument();
    expect(screen.getByText('Activity Trends')).toBeInTheDocument();
  });

  it('allows toggling between SVG chart view and accessible table view', () => {
    render(<AnalyticsTrendChart trends={mockTrends} />);

    const toggleButton = screen.getByRole('button', { name: /view as table/i });
    fireEvent.click(toggleButton);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('2026-10-21')).toBeInTheDocument();
    expect(screen.getByText('2026-10-22')).toBeInTheDocument();

    // Toggle back
    const chartButton = screen.getByRole('button', { name: /view as chart/i });
    fireEvent.click(chartButton);

    expect(screen.getByRole('img', { name: /activity trend chart/i })).toBeInTheDocument();
  });

  it('handles empty trend records gracefully', () => {
    render(<AnalyticsTrendChart trends={[]} />);

    expect(screen.getByText('No trend data recorded for this time period.')).toBeInTheDocument();
  });
});
