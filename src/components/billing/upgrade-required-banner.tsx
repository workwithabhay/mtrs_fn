'use client';

import * as React from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SubscriptionData } from '@/lib/api/types';

interface UpgradeRequiredBannerProps {
  subscription: SubscriptionData | null;
  className?: string;
}

export function UpgradeRequiredBanner({
  subscription,
  className = '',
}: UpgradeRequiredBannerProps) {
  if (!subscription) return null;

  const isExpired =
    subscription.status === 'trial_expired' ||
    subscription.status === 'expired' ||
    subscription.entitlementStatus === 'trial_expired' ||
    subscription.entitlementStatus === 'subscription_expired';

  if (!isExpired) {
    return null;
  }

  const isTrial =
    subscription.entitlementStatus === 'trial_expired' ||
    subscription.status === 'trial_expired' ||
    subscription.entitlementSource === 'trial';

  return (
    <div
      role="alert"
      className={`p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-amber-900">
            {isTrial ? 'Your 7-Day Free Trial Has Ended' : 'Your Subscription Has Expired'}
          </h4>
          <p className="text-xs text-amber-800 max-w-2xl leading-relaxed">
            Choose a plan to resume customer review routing and new touchpoint generation.
          </p>
          <p className="text-[11px] text-amber-700 flex items-center gap-1.5 pt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              All existing QR campaigns, reviews, customer contacts, and analytics remain safely stored.
            </span>
          </p>
        </div>
      </div>

      <Button variant="primary" size="sm" asChild className="shrink-0 w-full md:w-auto">
        <Link href="/dashboard/billing">
          <span>Choose a Plan</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Link>
      </Button>
    </div>
  );
}
