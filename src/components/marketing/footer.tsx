'use client';

import * as React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';

export function Footer() {
  return (
    <footer
      className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 select-none "
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        ReviewFlow Footer
      </h2>

      {/* Centered Floating Card Container in Current Light Theme */}
      <div className="max-w-6xl mx-auto rounded-[28px] sm:rounded-[36px] overflow-hidden border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] bg-white">
        {/* UPPER BODY: Crisp Clean White Canvas */}
        <div className="relative p-7 sm:p-10 lg:p-12 overflow-hidden bg-white">
          {/* Subtle Ambient Pattern */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
            {/* LEFT COLUMN: Brand Logo, Tagline & Social Icons (Col 5) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Brand Logo */}
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 group focus-ring rounded-lg"
                aria-label="ReviewFlow Home"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/25 group-hover:scale-105 transition-transform duration-200">
                  <Star className="w-4 h-4 fill-white text-white" />
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                  ReviewFlow
                </span>
              </Link>

              {/* Tagline */}
              <p className="text-xs sm:text-sm font-medium text-slate-600 tracking-wide">
                Seamless Customer Reviews Zero Worries
              </p>

              {/* Circular Social Outline Buttons */}
              <div className="flex items-center gap-2.5 pt-2">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ReviewFlow on Facebook"
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80 transition-all duration-200 shadow-2xs focus-ring"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ReviewFlow on Instagram"
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80 transition-all duration-200 shadow-2xs focus-ring"
                >
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ReviewFlow on YouTube"
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80 transition-all duration-200 shadow-2xs focus-ring"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ReviewFlow on LinkedIn"
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80 transition-all duration-200 shadow-2xs focus-ring"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* RIGHT COLUMNS: Navigation, Solutions, Platform (Col 7) */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10">
              {/* Col 1: Navigation */}
              <div className="space-y-3.5">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight">
                  Navigation
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-600">
                  <li>
                    <Link href="#features" className="hover:text-indigo-600 transition-colors inline-block">
                      Platform Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#how-it-works" className="hover:text-indigo-600 transition-colors inline-block">
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link href="#pricing" className="hover:text-indigo-600 transition-colors inline-block">
                      Transparent Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#faq" className="hover:text-indigo-600 transition-colors inline-block">
                      Frequently Asked Questions
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-indigo-600 transition-colors inline-block">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-indigo-600 transition-colors inline-block">
                      Terms &amp; Conditions
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 2: Solutions */}
              <div className="space-y-3.5">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight">
                  Solutions
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-600">
                  <li>
                    <a href="#industries" className="hover:text-indigo-600 transition-colors inline-block">
                      Restaurants &amp; Cafes
                    </a>
                  </li>
                  <li>
                    <a href="#industries" className="hover:text-indigo-600 transition-colors inline-block">
                      Beauty Salons &amp; Spas
                    </a>
                  </li>
                  <li>
                    <a href="#industries" className="hover:text-indigo-600 transition-colors inline-block">
                      Marts &amp; Retail Shops
                    </a>
                  </li>
                  <li>
                    <a href="#industries" className="hover:text-indigo-600 transition-colors inline-block">
                      Clinics &amp; Healthcare
                    </a>
                  </li>
                  <li>
                    <a href="#industries" className="hover:text-indigo-600 transition-colors inline-block">
                      Fitness &amp; Gym Studios
                    </a>
                  </li>
                  <li>
                    <a href="#industries" className="hover:text-indigo-600 transition-colors inline-block">
                      Hotels &amp; Hospitality
                    </a>
                  </li>
                </ul>
              </div>

              {/* Col 3: Platform */}
              <div className="space-y-3.5 col-span-2 sm:col-span-1">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight">
                  Platform
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-600">
                  <li>
                    <Link href="/login" className="hover:text-indigo-600 transition-colors inline-block">
                      Owner Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup" className="hover:text-indigo-600 transition-colors inline-block">
                      Get Started (Sign Up)
                    </Link>
                  </li>
                  <li className="pt-1">
                    <Link href="/design-system" className="hover:text-indigo-600 transition-colors inline-block text-slate-500 font-medium">
                      Design System
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* LOWER BAR: Crisp Slate/Light Bar with Copyright & Compliance Note */}
        <div className="bg-slate-50/90 border-t border-slate-100 px-7 sm:px-10 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] sm:text-xs text-slate-500 font-normal">
          {/* Copyright & Compliance text */}
          <p className="order-2 sm:order-1 text-center sm:text-left leading-normal text-slate-500">
            &copy; 2026 ReviewFlow. Compliant with Google Customer Review Guidelines. Notice on review authenticity: ReviewFlow does not gate or fabricate reviews.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
