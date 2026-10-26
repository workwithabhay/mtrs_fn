import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnalyticsCampaignTable } from '@/components/analytics/analytics-campaign-table';
import type { AnalyticsCampaignPerformanceItem } from '@/lib/api/types';

const mockCampaigns: AnalyticsCampaignPerformanceItem[] = [
  {
    campaignId: 'c1',
    title: 'Front Counter Display',
    heading: 'How did we do today?',
    status: 'active',
    publicToken: 'tok_front',
    totalScansAllTime: 120,
    periodScans: 40,
    periodFeedbacks: 10,
    periodGoogleReviewClicks: 8,
    createdAt: '2026-10-01T10:00:00.000Z',
  },
  {
    campaignId: 'c2',
    title: 'Patio Table 4',
    heading: 'Enjoying your evening?',
    status: 'inactive',
    publicToken: 'tok_patio',
    totalScansAllTime: 30,
    periodScans: 0,
    periodFeedbacks: 0,
    periodGoogleReviewClicks: 0,
    createdAt: '2026-10-05T10:00:00.000Z',
  },
];

describe('AnalyticsCampaignTable Component', () => {
  it('renders campaign rows with accurate period scans, feedback count, and submission conversion rate', () => {
    render(<AnalyticsCampaignTable campaigns={mockCampaigns} />);

    expect(screen.getAllByText('Front Counter Display')[0]).toBeInTheDocument();
    expect(screen.getAllByText('active')[0]).toBeInTheDocument();
    expect(screen.getAllByText('40')[0]).toBeInTheDocument();
    expect(screen.getAllByText('10')[0]).toBeInTheDocument();
    // Submission rate: 10 / 40 = 25.0%
    expect(screen.getAllByText('25.0%')[0]).toBeInTheDocument();
    expect(screen.getAllByText('8')[0]).toBeInTheDocument(); // review clicks
  });

  it('handles campaigns with zero scans cleanly with an em-dash conversion rate', () => {
    render(<AnalyticsCampaignTable campaigns={mockCampaigns} />);

    expect(screen.getAllByText('Patio Table 4')[0]).toBeInTheDocument();
    expect(screen.getAllByText('inactive')[0]).toBeInTheDocument();
    expect(screen.getAllByText('—')[0]).toBeInTheDocument();
  });

  it('displays empty state when no campaigns are available', () => {
    render(<AnalyticsCampaignTable campaigns={[]} />);

    expect(screen.getByText('No QR campaigns have been created yet.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create first qr campaign/i })).toBeInTheDocument();
  });
});
