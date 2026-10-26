'use client';

import * as React from 'react';
import Link from 'next/link';
import { Users, QrCode, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface CustomerEmptyStateProps {
  isFiltered?: boolean;
  onClearFilters?: () => void;
}

export function CustomerEmptyState({
  isFiltered = false,
  onClearFilters,
}: CustomerEmptyStateProps) {
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-brand-border bg-brand-surface">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-brand-text-secondary flex items-center justify-center mb-4">
          <SearchX className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-semibold text-brand-text-primary">
          No matching customers found
        </h3>
        <p className="mt-1 text-xs text-brand-text-secondary max-w-sm">
          No customer profiles matched your current search query. Try clearing your search term or adjusting filters.
        </p>
        {onClearFilters && (
          <div className="mt-5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-xs h-8 px-3"
            >
              Clear Search Query
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-brand-border bg-brand-surface">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-brand-primary flex items-center justify-center mb-4">
        <Users className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-brand-text-primary">
        No customer profiles yet
      </h3>
      <p className="mt-1 text-xs text-brand-text-secondary max-w-md">
        Verified customer profiles are automatically captured whenever patrons scan your campaign QR stands and submit ratings or private feedback.
      </p>
      <div className="mt-5 flex items-center gap-3">
        <Button asChild size="sm" className="text-xs h-8 px-3 gap-1.5 bg-brand-primary hover:bg-brand-primary/90 text-white">
          <Link href="/dashboard/campaigns">
            <QrCode className="w-3.5 h-3.5" />
            <span>View QR Campaigns</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
