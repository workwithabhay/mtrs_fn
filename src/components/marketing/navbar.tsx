'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  SparklesIcon,
  RocketLaunchIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  ArrowRightIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Scroll detection to toggle between minimized normal state and expanded scrolled state
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile navigation on Esc key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent background scroll when mobile drawer is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Features', href: '#features', icon: SparklesIcon },
    { label: 'How It Works', href: '#how-it-works', icon: RocketLaunchIcon },
    { label: 'Pricing', href: '#pricing', icon: CreditCardIcon },
    { label: 'FAQ', href: '#faq', icon: QuestionMarkCircleIcon },
  ];

  return (
    <>
      {/* =================================================================== */}
      {/* TOP DESKTOP & MOBILE HEADER: GLASS EFFECT WITH SCROLL MINIMIZE/EXPAND */}
      {/* =================================================================== */}
      <header
        className={cn(
          'fixed inset-x-0 z-40 flex justify-center px-3 sm:px-6 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none',
          isScrolled ? 'top-2 sm:top-3' : 'top-3 sm:top-5'
        )}
      >
        <div
          className={cn(
            'pointer-events-auto w-full flex items-center justify-between gap-4 backdrop-blur-xl border transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] select-none flex-nowrap',
            // Glass effect styles
            'bg-white/80 border-white/70 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.06)]',
            // Minimize when normal (top of page), expand on scroll
            isScrolled
              ? 'max-w-6xl rounded-2xl sm:rounded-3xl px-6 sm:px-8 py-3 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.1)]'
              : 'max-w-4xl lg:max-w-5xl rounded-full px-5 sm:px-7 py-2.5 shadow-sm'
          )}
        >
          {/* Brand Logo & Wordmark (No SaaS word) */}
          <Link
            href="/"
            className="flex items-center gap-2.5 focus-ring rounded-full px-1.5 py-1 -ml-1 transition-opacity hover:opacity-90 shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <StarIcon className="w-4 h-4 fill-white text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 whitespace-nowrap">
              ReviewFlow
            </span>
          </Link>

          {/* Desktop Navigation Links (Single Row, No Wrap) */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1.5 shrink-0 flex-nowrap whitespace-nowrap"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70 px-3.5 py-2 rounded-full transition-all duration-200 focus-ring whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
         
          </nav>

          {/* Desktop Action CTAs (Taller Buttons) */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0 flex-nowrap">
            <Button
              variant="ghost"
              className="h-10 sm:h-11 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 text-xs sm:text-sm font-semibold px-4.5"
              asChild
            >
              <Link href="/login">Log In</Link>
            </Button>

            <Button
              className="h-10 sm:h-11 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xs text-xs sm:text-sm font-semibold px-5 sm:px-6"
              asChild
            >
              <Link href="/signup">
                <span>Get Started</span>
                <ArrowRightIcon className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </div>

          {/* Mobile Right Controls: Quick Login & Drawer Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-2.5 py-1 rounded-full"
            >
              Log In
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={
                mobileMenuOpen
                  ? 'Close Navigation Menu'
                  : 'Open Navigation Menu'
              }
              className="p-1.5 rounded-full text-slate-800 hover:bg-slate-100 transition-colors focus-ring"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Accessible Mobile Drawer Menu (When user taps hamburger) */}
        {mobileMenuOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            className="md:hidden fixed inset-x-3 top-20 bottom-24 z-50 bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200 pointer-events-auto"
          >
            <nav className="flex flex-col gap-2 pt-2">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-base font-semibold text-slate-800 hover:text-indigo-600 py-3 px-4 rounded-2xl hover:bg-slate-50 transition-colors focus-ring"
                  >
                    <IconComponent className="w-5 h-5 text-indigo-600 shrink-0" />
                    <span>{link.label}</span>
                  </a>
                );
              })}
              <Link
                href="/design-system"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-indigo-700 py-3 px-4 rounded-2xl bg-indigo-50/80 transition-colors focus-ring mt-2 flex items-center justify-between"
              >
                <span>Design System Preview</span>
                <Badge variant="default" size="sm">
                  Internal
                </Badge>
              </Link>
            </nav>

            <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
              <Button
                variant="outline"
                className="w-full justify-center rounded-full"
                asChild
              >
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  Log In
                </Link>
              </Button>
              <Button
                size="md"
                className="w-full justify-center rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xs font-semibold"
                asChild
              >
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <span>Get Started</span>
                  <ArrowRightIcon className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* =================================================================== */}
      {/* MOBILE FLOATING BOTTOM NAVIGATION: FROSTED GLASS CAPSULE DOCK       */}
      {/* WITH PILLS AND HEROICONS (Exact Match to User Requirement)          */}
      {/* =================================================================== */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-4 inset-x-3 z-50 md:hidden flex justify-center pointer-events-none select-none"
      >
        <div className="pointer-events-auto max-w-sm w-full bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.18)] rounded-full p-1.5 flex items-center justify-between gap-1 transition-transform duration-200">
          {/* Pill 1: Features */}
          <a
            href="#features"
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-full text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70 active:scale-95 transition-all group focus-ring"
            aria-label="Features"
          >
            <SparklesIcon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-[10px] font-semibold tracking-tight mt-0.5">
              Features
            </span>
          </a>

          {/* Pill 2: How It Works */}
          <a
            href="#how-it-works"
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-full text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70 active:scale-95 transition-all group focus-ring"
            aria-label="How It Works"
          >
            <RocketLaunchIcon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-[10px] font-semibold tracking-tight mt-0.5">
              How It Works
            </span>
          </a>

          {/* Pill 3: Pricing */}
          <a
            href="#pricing"
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-full text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70 active:scale-95 transition-all group focus-ring"
            aria-label="Pricing"
          >
            <CreditCardIcon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-[10px] font-semibold tracking-tight mt-0.5">
              Pricing
            </span>
          </a>

          {/* Pill 4: FAQ */}
          <a
            href="#faq"
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-full text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70 active:scale-95 transition-all group focus-ring"
            aria-label="FAQ"
          >
            <QuestionMarkCircleIcon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-[10px] font-semibold tracking-tight mt-0.5">
              FAQ
            </span>
          </a>

          {/* Pill 5: Get Started CTA Pill */}
          <Link
            href="/signup"
            className="flex flex-col items-center justify-center py-1.5 px-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs active:scale-95 transition-all"
            aria-label="Get Started"
          >
            <ArrowRightIcon className="w-4 h-4 text-white stroke-[2.5]" />
            <span className="text-[10px] font-bold text-white tracking-tight mt-0.5">
              Start
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
