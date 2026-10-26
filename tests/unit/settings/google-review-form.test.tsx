import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GoogleReviewForm } from '@/components/settings/google-review-form';
import * as businessApi from '@/lib/api/business';
import * as toastModule from '@/components/ui/toast';
import type { Business } from '@/lib/api/types';

describe('GoogleReviewForm Component', () => {
  const initialBusiness: Business = {
    _id: 'b-123',
    name: 'Artisan Bakery',
    category: 'Bakery & Café',
    googleReviewUrl: 'https://g.page/r/artisan/review',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Google Review URL, anti-gating policy notice, and Test Link button', () => {
    render(<GoogleReviewForm business={initialBusiness} onBusinessUpdated={vi.fn()} />);

    expect(screen.getByDisplayValue('https://g.page/r/artisan/review')).toBeInTheDocument();
    expect(screen.getByText(/strict anti-gating policy compliance/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /test link/i })).toHaveAttribute(
      'href',
      'https://g.page/r/artisan/review',
    );
  });

  it('validates URL format and shows error for invalid schemes or domains', () => {
    render(<GoogleReviewForm business={initialBusiness} onBusinessUpdated={vi.fn()} />);

    const urlInput = screen.getByLabelText(/google review link/i);
    const saveBtn = screen.getByRole('button', { name: /save destination/i });

    // Invalid URL string
    fireEvent.change(urlInput, { target: { value: 'not-a-valid-url' } });
    expect(screen.getByText(/please enter a valid http or https url/i)).toBeInTheDocument();
    expect(saveBtn).toBeDisabled();

    // Valid URL
    fireEvent.change(urlInput, { target: { value: 'https://maps.google.com/?cid=99887766' } });
    expect(screen.queryByText(/please enter a valid http or https url/i)).not.toBeInTheDocument();
    expect(saveBtn).not.toBeDisabled();
  });

  it('allows clearing the Google Review URL (setting to null)', async () => {
    const onUpdatedMock = vi.fn();
    vi.spyOn(businessApi, 'updateBusinessProfile').mockResolvedValue({
      ...initialBusiness,
      googleReviewUrl: null,
    });

    render(<GoogleReviewForm business={initialBusiness} onBusinessUpdated={onUpdatedMock} />);

    const urlInput = screen.getByLabelText(/google review link/i);
    fireEvent.change(urlInput, { target: { value: '' } });

    const saveBtn = screen.getByRole('button', { name: /save destination/i });
    expect(saveBtn).not.toBeDisabled();
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(businessApi.updateBusinessProfile).toHaveBeenCalledWith({
        googleReviewUrl: null,
      });
      expect(onUpdatedMock).toHaveBeenCalledWith(
        expect.objectContaining({ googleReviewUrl: null }),
      );
    });
  });

  it('submits updated valid URL and shows success toast', async () => {
    const toastSuccessSpy = vi.spyOn(toastModule.toast, 'success');
    const onUpdatedMock = vi.fn();

    const newUrl = 'https://g.page/r/new-place-id/review';
    vi.spyOn(businessApi, 'updateBusinessProfile').mockResolvedValue({
      ...initialBusiness,
      googleReviewUrl: newUrl,
    });

    render(<GoogleReviewForm business={initialBusiness} onBusinessUpdated={onUpdatedMock} />);

    const urlInput = screen.getByLabelText(/google review link/i);
    fireEvent.change(urlInput, { target: { value: newUrl } });

    fireEvent.click(screen.getByRole('button', { name: /save destination/i }));

    await waitFor(() => {
      expect(businessApi.updateBusinessProfile).toHaveBeenCalledWith({
        googleReviewUrl: newUrl,
      });
      expect(toastSuccessSpy).toHaveBeenCalledWith('Google review destination updated successfully');
    });
  });

  it('restores previous URL on Cancel click', () => {
    render(<GoogleReviewForm business={initialBusiness} onBusinessUpdated={vi.fn()} />);

    const urlInput = screen.getByLabelText(/google review link/i);
    fireEvent.change(urlInput, { target: { value: 'https://changed-url.com' } });

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(urlInput).toHaveValue('https://g.page/r/artisan/review');
  });
});
