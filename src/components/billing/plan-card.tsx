'use client';

import * as React from 'react';
import { Check, Sparkles, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { BillingPlan } from '@/lib/api/types';
import { COMMERCIAL_PLANS } from '@/lib/billing-plans';

interface PlanCardProps {
  plan: BillingPlan;
  currentPlanId?: string;
  isCurrentActive?: boolean;
  isUpgrading?: boolean;
  onSelectPlan: (plan: BillingPlan) => void;
}

export function PlanCard({
  plan,
  currentPlanId,
  isCurrentActive = false,
  isUpgrading = false,
  onSelectPlan,
}: PlanCardProps) {
  const isCurrent = plan.planId === currentPlanId && isCurrentActive;
  const isFiveMonth = plan.planId === 'five_month' || plan.interval === 'five_month';
  const isMonthly = plan.planId === 'monthly';

  // Fallback to centralized commercial definitions if plan is monthly or five_month
  const commercialMeta =
    isFiveMonth
      ? COMMERCIAL_PLANS.five_month
      : isMonthly
        ? COMMERCIAL_PLANS.monthly
        : null;

  const isPopular = commercialMeta?.isPopular || isFiveMonth;

  // Format price in ₹
  const rawPrice = plan.price || commercialMeta?.pricePaise || 0;
  const formattedPrice =
    rawPrice === 0 ? '₹0' : `₹${Math.round(rawPrice / 100).toLocaleString('en-IN')}`;

  const billingCadence =
    commercialMeta?.billingCadence ||
    (isFiveMonth ? 'for 5 calendar months' : 'per month');

  const durationLabel =
    commercialMeta?.durationLabel ||
    (isFiveMonth ? '5 Calendar Months' : '1 Month');

  const termsText =
    commercialMeta?.termDescription ||
    (isFiveMonth
      ? 'One-time purchase. Does not auto-renew. Access lasts 5 calendar months.'
      : 'Billed monthly. Valid for 1 calendar month with recurring renewal.');

  const featuresList =
    plan.features && plan.features.length > 0
      ? plan.features
      : commercialMeta?.features || [];

  return (
    <div
      className={`relative rounded-2xl border p-5 sm:p-6 flex flex-col justify-between transition-all ${
        isPopular
          ? 'border-brand-primary bg-gradient-to-b from-brand-primary/5 via-white to-white shadow-elevated ring-1 ring-brand-primary/40'
          : 'border-brand-border bg-brand-surface shadow-xs hover:border-slate-300'
      }`}
    >
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-brand-primary text-white shadow-xs">
          Best Value
        </span>
      )}

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-bold text-brand-text-primary">
            {plan.name || commercialMeta?.name}
          </h3>
          {isCurrent && (
            <Badge variant="success" className="text-[10px]">
              Current Plan
            </Badge>
          )}
        </div>

        <p className="text-xs text-brand-text-secondary leading-relaxed min-h-[32px]">
          {plan.description || (isFiveMonth ? '5 full calendar months of uninterrupted customer review routing.' : 'Flexible monthly access with complete review routing capabilities.')}
        </p>

        {/* Price & Cadence */}
        <div className="pt-2 border-t border-brand-border/60">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-text-primary">
              {formattedPrice}
            </span>
            <span className="text-xs font-medium text-brand-text-secondary">
              {billingCadence}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/70">
            <Clock className="w-3.5 h-3.5 text-brand-primary shrink-0" />
            <span>Duration: <strong>{durationLabel}</strong></span>
          </div>
        </div>

        {/* Clear Terms before purchase */}
        <div className="p-3 rounded-xl bg-slate-50/80 border border-brand-border/70 text-[11px] text-brand-text-secondary space-y-1">
          <span className="font-semibold text-brand-text-primary flex items-center gap-1">
            <Shield className="w-3 h-3 text-indigo-600" />
            Payment Terms:
          </span>
          <p className="leading-normal">{termsText}</p>
        </div>

        {/* Limits if defined */}
        {plan.limits && (
          <div className="p-3 rounded-xl bg-slate-50 border border-brand-border/60 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-brand-text-secondary">
              <span>Touchpoints:</span>
              <strong className="text-brand-text-primary">
                {plan.limits.maxCampaigns >= 1000 ? 'Unlimited' : plan.limits.maxCampaigns}
              </strong>
            </div>
            <div className="flex items-center justify-between text-brand-text-secondary">
              <span>Monthly Scans:</span>
              <strong className="text-brand-text-primary">
                {plan.limits.maxMonthlyScans >= 100000
                  ? 'Unlimited'
                  : plan.limits.maxMonthlyScans.toLocaleString()}
              </strong>
            </div>
            <div className="flex items-center justify-between text-brand-text-secondary">
              <span>AI Feedback Studio:</span>
              <strong className="text-brand-text-primary">
                {plan.limits.aiAssistanceEnabled ? 'Included' : 'Included'}
              </strong>
            </div>
          </div>
        )}

        {/* Features list */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-semibold text-brand-text-secondary uppercase tracking-wider block">
            What&apos;s Included
          </span>
          <ul className="space-y-2">
            {featuresList.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-xs text-brand-text-secondary"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Select button */}
      <div className="pt-6">
        <Button
          type="button"
          variant={isCurrent ? 'outline' : isPopular ? 'primary' : 'secondary'}
          size="md"
          className="w-full"
          disabled={isCurrent || isUpgrading}
          isLoading={isUpgrading}
          onClick={() => onSelectPlan(plan)}
        >
          {isCurrent ? (
            'Active Plan'
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              <span>Select {plan.name || commercialMeta?.name}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
