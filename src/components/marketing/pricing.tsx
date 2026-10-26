import Link from 'next/link';
import { Check, Sparkles, ArrowRight, Gift } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { COMMERCIAL_PLANS, TRIAL_DETAILS } from '@/lib/billing-plans';

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-brand-surface border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="default" size="md">
            Simple, Transparent Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-text-primary">
            Predictable Plans for Growing Businesses
          </h2>
          <p className="text-sm text-brand-text-secondary leading-relaxed">
            All plans include QR code generation, Google review routing, private feedback inbox, and customer directories.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-900 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary shrink-0" />
            <span>{TRIAL_DETAILS.label}: 7 days full access for eligible new accounts</span>
          </div>
        </div>

        {/* Commercial Plans Grid: Monthly and Five-Month */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Monthly Plan */}
          <Card className="flex flex-col justify-between p-6 bg-brand-surface border border-brand-border shadow-card hover:border-slate-300 transition-all">
            <CardHeader className="p-0 space-y-3 pb-6 border-b border-brand-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">{COMMERCIAL_PLANS.monthly.name}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  Monthly
                </Badge>
              </div>
              <CardDescription className="text-xs text-brand-text-secondary">
                {COMMERCIAL_PLANS.monthly.termDescription}
              </CardDescription>
              <div className="pt-2 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-brand-text-primary">
                  {COMMERCIAL_PLANS.monthly.formattedPrice}
                </span>
                <span className="text-xs text-brand-text-secondary">
                  / {COMMERCIAL_PLANS.monthly.billingCadence}
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-0 py-6 space-y-3 flex-1">
              <div className="text-xs font-semibold text-brand-text-primary">Included capabilities:</div>
              <ul className="space-y-2.5">
                {COMMERCIAL_PLANS.monthly.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-xs text-brand-text-secondary">
                    <Check className="w-4 h-4 text-brand-success shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="p-0 pt-4 border-t border-brand-border">
              <Button variant="outline" className="w-full justify-center text-xs" asChild>
                <Link href="/pricing">
                  <span>View Monthly Plan</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Five-Month Package */}
          <Card className="flex flex-col justify-between p-6 bg-brand-surface border-2 border-brand-primary shadow-elevated ring-1 ring-brand-primary/20 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="default" size="sm" className="bg-brand-primary text-white shadow-subtle px-3 py-0.5">
                Best Value
              </Badge>
            </div>

            <CardHeader className="p-0 space-y-3 pb-6 border-b border-brand-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">{COMMERCIAL_PLANS.five_month.name}</CardTitle>
                <Badge variant="default" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                  5 Months Access
                </Badge>
              </div>
              <CardDescription className="text-xs text-brand-text-secondary">
                {COMMERCIAL_PLANS.five_month.termDescription}
              </CardDescription>
              <div className="pt-2 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-brand-text-primary">
                  {COMMERCIAL_PLANS.five_month.formattedPrice}
                </span>
                <span className="text-xs text-brand-text-secondary">
                  one-time purchase (non-recurring)
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-0 py-6 space-y-3 flex-1">
              <div className="text-xs font-semibold text-brand-text-primary">Included capabilities:</div>
              <ul className="space-y-2.5">
                {COMMERCIAL_PLANS.five_month.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-xs text-brand-text-secondary">
                    <Check className="w-4 h-4 text-brand-success shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="p-0 pt-4 border-t border-brand-border">
              <Button variant="primary" className="w-full justify-center text-xs" asChild>
                <Link href="/pricing">
                  <span>View 5-Month Package</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Promo code callout */}
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Gift className="w-4 h-4 text-purple-700 shrink-0" />
            <span>
              Have the <strong>FREE4YOU</strong> code? Redeem it on the pricing or billing page for lifetime-free access.
            </span>
          </div>
          <Button variant="ghost" size="sm" asChild className="shrink-0 text-purple-800 hover:bg-purple-100">
            <Link href="/pricing">
              <span>Redeem</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
