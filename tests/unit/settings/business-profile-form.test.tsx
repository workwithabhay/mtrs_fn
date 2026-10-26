import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BusinessProfileForm } from '@/components/settings/business-profile-form';
import * as businessApi from '@/lib/api/business';
import * as toastModule from '@/components/ui/toast';
import type { Business } from '@/lib/api/types';

describe('BusinessProfileForm Component', () => {
  const initialBusiness: Business = {
    _id: 'b-123',
    name: 'Artisan Bakery',
    category: 'Bakery & Café',
    status: 'active',
    googleReviewUrl: 'https://g.page/r/artisan/review',
    branding: {
      primaryColor: '#2563EB',
      secondaryColor: '#1E293B',
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('populates fields with existing business profile values', () => {
    render(
      <BusinessProfileForm business={initialBusiness} onBusinessUpdated={vi.fn()} />,
    );

    expect(screen.getByDisplayValue('Artisan Bakery')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bakery & Café')).toBeInTheDocument();
    expect(screen.getByText('b-123')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('validates name length (2 to 120 chars) and disables Save when invalid or pristine', () => {
    render(
      <BusinessProfileForm business={initialBusiness} onBusinessUpdated={vi.fn()} />,
    );

    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    expect(saveBtn).toBeDisabled();

    const nameInput = screen.getByLabelText(/business name/i);

    // Type 1 character (< 2 chars)
    fireEvent.change(nameInput, { target: { value: 'A' } });
    expect(screen.getByText(/name must be between 2 and 120 characters/i)).toBeInTheDocument();
    expect(saveBtn).toBeDisabled();

    // Type valid name
    fireEvent.change(nameInput, { target: { value: 'New Bakery' } });
    expect(screen.queryByText(/name must be between 2 and 120 characters/i)).not.toBeInTheDocument();
    expect(saveBtn).not.toBeDisabled();
  });

  it('updates category input when clicking a category preset button', () => {
    render(
      <BusinessProfileForm business={initialBusiness} onBusinessUpdated={vi.fn()} />,
    );

    const presetBtn = screen.getByRole('button', { name: /health & wellness/i });
    fireEvent.click(presetBtn);

    const categoryInput = screen.getByLabelText(/business category/i) as HTMLInputElement;
    expect(categoryInput.value).toBe('Health & Wellness');

    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    expect(saveBtn).not.toBeDisabled();
  });

  it('submits updated profile and calls onBusinessUpdated callback', async () => {
    const toastSuccessSpy = vi.spyOn(toastModule.toast, 'success');
    const onUpdatedMock = vi.fn();

    const updatedBusiness: Business = {
      ...initialBusiness,
      name: 'Artisan Bakery Roastery',
      category: 'Coffee & Roastery',
    };

    vi.spyOn(businessApi, 'updateBusinessProfile').mockResolvedValue(updatedBusiness);

    render(
      <BusinessProfileForm business={initialBusiness} onBusinessUpdated={onUpdatedMock} />,
    );

    const nameInput = screen.getByLabelText(/business name/i);
    const categoryInput = screen.getByLabelText(/business category/i);

    fireEvent.change(nameInput, { target: { value: 'Artisan Bakery Roastery' } });
    fireEvent.change(categoryInput, { target: { value: 'Coffee & Roastery' } });

    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(businessApi.updateBusinessProfile).toHaveBeenCalledWith({
        name: 'Artisan Bakery Roastery',
        category: 'Coffee & Roastery',
      });
      expect(onUpdatedMock).toHaveBeenCalledWith(updatedBusiness);
      expect(toastSuccessSpy).toHaveBeenCalledWith('Business profile updated successfully');
    });
  });

  it('restores initial values on Cancel click', () => {
    render(
      <BusinessProfileForm business={initialBusiness} onBusinessUpdated={vi.fn()} />,
    );

    const nameInput = screen.getByLabelText(/business name/i);
    fireEvent.change(nameInput, { target: { value: 'Changed Name' } });

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(nameInput).toHaveValue('Artisan Bakery');
    expect(cancelBtn).toBeDisabled();
  });

  it('displays error alert on API rejection and preserves unsaved edits', async () => {
    vi.spyOn(businessApi, 'updateBusinessProfile').mockRejectedValue(
      new Error('Server error occurred while saving profile.'),
    );

    render(
      <BusinessProfileForm business={initialBusiness} onBusinessUpdated={vi.fn()} />,
    );

    const nameInput = screen.getByLabelText(/business name/i);
    fireEvent.change(nameInput, { target: { value: 'Attempted Name' } });

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/server error occurred while saving profile/i)).toBeInTheDocument();
    });

    expect(nameInput).toHaveValue('Attempted Name');
  });
});
