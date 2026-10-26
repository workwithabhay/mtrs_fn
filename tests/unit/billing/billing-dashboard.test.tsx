import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BillingDashboard } from '@/components/billing/billing-dashboard';
import * as billingApi from '@/lib/api/billing';
import * as razorpayLib from '@/lib/razorpay';
import * as toastModule from '@/components/ui/toast';
import type { BillingPlan, SubscriptionData, PaymentHistoryResponse } from '@/lib/api/types';

describe('BillingDashboard Component — Real Commercial Flows', () => {
  const mockPlans: BillingPlan[] = [
    {
      planId: 'monthly',
      name: 'Monthly Plan',
      description: 'Flexible monthly subscription',
      price: 9900, // ₹99
      currency: 'INR',
      interval: 'monthly',
      features: ['Unlimited Touchpoints', 'Google Review Routing', 'AI Feedback Studio'],
      limits: { maxCampaigns: 1000, maxMonthlyScans: 100000, aiAssistanceEnabled: true },
    },
    {
      planId: 'five_month',
      name: 'Five-Month Package',
      description: 'One-time 5 calendar months purchase',
      price: 39900, // ₹399
      currency: 'INR',
      interval: 'five_month',
      features: ['5 Calendar Months Access', 'Non-recurring', 'Priority Support'],
      limits: { maxCampaigns: 1000, maxMonthlyScans: 100000, aiAssistanceEnabled: true },
    },
  ];

  const mockTrialActiveSub: SubscriptionData = {
    planId: 'trial',
    planName: '7-Day Free Trial',
    status: 'active',
    entitlementStatus: 'trial_active',
    canAccessProduct: true,
    entitlementSource: 'trial',
    billingInterval: 'monthly',
    priceSnapshot: { amount: 0, currency: 'INR' },
    currentPeriodStart: '2026-10-20T00:00:00.000Z',
    currentPeriodEnd: '2026-10-27T00:00:00.000Z',
    trialEndsAt: '2026-10-27T00:00:00.000Z',
    daysRemaining: 5,
    isLifetime: false,
    cancelAtPeriodEnd: false,
    features: ['Unlimited Touchpoints', 'Google Review Routing'],
    limits: { maxCampaigns: 1000, maxMonthlyScans: 100000, aiAssistanceEnabled: true },
  };

  const mockHistory: PaymentHistoryResponse = {
    items: [
      {
        id: 'pay_1',
        provider: 'mock',
        isSimulated: true,
        eventType: 'checkout.initiated',
        status: 'success',
        amount: 9900,
        currency: 'INR',
        idempotencyKey: 'idem_1',
        checkoutId: 'chk_1',
        paymentReference: 'ref_1',
        createdAt: '2026-10-20T10:00:00.000Z',
      },
    ],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading skeleton while fetching billing data', () => {
    vi.spyOn(billingApi, 'listBillingPlans').mockReturnValue(new Promise(() => {}));
    vi.spyOn(billingApi, 'getSubscription').mockReturnValue(new Promise(() => {}));
    vi.spyOn(billingApi, 'getPaymentHistory').mockReturnValue(new Promise(() => {}));

    render(<BillingDashboard />);
    expect(screen.getByRole('status', { name: /loading billing dashboard/i })).toBeInTheDocument();
  });

  it('renders error banner and handles retry correctly', async () => {
    vi.spyOn(billingApi, 'listBillingPlans').mockRejectedValueOnce(new Error('Network gateway error'));
    vi.spyOn(billingApi, 'getSubscription').mockResolvedValue(mockTrialActiveSub);
    vi.spyOn(billingApi, 'getPaymentHistory').mockResolvedValue(mockHistory);

    render(<BillingDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Network gateway error')).toBeInTheDocument();
    });

    // Mock successful retry
    vi.spyOn(billingApi, 'listBillingPlans').mockResolvedValue(mockPlans);
    const retryBtn = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /billing & subscription management/i })).toBeInTheDocument();
    });
  });

  it('renders accurate plan prices: Monthly ₹99 and Five-Month ₹399', async () => {
    vi.spyOn(billingApi, 'listBillingPlans').mockResolvedValue(mockPlans);
    vi.spyOn(billingApi, 'getSubscription').mockResolvedValue(mockTrialActiveSub);
    vi.spyOn(billingApi, 'getPaymentHistory').mockResolvedValue(mockHistory);

    render(<BillingDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Monthly Plan')).toBeInTheDocument();
      expect(screen.getByText('Five-Month Package')).toBeInTheDocument();
    });

    // Prices verified
    expect(screen.getAllByText('₹99').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('₹399')).toBeInTheDocument();

    // Check duration terms
    expect(screen.getAllByText(/1 calendar month/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/5 calendar months/i).length).toBeGreaterThanOrEqual(1);
  });

  it('displays 7-day trial active status and server days remaining', async () => {
    vi.spyOn(billingApi, 'listBillingPlans').mockResolvedValue(mockPlans);
    vi.spyOn(billingApi, 'getSubscription').mockResolvedValue(mockTrialActiveSub);
    vi.spyOn(billingApi, 'getPaymentHistory').mockResolvedValue(mockHistory);

    render(<BillingDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/7-day free trial in progress/i)).toBeInTheDocument();
      expect(screen.getByText(/5 calendar day\(s\) remaining/i)).toBeInTheDocument();
    });
  });

  it('displays trial expired alert with preserved data notice when trial ends', async () => {
    const expiredSub: SubscriptionData = {
      ...mockTrialActiveSub,
      status: 'trial_expired',
      entitlementStatus: 'trial_expired',
      canAccessProduct: false,
      daysRemaining: 0,
    };

    vi.spyOn(billingApi, 'listBillingPlans').mockResolvedValue(mockPlans);
    vi.spyOn(billingApi, 'getSubscription').mockResolvedValue(expiredSub);
    vi.spyOn(billingApi, 'getPaymentHistory').mockResolvedValue(mockHistory);

    render(<BillingDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/your 7-day free trial has ended/i)).toBeInTheDocument();
      expect(screen.getByText(/data preserved/i)).toBeInTheDocument();
    });
  });

  it('redeems FREE4YOU code and refreshes authoritative entitlement', async () => {
    const toastSuccessSpy = vi.spyOn(toastModule.toast, 'success');

    vi.spyOn(billingApi, 'listBillingPlans').mockResolvedValue(mockPlans);
    vi.spyOn(billingApi, 'getSubscription').mockResolvedValue(mockTrialActiveSub);
    vi.spyOn(billingApi, 'getPaymentHistory').mockResolvedValue(mockHistory);

    const lifetimeSub: SubscriptionData = {
      ...mockTrialActiveSub,
      planId: 'free4you',
      planName: 'Lifetime Free Access',
      entitlementStatus: 'promo_active',
      entitlementSource: 'promo_free4you',
      isLifetime: true,
    };

    vi.spyOn(billingApi, 'redeemPromoCode').mockResolvedValue({
      success: true,
      code: 'FREE4YOU',
      message: 'Promotional code FREE4YOU redeemed successfully! Lifetime-free access granted.',
      isLifetime: true,
      subscription: lifetimeSub,
    });

    render(<BillingDashboard />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/e\.g\. FREE4YOU/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/e\.g\. FREE4YOU/i);
    const redeemBtn = screen.getByRole('button', { name: /redeem code/i });

    fireEvent.change(input, { target: { value: 'FREE4YOU' } });
    fireEvent.click(redeemBtn);

    await waitFor(() => {
      expect(billingApi.redeemPromoCode).toHaveBeenCalledWith('FREE4YOU');
      expect(toastSuccessSpy).toHaveBeenCalledWith(
        'FREE4YOU code redeemed! Lifetime-free access active.',
      );
    });
  });

  it('handles simulated mock checkout mode seamlessly', async () => {
    const toastSuccessSpy = vi.spyOn(toastModule.toast, 'success');

    vi.spyOn(billingApi, 'listBillingPlans').mockResolvedValue(mockPlans);
    vi.spyOn(billingApi, 'getSubscription').mockResolvedValue(mockTrialActiveSub);
    vi.spyOn(billingApi, 'getPaymentHistory').mockResolvedValue(mockHistory);

    const paidSub: SubscriptionData = {
      ...mockTrialActiveSub,
      planId: 'monthly',
      planName: 'Monthly Plan',
      status: 'active',
      entitlementStatus: 'paid_active',
      entitlementSource: 'paid_subscription',
      isSimulated: true,
    };

    vi.spyOn(billingApi, 'createCheckout').mockResolvedValue({
      checkoutId: 'chk_mock_123',
      provider: 'mock',
      isSimulated: true,
      status: 'succeeded',
      amount: 9900,
      currency: 'INR',
      planId: 'monthly',
      message: 'Test Mode: Switched to Monthly Plan successfully!',
      subscription: paidSub,
    });

    render(<BillingDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /select monthly plan/i })).toBeInTheDocument();
    });

    // 1. Click plan card to open checkout dialog
    fireEvent.click(screen.getByRole('button', { name: /select monthly plan/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /confirm subscription order/i })).toBeInTheDocument();
    });

    // 2. Click proceed to payment in dialog
    const proceedBtn = screen.getByRole('button', { name: /proceed to payment/i });
    fireEvent.click(proceedBtn);

    await waitFor(() => {
      expect(billingApi.createCheckout).toHaveBeenCalledWith({
        planId: 'monthly',
        interval: 'monthly',
        simulateSuccess: true,
      });
      expect(toastSuccessSpy).toHaveBeenCalledWith(
        'Test Mode: Switched to Monthly Plan successfully!',
      );
    });
  });

  it('handles Razorpay SDK checkout flow and signature verification', async () => {
    const toastSuccessSpy = vi.spyOn(toastModule.toast, 'success');

    vi.spyOn(billingApi, 'listBillingPlans').mockResolvedValue(mockPlans);
    vi.spyOn(billingApi, 'getSubscription').mockResolvedValue(mockTrialActiveSub);
    vi.spyOn(billingApi, 'getPaymentHistory').mockResolvedValue(mockHistory);

    // Mock order initiation
    vi.spyOn(billingApi, 'createCheckout').mockResolvedValue({
      checkoutId: 'order_rzp_999',
      provider: 'razorpay',
      isSimulated: false,
      status: 'initiated',
      amount: 9900,
      currency: 'INR',
      planId: 'monthly',
      keyId: 'rzp_test_key_123',
    });

    // Mock launchRazorpayModal success callback
    vi.spyOn(razorpayLib, 'launchRazorpayModal').mockImplementation(async (config) => {
      await config.onSuccess({
        razorpay_order_id: 'order_rzp_999',
        razorpay_payment_id: 'pay_rzp_888',
        razorpay_signature: 'sig_mock_valid_hmac',
      });
      return true;
    });

    // Mock verification
    vi.spyOn(billingApi, 'verifyPayment').mockResolvedValue({
      verified: true,
      checkoutId: 'order_rzp_999',
      paymentReference: 'pay_rzp_888',
      status: 'succeeded',
      isSimulated: false,
      amount: 9900,
      currency: 'INR',
      subscription: { planId: 'monthly', status: 'active' },
      message: 'Payment verified successfully and paid access activated.',
    });

    render(<BillingDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /select monthly plan/i })).toBeInTheDocument();
    });

    // Open checkout dialog and confirm
    fireEvent.click(screen.getByRole('button', { name: /select monthly plan/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /proceed to payment/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /proceed to payment/i }));

    await waitFor(() => {
      expect(billingApi.createCheckout).toHaveBeenCalled();
      expect(billingApi.verifyPayment).toHaveBeenCalledWith({
        orderId: 'order_rzp_999',
        paymentId: 'pay_rzp_888',
        signature: 'sig_mock_valid_hmac',
      });
      expect(toastSuccessSpy).toHaveBeenCalledWith(
        'Payment verified successfully and paid access activated.',
      );
    });
  });

  it('handles Razorpay script load failure gracefully', async () => {
    const toastErrorSpy = vi.spyOn(toastModule.toast, 'error');

    vi.spyOn(billingApi, 'listBillingPlans').mockResolvedValue(mockPlans);
    vi.spyOn(billingApi, 'getSubscription').mockResolvedValue(mockTrialActiveSub);
    vi.spyOn(billingApi, 'getPaymentHistory').mockResolvedValue(mockHistory);

    vi.spyOn(billingApi, 'createCheckout').mockResolvedValue({
      checkoutId: 'order_rzp_999',
      provider: 'razorpay',
      isSimulated: false,
      status: 'initiated',
      amount: 9900,
      currency: 'INR',
      planId: 'monthly',
      keyId: 'rzp_test_key_123',
    });

    // Mock script failure
    vi.spyOn(razorpayLib, 'launchRazorpayModal').mockResolvedValue(false);

    render(<BillingDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /select monthly plan/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /select monthly plan/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /proceed to payment/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /proceed to payment/i }));

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith(
        expect.stringMatching(/failed to load razorpay payment gateway script/i),
      );
    });
  });

  it('cancels active recurring subscription through confirmation dialog', async () => {
    const paidRecurringSub: SubscriptionData = {
      ...mockTrialActiveSub,
      planId: 'monthly',
      planName: 'Monthly Plan',
      status: 'active',
      entitlementStatus: 'paid_active',
      entitlementSource: 'paid_subscription',
      billingInterval: 'monthly',
      priceSnapshot: { amount: 9900, currency: 'INR' },
    };

    vi.spyOn(billingApi, 'listBillingPlans').mockResolvedValue(mockPlans);
    vi.spyOn(billingApi, 'getSubscription').mockResolvedValue(paidRecurringSub);
    vi.spyOn(billingApi, 'getPaymentHistory').mockResolvedValue(mockHistory);

    vi.spyOn(billingApi, 'cancelSubscription').mockResolvedValue({
      message: 'Subscription scheduled for cancellation',
      subscription: {
        ...paidRecurringSub,
        cancelAtPeriodEnd: true,
      },
    });

    render(<BillingDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cancel subscription/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /cancel subscription/i }));

    await waitFor(() => {
      expect(screen.getByText(/confirm cancellation/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /confirm cancellation/i }));

    await waitFor(() => {
      expect(billingApi.cancelSubscription).toHaveBeenCalledWith(false);
    });
  });
});
