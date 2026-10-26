'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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

  // Prevent background scroll when mobile menu is open
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
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-border/80 bg-brand-surface/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-ring rounded-lg px-1.5 py-1 -ml-1.5 transition-opacity hover:opacity-90"
        >
          <div className="w-8 h-8 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-subtle">
            <Star className="w-4 h-4 fill-white text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-brand-text-primary">
              ReviewFlow
            </span>
            <Badge variant="secondary" size="sm" className="hidden sm:inline-flex text-[10px]">
              SaaS
            </Badge>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-brand-text-secondary hover:text-brand-text-primary px-3 py-1.5 rounded-lg transition-colors focus-ring"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/design-system"
            className="text-xs font-medium text-brand-primary bg-indigo-50/70 hover:bg-indigo-50 px-2.5 py-1 rounded-md transition-colors focus-ring ml-2"
          >
            Design System
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button variant="primary" size="sm" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            className="p-2 rounded-xl text-brand-text-primary hover:bg-slate-100 transition-colors focus-ring"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="md:hidden fixed inset-x-0 top-16 bottom-0 z-50 bg-brand-surface/98 backdrop-blur-lg border-b border-brand-border p-6 flex flex-col justify-between overflow-y-auto animate-in fade-in-0 duration-200"
        >
          <nav className="flex flex-col gap-2 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-semibold text-brand-text-primary hover:text-brand-primary py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors focus-ring"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/design-system"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-brand-primary py-3 px-3 rounded-xl bg-indigo-50/60 transition-colors focus-ring mt-2 flex items-center justify-between"
            >
              <span>Design System Preview</span>
              <Badge variant="default" size="sm">
                Internal
              </Badge>
            </Link>
          </nav>

          <div className="flex flex-col gap-3 pt-6 border-t border-brand-border">
            <Button variant="outline" className="w-full justify-center" asChild>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                Log In
              </Link>
            </Button>
            <Button variant="primary" className="w-full justify-center" asChild>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
