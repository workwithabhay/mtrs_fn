'use client';

import * as React from 'react';
import { Users, UserCheck, Star } from 'lucide-react';
import type { CustomerDirectoryStats } from '@/lib/api/types';

export interface CustomerStatsCardsProps {
  stats: CustomerDirectoryStats;
  loading?: boolean;
}

export function CustomerStatsCards({ stats, loading = false }: CustomerStatsCardsProps) {
  const repeatPercentage =
    stats.totalCustomers > 0
      ? Math.round((stats.repeatCustomers / stats.totalCustomers) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Customers */}
      <div className="rounded-2xl border border-brand-border bg-brand-surface p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary">
            Total Customers
          </p>
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Users className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>
        <div className="mt-3">
          {loading ? (
            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-brand-text-primary">
                {stats.totalCustomers}
              </span>
              <span className="text-xs text-brand-text-secondary">verified profiles</span>
            </div>
          )}
          <p className="mt-1 text-xs text-brand-text-secondary">
            Patrons who scanned & shared feedback
          </p>
        </div>
      </div>

      {/* Repeat Patrons */}
      <div className="rounded-2xl border border-brand-border bg-brand-surface p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary">
            Repeat Patrons
          </p>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <UserCheck className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>
        <div className="mt-3">
          {loading ? (
            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-brand-text-primary">
                {stats.repeatCustomers}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                ({repeatPercentage}% loyalty)
              </span>
            </div>
          )}
          <p className="mt-1 text-xs text-brand-text-secondary">
            Visited & provided feedback more than once
          </p>
        </div>
      </div>

      {/* Average Rating */}
      <div className="rounded-2xl border border-brand-border bg-brand-surface p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary">
            Average Sentiment
          </p>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" aria-hidden="true" />
          </div>
        </div>
        <div className="mt-3">
          {loading ? (
            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-brand-text-primary">
                {stats.averageRating !== null ? `${stats.averageRating} / 5` : 'N/A'}
              </span>
              {stats.averageRating !== null && (
                <span className="text-xs text-brand-text-secondary">overall score</span>
              )}
            </div>
          )}
          <p className="mt-1 text-xs text-brand-text-secondary">
            Customer satisfaction across all touchpoints
          </p>
        </div>
      </div>
    </div>
  );
}
