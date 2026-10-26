import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  listBillingPlans,
  getSubscription,
  createCheckout,
  cancelSubscription,
  getPaymentHistory,
} from '@/lib/api/billing';
import * as client from '@/lib/api/client';

describe('Billing API Client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('calls GET /billing/plans', async () => {
    const mockPlans = [
      {
        planId: 'free',
        name: 'Free Trial',
        description: 'Starter tier',
        price: 0,
        currency: 'INR',
        interval: 'monthly' as const,
        features: ['1 QR Campaign'],
        limits: { maxCampaigns: 1, maxMonthlyScans: 200, aiAssistanceEnabled: false },
      },
    ];

    const apiFetchSpy = vi.spyOn(client, 'apiFetch').mockResolvedValue(mockPlans);

    const result = await listBillingPlans();
    expect(apiFetchSpy).toHaveBeenCalledWith('/billing/plans', { method: 'GET' }, undefined);
    expect(result).toEqual(mockPlans);
  });

  it('calls GET /billing/subscription', async () => {
    const mockSub = {
      planId: 'starter',
      planName: 'Starter Plan',
      status: 'active' as const,
      billingInterval: 'monthly' as const,
      priceSnapshot: { amount: 99900, currency: 'INR' },
      currentPeriodStart: '2026-10-01T00:00:00.000Z',
      currentPeriodEnd: '2026-11-01T00:00:00.000Z',
      cancelAtPeriodEnd: false,
      features: ['5 QR Campaigns'],
      limits: { maxCampaigns: 5, maxMonthlyScans: 2000, aiAssistanceEnabled: true },
    };

    const apiFetchSpy = vi.spyOn(client, 'apiFetch').mockResolvedValue(mockSub);

    const result = await getSubscription();
    expect(apiFetchSpy).toHaveBeenCalledWith('/billing/subscription', { method: 'GET' }, undefined);
    expect(result).toEqual(mockSub);
  });

  it('calls POST /billing/subscription/checkout', async () => {
    const mockCheckoutRes = {
      message: 'Plan upgraded successfully',
      checkoutId: 'chk_123',
      subscription: {
        planId: 'growth',
        planName: 'Growth Plan',
        status: 'active' as const,
        billingInterval: 'monthly' as const,
        priceSnapshot: { amount: 249900, currency: 'INR' },
        currentPeriodStart: '2026-10-01T00:00:00.000Z',
        currentPeriodEnd: '2026-11-01T00:00:00.000Z',
        cancelAtPeriodEnd: false,
        features: [],
        limits: { maxCampaigns: 20, maxMonthlyScans: 10000, aiAssistanceEnabled: true },
      },
    };

    const apiFetchSpy = vi.spyOn(client, 'apiFetch').mockResolvedValue(mockCheckoutRes);

    const result = await createCheckout({
      planId: 'growth',
      interval: 'monthly',
      simulateSuccess: true,
    });

    expect(apiFetchSpy).toHaveBeenCalledWith(
      '/billing/subscription/checkout',
      {
        method: 'POST',
        body: JSON.stringify({
          planId: 'growth',
          interval: 'monthly',
          simulateSuccess: true,
        }),
      },
      undefined,
    );
    expect(result).toEqual(mockCheckoutRes);
  });

  it('calls POST /billing/subscription/cancel', async () => {
    const mockCancelRes = {
      message: 'Subscription scheduled for cancellation',
      subscription: {
        planId: 'starter',
        planName: 'Starter Plan',
        status: 'active' as const,
        billingInterval: 'monthly' as const,
        priceSnapshot: { amount: 99900, currency: 'INR' },
        currentPeriodStart: '2026-10-01T00:00:00.000Z',
        currentPeriodEnd: '2026-11-01T00:00:00.000Z',
        cancelAtPeriodEnd: true,
        features: [],
        limits: { maxCampaigns: 5, maxMonthlyScans: 2000, aiAssistanceEnabled: true },
      },
    };

    const apiFetchSpy = vi.spyOn(client, 'apiFetch').mockResolvedValue(mockCancelRes);

    const result = await cancelSubscription(false);

    expect(apiFetchSpy).toHaveBeenCalledWith(
      '/billing/subscription/cancel',
      {
        method: 'POST',
        body: JSON.stringify({ immediate: false }),
      },
      undefined,
    );
    expect(result).toEqual(mockCancelRes);
  });

  it('calls GET /billing/payment-history with page and limit params', async () => {
    const mockHistory = {
      events: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    const apiFetchSpy = vi.spyOn(client, 'apiFetch').mockResolvedValue(mockHistory);

    const result = await getPaymentHistory(2, 5);

    expect(apiFetchSpy).toHaveBeenCalledWith(
      '/billing/payment-history?page=2&limit=5',
      { method: 'GET' },
      undefined,
    );
    expect(result).toEqual(mockHistory);
  });
});
