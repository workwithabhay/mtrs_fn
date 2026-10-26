'use client';

import * as React from 'react';
import { CreditCard, AlertCircle, RotateCcw, ShieldAlert, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toast';
import { useOptionalAuth } from '@/contexts/auth-context';
import {
  listBillingPlans,
  getSubscription,
  createCheckout,
  verifyPayment,
  cancelSubscription,
  getPaymentHistory,
} from '@/lib/api/billing';
import { launchRazorpayModal } from '@/lib/razorpay';
import { COMMERCIAL_PLANS } from '@/lib/billing-plans';
import type {
  BillingPlan,
  SubscriptionData,
  PaymentEventItem,
} from '@/lib/api/types';
import { SubscriptionStatusCard } from './subscription-status-card';
import { PlanCard } from './plan-card';
import { PaymentHistoryTable } from './payment-history-table';
import { RedeemPromoCard } from './redeem-promo-card';
import { CheckoutDialog } from './checkout-dialog';
import { CancelSubscriptionDialog } from './cancel-subscription-dialog';

export function BillingDashboard() {
  const auth = useOptionalAuth();
  const user = auth?.user ?? null;

  const [plans, setPlans] = React.useState<BillingPlan[]>([]);
  const [subscription, setSubscription] = React.useState<SubscriptionData | null>(null);
  const [paymentEvents, setPaymentEvents] = React.useState<PaymentEventItem[]>([]);

  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Pre-checkout dialog state
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = React.useState<BillingPlan | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = React.useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = React.useState(false);
  const [checkoutError, setCheckoutError] = React.useState<string | null>(null);

  // Cancellation dialog state
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);
  const [isCancelling, setIsCancelling] = React.useState(false);

  // Provider test mode indicator state
  const [isTestMode, setIsTestMode] = React.useState(false);

  const fetchBillingData = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [fetchedPlans, fetchedSub, fetchedHistory] = await Promise.all([
        listBillingPlans(),
        getSubscription(),
        getPaymentHistory(1, 10),
      ]);

      // If backend returns empty plans array (e.g. before initial seeding), populate commercial defaults
      let resolvedPlans = fetchedPlans;
      if (!resolvedPlans || resolvedPlans.length === 0) {
        resolvedPlans = [
          {
            planId: COMMERCIAL_PLANS.monthly.planId,
            name: COMMERCIAL_PLANS.monthly.name,
            description: COMMERCIAL_PLANS.monthly.termDescription,
            price: COMMERCIAL_PLANS.monthly.pricePaise,
            currency: 'INR',
            interval: 'monthly',
            features: COMMERCIAL_PLANS.monthly.features,
            limits: { maxCampaigns: 1000, maxMonthlyScans: 100000, aiAssistanceEnabled: true },
          },
          {
            planId: COMMERCIAL_PLANS.five_month.planId,
            name: COMMERCIAL_PLANS.five_month.name,
            description: COMMERCIAL_PLANS.five_month.termDescription,
            price: COMMERCIAL_PLANS.five_month.pricePaise,
            currency: 'INR',
            interval: 'five_month',
            features: COMMERCIAL_PLANS.five_month.features,
            limits: { maxCampaigns: 1000, maxMonthlyScans: 100000, aiAssistanceEnabled: true },
          },
        ];
      }

      setPlans(resolvedPlans);
      setSubscription(fetchedSub);

      const eventsList = fetchedHistory.items || fetchedHistory.events || [];
      setPaymentEvents(eventsList);

      if (fetchedSub.isSimulated || eventsList.some((e) => e.isSimulated)) {
        setIsTestMode(true);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to load billing data. Please check your network and try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const [fetchedPlans, fetchedSub, fetchedHistory] = await Promise.all([
          listBillingPlans(),
          getSubscription(),
          getPaymentHistory(1, 10),
        ]);
        if (isCancelled) return;

        let resolvedPlans = fetchedPlans;
        if (!resolvedPlans || resolvedPlans.length === 0) {
          resolvedPlans = [
            {
              planId: COMMERCIAL_PLANS.monthly.planId,
              name: COMMERCIAL_PLANS.monthly.name,
              description: COMMERCIAL_PLANS.monthly.termDescription,
              price: COMMERCIAL_PLANS.monthly.pricePaise,
              currency: 'INR',
              interval: 'monthly',
              features: COMMERCIAL_PLANS.monthly.features,
              limits: { maxCampaigns: 1000, maxMonthlyScans: 100000, aiAssistanceEnabled: true },
            },
            {
              planId: COMMERCIAL_PLANS.five_month.planId,
              name: COMMERCIAL_PLANS.five_month.name,
              description: COMMERCIAL_PLANS.five_month.termDescription,
              price: COMMERCIAL_PLANS.five_month.pricePaise,
              currency: 'INR',
              interval: 'five_month',
              features: COMMERCIAL_PLANS.five_month.features,
              limits: { maxCampaigns: 1000, maxMonthlyScans: 100000, aiAssistanceEnabled: true },
            },
          ];
        }

        setPlans(resolvedPlans);
        setSubscription(fetchedSub);

        const eventsList = fetchedHistory.items || fetchedHistory.events || [];
        setPaymentEvents(eventsList);

        if (fetchedSub.isSimulated || eventsList.some((e) => e.isSimulated)) {
          setIsTestMode(true);
        }
        setErrorMessage(null);
      } catch (err: unknown) {
        if (isCancelled) return;
        const msg =
          err instanceof Error
            ? err.message
            : 'Unable to load billing data. Please check your network and try again.';
        setErrorMessage(msg);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Opens pre-checkout confirmation dialog
  const handleSelectPlan = (plan: BillingPlan) => {
    setCheckoutError(null);
    setSelectedPlanForCheckout(plan);
    setIsCheckoutModalOpen(true);
  };

  // Executes Razorpay or Mock checkout flow
  const handleConfirmCheckout = async (plan: BillingPlan) => {
    setIsProcessingCheckout(true);
    setCheckoutError(null);

    try {
      const checkoutRes = await createCheckout({
        planId: plan.planId,
        interval: plan.interval || (plan.planId === 'five_month' ? 'five_month' : 'monthly'),
        simulateSuccess: true,
      });

      // 1. If Mock Provider simulated success directly:
      if (checkoutRes.isSimulated && checkoutRes.status === 'succeeded') {
        setIsTestMode(true);
        toast.success(
          checkoutRes.message || `Test Mode: Switched to ${plan.name} successfully!`,
        );

        // Refresh authoritative subscription & payment history from server
        const [refreshedSub, history] = await Promise.all([
          getSubscription(),
          getPaymentHistory(1, 10),
        ]);
        setSubscription(refreshedSub);
        setPaymentEvents(history.items || history.events || []);

        setIsCheckoutModalOpen(false);
        setSelectedPlanForCheckout(null);
        return;
      }

      // 2. Razorpay Provider Checkout Integration
      const keyId = checkoutRes.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
      const orderId = checkoutRes.checkoutId;

      if (!orderId) {
        throw new Error('Payment gateway order identifier was not received.');
      }

      // Close checkout review dialog before opening Razorpay frame
      setIsCheckoutModalOpen(false);

      const launched = await launchRazorpayModal({
        keyId,
        orderId,
        amount: checkoutRes.amount || plan.price,
        currency: checkoutRes.currency || plan.currency || 'INR',
        name: 'ReviewFlow',
        description: `${plan.name} Access`,
        customerName: user?.name,
        customerEmail: user?.email,
        onSuccess: async (paymentResponse) => {
          try {
            // Verify payment signature on backend
            const verification = await verifyPayment({
              orderId: paymentResponse.razorpay_order_id,
              paymentId: paymentResponse.razorpay_payment_id,
              signature: paymentResponse.razorpay_signature,
            });

            if (verification.verified) {
              toast.success(
                verification.message || 'Payment verified successfully! Paid access is now active.',
              );

              // Server-authoritative refresh
              const [refreshedSub, history] = await Promise.all([
                getSubscription(),
                getPaymentHistory(1, 10),
              ]);
              setSubscription(refreshedSub);
              setPaymentEvents(history.items || history.events || []);
            } else {
              toast.error('Payment signature could not be verified by the server.');
            }
          } catch (err: unknown) {
            const msg =
              err instanceof Error
                ? err.message
                : 'Payment verification failed. Please contact support.';
            toast.error(msg);
          }
        },
        onFailure: (err) => {
          const desc =
            err.error?.description ||
            'Payment failed or was declined by bank. You have not been charged.';
          toast.error(desc);
          // Refresh payment history to reflect failed event
          getPaymentHistory(1, 10).then((history) => {
            setPaymentEvents(history.items || history.events || []);
          });
        },
        onDismiss: () => {
          toast.info('Checkout cancelled. You can choose a plan whenever you are ready.');
        },
      });

      if (!launched) {
        // Fallback for script load failure
        throw new Error(
          'Failed to load Razorpay payment gateway script. Please verify your internet connection or ad-blocker settings.',
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Checkout initiation failed.';
      setCheckoutError(msg);
      toast.error(msg);
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const handleConfirmCancel = async (immediate: boolean) => {
    setIsCancelling(true);
    try {
      const res = await cancelSubscription(immediate);
      setSubscription(res.subscription);
      setIsCancelModalOpen(false);
      toast.success(res.message || 'Subscription cancelled successfully');

      // Refresh payment history
      const history = await getPaymentHistory(1, 10);
      setPaymentEvents(history.items || history.events || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Cancellation failed.';
      toast.error(msg);
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePromoRedemptionSuccess = async () => {
    // Refresh authoritative server subscription data
    try {
      const [refreshedSub, history] = await Promise.all([
        getSubscription(),
        getPaymentHistory(1, 10),
      ]);
      setSubscription(refreshedSub);
      setPaymentEvents(history.items || history.events || []);
      toast.success('FREE4YOU code redeemed! Lifetime-free access active.');
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary">
            <CreditCard className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-text-primary">
            Billing &amp; Subscription Management
          </h1>
        </div>
        <p className="text-sm text-brand-text-secondary max-w-2xl">
          Manage your subscription tier, track trial expiry, redeem promotional codes, and review invoice history.
        </p>
      </div>

      {/* Test Mode Notification Banner */}
      {isTestMode && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Test Mode Active:</strong> Payment transactions are simulated in sandbox environment. Real bank accounts are not charged.
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900 shrink-0">
            Sandbox
          </span>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6" role="status" aria-label="Loading billing dashboard">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Skeleton className="h-96 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      )}

      {/* Error Banner */}
      {!isLoading && errorMessage && (
        <div
          role="alert"
          className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-sm">{errorMessage}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchBillingData}
            className="bg-white shrink-0"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !errorMessage && subscription && (
        <>
          {/* Current Subscription Status */}
          <SubscriptionStatusCard
            subscription={subscription}
            onCancelClick={() => setIsCancelModalOpen(true)}
          />

          {/* FREE4YOU Code Redemption UI */}
          <RedeemPromoCard
            currentSubscription={subscription}
            onRedemptionSuccess={handlePromoRedemptionSuccess}
          />

          {/* Available Commercial Plans Section */}
          <div className="space-y-5 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-brand-text-primary">
                  Choose a Subscription Plan
                </h2>
                <p className="text-xs text-brand-text-secondary">
                  Transparent options with clear commercial terms and no hidden fees.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-brand-text-secondary">
                <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                <span>Instant activation upon payment verification</span>
              </div>
            </div>

            {/* Plan Cards Grid: Monthly (₹99) and 5-Month (₹399) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.planId}
                  plan={plan}
                  currentPlanId={subscription.planId}
                  isCurrentActive={
                    subscription.status === 'active' &&
                    !subscription.isLifetime &&
                    subscription.entitlementSource !== 'promo_free4you'
                  }
                  isUpgrading={isProcessingCheckout && selectedPlanForCheckout?.planId === plan.planId}
                  onSelectPlan={handleSelectPlan}
                />
              ))}
            </div>
          </div>

          {/* Payment History Table */}
          <PaymentHistoryTable events={paymentEvents} isLoading={false} />

          {/* Pre-Checkout Confirmation Dialog */}
          <CheckoutDialog
            isOpen={isCheckoutModalOpen}
            onClose={() => {
              setIsCheckoutModalOpen(false);
              setSelectedPlanForCheckout(null);
            }}
            plan={selectedPlanForCheckout}
            isProcessing={isProcessingCheckout}
            onConfirmCheckout={handleConfirmCheckout}
            error={checkoutError}
          />

          {/* Cancel Subscription Confirmation Dialog */}
          <CancelSubscriptionDialog
            isOpen={isCancelModalOpen}
            onClose={() => setIsCancelModalOpen(false)}
            onConfirm={handleConfirmCancel}
            isCancelling={isCancelling}
          />
        </>
      )}
    </div>
  );
}
