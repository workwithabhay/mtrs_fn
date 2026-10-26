'use client';

import * as React from 'react';
import { Calendar } from 'lucide-react';
import type { AnalyticsDateRange, AnalyticsPeriod } from '@/lib/api/types';

interface AnalyticsDateSelectorProps {
  selectedRange: AnalyticsDateRange;
  onChange: (range: AnalyticsDateRange) => void;
  period?: AnalyticsPeriod;
  disabled?: boolean;
}

const RANGES: { id: AnalyticsDateRange; label: string }[] = [
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: '90d', label: 'Last 90 Days' },
];

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return isoString;
  }
}

export function AnalyticsDateSelector({
  selectedRange,
  onChange,
  period,
  disabled = false,
}: AnalyticsDateSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-brand-surface rounded-2xl border border-brand-border shadow-xs">
      <div className="flex items-center gap-2 text-xs text-brand-text-secondary">
        <Calendar className="w-4 h-4 text-brand-primary shrink-0" aria-hidden="true" />
        <span className="font-medium text-brand-text-primary">Reporting Window:</span>
        {period ? (
          <span className="text-brand-text-secondary">
            {formatDate(period.startDate)} – {formatDate(period.endDate)} (UTC)
          </span>
        ) : (
          <span className="text-brand-text-muted">Loading period...</span>
        )}
      </div>

      <div
        role="group"
        aria-label="Analytics date range selection"
        className="inline-flex rounded-xl bg-slate-100 p-1 self-start sm:self-auto border border-slate-200/60"
      >
        {RANGES.map((r) => {
          const isActive = selectedRange === r.id;
          return (
            <button
              key={r.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(r.id)}
              aria-pressed={isActive}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all select-none focus-ring ${
                isActive
                  ? 'bg-white text-brand-text-primary shadow-xs font-bold border border-slate-200/80'
                  : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-slate-200/60'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {r.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
