'use client';

import * as React from 'react';
import {
  QrCode,
  MessageSquare,
  Star,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { AnalyticsSummaryResponse } from '@/lib/api/types';

interface AnalyticsKpiCardsProps {
  summary: AnalyticsSummaryResponse;
}

export function AnalyticsKpiCards({ summary }: AnalyticsKpiCardsProps) {
  const hasRatings = summary.ratings.totalRatings > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Scans */}
      <Card className="p-4 relative flex flex-col justify-between overflow-hidden shadow-xs">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-text-secondary font-medium">QR Scans (Period)</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-brand-primary flex items-center justify-center">
              <QrCode className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-brand-text-primary tracking-tight">
              {summary.engagement.periodScans.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-brand-text-muted mt-1">
            All-time: <strong className="text-brand-text-secondary">{summary.engagement.totalScansAllTime.toLocaleString()}</strong> scans
          </p>
        </div>
        <div className="mt-3 pt-2.5 border-t border-brand-border/40 flex items-start gap-1.5 text-[10px] text-brand-text-muted">
          <Info className="w-3 h-3 text-brand-text-muted shrink-0 mt-0.5" aria-hidden="true" />
          <span>Raw scan events (not unique visitors).</span>
        </div>
      </Card>

      {/* 2. Feedback Submissions */}
      <Card className="p-4 relative flex flex-col justify-between overflow-hidden shadow-xs">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-text-secondary font-medium">Feedback Received</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-brand-text-primary tracking-tight">
              {summary.feedbacks.periodTotal.toLocaleString()}
            </span>
            <span className="text-xs text-brand-text-muted">
              ({summary.feedbacks.total.toLocaleString()} all-time)
            </span>
          </div>
          <p className="text-[11px] text-brand-text-secondary mt-1">
            {summary.feedbacks.newCount} new • {summary.feedbacks.reviewedCount} reviewed • {summary.feedbacks.resolvedCount} resolved
          </p>
        </div>
        <div className="mt-3 pt-2.5 border-t border-brand-border/40 flex items-start gap-1.5 text-[10px] text-brand-text-muted">
          <Info className="w-3 h-3 text-brand-text-muted shrink-0 mt-0.5" aria-hidden="true" />
          <span>Private direct feedback from touchpoints.</span>
        </div>
      </Card>

      {/* 3. Average Rating */}
      <Card className="p-4 relative flex flex-col justify-between overflow-hidden shadow-xs">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-text-secondary font-medium">Average Rating</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-brand-text-primary tracking-tight">
              {hasRatings ? summary.ratings.averageRating.toFixed(1) : '—'}
            </span>
            {hasRatings && (
              <span className="text-xs font-semibold text-brand-text-secondary">/ 5.0</span>
            )}
          </div>
          <p className="text-[11px] text-brand-text-muted mt-1">
            {hasRatings
              ? `Across ${summary.ratings.totalRatings} customer rating${summary.ratings.totalRatings === 1 ? '' : 's'}`
              : 'No ratings submitted in period'}
          </p>
        </div>
        <div className="mt-3 pt-2.5 border-t border-brand-border/40 flex items-start gap-1.5 text-[10px] text-brand-text-muted">
          <Info className="w-3 h-3 text-brand-text-muted shrink-0 mt-0.5" aria-hidden="true" />
          <span>Calculated from verified customer submissions.</span>
        </div>
      </Card>

      {/* 4. Google Review Clicks */}
      <Card className="p-4 relative flex flex-col justify-between overflow-hidden shadow-xs">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-text-secondary font-medium">Google Review Taps</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-brand-text-primary tracking-tight">
              {summary.engagement.googleReviewClicks.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-brand-text-muted mt-1">
            Patron taps on public Google Review button
          </p>
        </div>
        <div className="mt-3 pt-2.5 border-t border-brand-border/40 flex items-start gap-1.5 text-[10px] text-brand-text-muted">
          <Info className="w-3 h-3 text-brand-text-muted shrink-0 mt-0.5" aria-hidden="true" />
          <span>External review link taps, not verified posted reviews.</span>
        </div>
      </Card>
    </div>
  );
}
