'use client';

import * as React from 'react';
import { RefreshCw, AlertCircle, MessageSquare, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FeedbackFilters, type FeedbackFilterValues } from './feedback-filters';
import { FeedbackTable } from './feedback-table';
import { FeedbackEmptyState } from './feedback-empty-state';
import { FeedbackDetailDrawer } from './feedback-detail-drawer';
import { listOwnerFeedbacks } from '@/lib/api/feedback-inbox';
import type {
  OwnerFeedbackItem,
  PaginationMeta,
  ListOwnerFeedbackQuery,
} from '@/lib/api/types';

export function FeedbackInbox() {
  const [feedbacks, setFeedbacks] = React.useState<OwnerFeedbackItem[]>([]);
  const [meta, setMeta] = React.useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [filters, setFilters] = React.useState<FeedbackFilterValues>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [page, setPage] = React.useState<number>(1);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Detail Drawer State
  const [selectedFeedback, setSelectedFeedback] = React.useState<OwnerFeedbackItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);

  // Data loader for explicit user actions (e.g. Retry button)
  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const query: ListOwnerFeedbackQuery = {
      page,
      limit: 10,
      rating: filters.rating,
      status: filters.status,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };

    try {
      const res = await listOwnerFeedbacks(query);
      setFeedbacks(res.feedbacks);
      setMeta(res.meta);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load customer feedback.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [page, filters.rating, filters.status, filters.sortBy, filters.sortOrder]);

  // Sync data with React 19 / ESLint 9 pattern
  React.useEffect(() => {
    let isMounted = true;

    const query: ListOwnerFeedbackQuery = {
      page,
      limit: 10,
      rating: filters.rating,
      status: filters.status,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };

    listOwnerFeedbacks(query)
      .then((res) => {
        if (!isMounted) return;
        setFeedbacks(res.feedbacks);
        setMeta(res.meta);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Failed to load customer feedback.';
        setError(msg);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [page, filters.rating, filters.status, filters.sortBy, filters.sortOrder]);

  // Apply client-side search query on loaded page records
  const displayedFeedbacks = React.useMemo(() => {
    if (!filters.searchQuery || filters.searchQuery.trim().length === 0) {
      return feedbacks;
    }
    const q = filters.searchQuery.toLowerCase().trim();
    return feedbacks.filter((item) => {
      const name = (item.customerId?.name || '').toLowerCase();
      const text = (item.text || '').toLowerCase();
      const email = (item.customerId?.email || '').toLowerCase();
      return name.includes(q) || text.includes(q) || email.includes(q);
    });
  }, [feedbacks, filters.searchQuery]);

  const handleResetFilters = () => {
    setFilters({
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setPage(1);
  };

  const handleStatusUpdated = (updated: OwnerFeedbackItem) => {
    setFeedbacks((prev) => prev.map((f) => (f._id === updated._id ? updated : f)));
    if (selectedFeedback && selectedFeedback._id === updated._id) {
      setSelectedFeedback(updated);
    }
  };

  // Summary counts based on verified total and loaded data
  const hasEverReceivedFeedback = meta.total > 0 || feedbacks.length > 0;
  const isFiltered = Boolean(
    filters.rating !== undefined ||
      filters.status ||
      (filters.searchQuery && filters.searchQuery.trim().length > 0) ||
      filters.sortBy !== 'createdAt' ||
      filters.sortOrder !== 'desc',
  );

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-primary tracking-tight">
            Customer Feedback
          </h1>
          <p className="text-xs text-brand-text-secondary mt-1">
            Review customer sentiments, follow up with guests, and track your review recovery lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={loadData}
            disabled={isLoading}
            className="text-xs h-9"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <Card className="border-brand-error/20 bg-brand-error/10">
          <CardContent className="p-4 flex items-start justify-between gap-3 text-xs text-brand-error">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to load feedback</p>
                <p>{error}</p>
              </div>
            </div>

            <Button type="button" variant="secondary" size="sm" onClick={loadData} className="text-xs shrink-0">
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Summary KPI Strip (Truthful totals only) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-brand-border bg-brand-surface shadow-xs p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-text-secondary font-medium">Total Feedback</span>
            <MessageSquare className="w-4 h-4 text-brand-primary" />
          </div>
          <p className="text-2xl font-bold text-brand-text-primary mt-2">{meta.total}</p>
          <span className="text-[11px] text-brand-text-muted">Verified customer submissions</span>
        </Card>

        <Card className="border-brand-border bg-brand-surface shadow-xs p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-text-secondary font-medium">New Submissions</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-brand-text-primary mt-2">
            {feedbacks.filter((f) => f.status === 'new').length}
          </p>
          <span className="text-[11px] text-brand-text-muted">On active page awaiting review</span>
        </Card>

        <Card className="border-brand-border bg-brand-surface shadow-xs p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-text-secondary font-medium">Resolved Items</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-brand-text-primary mt-2">
            {feedbacks.filter((f) => f.status === 'resolved').length}
          </p>
          <span className="text-[11px] text-brand-text-muted">Marked resolved on active page</span>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <FeedbackFilters
        filters={filters}
        onChange={(next) => {
          setFilters(next);
          setPage(1);
        }}
        onReset={handleResetFilters}
        totalResults={meta.total}
      />

      {/* Data Views */}
      {isLoading ? (
        <div className="space-y-3" role="status" aria-label="Loading feedback records">
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      ) : displayedFeedbacks.length === 0 ? (
        <FeedbackEmptyState
          isFiltered={isFiltered || hasEverReceivedFeedback}
          onResetFilters={isFiltered ? handleResetFilters : undefined}
        />
      ) : (
        <FeedbackTable
          feedbacks={displayedFeedbacks}
          meta={meta}
          onPageChange={(nextPage) => setPage(nextPage)}
          onSelectFeedback={(item) => {
            setSelectedFeedback(item);
            setIsDrawerOpen(true);
          }}
        />
      )}

      {/* Detail Drawer */}
      <FeedbackDetailDrawer
        feedback={selectedFeedback}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onStatusUpdated={handleStatusUpdated}
      />
    </div>
  );
}
