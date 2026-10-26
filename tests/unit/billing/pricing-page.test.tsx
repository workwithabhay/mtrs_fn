import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PricingPage from '@/app/pricing/page';
import * as authContext from '@/contexts/auth-context';
import * as billingApi from '@/lib/api/billing';

describe('Pricing Page Route Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders commercial options: Monthly (₹99) and Five-Month (₹399)', () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: null,
      business: null,
      isAuthenticated: false,
      isLoading: false,
      checkSession: vi.fn(),
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    render(<PricingPage />);

    // Check headings
    expect(screen.getByRole('heading', { name: 'Monthly Plan' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Five-Month Package' })).toBeInTheDocument();

    // Check exact prices
    expect(screen.getByText('₹99')).toBeInTheDocument();
    expect(screen.getByText('₹399')).toBeInTheDocument();

    // Check non-recurring notice for 5-month plan
    expect(screen.getAllByText(/non-recurring/i).length).toBeGreaterThan(0);

    // Check 7-day trial explanation
    expect(screen.getByText(/7-day free trial included for every new account/i)).toBeInTheDocument();
  });

  it('displays authenticated user active trial dates when logged in', async () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: {
        id: 'u-1',
        name: 'Maria Santos',
        email: 'maria@example.com',
        role: 'business_owner',
        status: 'active',
        isEmailVerified: true,
      },
      business: { id: 'b-1', name: 'Santos Bakery', category: 'Bakery' },
      isAuthenticated: true,
      isLoading: false,
      checkSession: vi.fn(),
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    vi.spyOn(billingApi, 'getSubscription').mockResolvedValue({
      planId: 'trial',
      planName: '7-Day Free Trial',
      status: 'active',
      entitlementStatus: 'trial_active',
      canAccessProduct: true,
      billingInterval: 'monthly',
      priceSnapshot: { amount: 0, currency: 'INR' },
      currentPeriodStart: '2026-10-20T00:00:00.000Z',
      currentPeriodEnd: '2026-10-27T00:00:00.000Z',
      trialEndsAt: '2026-10-27T00:00:00.000Z',
      daysRemaining: 4,
      isLifetime: false,
      cancelAtPeriodEnd: false,
    });

    render(<PricingPage />);

    await waitFor(() => {
      expect(screen.getByText(/your current access:/i)).toBeInTheDocument();
      expect(screen.getByText(/4 days remaining/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /go to billing dashboard/i })).toBeInTheDocument();
    });
  });

  it('handles FREE4YOU code redemption on pricing page', async () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: {
        id: 'u-1',
        name: 'Maria Santos',
        email: 'maria@example.com',
        role: 'business_owner',
        status: 'active',
        isEmailVerified: true,
      },
      business: { id: 'b-1', name: 'Santos Bakery', category: 'Bakery' },
      isAuthenticated: true,
      isLoading: false,
      checkSession: vi.fn(),
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    vi.spyOn(billingApi, 'getSubscription').mockResolvedValue({
      planId: 'trial',
      planName: '7-Day Free Trial',
      status: 'active',
      entitlementStatus: 'trial_active',
      canAccessProduct: true,
      billingInterval: 'monthly',
      priceSnapshot: { amount: 0, currency: 'INR' },
      currentPeriodStart: '2026-10-20T00:00:00.000Z',
      currentPeriodEnd: '2026-10-27T00:00:00.000Z',
      trialEndsAt: '2026-10-27T00:00:00.000Z',
      daysRemaining: 4,
      isLifetime: false,
      cancelAtPeriodEnd: false,
    });

    vi.spyOn(billingApi, 'redeemPromoCode').mockResolvedValue({
      success: true,
      code: 'FREE4YOU',
      message: 'FREE4YOU redeemed successfully! Lifetime-free access is active.',
      isLifetime: true,
      subscription: { planId: 'free4you', status: 'active' },
    });

    render(<PricingPage />);

    const input = screen.getByPlaceholderText(/enter FREE4YOU/i);
    const redeemBtn = screen.getByRole('button', { name: /redeem/i });

    fireEvent.change(input, { target: { value: 'FREE4YOU' } });
    fireEvent.click(redeemBtn);

    await waitFor(() => {
      expect(billingApi.redeemPromoCode).toHaveBeenCalledWith('FREE4YOU');
      expect(
        screen.getByText(/FREE4YOU redeemed successfully! Lifetime-free access is active\./i),
      ).toBeInTheDocument();
    });
  });
});
