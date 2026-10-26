import * as React from 'react';
import Link from 'next/link';
import { Plus, RefreshCw, AlertCircle, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { CampaignCard } from './campaign-card';
import { CampaignEmptyState } from './campaign-empty-state';
import { listCampaigns, deactivateCampaign } from '@/lib/api/campaigns';
import type { QrCampaign, QrCampaignStatus } from '@/lib/api/types';

export function CampaignList() {
  const [campaigns, setCampaigns] = React.useState<QrCampaign[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | QrCampaignStatus>('all');
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(1);
  const [totalCount, setTotalCount] = React.useState<number>(0);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await listCampaigns({
        page: currentPage,
        limit: 9,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });

      setCampaigns(res.campaigns);
      setTotalPages(res.meta.totalPages);
      setTotalCount(res.meta.total);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to load QR campaigns.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter]);

  React.useEffect(() => {
    let isMounted = true;

    listCampaigns({
      page: currentPage,
      limit: 9,
      status: statusFilter === 'all' ? undefined : statusFilter,
    })
      .then((res) => {
        if (!isMounted) return;
        setCampaigns(res.campaigns);
        setTotalPages(res.meta.totalPages);
        setTotalCount(res.meta.total);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Unable to load QR campaigns.';
        setError(msg);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentPage, statusFilter]);

  const handleDeactivate = async (id: string) => {
    try {
      await deactivateCampaign(id);
      // Update local state smoothly
      setCampaigns((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: 'inactive' } : c)),
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to deactivate campaign.';
      alert(msg);
    }
  };

  const filteredCampaigns = React.useMemo(() => {
    if (!searchQuery.trim()) return campaigns;
    const q = searchQuery.toLowerCase();
    return campaigns.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.heading.toLowerCase().includes(q) ||
        c.publicToken.toLowerCase().includes(q),
    );
  }, [campaigns, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-text-primary tracking-tight">
            Your QR Campaigns
          </h2>
          <p className="text-xs text-brand-text-secondary mt-0.5">
            Manage multi-format touchpoint QR codes and monitor physical scan touchpoints.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={loadData}
            disabled={isLoading}
            aria-label="Refresh campaigns list"
            className="text-brand-text-secondary hover:text-brand-text-primary h-9"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

          <Button asChild variant="primary" size="sm" className="h-9">
            <Link href="/dashboard/campaigns/new">
              <Plus className="w-4 h-4 mr-1.5" />
              Create QR Campaign
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-brand-surface border border-brand-border">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Search campaigns by title or heading..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leadingIcon={<Search className="w-4 h-4" />}
            className="h-9 text-xs"
            aria-label="Search campaigns"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-text-muted flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          <div className="flex items-center gap-1 bg-brand-surface-raised p-1 rounded-lg border border-brand-border text-xs">
            {(['all', 'active', 'inactive'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-brand-text-secondary hover:text-brand-text-primary'
                }`}
                aria-pressed={statusFilter === status}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          role="status"
          aria-label="Loading QR campaigns"
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-5 rounded-xl border border-brand-border bg-brand-surface space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2 w-3/4">
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                  <Skeleton className="h-3.5 w-1/2 rounded-md" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-12 w-full rounded-md" />
              <div className="flex gap-2">
                <Skeleton className="h-8 flex-1 rounded-md" />
                <Skeleton className="h-8 flex-1 rounded-md" />
                <Skeleton className="h-8 flex-1 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recoverable Error State */}
      {!isLoading && error && (
        <div
          className="p-6 rounded-2xl bg-brand-error/10 border border-brand-error/20 flex flex-col items-center justify-center text-center space-y-3"
          role="alert"
        >
          <AlertCircle className="w-8 h-8 text-brand-error" />
          <h3 className="text-base font-semibold text-brand-text-primary">
            Failed to load QR campaigns
          </h3>
          <p className="text-xs text-brand-text-secondary max-w-md">{error}</p>
          <Button variant="secondary" size="sm" onClick={loadData}>
            Try again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredCampaigns.length === 0 && (
        <CampaignEmptyState
          isFiltered={searchQuery.trim().length > 0 || statusFilter !== 'all'}
          onResetFilter={() => {
            setSearchQuery('');
            setStatusFilter('all');
          }}
        />
      )}

      {/* Campaign Cards Grid */}
      {!isLoading && !error && filteredCampaigns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign._id}
              campaign={campaign}
              onDeactivate={handleDeactivate}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-brand-border">
          <span className="text-xs text-brand-text-muted">
            Showing Page <strong className="text-brand-text-primary">{currentPage}</strong> of{' '}
            <strong className="text-brand-text-primary">{totalPages}</strong> ({totalCount} total)
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="text-xs h-8"
            >
              Previous
            </Button>

            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="text-xs h-8"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
