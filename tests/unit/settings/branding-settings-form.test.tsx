import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrandingSettingsForm } from '@/components/settings/branding-settings-form';
import * as businessApi from '@/lib/api/business';
import * as toastModule from '@/components/ui/toast';
import type { Business } from '@/lib/api/types';

describe('BrandingSettingsForm Component', () => {
  const initialBusiness: Business = {
    _id: 'b-123',
    name: 'Artisan Bakery',
    category: 'Bakery',
    branding: {
      primaryColor: '#2563EB',
      secondaryColor: '#1E293B',
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial primary and secondary hex colors', () => {
    render(<BrandingSettingsForm business={initialBusiness} onBusinessUpdated={vi.fn()} />);

    expect(screen.getByDisplayValue('#2563EB')).toBeInTheDocument();
    expect(screen.getByDisplayValue('#1E293B')).toBeInTheDocument();
    expect(screen.getByText(/live touchpoint preview/i)).toBeInTheDocument();
  });

  it('validates hex color format and shows error for non-hex values', () => {
    render(<BrandingSettingsForm business={initialBusiness} onBusinessUpdated={vi.fn()} />);

    const primaryInput = screen.getByDisplayValue('#2563EB');
    const saveBtn = screen.getByRole('button', { name: /save branding/i });

    // Invalid hex
    fireEvent.change(primaryInput, { target: { value: 'blue' } });
    expect(screen.getByText(/valid hex code required/i)).toBeInTheDocument();
    expect(saveBtn).toBeDisabled();

    // Valid hex
    fireEvent.change(primaryInput, { target: { value: '#10B981' } });
    expect(screen.queryByText(/valid hex code required/i)).not.toBeInTheDocument();
    expect(saveBtn).not.toBeDisabled();
  });

  it('applies preset palette when palette preset button is clicked', () => {
    render(<BrandingSettingsForm business={initialBusiness} onBusinessUpdated={vi.fn()} />);

    const emeraldBtn = screen.getByRole('button', { name: /emerald/i });
    fireEvent.click(emeraldBtn);

    expect(screen.getByDisplayValue('#10B981')).toBeInTheDocument();
    expect(screen.getByDisplayValue('#064E3B')).toBeInTheDocument();
  });

  it('submits updated hex colors and calls onBusinessUpdated', async () => {
    const toastSuccessSpy = vi.spyOn(toastModule.toast, 'success');
    const onUpdatedMock = vi.fn();

    vi.spyOn(businessApi, 'updateBusinessProfile').mockResolvedValue({
      ...initialBusiness,
      branding: {
        primaryColor: '#8B5CF6',
        secondaryColor: '#2E1065',
      },
    });

    render(<BrandingSettingsForm business={initialBusiness} onBusinessUpdated={onUpdatedMock} />);

    const violetBtn = screen.getByRole('button', { name: /violet/i });
    fireEvent.click(violetBtn);

    const saveBtn = screen.getByRole('button', { name: /save branding/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(businessApi.updateBusinessProfile).toHaveBeenCalledWith({
        branding: {
          primaryColor: '#8B5CF6',
          secondaryColor: '#2E1065',
        },
      });
      expect(toastSuccessSpy).toHaveBeenCalledWith('Branding defaults updated successfully');
    });
  });

  it('restores original colors on Cancel click', () => {
    render(<BrandingSettingsForm business={initialBusiness} onBusinessUpdated={vi.fn()} />);

    const primaryInput = screen.getByDisplayValue('#2563EB');
    fireEvent.change(primaryInput, { target: { value: '#FF0000' } });

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(screen.getByDisplayValue('#2563EB')).toBeInTheDocument();
  });
});
