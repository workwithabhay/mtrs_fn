'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserMenu } from './user-menu';
import { useAuth } from '@/contexts/auth-context';
import { Badge } from '@/components/ui/badge';

interface AppHeaderProps {
  onOpenMobileNav: () => void;
}

export function AppHeader({ onOpenMobileNav }: AppHeaderProps) {
  const { business } = useAuth();
  const hasGoogleUrl = Boolean(business?.googleReviewUrl);

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-brand-border bg-brand-surface/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & location */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open sidebar navigation menu"
          className="lg:hidden p-2 rounded-xl text-brand-text-secondary hover:bg-slate-100 hover:text-brand-text-primary focus-ring"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-brand-text-primary hover:text-brand-primary transition-colors hidden sm:inline"
          >
            ReviewFlow
          </Link>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="text-sm font-bold text-brand-text-primary">Overview</span>
        </div>
      </div>

      {/* Right: Review Status Indicator & User Menu */}
      <div className="flex items-center gap-3">
        {/* Google Review Destination Status Indicator */}
        <div className="hidden md:flex items-center">
          {hasGoogleUrl ? (
            <a
              href={business?.googleReviewUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              title="Open verified Google review destination in a new tab"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors focus-ring"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Google Review Link Active</span>
              <ExternalLink className="w-3 h-3 ml-0.5 text-emerald-500" />
            </a>
          ) : (
            <div
              title="Add your Google Business review link in Settings (Phase 11)"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Review Link Pending</span>
            </div>
          )}
        </div>

        {/* Global session badge */}
        <Badge variant="success" size="sm" className="hidden sm:inline-flex">
          Session Active
        </Badge>

        {/* User Account Menu */}
        <UserMenu />
      </div>
    </header>
  );
}
