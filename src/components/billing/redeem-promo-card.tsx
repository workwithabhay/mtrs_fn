'use client';

import * as React from 'react';
import { Gift, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { redeemPromoCode } from '@/lib/api/billing';
import { PROMO_CODE_DETAILS } from '@/lib/billing-plans';
import type { SubscriptionData } from '@/lib/api/types';

interface RedeemPromoCardProps {
  currentSubscription?: SubscriptionData | null;
  onRedemptionSuccess: (subscription?: Partial<SubscriptionData>) => void;
}

export function RedeemPromoCard({
  currentSubscription,
  onRedemptionSuccess,
}: RedeemPromoCardProps) {
  const [code, setCode] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const isAlreadyLifetime =
    currentSubscription?.isLifetime ||
    currentSubscription?.entitlementSource === 'promo_free4you' ||
    currentSubscription?.entitlementStatus === 'promo_active';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode) {
      setErrorMessage('Please enter a promotional code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await redeemPromoCode(cleanCode);
      if (res.success) {
        setSuccessMessage(res.message || 'Lifetime-free access activated successfully!');
        setCode('');
        onRedemptionSuccess(res.subscription);
      } else {
        setErrorMessage(res.message || 'Unable to redeem promotional code.');
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to redeem promotional code. Please verify the code and try again.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-border">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-700 shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-brand-text-primary">
                {PROMO_CODE_DETAILS.label}
              </h3>
              <Badge variant="secondary" className="text-[10px] text-purple-700 border-purple-200 bg-purple-50">
                Promo Code
              </Badge>
            </div>
            <p className="text-xs text-brand-text-secondary mt-0.5">
              {PROMO_CODE_DETAILS.description}
            </p>
          </div>
        </div>
      </div>

      {isAlreadyLifetime ? (
        <div
          role="status"
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-3"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block text-emerald-900">
              Lifetime-Free Promotional Access Active
            </strong>
            <p className="mt-0.5 text-emerald-800">
              Your business account has already redeemed FREE4YOU and enjoys permanent, unexpiring access to ReviewFlow.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1">
              <label htmlFor="promo-code-input" className="sr-only">
                Promotional Code
              </label>
              <Input
                id="promo-code-input"
                name="promoCode"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="e.g. FREE4YOU"
                disabled={isSubmitting}
                className="font-mono uppercase text-sm tracking-wider"
                autoComplete="off"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting || !code.trim()}
              isLoading={isSubmitting}
              className="shrink-0"
            >
              <span>Redeem Code</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <p className="text-[11px] text-brand-text-secondary">
            Note: Entitlement is verified server-side. Each business account may redeem this promotional grant once.
          </p>
        </form>
      )}
    </div>
  );
}
