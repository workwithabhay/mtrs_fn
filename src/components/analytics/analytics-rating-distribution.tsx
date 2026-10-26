'use client';

import * as React from 'react';
import { Star, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { AnalyticsRatingsBreakdownResponse } from '@/lib/api/types';

interface AnalyticsRatingDistributionProps {
  ratings: AnalyticsRatingsBreakdownResponse;
}

export function AnalyticsRatingDistribution({ ratings }: AnalyticsRatingDistributionProps) {
  const hasRatings = ratings.totalRatings > 0;

  // Sort stars in descending order: 5 down to 1
  const sortedBreakdown = [...ratings.breakdown].sort((a, b) => b.star - a.star);

  return (
    <Card className="shadow-xs overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" aria-hidden="true" />
          <CardTitle className="text-base font-bold">Rating Distribution</CardTitle>
        </div>
        <CardDescription className="text-xs text-brand-text-secondary mt-0.5">
          Breakdown of customer sentiments across 1 to 5 star ratings.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Score Summary */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-brand-border/60">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-brand-text-primary">
                {hasRatings ? ratings.averageRating.toFixed(1) : '—'}
              </span>
              <span className="text-xs text-brand-text-muted font-medium">/ 5.0</span>
            </div>
            <p className="text-[11px] text-brand-text-secondary mt-0.5">
              {hasRatings
                ? `Based on ${ratings.totalRatings} verified customer review${ratings.totalRatings === 1 ? '' : 's'}`
                : 'No customer ratings in this period'}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = hasRatings && star <= Math.round(ratings.averageRating);
              return (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                  }`}
                  aria-hidden="true"
                />
              );
            })}
          </div>
        </div>

        {/* 5-to-1 Star Progress Bars */}
        {!hasRatings ? (
          <div className="py-6 text-center text-xs text-brand-text-muted">
            No star ratings received yet for the selected timeframe.
          </div>
        ) : (
          <div className="space-y-2.5">
            {sortedBreakdown.map((item) => (
              <div key={item.star} className="flex items-center gap-3 text-xs">
                {/* Star Label */}
                <span className="w-12 flex items-center gap-1 font-semibold text-brand-text-primary shrink-0">
                  <span>{item.star}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                </span>

                {/* Progress Bar Container */}
                <div
                  role="progressbar"
                  aria-label={`${item.star} stars rating distribution`}
                  aria-valuenow={item.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      item.star >= 4
                        ? 'bg-emerald-500'
                        : item.star === 3
                        ? 'bg-amber-400'
                        : 'bg-rose-400'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                {/* Percent & Count */}
                <span className="w-16 text-right font-mono text-brand-text-secondary text-[11px] shrink-0">
                  {item.percentage.toFixed(1)}% <span className="text-brand-text-muted">({item.count})</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
