'use client';

import * as React from 'react';
import { Users, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomerStatsCards } from './customer-stats-cards';
import { CustomerFilters } from './customer-filters';
import { CustomerTable } from './customer-table';
import { CustomerEmptyState } from './customer-empty-state';
import { listCustomers } from '@/lib/api/customers';
import type {
  CustomerDirectoryItem,
  CustomerDirectoryStats,
} from '@/lib/api/types';

export function CustomerDirectory() {
  const [customers, setCustomers] = React.useState<CustomerDirectoryItem[]>([]);
  const [stats, setStats] = React.useState<CustomerDirectoryStats>({
    totalCustomers: 0,
    repeatCustomers: 0,
    averageRating: null,
  });
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);

  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'lastVisitedAt' | 'createdAt' | 'name'>(
    'lastVisitedAt',
  );
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Debounce search input by 300ms
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Manual refresh / retry handler
  const handleRefresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listCustomers({
        page,
        limit,
        search: debouncedSearch,
        sortBy,
        sortOrder,
      });
      setCustomers(res.customers);
      setStats(res.stats);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load customer directory.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, sortBy, sortOrder]);

  // Sync data with React 19 / ESLint 9 pattern
  React.useEffect(() => {
    let isMounted = true;

    listCustomers({
      page,
      limit,
      search: debouncedSearch,
      sortBy,
      sortOrder,
    })
      .then((res) => {
        if (!isMounted) return;
        setCustomers(res.customers);
        setStats(res.stats);
        setTotal(res.total);
        setTotalPages(res.totalPages);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Failed to load customer directory.';
        setError(msg);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [page, limit, debouncedSearch, sortBy, sortOrder]);

  function handleResetFilters() {
    setSearch('');
    setDebouncedSearch('');
    setSortBy('lastVisitedAt');
    setSortOrder('desc');
    setPage(1);
  }

  const isFiltered = debouncedSearch.trim().length > 0 || sortBy !== 'lastVisitedAt' || sortOrder !== 'desc';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-text-primary">
              Customers Directory
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
              <Users className="w-3 h-3" />
              Verified Patrons
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-brand-text-secondary">
            Verified customer profiles captured from your QR touchpoints, repeat visit counts, and sentiment trends.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleRefresh()}
          disabled={loading}
          className="text-xs h-9 px-3 gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <CustomerStatsCards stats={stats} loading={loading && customers.length === 0} />

      {/* Filter and Search Bar */}
      <CustomerFilters
        search={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={setSearch}
        onSortByChange={(val) => {
          setSortBy(val);
          setPage(1);
        }}
        onSortOrderChange={(val) => {
          setSortOrder(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Error state */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleRefresh()}
            className="text-xs h-7 px-2 bg-white dark:bg-slate-900"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && customers.length === 0 && !error && (
        <div className="rounded-2xl border border-brand-border bg-brand-surface p-8 space-y-4">
          <div className="h-6 w-1/4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-12 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"
              />
            ))}
          </div>
        </div>
      )}

      {/* Content Table or Empty State */}
      {!loading && customers.length === 0 && !error ? (
        <CustomerEmptyState
          isFiltered={isFiltered}
          onClearFilters={handleResetFilters}
        />
      ) : customers.length > 0 ? (
        <CustomerTable
          customers={customers}
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={(newPage) => setPage(newPage)}
        />
      ) : null}
    </div>
  );
}
