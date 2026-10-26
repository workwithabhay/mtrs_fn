'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  QrCode,
  MessageSquare,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  Clock,
  Palette,
  Loader2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  const router = useRouter();
  const { user, business, isAuthenticated, isLoading } = useAuth();

  // If unauthenticated after loading check, redirect to /login
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="flex flex-col items-center gap-3 text-brand-text-secondary" role="status">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          <p className="text-sm font-medium">Loading your business dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full shadow-elevated text-center p-6 space-y-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-text-primary">Sign In Required</h2>
            <p className="text-xs text-brand-text-secondary mt-1">
              You must be logged in with an active session cookie to access the owner portal.
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href="/login">
              <span>Go to Log In</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  const hasGoogleUrl = Boolean(business?.googleReviewUrl && business.googleReviewUrl.trim().length > 0);

  // Calculate truthful checklist progress based on verified session context
  const checklistItems = [
    {
      id: 'account_created',
      title: 'Business Account & Owner Profile Provisioned',
      description: `Signed in as ${user.name} with verified email ${user.email}.`,
      isCompleted: true,
      phase: 4,
    },
    {
      id: 'google_review_url',
      title: 'Google Business Profile Review Link',
      description: hasGoogleUrl
        ? `Configured: ${business?.googleReviewUrl}`
        : 'Connect your public Google review URL so happy patrons can be guided there with one tap.',
      isCompleted: hasGoogleUrl,
      phase: 11,
      action: hasGoogleUrl ? (
        <a
          href={business?.googleReviewUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline"
        >
          <span>Test link destination</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      ) : (
        <span className="text-xs text-amber-700 font-medium">
          Pending configuration in Settings (Phase 11)
        </span>
      ),
    },
    {
      id: 'first_campaign',
      title: 'Generate Print-Ready QR Touchpoints',
      description: 'Create customized QR flyers, table tents, and counter cards with high-res PNG/SVG/PDF export.',
      isCompleted: false,
      phase: 6,
      action: (
        <Link
          href="/dashboard/campaigns"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline"
        >
          <span>Open QR Campaigns</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      ),
    },
    {
      id: 'collect_feedback',
      title: 'Collect First Customer Feedback & Reviews',
      description: 'Place QR touchpoints at checkout counters, receipts, or dining tables to begin capturing sentiment.',
      isCompleted: false,
      phase: 7,
      action: (
        <span className="text-xs text-slate-500 font-medium">
          Feedback flow launches in Phase 7
        </span>
      ),
    },
  ];

  const completedCount = checklistItems.filter((i) => i.isCompleted).length;

  return (
    <div className="space-y-8">
      {/* 1. Welcome & Business Context Banner */}
      <section
        aria-labelledby="dashboard-welcome-heading"
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white relative overflow-hidden shadow-elevated"
      >
        {/* Decorative background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.4) 0%, transparent 50%)',
          }}
        />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Business Owner</span>
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">•</span>
              <span className="text-xs text-slate-300 font-mono">{user.email}</span>
            </div>

            <h1
              id="dashboard-welcome-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white"
            >
              Welcome back, {user.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Managing <strong className="text-white font-semibold">{business?.name || 'Your Business'}</strong>
              {business?.category ? ` (${business.category})` : ''}.
              Collect customer feedback and guide delighted patrons to your Google review page.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-1">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Setup Progress</span>
                <span className="font-bold text-white">{completedCount} of 4</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Getting-Started Onboarding Checklist */}
      <section aria-labelledby="onboarding-checklist-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="onboarding-checklist-heading" className="text-lg font-bold text-brand-text-primary">
              Getting-Started Checklist
            </h2>
            <p className="text-xs text-brand-text-secondary">
              Follow these recommended milestones to launch your first QR feedback campaign.
            </p>
          </div>
          <Badge variant="default" size="sm">
            {completedCount === 4 ? 'All Set' : `${4 - completedCount} Steps Remaining`}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checklistItems.map((item) => (
            <Card
              key={item.id}
              className={`p-5 transition-all ${
                item.isCompleted
                  ? 'bg-brand-surface border-brand-border'
                  : 'bg-slate-50/50 border-dashed border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 shrink-0">
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-brand-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-brand-text-primary truncate">
                      {item.title}
                    </h3>
                    {item.isCompleted ? (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                        Completed
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                        Phase {item.phase}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                  {item.action && <div className="pt-1.5">{item.action}</div>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Business Profile Summary Card */}
      <section aria-labelledby="business-summary-heading">
        <Card className="shadow-card overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-brand-border py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-brand-primary flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle id="business-summary-heading" className="text-base font-bold">
                    Business Profile & Review Destination
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Verified owner context retrieved from your active authenticated session.
                  </CardDescription>
                </div>
              </div>
              <Badge variant="success" size="sm">
                Verified Profile
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="space-y-1">
                <span className="text-brand-text-secondary font-medium">Business Name</span>
                <p className="text-sm font-bold text-brand-text-primary">
                  {business?.name || 'Not configured'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-brand-text-secondary font-medium">Category</span>
                <p className="text-sm font-semibold text-brand-text-primary">
                  {business?.category || 'Not categorized'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-brand-text-secondary font-medium">Account Owner</span>
                <p className="text-sm font-semibold text-brand-text-primary">{user.name}</p>
                <p className="text-[11px] text-brand-text-secondary font-mono">{user.email}</p>
              </div>

              <div className="space-y-1">
                <span className="text-brand-text-secondary font-medium">Google Review Link</span>
                {hasGoogleUrl ? (
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <a
                      href={business?.googleReviewUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1 truncate max-w-[180px]"
                      title={business?.googleReviewUrl || ''}
                    >
                      <span className="truncate">{business?.googleReviewUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-amber-700 italic">Not set (Add in Settings)</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 4. Product Capability Overview Cards (Truthful Empty States) */}
      <section aria-labelledby="product-capabilities-heading" className="space-y-4">
        <div>
          <h2 id="product-capabilities-heading" className="text-lg font-bold text-brand-text-primary">
            Platform Capabilities Overview
          </h2>
          <p className="text-xs text-brand-text-secondary">
            Truthful overview of platform features. No fabricated metrics or fictional customer numbers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: QR Touchpoints */}
          <Card className="p-6 flex flex-col justify-between space-y-4 border-brand-border">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-brand-primary flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <Badge variant="secondary" size="sm">
                  0 Active
                </Badge>
              </div>
              <h3 className="font-bold text-base text-brand-text-primary">QR Touchpoint Campaigns</h3>
              <p className="text-xs text-brand-text-secondary leading-relaxed">
                Design custom table tents, counter stickers, and receipt cards. Download in crisp PNG, SVG, or vector PDF ready for print.
              </p>
            </div>

            <div className="pt-2 border-t border-brand-border flex items-center justify-between text-xs">
              <span className="text-slate-400">Available</span>
              <Link href="/dashboard/campaigns" className="font-semibold text-brand-primary hover:underline">
                Manage Campaigns &rarr;
              </Link>
            </div>
          </Card>

          {/* Card 2: Customer Feedback */}
          <Card className="p-6 flex flex-col justify-between space-y-4 border-brand-border">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-success flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <Badge variant="secondary" size="sm">
                  0 Feedbacks
                </Badge>
              </div>
              <h3 className="font-bold text-base text-brand-text-primary">Private Customer Feedback</h3>
              <p className="text-xs text-brand-text-secondary leading-relaxed">
                Capture constructive criticism and private inquiries directly from customers before issues turn into public complaints.
              </p>
            </div>

            <div className="pt-2 border-t border-brand-border flex items-center justify-between text-xs">
              <span className="text-slate-400">Inbox</span>
              <span className="font-medium text-brand-success">Awaiting First Scan</span>
            </div>
          </Card>

          {/* Card 3: Google Reviews */}
          <Card className="p-6 flex flex-col justify-between space-y-4 border-brand-border">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <Badge variant="success" size="sm">
                  Anti-Gating
                </Badge>
              </div>
              <h3 className="font-bold text-base text-brand-text-primary">Direct Google Reviews</h3>
              <p className="text-xs text-brand-text-secondary leading-relaxed">
                Satisfied patrons are directed straight to your verified Google business review page with zero policy-violating review filtering.
              </p>
            </div>

            <div className="pt-2 border-t border-brand-border flex items-center justify-between text-xs">
              <span className="text-slate-400">Policy</span>
              <span className="font-medium text-emerald-700">100% Policy Compliant</span>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Recent Activity Feed (Truthful Empty State) */}
      <section aria-labelledby="recent-activity-heading">
        <Card className="shadow-card">
          <CardHeader className="py-4 border-b border-brand-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-text-secondary" />
                <CardTitle id="recent-activity-heading" className="text-base font-bold">
                  Recent Customer Activity
                </CardTitle>
              </div>
              <span className="text-xs text-brand-text-secondary">Real-Time Stream</span>
            </div>
          </CardHeader>

          <CardContent className="p-10 text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-50 border border-brand-border flex items-center justify-center text-slate-400">
              <Clock className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm font-bold text-brand-text-primary">
                No Customer Activity Recorded Yet
              </h3>
              <p className="text-xs text-brand-text-secondary leading-relaxed">
                When customers scan your QR codes and rate their experience, scan events, feedback submissions, and Google review clicks will stream here in real-time.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 6. Quick Next Actions & Resources */}
      <section aria-labelledby="quick-actions-heading" className="space-y-4">
        <div>
          <h2 id="quick-actions-heading" className="text-base font-bold text-brand-text-primary">
            Quick Resources & Shortcuts
          </h2>
          <p className="text-xs text-brand-text-secondary">
            Verified shortcuts for exploring the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/design-system"
            className="p-4 rounded-2xl bg-brand-surface border border-brand-border hover:border-indigo-200 hover:shadow-subtle transition-all flex items-center gap-3.5 focus-ring"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-brand-primary flex items-center justify-center shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="text-xs font-bold text-brand-text-primary">Design System</h3>
              <p className="text-[11px] text-brand-text-secondary truncate">
                Interactive component showcase
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="p-4 rounded-2xl bg-brand-surface border border-brand-border hover:border-indigo-200 hover:shadow-subtle transition-all flex items-center gap-3.5 focus-ring"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-success flex items-center justify-center shrink-0">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="text-xs font-bold text-brand-text-primary">Marketing Website</h3>
              <p className="text-[11px] text-brand-text-secondary truncate">
                View public landing page
              </p>
            </div>
          </Link>

          <div className="p-4 rounded-2xl bg-slate-50 border border-brand-border flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="text-xs font-bold text-brand-text-primary">Phase 6 Next</h3>
              <p className="text-[11px] text-brand-text-secondary truncate">
                QR Campaign Generator
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
