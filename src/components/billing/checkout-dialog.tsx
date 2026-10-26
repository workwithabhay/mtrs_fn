'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Lock, Sparkles, AlertCircle } from 'lucide-react';
import type { BillingPlan } from '@/lib/api/types';
import { COMMERCIAL_PLANS } from '@/lib/billing-plans';

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan: BillingPlan | null;
  isProcessing: boolean;
  onConfirmCheckout: (plan: BillingPlan) => void;
  error?: string | null;
}

export function CheckoutDialog({
  isOpen,
  onClose,
  plan,
  isProcessing,
  onConfirmCheckout,
  error,
}: CheckoutDialogProps) {
  if (!plan) return null;

  const isFiveMonth = plan.planId === 'five_month' || plan.interval === 'five_month';
  const commercial = isFiveMonth ? COMMERCIAL_PLANS.five_month : COMMERCIAL_PLANS.monthly;

  const priceFormatted =
    plan.price > 0
      ? `₹${Math.round(plan.price / 100).toLocaleString('en-IN')}`
      : commercial.formattedPrice;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isProcessing && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-1">
            <Lock className="w-5 h-5 text-indigo-600" />
          </div>
          <DialogTitle className="text-lg font-bold text-brand-text-primary">
            Confirm Subscription Order
          </DialogTitle>
          <DialogDescription className="text-xs text-brand-text-secondary">
            Review your plan summary and commercial terms before proceeding to secure checkout.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-brand-border space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-brand-text-primary">
                  {plan.name || commercial.name}
                </h4>
                <p className="text-xs text-brand-text-secondary mt-0.5">
                  {isFiveMonth ? '5 Calendar Months Package' : 'Monthly Access'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-brand-text-primary">
                  {priceFormatted}
                </span>
                <span className="text-[11px] block text-brand-text-secondary">
                  {isFiveMonth ? 'one-time total' : 'per month'}
                </span>
              </div>
            </div>

            <div className="border-t border-brand-border/60 pt-2.5 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {isFiveMonth
                    ? 'Non-recurring payment. Access expires after 5 full calendar months with zero auto-debit.'
                    : 'Billed monthly. Valid for 1 calendar month. Renewal terms are confirmed before charge.'}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-primary shrink-0" />
            <span>
              Supported payment methods: UPI, Debit/Credit Cards, NetBanking via Razorpay.
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => onConfirmCheckout(plan)}
            disabled={isProcessing}
            isLoading={isProcessing}
            className="w-full sm:w-auto"
          >
            <span>Proceed to Payment ({priceFormatted})</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
