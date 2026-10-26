import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import QrCustomerLandingPage from '@/app/qr/[token]/page';
import * as feedbackApi from '@/lib/api/feedback';
import { ApiError } from '@/lib/api/client';
import type { PublicQrLandingData } from '@/lib/api/types';

vi.mock('next/navigation', () => ({
  useParams: () => ({ token: 'valid_tok_123' }),
}));

const mockLandingData: PublicQrLandingData = {
  campaign: {
    title: 'Outdoor Patio',
    heading: 'How did you enjoy dining on the patio?',
    description: 'We welcome all feedback',
    branding: { primaryColor: '#059669' },
  },
  business: { name: 'Green Garden Trattoria' },
  googleReviewUrl: 'https://g.page/r/garden/review',
  feedbackQuestions: [],
};

describe('QrCustomerLandingPage (/qr/[token])', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('loads and displays active campaign details, recording a scan event', async () => {
    const landingSpy = vi.spyOn(feedbackApi, 'getPublicLanding').mockResolvedValue(mockLandingData);
    const scanSpy = vi.spyOn(feedbackApi, 'recordPublicScan').mockResolvedValue({
      title: 'Outdoor Patio',
      heading: 'How did you enjoy dining on the patio?',
      description: null,
      branding: {},
    });

    render(<QrCustomerLandingPage />);

    // Initially in loading state
    expect(screen.getByRole('status', { name: /loading customer feedback/i })).toBeInTheDocument();

    // Resolves to active campaign
    expect(await screen.findByText('How did you enjoy dining on the patio?')).toBeInTheDocument();
    expect(screen.getAllByText('Green Garden Trattoria').length).toBeGreaterThan(0);

    expect(landingSpy).toHaveBeenCalledWith('valid_tok_123');
    expect(scanSpy).toHaveBeenCalledWith('valid_tok_123');
  });

  it('displays inactive touchpoint error when backend indicates campaign is inactive', async () => {
    vi.spyOn(feedbackApi, 'getPublicLanding').mockRejectedValue(
      new ApiError('NOT_FOUND', 'QR campaign not found or is currently inactive.', 404),
    );

    render(<QrCustomerLandingPage />);

    expect(await screen.findByText('Touchpoint Inactive')).toBeInTheDocument();
    expect(
      screen.getByText(/this qr campaign has been marked inactive by the business/i),
    ).toBeInTheDocument();
  });

  it('displays not found error when token is invalid or non-existent', async () => {
    vi.spyOn(feedbackApi, 'getPublicLanding').mockRejectedValue(
      new ApiError('NOT_FOUND', 'Campaign token not found.', 404),
    );

    render(<QrCustomerLandingPage />);

    expect(await screen.findByText('Campaign Not Found')).toBeInTheDocument();
    expect(
      screen.getByText(/the qr code you scanned does not match an active reviewflow campaign/i),
    ).toBeInTheDocument();
  });

  it('displays connection error and retries upon network failure', async () => {
    const landingSpy = vi.spyOn(feedbackApi, 'getPublicLanding')
      .mockRejectedValueOnce(new ApiError('NETWORK_ERROR', 'Network connection lost.', 0))
      .mockResolvedValueOnce(mockLandingData);

    render(<QrCustomerLandingPage />);

    expect(await screen.findByText('Connection Error')).toBeInTheDocument();
    const retryBtn = screen.getByRole('button', { name: /try again/i });
    expect(retryBtn).toBeInTheDocument();

    // Click retry
    fireEvent.click(retryBtn);

    expect(await screen.findByText('How did you enjoy dining on the patio?')).toBeInTheDocument();
    expect(landingSpy).toHaveBeenCalledTimes(2);
  });
});
