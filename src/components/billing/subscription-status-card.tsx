'use client';

import * as React from 'react';
import {
  CreditCard,
  Calendar,
  QrCode,
  BarChart,
  Sparkles,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { SubscriptionData, EntitlementStatus } from '@/lib/api/types';

interface SubscriptionStatusCardProps {
  subscription: SubscriptionData;
  onCancelClick: () => void;
}

export function SubscriptionStatusCard({
  subscription,
  onCancelClick,
}: SubscriptionStatusCardProps) {
  const entitlementStatus: EntitlementStatus =
    subscription.entitlementStatus ||
    (subscription.status === 'trial_expired'
      ? 'trial_expired'
      : subscription.isLifetime
        ? 'promo_active'
        : subscription.status === 'active'
          ? subscription.planId === 'trial'
            ? 'trial_active'
            : 'paid_active'
          : 'restricted');

  const isTrialActive = entitlementStatus === 'trial_active';
  const isTrialExpired = entitlementStatus === 'trial_expired';
  const isPaidActive = entitlementStatus === 'paid_active';
  const isPromoLifetime =
    entitlementStatus === 'promo_active' ||
    subscription.isLifetime ||
    subscription.entitlementSource === 'promo_free4you';
  const isSubscriptionExpired = entitlementStatus === 'subscription_expired';
  const isCancelled = subscription.status === 'cancelled' || subscription.cancelAtPeriodEnd;

  // Format dates safely
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const periodEndFormatted = formatDate(subscription.currentPeriodEnd);
  const trialEndFormatted = formatDate(subscription.trialEndsAt || subscription.currentPeriodEnd);

  // Price formatting
  const priceAmount = subscription.priceSnapshot?.amount ?? 0;
  const formattedPrice =
    isPromoLifetime || priceAmount === 0
      ? '₹0'
      : `₹${(priceAmount / 100).toLocaleString('en-IN')}`;

  const isRecurringMonthly =
    subscription.billingInterval === 'monthly' &&
    !isPromoLifetime &&
    subscription.planId === 'monthly';

  const canCancel =
    isPaidActive &&
    isRecurringMonthly &&
    !isCancelled &&
    !isPromoLifetime;

  return (
    <div className="bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-6 space-y-6 shadow-xs">
      {/* Header section with status badge and title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-brand-border">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              isPromoLifetime
                ? 'bg-purple-100 text-purple-700'
                : isTrialExpired || isSubscriptionExpired
                  ? 'bg-red-100 text-red-700'
                  : 'bg-brand-primary/10 text-brand-primary'
            }`}
          >
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-brand-text-primary">
                {isPromoLifetime
                  ? 'Lifetime Free Access (FREE4YOU)'
                  : isTrialActive
                    ? '7-Day Free Trial'
                    : isTrialExpired
                      ? '7-Day Free Trial (Expired)'
                      : subscription.planName || 'Current Plan'}
              </h2>

              {/* Status Badge */}
              {isPromoLifetime && (
                <Badge variant="default" className="bg-purple-700 text-white text-[11px] gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Lifetime Active</span>
                </Badge>
              )}

              {isTrialActive && (
                <Badge variant="success" className="text-[11px] gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    Trial Active
                    {typeof subscription.daysRemaining === 'number'
                      ? ` (${subscription.daysRemaining}d left)`
                      : ''}
                  </span>
                </Badge>
              )}

              {isTrialExpired && (
                <Badge variant="destructive" className="text-[11px] gap-1">
                  <XCircle className="w-3 h-3" />
                  <span>Trial Expired</span>
                </Badge>
              )}

              {isPaidActive && (
                <Badge variant={isCancelled ? 'warning' : 'success'} className="text-[11px] gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{isCancelled ? 'Cancelling at Period End' : 'Paid Active'}</span>
                </Badge>
              )}

              {isSubscriptionExpired && (
                <Badge variant="destructive" className="text-[11px] gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Subscription Expired</span>
                </Badge>
              )}
            </div>

            <p className="text-xs text-brand-text-secondary mt-1">
              {isPromoLifetime
                ? 'Promotional grant • No renewal required'
                : isTrialActive || isTrialExpired
                  ? 'No credit card required for 7-day trial'
                  : `${formattedPrice} • ${
                      subscription.billingInterval === 'five_month'
                        ? 'One-time package (5 calendar months)'
                        : 'Billed monthly'
                    }`}
            </p>
          </div>
        </div>

        {canCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancelClick}
            className="text-xs text-brand-text-secondary hover:text-brand-error shrink-0"
          >
            Cancel Subscription
          </Button>
        )}
      </div>

      {/* Trial Active Banner */}
      {isTrialActive && (
        <div
          role="status"
          className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs flex items-start gap-3"
        >
          <Clock className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block text-indigo-900">
              7-Day Free Trial in Progress
            </span>
            <p className="text-indigo-800">
              Your account has full access to ReviewFlow features until{' '}
              <strong>{trialEndFormatted || 'the end of your trial'}</strong>
              {typeof subscription.daysRemaining === 'number' && (
                <> ({subscription.daysRemaining} calendar day(s) remaining)</>
              )}
              . Choose a plan at any time to ensure uninterrupted service.
            </p>
          </div>
        </div>
      )}

      {/* Trial Expired Alert Banner */}
      {isTrialExpired && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-3"
        >
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold block text-amber-900 text-sm">
              Your 7-Day Free Trial Has Ended
            </strong>
            <p className="text-amber-800">
              Select one of the available plans below to resume touchpoint creation and review routing.
            </p>
            <p className="text-[11px] text-amber-700 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
              <strong>Data Preserved:</strong> All existing QR campaigns, reviews, customer contacts, and analytics remain safely stored in your account.
            </p>
          </div>
        </div>
      )}

      {/* Subscription Expired Alert Banner */}
      {isSubscriptionExpired && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-950 text-xs flex items-start gap-3"
        >
          <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold block text-red-900 text-sm">
              Paid Access Period Expired
            </strong>
            <p className="text-red-800">
              Your paid subscription or 5-month package ended on{' '}
              <strong>{periodEndFormatted || 'the expiry date'}</strong>. Please renew below to continue.
            </p>
            <p className="text-[11px] text-red-700 pt-1">
              Your historical customer records, reviews, and touchpoints remain intact and accessible.
            </p>
          </div>
        </div>
      )}

      {/* Scheduled cancellation warning */}
      {subscription.cancelAtPeriodEnd && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            Your subscription will not renew automatically and access will end on{' '}
            <strong>{periodEndFormatted}</strong>.
          </span>
        </div>
      )}

      {/* Limits & Feature Grid */}
      {subscription.limits && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-brand-border bg-slate-50/50 space-y-1">
            <div className="flex items-center gap-2 text-brand-text-secondary text-xs">
              <QrCode className="w-4 h-4 text-brand-primary" />
              <span>QR Campaign Touchpoints</span>
            </div>
            <span className="text-lg font-bold text-brand-text-primary block">
              {subscription.limits.maxCampaigns >= 1000 ? 'Unlimited' : subscription.limits.maxCampaigns}{' '}
              <span className="text-xs font-normal text-brand-text-secondary">active</span>
            </span>
          </div>

          <div className="p-4 rounded-xl border border-brand-border bg-slate-50/50 space-y-1">
            <div className="flex items-center gap-2 text-brand-text-secondary text-xs">
              <BarChart className="w-4 h-4 text-brand-primary" />
              <span>Monthly Scans Quota</span>
            </div>
            <span className="text-lg font-bold text-brand-text-primary block">
              {subscription.limits.maxMonthlyScans >= 100000
                ? 'Unlimited'
                : subscription.limits.maxMonthlyScans.toLocaleString()}{' '}
              <span className="text-xs font-normal text-brand-text-secondary">scans / mo</span>
            </span>
          </div>

          <div className="p-4 rounded-xl border border-brand-border bg-slate-50/50 space-y-1">
            <div className="flex items-center gap-2 text-brand-text-secondary text-xs">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span>AI Feedback Studio</span>
            </div>
            <span className="text-lg font-bold text-brand-text-primary block">
              {subscription.limits.aiAssistanceEnabled ? 'Included' : 'Standard'}
            </span>
          </div>
        </div>
      )}

      {/* Renewal or paid-through notice */}
      <div className="flex items-center gap-2 text-xs text-brand-text-secondary pt-1">
        <Calendar className="w-3.5 h-3.5 text-slate-400" />
        {isPromoLifetime ? (
          <span>Entitlement: <strong>Lifetime Promotional Free Access</strong></span>
        ) : isTrialActive ? (
          <span>
            Server trial expiry date: <strong>{trialEndFormatted}</strong>
          </span>
        ) : isTrialExpired ? (
          <span>
            Trial expired on: <strong>{trialEndFormatted}</strong>
          </span>
        ) : isRecurringMonthly ? (
          <span>
            Current monthly period valid through <strong>{periodEndFormatted}</strong>. Recurring billing applies.
          </span>
        ) : (
          <span>
            Access valid through <strong>{periodEndFormatted}</strong>. One-time purchase (non-recurring).
          </span>
        )}
      </div>
    </div>
  );
}
