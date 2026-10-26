'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Search,
  Sparkles,
  Layers,
  Palette,
  Type,
  SquareDashed,
  Bell,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toast';
import { GlowCard } from '@/components/effects/glow-card';

export default function DesignSystemPage() {
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [sampleInputValue, setSampleInputValue] = React.useState('');
  const [sampleSelectValue, setSampleSelectValue] = React.useState('starter');

  const triggerToast = (type: 'success' | 'error' | 'info' | 'warning') => {
    switch (type) {
      case 'success':
        toast.success('Action completed successfully!', {
          description: 'Your changes have been saved to the server.',
        });
        break;
      case 'error':
        toast.error('Something went wrong', {
          description: 'Please verify your network connection and retry.',
        });
        break;
      case 'info':
        toast.info('New platform update available', {
          description: 'Check out the new features in your dashboard.',
        });
        break;
      case 'warning':
        toast.warning('Session expiring soon', {
          description: 'Please save your in-progress work.',
        });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-brand-background text-brand-text-primary px-4 py-12 sm:px-8 max-w-6xl mx-auto space-y-16">
      {/* Navigation & Header */}
      <header className="space-y-4 pb-8 border-b border-brand-border">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-primary hover:text-brand-primary-hover focus-ring rounded-lg px-2 py-1 -ml-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-brand-primary border border-indigo-100 mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Phase 2 Internal Showcase</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Design System & UI Primitives</h1>
            <p className="text-sm text-brand-text-secondary mt-1">
              Accessible, composable UI components and verified design tokens for Review Management SaaS.
            </p>
          </div>
          <Badge variant="secondary" size="md">
            Internal Route
          </Badge>
        </div>
      </header>

      {/* 1. Color Palette Tokens */}
      <section aria-labelledby="colors-heading" className="space-y-6">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-brand-primary" />
          <h2 id="colors-heading" className="text-xl font-bold">
            1. Color Tokens & Semantic Roles
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {[
            { name: 'Primary', hex: '#4F46E5', token: 'brand-primary', text: 'white' },
            { name: 'Primary Hover', hex: '#4338CA', token: 'brand-primary-hover', text: 'white' },
            { name: 'Background', hex: '#F8FAFC', token: 'brand-background', text: 'slate-900', border: true },
            { name: 'Surface', hex: '#FFFFFF', token: 'brand-surface', text: 'slate-900', border: true },
            { name: 'Text Primary', hex: '#0F172A', token: 'brand-text-primary', text: 'white' },
            { name: 'Text Secondary', hex: '#64748B', token: 'brand-text-secondary', text: 'white' },
            { name: 'Border', hex: '#E2E8F0', token: 'brand-border', text: 'slate-900', border: true },
            { name: 'Success', hex: '#15803D', token: 'brand-success', text: 'white' },
            { name: 'Warning', hex: '#B45309', token: 'brand-warning', text: 'white' },
            { name: 'Error', hex: '#B91C1C', token: 'brand-error', text: 'white' },
            { name: 'Info', hex: '#0369A1', token: 'brand-info', text: 'white' },
          ].map((c) => (
            <div
              key={c.name}
              className="p-3.5 rounded-xl border border-brand-border bg-brand-surface shadow-subtle space-y-2"
            >
              <div
                className="w-full h-12 rounded-lg"
                style={{
                  backgroundColor: c.hex,
                  border: c.border ? '1px solid #E2E8F0' : 'none',
                }}
              />
              <div>
                <div className="text-xs font-bold text-brand-text-primary">{c.name}</div>
                <div className="text-[11px] font-mono text-brand-text-secondary">{c.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Typography Hierarchy */}
      <section aria-labelledby="typography-heading" className="space-y-6">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-brand-primary" />
          <h2 id="typography-heading" className="text-xl font-bold">
            2. Typography Hierarchy
          </h2>
        </div>

        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-brand-text-secondary uppercase">Display Heading 1</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Turn genuine customer feedback into 5-star reviews</h1>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-brand-text-secondary uppercase">Section Heading 2</span>
              <h2 className="text-2xl font-bold tracking-tight">QR Campaign Performance & Real-Time Analytics</h2>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-brand-text-secondary uppercase">Card Title 3</span>
              <h3 className="text-lg font-semibold">Average Customer Satisfaction Score</h3>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-brand-text-secondary uppercase">Body Text</span>
              <p className="text-sm text-brand-text-secondary leading-relaxed max-w-3xl">
                Every customer rating above 4 stars prompts for an optional verified Google review redirect. Negative ratings route privately to the internal owner inbox for instant service recovery.
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-brand-text-secondary uppercase">Mono / Code Tokens</span>
              <div>
                <code className="text-xs font-mono bg-slate-100 text-slate-800 px-2 py-1 rounded-md">
                  POST /api/v1/public/feedback/:token
                </code>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-brand-border pt-4 text-xs text-brand-text-secondary">
            Typography tokens configured via CSS variable --font-sans with Inter fallback.
          </CardFooter>
        </Card>
      </section>

      {/* 3. Buttons Showcase */}
      <section aria-labelledby="buttons-heading" className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SquareDashed className="w-5 h-5 text-brand-primary" />
            <h2 id="buttons-heading" className="text-xl font-bold">
              3. Button Variants & Interaction States
            </h2>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsButtonLoading((prev) => !prev)}
          >
            Toggle Loading: {isButtonLoading ? 'ON' : 'OFF'}
          </Button>
        </div>

        <Card>
          <CardContent className="space-y-8 pt-6">
            {/* Variants */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary mb-3">
                Variants
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" isLoading={isButtonLoading}>
                  Primary Button
                </Button>
                <Button variant="secondary" isLoading={isButtonLoading}>
                  Secondary
                </Button>
                <Button variant="outline" isLoading={isButtonLoading}>
                  Outline
                </Button>
                <Button variant="ghost" isLoading={isButtonLoading}>
                  Ghost
                </Button>
                <Button variant="destructive" isLoading={isButtonLoading}>
                  Destructive
                </Button>
                <Button variant="link">Link Button</Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary mb-3">
                Sizes & Icons
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" leadingIcon={<Sparkles className="w-3.5 h-3.5" />}>
                  Small (32px)
                </Button>
                <Button size="md" leadingIcon={<Mail className="w-4 h-4" />}>
                  Medium (40px)
                </Button>
                <Button size="lg" trailingIcon={<CheckCircle2 className="w-4 h-4" />}>
                  Large (48px)
                </Button>
                <Button size="icon" variant="outline" aria-label="Search">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 4. Form Controls: Input, Textarea, Select */}
      <section aria-labelledby="forms-heading" className="space-y-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-primary" />
          <h2 id="forms-heading" className="text-xl font-bold">
            4. Form Controls (Input, Textarea, Select)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Field States</CardTitle>
              <CardDescription>
                Labels, helper text, leading icons, and accessible validation association.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Business Email"
                placeholder="owner@company.com"
                helperText="We will send your login OTP to this address."
                leadingIcon={<Mail className="w-4 h-4" />}
                value={sampleInputValue}
                onChange={(e) => setSampleInputValue(e.target.value)}
                required
              />

              <Input
                label="Invalid State Demonstration"
                placeholder="Required field"
                defaultValue="invalid-email-format"
                error="Please enter a valid business email address."
              />

              <Input
                label="Disabled Input"
                placeholder="Read-only system value"
                defaultValue="ACCOUNT_TIER_STARTER"
                disabled
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Textarea & Select</CardTitle>
              <CardDescription>
                Accessible dropdowns and multi-line inputs with character counter guidance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Subscription Plan"
                value={sampleSelectValue}
                onChange={(e) => setSampleSelectValue(e.target.value)}
                helperText="Select the tier that best matches your customer scan volume."
                options={[
                  { label: 'Starter Plan — ₹999/mo', value: 'starter' },
                  { label: 'Growth Plan — ₹2,499/mo', value: 'growth' },
                  { label: 'Enterprise Plan — Custom', value: 'enterprise' },
                ]}
              />

              <Textarea
                label="Internal Feedback Notes"
                placeholder="Add private owner notes regarding this review..."
                maxLength={200}
                showCount
                helperText="Private notes are only visible to your business staff."
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 5. Badges & Status Indicators */}
      <section aria-labelledby="badges-heading" className="space-y-6">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-primary" />
          <h2 id="badges-heading" className="text-xl font-bold">
            5. Badges & Status Indicators
          </h2>
        </div>

        <Card>
          <CardContent className="space-y-6 pt-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary mb-3">
                Semantic Variants with Indicator Dots
              </h4>
              <div className="flex flex-wrap gap-2.5">
                <Badge variant="default" hasDot>
                  Active Campaign
                </Badge>
                <Badge variant="success" hasDot>
                  Verified 5-Star
                </Badge>
                <Badge variant="warning" hasDot>
                  Pending Recovery
                </Badge>
                <Badge variant="destructive" hasDot>
                  Suspended
                </Badge>
                <Badge variant="info" hasDot>
                  AI Processed
                </Badge>
                <Badge variant="secondary">Draft Mode</Badge>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary mb-3">
                Compact Size (sm)
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default" size="sm">
                  PRO
                </Badge>
                <Badge variant="success" size="sm">
                  PASS
                </Badge>
                <Badge variant="warning" size="sm">
                  WAIT
                </Badge>
                <Badge variant="destructive" size="sm">
                  FAILED
                </Badge>
                <Badge variant="info" size="sm">
                  NEW
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 6. Dialog & Toast Interactions */}
      <section aria-labelledby="modals-heading" className="space-y-6">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand-primary" />
          <h2 id="modals-heading" className="text-xl font-bold">
            6. Dialogs & Toast Notifications
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Accessible Modal Dialog</CardTitle>
              <CardDescription>
                Full keyboard focus trap, ESC key dismissal, and backdrop click handler via Radix UI.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="primary">Open Confirmation Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Deactivate QR Campaign?</DialogTitle>
                    <DialogDescription>
                      Customers scanning this QR code will no longer be routed to your feedback landing page. You can reactivate this campaign at any time.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Existing printed collateral will display a friendly campaign paused message.
                    </span>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setDialogOpen(false);
                        toast.success('Campaign deactivated successfully.');
                      }}
                    >
                      Deactivate Campaign
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Toast Notifications</CardTitle>
              <CardDescription>
                Non-blocking status announcements with accessible ARIA live regions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2.5">
                <Button size="sm" variant="outline" onClick={() => triggerToast('success')}>
                  Trigger Success
                </Button>
                <Button size="sm" variant="outline" onClick={() => triggerToast('error')}>
                  Trigger Error
                </Button>
                <Button size="sm" variant="outline" onClick={() => triggerToast('info')}>
                  Trigger Info
                </Button>
                <Button size="sm" variant="outline" onClick={() => triggerToast('warning')}>
                  Trigger Warning
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 7. ReactBits Glow Card & Skeletons */}
      <section aria-labelledby="effects-heading" className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-primary" />
          <h2 id="effects-heading" className="text-xl font-bold">
            7. ReactBits Micro-Interactions & Skeletons
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ReactBits Glow Card */}
          <GlowCard>
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-brand-primary border border-indigo-200/60">
                <Sparkles className="w-3 h-3" />
                <span>ReactBits Interaction</span>
              </div>
              <h3 className="text-lg font-bold text-brand-text-primary">
                Subtle Radial Glow Surface
              </h3>
              <p className="text-xs text-brand-text-secondary leading-relaxed">
                Hover over this card to observe the lightweight mouse-following radial highlight. Built with zero external physics libraries, completely accessible, and automatically disabled for users with reduced motion enabled.
              </p>
              <Button size="sm" variant="outline">
                Interactive Card Action
              </Button>
            </div>
          </GlowCard>

          {/* Skeletons Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Skeleton Loaders</CardTitle>
              <CardDescription>
                Lightweight placeholders that eliminate content layout shifts during data fetching.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" className="w-10 h-10" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-16 w-full" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer Notice */}
      <footer className="pt-8 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between text-xs text-brand-text-secondary gap-3">
        <p>Review Management SaaS — Design System Preview Route (/design-system)</p>
        <p className="font-mono text-[11px]">WCAG 2.2 AA Compliant Primitives</p>
      </footer>
    </div>
  );
}
