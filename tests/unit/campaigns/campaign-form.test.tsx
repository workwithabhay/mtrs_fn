import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CampaignForm } from '@/components/campaigns/campaign-form';
import * as campaignsApi from '@/lib/api/campaigns';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('CampaignForm Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockPush.mockReset();
  });

  it('should render form fields with labels and defaults', () => {
    render(<CampaignForm />);

    expect(screen.getByLabelText(/campaign placement title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/customer scan heading/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/optional description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create campaign/i })).toBeInTheDocument();
  });

  it('should validate required fields and prevent invalid submission', async () => {
    const createSpy = vi.spyOn(campaignsApi, 'createCampaign');

    render(<CampaignForm />);

    const titleInput = screen.getByLabelText(/campaign placement title/i);
    const headingInput = screen.getByLabelText(/customer scan heading/i);

    // Clear inputs
    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.change(headingInput, { target: { value: '' } });

    const submitBtn = screen.getByRole('button', { name: /create campaign/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Campaign title is required.')).toBeInTheDocument();
      expect(screen.getByText('Landing page heading is required.')).toBeInTheDocument();
    });

    expect(createSpy).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should update primary color when clicking color presets', () => {
    render(<CampaignForm />);

    const emeraldPreset = screen.getByRole('button', { name: /select emerald color/i });
    fireEvent.click(emeraldPreset);

    // Live preview should update
    expect(screen.getByText(/#059669/i)).toBeInTheDocument();
  });

  it('should submit valid payload and navigate to newly created campaign', async () => {
    const createSpy = vi.spyOn(campaignsApi, 'createCampaign').mockResolvedValue({
      _id: 'new-campaign-id-123',
      businessId: 'b-1',
      title: 'Countertop Card',
      heading: 'Tell us how we did',
      description: 'Quick feedback',
      branding: { primaryColor: '#2563EB', backgroundColor: '#FFFFFF' },
      status: 'active',
      publicToken: 'token12345678901234567890',
      scanCount: 0,
      createdAt: '2026-10-24T12:00:00.000Z',
      updatedAt: '2026-10-24T12:00:00.000Z',
    });

    render(<CampaignForm />);

    const titleInput = screen.getByLabelText(/campaign placement title/i);
    const headingInput = screen.getByLabelText(/customer scan heading/i);
    const descInput = screen.getByLabelText(/optional description/i);

    fireEvent.change(titleInput, { target: { value: 'Countertop Card' } });
    fireEvent.change(headingInput, { target: { value: 'Tell us how we did' } });
    fireEvent.change(descInput, { target: { value: 'Quick feedback' } });

    const submitBtn = screen.getByRole('button', { name: /create campaign/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith({
        title: 'Countertop Card',
        heading: 'Tell us how we did',
        description: 'Quick feedback',
        branding: {
          primaryColor: '#2563EB',
          backgroundColor: '#FFFFFF',
        },
      });
      expect(mockPush).toHaveBeenCalledWith('/dashboard/campaigns/new-campaign-id-123');
    });
  });

  it('should display API error banner when creation fails', async () => {
    vi.spyOn(campaignsApi, 'createCampaign').mockRejectedValue(
      new Error('Campaign title already exists for your business.'),
    );

    render(<CampaignForm />);

    const titleInput = screen.getByLabelText(/campaign placement title/i);
    fireEvent.change(titleInput, { target: { value: 'Duplicate Stand' } });

    const submitBtn = screen.getByRole('button', { name: /create campaign/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Campaign title already exists for your business.')).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
