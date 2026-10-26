import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CampaignList } from '@/components/campaigns/campaign-list';
import * as campaignsApi from '@/lib/api/campaigns';
import type { QrCampaign } from '@/lib/api/types';

describe('CampaignList Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockCampaigns: QrCampaign[] = [
    {
      _id: 'c-1',
      businessId: 'b-1',
      title: 'Countertop Acrylic Stand',
      heading: 'How did we do today?',
      description: 'Scan to leave a Google review or private feedback',
      branding: { primaryColor: '#2563EB', backgroundColor: '#FFFFFF' },
      status: 'active',
      publicToken: 'token-active-123456789012',
      scanCount: 28,
      createdAt: '2026-10-24T12:00:00.000Z',
      updatedAt: '2026-10-24T12:00:00.000Z',
    },
    {
      _id: 'c-2',
      businessId: 'b-1',
      title: 'Patio Table 4 Sticker',
      heading: 'Enjoying your meal?',
      description: null,
      branding: { primaryColor: '#059669', backgroundColor: '#FFFFFF' },
      status: 'inactive',
      publicToken: 'token-inactive-9876543210',
      scanCount: 5,
      createdAt: '2026-10-22T09:30:00.000Z',
      updatedAt: '2026-10-22T09:30:00.000Z',
    },
  ];

  it('should render loading skeleton while fetching campaigns', () => {
    vi.spyOn(campaignsApi, 'listCampaigns').mockReturnValue(new Promise(() => {}));

    render(<CampaignList />);

    expect(screen.getByRole('status', { name: /loading qr campaigns/i })).toBeInTheDocument();
  });

  it('should render campaign cards with real verified data', async () => {
    vi.spyOn(campaignsApi, 'listCampaigns').mockResolvedValue({
      campaigns: mockCampaigns,
      meta: { total: 2, page: 1, limit: 9, totalPages: 1 },
    });

    render(<CampaignList />);

    await waitFor(() => {
      expect(screen.getByText('Countertop Acrylic Stand')).toBeInTheDocument();
      expect(screen.getByText('Patio Table 4 Sticker')).toBeInTheDocument();
    });

    expect(screen.getByText('How did we do today?')).toBeInTheDocument();
    expect(screen.getByText('28')).toBeInTheDocument(); // Real scan count
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('should render empty state when no campaigns exist', async () => {
    vi.spyOn(campaignsApi, 'listCampaigns').mockResolvedValue({
      campaigns: [],
      meta: { total: 0, page: 1, limit: 9, totalPages: 0 },
    });

    render(<CampaignList />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /create your first qr touchpoint/i })).toBeInTheDocument();
    });

    expect(screen.getAllByRole('link', { name: /create qr campaign/i }).length).toBeGreaterThan(0);
  });

  it('should filter campaigns by search query', async () => {
    vi.spyOn(campaignsApi, 'listCampaigns').mockResolvedValue({
      campaigns: mockCampaigns,
      meta: { total: 2, page: 1, limit: 9, totalPages: 1 },
    });

    render(<CampaignList />);

    await waitFor(() => {
      expect(screen.getByText('Countertop Acrylic Stand')).toBeInTheDocument();
    });

    const searchInput = screen.getByRole('searchbox', { name: /search campaigns/i });
    fireEvent.change(searchInput, { target: { value: 'Patio' } });

    expect(screen.queryByText('Countertop Acrylic Stand')).not.toBeInTheDocument();
    expect(screen.getByText('Patio Table 4 Sticker')).toBeInTheDocument();
  });

  it('should filter campaigns when clicking status buttons', async () => {
    const listSpy = vi.spyOn(campaignsApi, 'listCampaigns').mockResolvedValue({
      campaigns: [mockCampaigns[0]],
      meta: { total: 1, page: 1, limit: 9, totalPages: 1 },
    });

    render(<CampaignList />);

    await waitFor(() => {
      expect(screen.getByText('Countertop Acrylic Stand')).toBeInTheDocument();
    });

    const activeFilterButton = screen.getByRole('button', { name: 'active' });
    fireEvent.click(activeFilterButton);

    await waitFor(() => {
      expect(listSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'active' }));
    });
  });

  it('should display error state and retry on click', async () => {
    const listSpy = vi.spyOn(campaignsApi, 'listCampaigns')
      .mockRejectedValueOnce(new Error('Network connection dropped.'))
      .mockResolvedValueOnce({
        campaigns: mockCampaigns,
        meta: { total: 2, page: 1, limit: 9, totalPages: 1 },
      });

    render(<CampaignList />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Network connection dropped.')).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('Countertop Acrylic Stand')).toBeInTheDocument();
    });

    expect(listSpy).toHaveBeenCalledTimes(2);
  });
});
