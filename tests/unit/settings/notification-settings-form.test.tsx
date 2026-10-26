import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationSettingsForm } from '@/components/settings/notification-settings-form';
import * as businessApi from '@/lib/api/business';
import * as toastModule from '@/components/ui/toast';
import type { BusinessSettings } from '@/lib/api/types';

describe('NotificationSettingsForm Component', () => {
  const initialSettings: BusinessSettings = {
    allowPublicReviews: true,
    defaultLanguage: 'en',
    notificationEmail: 'alerts@bakery.com',
    headingText: 'How was your experience?',
    subheadingText: 'Your feedback helps us improve.',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial settings values into form fields', () => {
    render(<NotificationSettingsForm settings={initialSettings} onSettingsUpdated={vi.fn()} />);

    expect(screen.getByDisplayValue('alerts@bakery.com')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /enable public google review link-out/i })).toBeChecked();
    expect(screen.getByDisplayValue('How was your experience?')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Your feedback helps us improve.')).toBeInTheDocument();
  });

  it('validates notification email and shows error for invalid emails', () => {
    render(<NotificationSettingsForm settings={initialSettings} onSettingsUpdated={vi.fn()} />);

    const emailInput = screen.getByLabelText(/feedback alert email/i);
    const saveBtn = screen.getByRole('button', { name: /save experience settings/i });

    // Invalid email
    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    expect(saveBtn).toBeDisabled();

    // Valid email
    fireEvent.change(emailInput, { target: { value: 'valid@bakery.com' } });
    expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
    expect(saveBtn).not.toBeDisabled();
  });

  it('toggles allowPublicReviews checkbox', async () => {
    const onUpdatedMock = vi.fn();
    vi.spyOn(businessApi, 'updateBusinessSettings').mockResolvedValue({
      ...initialSettings,
      allowPublicReviews: false,
    });

    render(<NotificationSettingsForm settings={initialSettings} onSettingsUpdated={onUpdatedMock} />);

    const checkbox = screen.getByRole('checkbox', { name: /enable public google review link-out/i });
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();

    const saveBtn = screen.getByRole('button', { name: /save experience settings/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(businessApi.updateBusinessSettings).toHaveBeenCalledWith(
        expect.objectContaining({ allowPublicReviews: false }),
      );
      expect(onUpdatedMock).toHaveBeenCalledWith(
        expect.objectContaining({ allowPublicReviews: false }),
      );
    });
  });

  it('submits updated touchpoint copy and shows success toast', async () => {
    const toastSuccessSpy = vi.spyOn(toastModule.toast, 'success');
    vi.spyOn(businessApi, 'updateBusinessSettings').mockResolvedValue({
      ...initialSettings,
      headingText: 'Rate our bakery service',
      subheadingText: 'Let us know how your visit was.',
    });

    render(<NotificationSettingsForm settings={initialSettings} onSettingsUpdated={vi.fn()} />);

    const headingInput = screen.getByLabelText(/default touchpoint heading/i);
    fireEvent.change(headingInput, { target: { value: 'Rate our bakery service' } });

    fireEvent.click(screen.getByRole('button', { name: /save experience settings/i }));

    await waitFor(() => {
      expect(businessApi.updateBusinessSettings).toHaveBeenCalledWith(
        expect.objectContaining({ headingText: 'Rate our bakery service' }),
      );
      expect(toastSuccessSpy).toHaveBeenCalledWith(
        'Notification & feedback settings saved successfully',
      );
    });
  });

  it('restores initial values on Cancel click', () => {
    render(<NotificationSettingsForm settings={initialSettings} onSettingsUpdated={vi.fn()} />);

    const emailInput = screen.getByLabelText(/feedback alert email/i);
    fireEvent.change(emailInput, { target: { value: 'changed@bakery.com' } });

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(emailInput).toHaveValue('alerts@bakery.com');
  });
});
