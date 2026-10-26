import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import BillingPage from '@/app/dashboard/billing/page';
import * as authContext from '@/contexts/auth-context';
import * as billingApi from '@/lib/api/billing';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('Billing Page Route Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading skeleton while auth is loading', () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: null,
      business: null,
      isAuthenticated: false,
      isLoading: true,
      checkSession: vi.fn(),
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    render(<BillingPage />);
    expect(screen.getByRole('status', { name: /loading billing page/i })).toBeInTheDocument();
  });

  it('redirects to /login if user is not authenticated', () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: null,
      business: null,
      isAuthenticated: false,
      isLoading: false,
      checkSession: vi.fn(),
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    render(<BillingPage />);
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('renders BillingDashboard when authenticated', () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: {
        id: 'u-1',
        name: 'Maria Santos',
        email: 'maria@santos.com',
        role: 'business_owner',
        status: 'active',
        isEmailVerified: true,
      },
      business: {
        id: 'b-1',
        name: 'Café Santos',
        category: 'Dining',
      },
      isAuthenticated: true,
      isLoading: false,
      checkSession: vi.fn(),
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    vi.spyOn(billingApi, 'listBillingPlans').mockResolvedValue([]);
    vi.spyOn(billingApi, 'getSubscription').mockResolvedValue({
      planId: 'free',
      planName: 'Free Trial',
      status: 'active',
      billingInterval: 'monthly',
      priceSnapshot: { amount: 0, currency: 'INR' },
      currentPeriodStart: '2026-10-01T00:00:00.000Z',
      currentPeriodEnd: '2026-11-01T00:00:00.000Z',
      cancelAtPeriodEnd: false,
      features: [],
      limits: { maxCampaigns: 1, maxMonthlyScans: 200, aiAssistanceEnabled: false },
    });
    vi.spyOn(billingApi, 'getPaymentHistory').mockResolvedValue({
      events: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    });

    render(<BillingPage />);
    expect(screen.getByRole('heading', { name: /billing & subscription management/i })).toBeInTheDocument();
  });
});
