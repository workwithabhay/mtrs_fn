'use client';

import * as React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import type { FeedbackLifecycleStatus } from '@/lib/api/types';

export interface FeedbackFilterValues {
  rating?: number;
  status?: FeedbackLifecycleStatus;
  sortBy?: 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
  searchQuery?: string;
}

export interface FeedbackFiltersProps {
  filters: FeedbackFilterValues;
  onChange: (nextFilters: FeedbackFilterValues) => void;
  onReset: () => void;
  totalResults: number;
}

export function FeedbackFilters({
  filters,
  onChange,
  onReset,
  totalResults,
}: FeedbackFiltersProps) {
  const hasActiveFilters = Boolean(
    filters.rating !== undefined ||
      filters.status ||
      (filters.searchQuery && filters.searchQuery.trim().length > 0) ||
      filters.sortBy !== 'createdAt' ||
      filters.sortOrder !== 'desc',
  );

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const num = val === 'all' ? undefined : parseInt(val, 10);
    onChange({ ...filters, rating: num });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const st = val === 'all' ? undefined : (val as FeedbackLifecycleStatus);
    onChange({ ...filters, status: st });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    switch (val) {
      case 'newest':
        onChange({ ...filters, sortBy: 'createdAt', sortOrder: 'desc' });
        break;
      case 'oldest':
        onChange({ ...filters, sortBy: 'createdAt', sortOrder: 'asc' });
        break;
      case 'highest_rating':
        onChange({ ...filters, sortBy: 'rating', sortOrder: 'desc' });
        break;
      case 'lowest_rating':
        onChange({ ...filters, sortBy: 'rating', sortOrder: 'asc' });
        break;
      default:
        onChange({ ...filters, sortBy: 'createdAt', sortOrder: 'desc' });
    }
  };

  const currentSortValue =
    filters.sortBy === 'rating'
      ? filters.sortOrder === 'asc'
        ? 'lowest_rating'
        : 'highest_rating'
      : filters.sortOrder === 'asc'
        ? 'oldest'
        : 'newest';

  return (
    <div className="space-y-4 bg-brand-surface p-4 sm:p-5 rounded-2xl border border-brand-border shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Search */}
        <div className="lg:col-span-1">
          <Input
            id="feedback-search"
            placeholder="Search name or comments..."
            value={filters.searchQuery || ''}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            leadingIcon={<Search className="w-4 h-4 text-brand-text-muted" />}
            className="h-10 text-xs"
          />
        </div>

        {/* Rating Filter */}
        <div>
          <Select
            id="filter-rating"
            value={filters.rating !== undefined ? filters.rating.toString() : 'all'}
            onChange={handleRatingChange}
            options={[
              { value: 'all', label: 'All Ratings' },
              { value: '5', label: '5 Stars ★★★★★' },
              { value: '4', label: '4 Stars ★★★★☆' },
              { value: '3', label: '3 Stars ★★★☆☆' },
              { value: '2', label: '2 Stars ★★☆☆☆' },
              { value: '1', label: '1 Star ★☆☆☆☆' },
            ]}
            className="h-10 text-xs"
          />
        </div>

        {/* Status Filter */}
        <div>
          <Select
            id="filter-status"
            value={filters.status || 'all'}
            onChange={handleStatusChange}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'new', label: 'New' },
              { value: 'reviewed', label: 'Reviewed' },
              { value: 'resolved', label: 'Resolved' },
            ]}
            className="h-10 text-xs"
          />
        </div>

        {/* Sort Order */}
        <div>
          <Select
            id="filter-sort"
            value={currentSortValue}
            onChange={handleSortChange}
            options={[
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
              { value: 'highest_rating', label: 'Highest Rating' },
              { value: 'lowest_rating', label: 'Lowest Rating' },
            ]}
            className="h-10 text-xs"
          />
        </div>
      </div>

      {/* Filter Status Bar */}
      <div className="flex items-center justify-between pt-1 text-xs text-brand-text-secondary border-t border-brand-border/40">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-brand-text-muted" />
          <span>
            Showing <strong className="text-brand-text-primary font-semibold">{totalResults}</strong> records
          </span>
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs h-7 text-brand-text-secondary hover:text-brand-text-primary"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
}
