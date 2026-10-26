'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Gift,
  HelpCircle,
  CreditCard,
} from 'lucide-react';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { getSubscription, redeemPromoCode } from '@/lib/api/billing';
import { COMMERCIAL_PLANS, PROMO_CODE_DETAILS, TRIAL_DETAILS } from '@/lib/billing-plans';
import type { SubscriptionData } from '@/lib/api/types';

export default function PricingPage() {
  const { isAuthenticated, user } = useAuth();
  const [subscription, setSubscription] = React.useState<SubscriptionData | null>(null);

  // Promo code state
  const [promoCodeInput, setPromoCodeInput] = React.useState('');
  const [promoSubmitting, setPromoSubmitting] = React.useState(false);
  const [promoMessage, setPromoMessage] = React.useState<{ text: string; isError: boolean } | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    if (isAuthenticated) {
      getSubscription()
        .then((sub) => {
          if (isMounted) setSubscription(sub);
        })
        .catch(() => {
          // Unauthenticated or not yet created
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const handleRedeemPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoCodeInput.trim().toUpperCase();
    if (!cleanCode) {
      setPromoMessage({ text: 'Please enter a promotional code.', isError: true });
      return;
    }

    if (!isAuthenticated) {
      setPromoMessage({
        text: 'Please sign in or create an account to redeem your promotional code.',
        isError: true,
      });
      return;
    }

    setPromoSubmitting(true);
    setPromoMessage(null);

    try {
      const res = await redeemPromoCode(cleanCode);
      if (res.success) {
        setPromoMessage({
          text: res.message || 'FREE4YOU redeemed successfully! Lifetime-free access is active.',
          isError: false,
        });
        setPromoCodeInput('');
        // Refresh subscription
        const sub = await getSubscription();
        setSubscription(sub);
      } else {
        setPromoMessage({ text: res.message || 'Unable to redeem code.', isError: true });
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to redeem code. Please verify and try again.';
      setPromoMessage({ text: msg, isError: true });
    } finally {
      setPromoSubmitting(false);
    }
  };

  const trialEndFormatted = subscription?.trialEndsAt
    ? new Date(subscription.trialEndsAt).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-brand-background text-brand-text-primary selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      <main id="main-content" className="flex-1 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="default" size="md">
              Transparent Pricing
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-text-primary">
              Simple, Predictable Plans for Business Growth
            </h1>
            <p className="text-sm sm:text-base text-brand-text-secondary leading-relaxed">
              No hidden fees, no complicated tiers. Start with a 7-day free trial, subscribe monthly, or choose our five-month package.
            </p>
          </div>

          {/* Authenticated Trial or Entitlement Status Card (when logged in) */}
          {isAuthenticated && subscription && (
            <div className="max-w-3xl mx-auto p-4 sm:p-5 rounded-2xl border border-brand-border bg-brand-surface shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-brand-primary shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">
                      Your Current Access:
                    </span>
                    <Badge variant="secondary" className="capitalize text-xs">
                      {subscription.planName || subscription.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-brand-text-primary font-medium mt-0.5">
                    {subscription.entitlementStatus === 'trial_active' && trialEndFormatted
                      ? `7-Day Trial active through ${trialEndFormatted} (${subscription.daysRemaining ?? 0} days remaining)`
                      : subscription.isLifetime
                        ? 'Promotional Lifetime Free Access Active'
                        : `Access status: ${subscription.status}`}
                  </p>
                </div>
              </div>

              <Button variant="outline" size="sm" asChild className="shrink-0 w-full sm:w-auto">
                <Link href="/dashboard/billing">
                  <span>Go to Billing Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          )}

          {/* 7-Day Free Trial Notice Banner */}
          <div className="max-w-4xl mx-auto p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-white to-indigo-50/50 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-brand-primary text-white shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-brand-text-primary">
                  {TRIAL_DETAILS.label} Included for Every New Account
                </h3>
                <p className="text-xs text-brand-text-secondary leading-relaxed">
                  {TRIAL_DETAILS.description}
                </p>
              </div>
            </div>
            {!isAuthenticated ? (
              <Button variant="primary" size="sm" asChild className="shrink-0 w-full sm:w-auto">
                <Link href="/signup">
                  <span>Start 7-Day Free Trial</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            ) : (
              <span className="text-xs text-brand-text-secondary font-medium px-3 py-1.5 rounded-lg bg-slate-100 shrink-0">
                Logged in as {user?.name}
              </span>
            )}
          </div>

          {/* Commercial Plans Grid: Monthly (₹99) and Five-Month (₹399) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* 1. Monthly Plan */}
            <Card className="flex flex-col justify-between p-6 bg-brand-surface border border-brand-border shadow-xs hover:border-slate-300 transition-all">
              <div>
                <CardHeader className="p-0 pb-6 border-b border-brand-border space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-brand-text-primary">
                      {COMMERCIAL_PLANS.monthly.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-[11px]">
                      Monthly
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-brand-text-secondary min-h-[32px]">
                    Flexible subscription billed monthly with straightforward cancellation terms.
                  </CardDescription>

                  <div className="pt-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-extrabold text-brand-text-primary">
                        {COMMERCIAL_PLANS.monthly.formattedPrice}
                      </span>
                      <span className="text-xs text-brand-text-secondary">
                        / {COMMERCIAL_PLANS.monthly.billingCadence}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0 py-6 space-y-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-brand-border/60 text-[11px] text-slate-600 space-y-1">
                    <span className="font-semibold text-brand-text-primary flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      Renewal Terms:
                    </span>
                    <p className="leading-relaxed">
                      {COMMERCIAL_PLANS.monthly.termDescription}
                    </p>
                  </div>

                  <div className="text-xs font-semibold text-brand-text-primary">
                    Plan Capabilities:
                  </div>
                  <ul className="space-y-2.5">
                    {COMMERCIAL_PLANS.monthly.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-xs text-brand-text-secondary">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>

              <CardFooter className="p-0 pt-4 border-t border-brand-border">
                <Button variant="outline" size="md" className="w-full" asChild>
                  <Link href={isAuthenticated ? '/dashboard/billing' : '/signup'}>
                    <span>{isAuthenticated ? 'Select Monthly Plan in Dashboard' : 'Get Started with Monthly'}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* 2. Five-Month Package */}
            <Card className="flex flex-col justify-between p-6 bg-brand-surface border-2 border-brand-primary shadow-elevated ring-1 ring-brand-primary/20 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="default" size="sm" className="bg-brand-primary text-white shadow-subtle px-3 py-0.5">
                  Best Value Package
                </Badge>
              </div>

              <div>
                <CardHeader className="p-0 pb-6 border-b border-brand-border space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-brand-text-primary">
                      {COMMERCIAL_PLANS.five_month.name}
                    </CardTitle>
                    <Badge variant="default" className="text-[11px] bg-indigo-50 text-indigo-700 border-indigo-200">
                      5 Calendar Months
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-brand-text-secondary min-h-[32px]">
                    One-time payment granting 5 full calendar months of uninterrupted platform access.
                  </CardDescription>

                  <div className="pt-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-extrabold text-brand-text-primary">
                        {COMMERCIAL_PLANS.five_month.formattedPrice}
                      </span>
                      <span className="text-xs text-brand-text-secondary font-medium">
                        one-time purchase (5 calendar months)
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0 py-6 space-y-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-brand-border/60 text-[11px] text-slate-600 space-y-1">
                    <span className="font-semibold text-brand-text-primary flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      Package Terms:
                    </span>
                    <p className="leading-relaxed">
                      {COMMERCIAL_PLANS.five_month.termDescription}
                    </p>
                  </div>

                  <div className="text-xs font-semibold text-brand-text-primary">
                    Plan Capabilities:
                  </div>
                  <ul className="space-y-2.5">
                    {COMMERCIAL_PLANS.five_month.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-xs text-brand-text-secondary">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>

              <CardFooter className="p-0 pt-4 border-t border-brand-border">
                <Button variant="primary" size="md" className="w-full" asChild>
                  <Link href={isAuthenticated ? '/dashboard/billing' : '/signup'}>
                    <span>{isAuthenticated ? 'Select 5-Month Package in Dashboard' : 'Get Started with 5-Month Package'}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* FREE4YOU Promotional Redemption Box */}
          <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-brand-border">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-brand-text-primary">
                  {PROMO_CODE_DETAILS.label}
                </h3>
                <p className="text-xs text-brand-text-secondary">
                  {PROMO_CODE_DETAILS.description}
                </p>
              </div>
            </div>

            <form onSubmit={handleRedeemPromo} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <label htmlFor="pricing-promo-input" className="sr-only">
                  Promotional Code
                </label>
                <Input
                  id="pricing-promo-input"
                  name="promoCode"
                  type="text"
                  placeholder="Enter FREE4YOU"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                  disabled={promoSubmitting}
                  className="font-mono uppercase text-sm tracking-wider"
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={promoSubmitting || !promoCodeInput.trim()}
                  isLoading={promoSubmitting}
                  className="shrink-0"
                >
                  <span>Redeem</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>

              {promoMessage && (
                <div
                  role={promoMessage.isError ? 'alert' : 'status'}
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    promoMessage.isError
                      ? 'bg-red-50 border border-red-200 text-red-800'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  }`}
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>{promoMessage.text}</span>
                </div>
              )}

              <p className="text-[11px] text-brand-text-secondary">
                Promotional redemption requires an active business account and is verified by the backend.
              </p>
            </form>
          </div>

          {/* Commercial Transparency FAQ */}
          <div className="max-w-3xl mx-auto pt-8 border-t border-brand-border space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-brand-text-primary flex items-center justify-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <span>Pricing &amp; Subscription Questions</span>
              </h3>
              <p className="text-xs text-brand-text-secondary">
                Common questions about payment verification, renewal, and trial periods.
              </p>
            </div>

            <div className="space-y-4 text-xs text-brand-text-secondary">
              <div className="p-4 rounded-xl border border-brand-border bg-slate-50 space-y-1">
                <strong className="text-brand-text-primary block text-sm">
                  What happens when my 7-day free trial ends?
                </strong>
                <p className="leading-relaxed">
                  Your QR touchpoints and customer reviews remain securely preserved in your account. To create new campaigns or continue routing reviews to Google, choose either the Monthly plan or 5-Month package.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-brand-border bg-slate-50 space-y-1">
                <strong className="text-brand-text-primary block text-sm">
                  Does the Five-Month plan auto-renew?
                </strong>
                <p className="leading-relaxed">
                  No. The Five-Month plan is a one-time purchase of ₹399 that does not auto-renew. Access is valid for five calendar months after verified payment.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-brand-border bg-slate-50 space-y-1">
                <strong className="text-brand-text-primary block text-sm">
                  How does payment verification work?
                </strong>
                <p className="leading-relaxed">
                  Payments are processed via Razorpay. Paid access is granted only after cryptographic signature verification is confirmed on our secure backend.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
