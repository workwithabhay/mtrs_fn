'use client';

import * as React from 'react';
import Link from 'next/link';
import { Store, QrCode, ThumbsUp, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      step: '1',
      title: 'Set Up Your Business Profile',
      description:
        'Enter your business details, category, and paste your official Google Business review link. Setup takes less than 2 minutes with email OTP verification.',
      icon: <Store className="w-4 h-4 text-[#F25C43]" />,
      nodePercentX: 17.78,
      nodePercentY: 52.38,
    },
    {
      step: '2',
      title: 'Generate & Place QR Codes',
      description:
        'Customize campaigns for different tables, counters, or receipts. Download in crisp vector formats (PNG, SVG, PDF) and print on physical collateral.',
      icon: <QrCode className="w-4 h-4 text-[#F25C43]" />,
      nodePercentX: 53.33,
      nodePercentY: 45.24,
    },
    {
      step: '3',
      title: 'Collect Feedback & Guide Reviews',
      description:
        'Customers scan your code to rate their experience. Happy patrons are guided to your Google review link with one tap, while private feedback alerts your team.',
      icon: <ThumbsUp className="w-4 h-4 text-[#F25C43]" />,
      nodePercentX: 82.22,
      nodePercentY: 21.43,
    },
  ];

  // Mathematically smooth C1-continuous spline wave through all 3 steps in 900x420 viewBox
  const wavePath =
    'M 20,180 C 60,195 110,220 160,220 C 220,220 270,150 320,150 C 370,150 430,190 480,190 C 560,190 660,90 740,90 C 780,90 810,95 840,95';

  return (
    <section
      id="how-it-works"
      className="relative py-20 lg:py-28 bg-[#FFFFFF] text-slate-900 border-b border-slate-200/80 overflow-hidden"
    >
      <style>{`
        @keyframes flowBeam {
          0% {
            stroke-dashoffset: 900;
          }
          100% {
            stroke-dashoffset: -100;
          }
        }
        .animate-flow-beam {
          animation: flowBeam 5s linear infinite;
        }
      `}</style>

      {/* Subtle soft warm radial highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-[#fbf6f2] -z-10 opacity-70"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* =================================================================== */}
          {/* LEFT COLUMN: Eyebrow, Main Heading, Subtext & Coral Pill Button      */}
          {/* =================================================================== */}
          <div className="lg:col-span-4 space-y-6 z-10">
            {/* Coral Eyebrow / Kicker */}
            <h2 className="text-xs sm:text-[13px] font-bold tracking-wider uppercase text-[#F25C43]">
              Simple 3-Step Process
            </h2>

            {/* Display Heading with normal, balanced font weights */}
            <h3 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-slate-900 leading-[1.2]">
              How ReviewFlow Works
            </h3>

            {/* Subtext description */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-sm">
              From setup to your first customer scan in three straightforward steps.
            </p>

            {/* Coral Pill Button with icon */}
            <div className="pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#F25C43] hover:bg-[#e04b33] text-white text-sm font-semibold tracking-normal shadow-md shadow-[#F25C43]/25 transition-all duration-200 hover:shadow-lg hover:shadow-[#F25C43]/35 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* =================================================================== */}
          {/* RIGHT COLUMN: The Undulating Coral Wave + 3 Interactive Step Nodes  */}
          {/* =================================================================== */}
          <div className="lg:col-span-8 relative">

            {/* Desktop Canvas View (lg and above) */}
            <div className="hidden lg:block relative w-full aspect-[900/420] max-h-[440px]">

              {/* SVG Layer with animated flowing energy wave */}
              <svg
                viewBox="0 0 900 420"
                className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Subtle soft drop shadow for the coral line */}
                  <filter id="coralShadow" x="-10%" y="-20%" width="120%" height="160%">
                    <feDropShadow
                      dx="0"
                      dy="8"
                      stdDeviation="6"
                      floodColor="#F25C43"
                      floodOpacity="0.22"
                    />
                  </filter>

                  {/* Gradient for traveling pulse beam */}
                  <linearGradient id="pulseBeamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                    <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </linearGradient>

                  {/* Gradient for the wave itself */}
                  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F25C43" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#FF7A63" stopOpacity="1" />
                    <stop offset="100%" stopColor="#F25C43" stopOpacity="0.85" />
                  </linearGradient>

                  {/* Soft radial glow aura for the animated traveling dot */}
                  <radialGradient id="dotAura">
                    <stop offset="0%" stopColor="#F25C43" stopOpacity="0.45" />
                    <stop offset="55%" stopColor="#F25C43" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#F25C43" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Main Coral Wave Path with smooth shadow */}
                <path
                  d={wavePath}
                  fill="none"
                  stroke="url(#waveGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="url(#coralShadow)"
                />

                {/* Traveling glowing pulse line synchronized with the dot */}
                <path
                  d={wavePath}
                  fill="none"
                  stroke="url(#pulseBeamGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="140 760"
                  className="animate-flow-beam"
                />

                {/* Perfect Traveling Animated Dot: 100% True Geometric Circles */}
                <g>
                  <animateMotion
                    path={wavePath}
                    dur="5s"
                    repeatCount="indefinite"
                    rotate="auto"
                  />
                  {/* Outer radiant ambient aura */}
                  <circle r="16" fill="url(#dotAura)" />
                  {/* Soft outer glow */}
                  <circle r="9" fill="#F25C43" opacity="0.25" />
                  {/* Crisp concentric ring */}
                  <circle r="6.5" fill="none" stroke="#F25C43" strokeWidth="1.5" opacity="0.7" />
                  {/* Solid vibrant coral dot */}
                  <circle r="4.5" fill="#F25C43" />
                  {/* Pure specular white center */}
                  <circle r="1.8" fill="#FFFFFF" />
                </g>

                {/* Dashed line tail accent matching reference wave */}
                <line
                  x1="840"
                  y1="95"
                  x2="880"
                  y2="95"
                  stroke="#F25C43"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </svg>

              {/* =============================================================== */}
              {/* STEP 1 (Left Valley)                                            */}
              {/* =============================================================== */}
              <div
                className="absolute group z-10"
                style={{
                  left: '17.78%',
                  top: '52.38%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Node Button / Marker overlapping the coral wave */}
                <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200/90 shadow-[0_4px_14px_rgba(0,0,0,0.06)] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-[#F25C43] group-hover:shadow-[0_8px_20px_rgba(242,92,67,0.22)] cursor-pointer">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#F25C43]/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#F25C43]" />
                  </span>
                </div>

                {/* Step Content Card below the node */}
                <div className="absolute left-1/2 -translate-x-1/2 top-8 w-[220px] pt-3 space-y-1.5 select-none pointer-events-auto">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-50 border border-orange-100/90 text-[11px] font-semibold text-[#F25C43]">
                    <Store className="w-3 h-3" />
                    <span>Step 01</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#F25C43] transition-colors leading-snug">
                    {steps[0].title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {steps[0].description}
                  </p>
                </div>
              </div>

              {/* =============================================================== */}
              {/* STEP 2 (Center Dip)                                             */}
              {/* =============================================================== */}
              <div
                className="absolute group z-10"
                style={{
                  left: '53.33%',
                  top: '45.24%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Node Button / Marker overlapping the coral wave */}
                <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200/90 shadow-[0_4px_14px_rgba(0,0,0,0.06)] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-[#F25C43] group-hover:shadow-[0_8px_20px_rgba(242,92,67,0.22)] cursor-pointer">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#F25C43]/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#F25C43]" />
                  </span>
                </div>

                {/* Step Content Card below the node */}
                <div className="absolute left-1/2 -translate-x-1/2 top-8 w-[220px] pt-3 space-y-1.5 select-none pointer-events-auto">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-50 border border-orange-100/90 text-[11px] font-semibold text-[#F25C43]">
                    <QrCode className="w-3 h-3" />
                    <span>Step 02</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#F25C43] transition-colors leading-snug">
                    {steps[1].title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {steps[1].description}
                  </p>
                </div>
              </div>

              {/* =============================================================== */}
              {/* STEP 3 (Top Right Elevated)                                     */}
              {/* =============================================================== */}
              <div
                className="absolute group z-10"
                style={{
                  left: '82.22%',
                  top: '21.43%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Node Button / Marker overlapping the coral wave */}
                <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200/90 shadow-[0_4px_14px_rgba(0,0,0,0.06)] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-[#F25C43] group-hover:shadow-[0_8px_20px_rgba(242,92,67,0.22)] cursor-pointer">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#F25C43]/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#F25C43]" />
                  </span>
                </div>

                {/* Step Content Card below the node */}
                <div className="absolute left-1/2 -translate-x-1/2 top-8 w-[220px] pt-3 space-y-1.5 select-none pointer-events-auto">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-50 border border-orange-100/90 text-[11px] font-semibold text-[#F25C43]">
                    <ThumbsUp className="w-3 h-3" />
                    <span>Step 03</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#F25C43] transition-colors leading-snug">
                    {steps[2].title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {steps[2].description}
                  </p>
                </div>
              </div>

            </div>

            {/* Mobile / Tablet Responsive Fallback */}
            <div className="block lg:hidden space-y-4 pt-4">
              {steps.map((s, idx) => (
                <div
                  key={s.step}
                  className="relative flex items-start gap-4 p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-xs hover:border-[#F25C43]/40 transition-colors"
                >
                  {/* Step Node Icon */}
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100/80 flex items-center justify-center shrink-0 mt-0.5 text-[#F25C43]">
                    {s.icon}
                  </div>

                  {/* Content */}
                  <div className="space-y-1 z-10 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#F25C43]">
                        Step 0{idx + 1}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {s.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {s.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
