import Link from 'next/link';
import { ArrowRight, QrCode, Star, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-brand-border">
      {/* Background Decorative Grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          {/* Trust Banner Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-brand-primary border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary shrink-0" />
            <span>Ethical, Non-Gated Review Management</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-brand-text-primary leading-[1.12]">
            Turn Customer Feedback Into Your Next Opportunity.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-brand-text-secondary leading-relaxed max-w-2xl">
            Give customers a simple way to share their experience through QR-powered feedback campaigns and make your Google review page easy to find.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto text-base" asChild>
              <Link href="/signup">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base" asChild>
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>

          {/* Compliance Assurance */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-xs text-brand-text-secondary">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-success" />
              <span>Google Review Policy Compliant</span>
            </span>
            <span className="flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-brand-primary" />
              <span>Zero App Downloads Required</span>
            </span>
          </div>
        </div>

        {/* CSS-Built Illustrative Interface Preview */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="relative rounded-2xl p-2 sm:p-4 bg-slate-900/5 border border-brand-border shadow-elevated">
            <div className="rounded-xl bg-brand-surface border border-brand-border p-6 sm:p-8 space-y-6">
              {/* Illustrative Notice Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-brand-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono text-brand-text-secondary ml-2">
                    reviewflow.app/qr/demo-table-campaign
                  </span>
                </div>
                <Badge variant="secondary" size="sm" className="text-[10px]">
                  Illustrative Interface Preview
                </Badge>
              </div>

              {/* Grid Preview Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Left Card: Customer Mobile Scan Experience */}
                <div className="md:col-span-5 p-5 rounded-2xl bg-slate-50 border border-brand-border space-y-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary">
                    Mobile Feedback Experience
                  </div>

                  <div className="p-4 bg-brand-surface rounded-xl border border-brand-border shadow-subtle space-y-3">
                    <div className="text-center space-y-1">
                      <div className="font-bold text-sm text-brand-text-primary">Artisan Bistro</div>
                      <p className="text-xs text-brand-text-secondary">How was your visit today?</p>
                    </div>

                    {/* Star Rating Preview */}
                    <div className="flex justify-center gap-1.5 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-6 h-6 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <div className="space-y-2 pt-1">
                      <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                        Share on Google Reviews
                      </Button>
                      <Button size="sm" variant="ghost" className="w-full text-xs text-brand-text-secondary">
                        Leave Private Feedback
                      </Button>
                    </div>
                  </div>

                  <p className="text-[11px] text-brand-text-secondary text-center">
                    Customers always retain the choice to post directly to Google or write to you privately.
                  </p>
                </div>

                {/* Right Card: Owner Dashboard Live Overview */}
                <div className="md:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base text-brand-text-primary">Campaign Performance</h3>
                      <p className="text-xs text-brand-text-secondary">Table Tent QR • Main Dining Room</p>
                    </div>
                    <Badge variant="success" hasDot>
                      Active
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Card className="p-4 shadow-subtle bg-indigo-50/40 border-indigo-100">
                      <div className="text-xs text-brand-text-secondary font-medium">QR Scans</div>
                      <div className="text-2xl font-extrabold text-brand-primary mt-1">428</div>
                      <div className="text-[11px] text-brand-success mt-1 font-medium">↑ Real-time tracking</div>
                    </Card>
                    <Card className="p-4 shadow-subtle bg-emerald-50/40 border-emerald-100">
                      <div className="text-xs text-brand-text-secondary font-medium">Google Review Clicks</div>
                      <div className="text-2xl font-extrabold text-brand-success mt-1">194</div>
                      <div className="text-[11px] text-brand-text-secondary mt-1">45.3% conversion</div>
                    </Card>
                  </div>

                  {/* Private Feedback Alert Preview */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-border flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-brand-primary flex items-center justify-center shrink-0">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left space-y-0.5">
                      <div className="text-xs font-bold text-brand-text-primary">Private Feedback Received</div>
                      <p className="text-xs text-brand-text-secondary line-clamp-1">
                        &quot;Loved the cappuccino, but service took 15 mins during the lunch rush.&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
