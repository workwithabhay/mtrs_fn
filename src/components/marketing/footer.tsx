import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                R
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                ReviewFlow
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed">
              Empowering local businesses, healthcare clinics, retail stores, and service teams to
              capture valuable customer feedback through QR campaigns and streamline direct access to
              their Google review page.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Compliant with Google Customer Review Guidelines</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Navigation
            </p>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Platform Features
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="hover:text-white transition-colors"
                >
                  Transparent Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="hover:text-white transition-colors"
                >
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Platform */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Platform
            </p>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors"
                >
                  Owner Login
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="hover:text-white transition-colors"
                >
                  Get Started (Sign Up)
                </Link>
              </li>
              <li>
                <Link
                  href="/design-system"
                  className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>Design System</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                  <Sparkles className="w-3 h-3" />
                  <span>Phase 3 Active</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer / Compliance Note */}
        <div className="mt-12 pt-8 border-t border-slate-900 text-xs text-slate-500 space-y-2">
          <p>
            <strong className="text-slate-400">Notice on Review Authenticity:</strong> This platform does not post, fabricate, or modify customer reviews on Google or third-party review networks. We direct consenting customers to your verified Google business profile where reviews are submitted under their personal Google accounts in compliance with anti-gating policies.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Review Management SaaS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-default">Privacy Policy (Phase 5)</span>
            <span className="hover:text-slate-400 cursor-default">Terms of Service (Phase 5)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
