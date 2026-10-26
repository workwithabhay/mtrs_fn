import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SettingsContainer } from '@/components/settings/settings-container';
import * as businessApi from '@/lib/api/business';
import * as authContext from '@/contexts/auth-context';
import type { Business, BusinessSettings } from '@/lib/api/types';

describe('SettingsContainer Component', () => {
  const mockBusiness: Business = {
    _id: 'b-999',
    name: 'Café Santos',
    category: 'Dining',
    googleReviewUrl: 'https://g.page/r/santos/review',
    branding: {
      primaryColor: '#2563EB',
      secondaryColor: '#1E293B',
    },
  };

  const mockSettings: BusinessSettings = {
    allowPublicReviews: true,
    defaultLanguage: 'en',
    notificationEmail: 'owner@santos.com',
    headingText: 'How was your dining experience?',
    subheadingText: 'We appreciate your time.',
  };

  const mockSetSession = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: {
        id: 'u-1',
        name: 'Maria Santos',
        email: 'maria@santos.com',
        role: 'business_owner',
        status: 'active',
        isEmailVerified: true,
      },
      business: mockBusiness,
      isAuthenticated: true,
      isLoading: false,
      checkSession: vi.fn(),
      setSession: mockSetSession,
      logout: vi.fn(),
    });
  });

  it('fetches profile and settings on mount and displays active tab', async () => {
    vi.spyOn(businessApi, 'getBusinessProfile').mockResolvedValue(mockBusiness);
    vi.spyOn(businessApi, 'getBusinessSettings').mockResolvedValue(mockSettings);

    render(<SettingsContainer />);

    expect(screen.getByRole('status', { name: /loading settings/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /settings & profile management/i })).toBeInTheDocument();
      expect(screen.getByDisplayValue('Café Santos')).toBeInTheDocument();
    });

    expect(businessApi.getBusinessProfile).toHaveBeenCalledTimes(1);
    expect(businessApi.getBusinessSettings).toHaveBeenCalledTimes(1);
  });

  it('switches between tabs and renders corresponding sections', async () => {
    vi.spyOn(businessApi, 'getBusinessProfile').mockResolvedValue(mockBusiness);
    vi.spyOn(businessApi, 'getBusinessSettings').mockResolvedValue(mockSettings);

    render(<SettingsContainer />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Café Santos')).toBeInTheDocument();
    });

    // 1. Switch to Reviews tab
    const reviewsTab = screen.getByRole('tab', { name: /google review destination/i });
    fireEvent.click(reviewsTab);
    expect(screen.getByDisplayValue('https://g.page/r/santos/review')).toBeInTheDocument();

    // 2. Switch to Branding tab
    const brandingTab = screen.getByRole('tab', { name: /branding defaults/i });
    fireEvent.click(brandingTab);
    expect(screen.getByDisplayValue('#2563EB')).toBeInTheDocument();

    // 3. Switch to Notifications tab
    const notificationsTab = screen.getByRole('tab', { name: /customer experience & alerts/i });
    fireEvent.click(notificationsTab);
    expect(screen.getByDisplayValue('owner@santos.com')).toBeInTheDocument();

    // 4. Switch to Account tab
    const accountTab = screen.getByRole('tab', { name: /account & security/i });
    fireEvent.click(accountTab);
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('maria@santos.com')).toBeInTheDocument();
  });

  it('displays error alert on fetch failure and retries on button click', async () => {
    vi.spyOn(businessApi, 'getBusinessProfile').mockRejectedValueOnce(
      new Error('Failed to load business profile'),
    );
    vi.spyOn(businessApi, 'getBusinessSettings').mockResolvedValueOnce(mockSettings);

    render(<SettingsContainer />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/failed to load business profile/i)).toBeInTheDocument();
    });

    // Mock success for retry
    vi.spyOn(businessApi, 'getBusinessProfile').mockResolvedValueOnce(mockBusiness);
    vi.spyOn(businessApi, 'getBusinessSettings').mockResolvedValueOnce(mockSettings);

    const retryBtn = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Café Santos')).toBeInTheDocument();
    });
  });
});
