import Link from 'next/link';
import { ArrowRight, QrCode, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CtaBanner() {
  return (
    <section
      aria-labelledby="cta-banner-heading"
      className="relative overflow-hidden py-20 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white"
    >
      {/* Decorative background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.4) 0%, transparent 60%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Launch Your QR Campaign in Under 3 Minutes</span>
        </div>

        {/* Heading */}
        <h2
          id="cta-banner-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight"
        >
          Turn Customer Visits Into Your Greatest Growth Engine
        </h2>

        {/* Subtext */}
        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Place smart QR codes at your checkout counters, receipts, or table tents. Capture constructive
          feedback privately and guide delighted customers straight to your Google review page.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Button
            size="lg"
            className="w-full sm:w-auto text-base rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 px-8 py-3.5 h-auto font-bold transition-all duration-200 hover:shadow-xl hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0"
            asChild
          >
            <Link href="/signup">
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-base rounded-full px-7 py-3.5 h-auto font-semibold border-slate-700/80 bg-slate-800/60 text-white hover:bg-slate-800 hover:text-white"
          >
            <Link href="#how-it-works">See How It Works</Link>
          </Button>
        </div>

        {/* Highlights / Trust Points */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-indigo-400" />
            <span>Instant print-ready QR codes</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Policy-compliant non-gated access</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Zero app download required for customers</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaBanner;
