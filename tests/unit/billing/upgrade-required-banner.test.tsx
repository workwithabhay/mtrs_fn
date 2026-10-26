import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UpgradeRequiredBanner } from '@/components/billing/upgrade-required-banner';
import type { SubscriptionData } from '@/lib/api/types';

describe('UpgradeRequiredBanner Component', () => {
  const activeSub: SubscriptionData = {
    planId: 'trial',
    planName: '7-Day Free Trial',
    status: 'active',
    entitlementStatus: 'trial_active',
    canAccessProduct: true,
    billingInterval: 'monthly',
    priceSnapshot: { amount: 0, currency: 'INR' },
    currentPeriodStart: '2026-10-20T00:00:00.000Z',
    currentPeriodEnd: '2026-10-27T00:00:00.000Z',
    cancelAtPeriodEnd: false,
  };

  it('does not render when subscription is active and within trial', () => {
    const { container } = render(<UpgradeRequiredBanner subscription={activeSub} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders upgrade alert when trial has expired', () => {
    const expiredSub: SubscriptionData = {
      ...activeSub,
      status: 'trial_expired',
      entitlementStatus: 'trial_expired',
      canAccessProduct: false,
    };

    render(<UpgradeRequiredBanner subscription={expiredSub} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/your 7-day free trial has ended/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /choose a plan/i })).toHaveAttribute(
      'href',
      '/dashboard/billing',
    );
    expect(
      screen.getByText(/all existing qr campaigns, reviews, customer contacts, and analytics remain safely stored/i),
    ).toBeInTheDocument();
  });

  it('renders upgrade alert when paid subscription has expired', () => {
    const expiredPaidSub: SubscriptionData = {
      ...activeSub,
      planId: 'monthly',
      planName: 'Monthly Plan',
      status: 'expired',
      entitlementStatus: 'subscription_expired',
      entitlementSource: 'paid_subscription',
      canAccessProduct: false,
    };

    render(<UpgradeRequiredBanner subscription={expiredPaidSub} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/your subscription has expired/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /choose a plan/i })).toHaveAttribute(
      'href',
      '/dashboard/billing',
    );
  });
});
