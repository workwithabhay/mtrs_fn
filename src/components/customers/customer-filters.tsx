'use client';

import * as React from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface CustomerFiltersProps {
  search: string;
  sortBy: 'lastVisitedAt' | 'createdAt' | 'name';
  sortOrder: 'asc' | 'desc';
  onSearchChange: (search: string) => void;
  onSortByChange: (sortBy: 'lastVisitedAt' | 'createdAt' | 'name') => void;
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
  onReset: () => void;
}

export function CustomerFilters({
  search,
  sortBy,
  sortOrder,
  onSearchChange,
  onSortByChange,
  onSortOrderChange,
  onReset,
}: CustomerFiltersProps) {
  const isFiltered = search.trim().length > 0 || sortBy !== 'lastVisitedAt' || sortOrder !== 'desc';

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-brand-surface p-3 sm:p-4 rounded-2xl border border-brand-border">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary"
          aria-hidden="true"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email, or phone..."
          aria-label="Search customers"
          className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-brand-border bg-slate-50/50 dark:bg-slate-900/50 text-brand-text-primary placeholder:text-brand-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-brand-text-secondary hover:text-brand-text-primary"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Sorting Controls */}
      <div className="flex items-center gap-2">
        <label htmlFor="customer-sort-by" className="sr-only">
          Sort customers by
        </label>
        <select
          id="customer-sort-by"
          value={sortBy}
          onChange={(e) =>
            onSortByChange(e.target.value as 'lastVisitedAt' | 'createdAt' | 'name')
          }
          className="text-xs py-2 px-3 rounded-xl border border-brand-border bg-slate-50/50 dark:bg-slate-900/50 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all"
        >
          <option value="lastVisitedAt">Last Visited</option>
          <option value="createdAt">Date Joined</option>
          <option value="name">Name</option>
        </select>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="text-xs h-9 px-3 gap-1.5"
          title={`Order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{sortOrder === 'asc' ? 'Asc' : 'Desc'}</span>
        </Button>

        {isFiltered && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs text-brand-text-secondary hover:text-brand-text-primary h-9 px-2.5"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
