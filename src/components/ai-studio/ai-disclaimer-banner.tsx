'use client';

import * as React from 'react';
import { ShieldCheck, Info, Sparkles } from 'lucide-react';

export function AiDisclaimerBanner() {
  return (
    <div className="rounded-2xl border border-brand-border bg-gradient-to-r from-blue-50/70 via-slate-50 to-indigo-50/50 p-4 sm:p-5 text-left shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary shrink-0 mt-0.5 sm:mt-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-brand-text-primary">
                Truthful &amp; Ethical AI Assistance
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                Human-in-the-Loop
              </span>
            </div>
            <p className="text-xs text-brand-text-secondary mt-1 leading-relaxed max-w-3xl">
              AI polishes sentence structure, grammar, and tone. It is strictly constrained to preserve all original
              facts, names, sentiments, and events. It never fabricates praise, complaints, ratings, or reviews, and
              never publishes content automatically.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-brand-text-secondary bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-brand-border/60 shrink-0">
          <Info className="w-3.5 h-3.5 text-brand-primary" />
          <span>Manual review required</span>
        </div>
      </div>
    </div>
  );
}
