'use client';

import * as React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { AnalyticsDateSelector } from './analytics-date-selector';
import { AnalyticsKpiCards } from './analytics-kpi-cards';
import { AnalyticsTrendChart } from './analytics-trend-chart';
import { AnalyticsRatingDistribution } from './analytics-rating-distribution';
import { AnalyticsCampaignTable } from './analytics-campaign-table';
import {
  getAnalyticsSummary,
  getAnalyticsTrends,
  getRatingsBreakdown,
  getCampaignPerformance,
} from '@/lib/api/analytics';
import type {
  AnalyticsDateRange,
  AnalyticsSummaryResponse,
  AnalyticsTrendsResponse,
  AnalyticsRatingsBreakdownResponse,
  AnalyticsCampaignPerformanceResponse,
} from '@/lib/api/types';

export function AnalyticsDashboard() {
  const [selectedRange, setSelectedRange] = React.useState<AnalyticsDateRange>('30d');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [summary, setSummary] = React.useState<AnalyticsSummaryResponse | null>(null);
  const [trends, setTrends] = React.useState<AnalyticsTrendsResponse | null>(null);
  const [ratings, setRatings] = React.useState<AnalyticsRatingsBreakdownResponse | null>(null);
  const [campaigns, setCampaigns] = React.useState<AnalyticsCampaignPerformanceResponse | null>(null);

  React.useEffect(() => {
    let isCancelled = false;

    async function fetchData() {
      try {
        const [sumRes, trendRes, ratingRes, campRes] = await Promise.all([
          getAnalyticsSummary(selectedRange),
          getAnalyticsTrends(selectedRange),
          getRatingsBreakdown(selectedRange),
          getCampaignPerformance(selectedRange),
        ]);

        if (isCancelled) return;
        setSummary(sumRes);
        setTrends(trendRes);
        setRatings(ratingRes);
        setCampaigns(campRes);
        setError(null);
      } catch (err: unknown) {
        if (isCancelled) return;
        const message =
          err instanceof Error ? err.message : 'Unable to load analytics data from server.';
        setError(message);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    }

    void fetchData();

    return () => {
      isCancelled = true;
    };
  }, [selectedRange]);

  const handleRangeChange = (newRange: AnalyticsDateRange) => {
    setIsLoading(true);
    setSelectedRange(newRange);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setError(null);
    void (async () => {
      try {
        const [sumRes, trendRes, ratingRes, campRes] = await Promise.all([
          getAnalyticsSummary(selectedRange),
          getAnalyticsTrends(selectedRange),
          getRatingsBreakdown(selectedRange),
          getCampaignPerformance(selectedRange),
        ]);
        setSummary(sumRes);
        setTrends(trendRes);
        setRatings(ratingRes);
        setCampaigns(campRes);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Unable to load analytics data from server.';
        setError(message);
      } finally {
        setIsRefreshing(false);
      }
    })();
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    void (async () => {
      try {
        const [sumRes, trendRes, ratingRes, campRes] = await Promise.all([
          getAnalyticsSummary(selectedRange),
          getAnalyticsTrends(selectedRange),
          getRatingsBreakdown(selectedRange),
          getCampaignPerformance(selectedRange),
        ]);
        setSummary(sumRes);
        setTrends(trendRes);
        setRatings(ratingRes);
        setCampaigns(campRes);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Unable to load analytics data from server.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-primary tracking-tight">
            Analytics & Performance
          </h1>
          <p className="text-xs text-brand-text-secondary mt-1">
            Real customer feedback volume, QR touchpoint engagement, and rating distribution metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            className="text-xs h-9 gap-1.5"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 mr-1 ${isRefreshing ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <AnalyticsDateSelector
        selectedRange={selectedRange}
        onChange={handleRangeChange}
        period={summary?.period}
        disabled={isLoading || isRefreshing}
      />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6" role="status" aria-label="Loading analytics data">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-72 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <Card className="p-8 text-center border-red-200 bg-red-50/40">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="text-sm font-bold text-brand-text-primary">Unable to Load Analytics</h2>
          <p className="text-xs text-brand-text-secondary mt-1 max-w-md mx-auto">{error}</p>
          <Button
            type="button"
            size="sm"
            onClick={handleRetry}
            className="mt-4 text-xs"
          >
            Try Again
          </Button>
        </Card>
      )}

      {/* Loaded Content */}
      {!isLoading && !error && summary && (
        <>
          {/* KPI Cards */}
          <AnalyticsKpiCards summary={summary} />

          {/* Activity Trend Chart */}
          {trends && <AnalyticsTrendChart trends={trends.trends} period={trends.period} />}

          {/* Rating Distribution and Campaign Performance Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rating Distribution (1 col on large screens) */}
            <div className="lg:col-span-1">
              {ratings && <AnalyticsRatingDistribution ratings={ratings} />}
            </div>

            {/* Campaign Performance Table (2 cols on large screens) */}
            <div className="lg:col-span-2">
              {campaigns && <AnalyticsCampaignTable campaigns={campaigns.campaigns} />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
