'use client';

import * as React from 'react';
import { Star, Mail, Phone, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CustomerDirectoryItem } from '@/lib/api/types';

export interface CustomerTableProps {
  customers: CustomerDirectoryItem[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

export function CustomerTable({
  customers,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: CustomerTableProps) {
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-brand-border bg-brand-surface shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-brand-border bg-slate-50/75 dark:bg-slate-900/50 text-brand-text-secondary font-semibold uppercase tracking-wider text-[11px]">
              <th scope="col" className="py-3.5 px-4">Customer</th>
              <th scope="col" className="py-3.5 px-4">Contact</th>
              <th scope="col" className="py-3.5 px-4">Loyalty Status</th>
              <th scope="col" className="py-3.5 px-4">Submissions</th>
              <th scope="col" className="py-3.5 px-4">Avg Rating</th>
              <th scope="col" className="py-3.5 px-4">Last Visited</th>
              <th scope="col" className="py-3.5 px-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/60">
            {customers.map((customer) => {
              const initials = getInitials(customer.name);
              return (
                <tr
                  key={customer.id || customer._id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Customer info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary font-semibold flex items-center justify-center text-xs shrink-0">
                        {initials}
                      </div>
                      <div className="font-medium text-brand-text-primary text-xs">
                        {customer.name}
                      </div>
                    </div>
                  </td>

                  {/* Contact info */}
                  <td className="py-3.5 px-4 text-brand-text-secondary">
                    <div className="space-y-1">
                      {customer.email ? (
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                          <span className="truncate max-w-[180px]">{customer.email}</span>
                        </div>
                      ) : null}
                      {customer.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                          <span>{customer.phone}</span>
                        </div>
                      ) : null}
                      {!customer.email && !customer.phone && (
                        <span className="text-slate-400 italic">No contact provided</span>
                      )}
                    </div>
                  </td>

                  {/* Status badge */}
                  <td className="py-3.5 px-4">
                    {customer.isRepeat ? (
                      <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                        Repeat Patron
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-slate-600 dark:text-slate-400">
                        First-Time
                      </Badge>
                    )}
                  </td>

                  {/* Submissions count */}
                  <td className="py-3.5 px-4 text-brand-text-primary font-medium">
                    {customer.feedbackCount}{' '}
                    <span className="text-brand-text-secondary font-normal">
                      {customer.feedbackCount === 1 ? 'review' : 'reviews'}
                    </span>
                  </td>

                  {/* Avg Rating */}
                  <td className="py-3.5 px-4">
                    {customer.avgRating !== null ? (
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" aria-hidden="true" />
                        <span className="font-semibold text-brand-text-primary">
                          {customer.avgRating}
                        </span>
                        <span className="text-[11px] text-brand-text-secondary">/ 5</span>
                      </div>
                    ) : (
                      <span className="text-brand-text-secondary italic">None</span>
                    )}
                  </td>

                  {/* Last Visited */}
                  <td className="py-3.5 px-4 text-brand-text-secondary">
                    {formatDate(customer.lastVisitedAt)}
                  </td>

                  {/* Joined Date */}
                  <td className="py-3.5 px-4 text-brand-text-secondary">
                    {formatDate(customer.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {customers.map((customer) => {
          const initials = getInitials(customer.name);
          return (
            <div
              key={customer.id || customer._id}
              className="rounded-2xl border border-brand-border bg-brand-surface p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-primary/10 text-brand-primary font-semibold flex items-center justify-center text-xs shrink-0">
                    {initials}
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-text-primary text-xs">
                      {customer.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-brand-text-secondary mt-0.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Visited {formatDate(customer.lastVisitedAt)}</span>
                    </div>
                  </div>
                </div>
                {customer.isRepeat ? (
                  <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 text-[10px]">
                    Repeat
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-slate-600 dark:text-slate-400 text-[10px]">
                    First-Time
                  </Badge>
                )}
              </div>

              {/* Contact info */}
              <div className="space-y-1 text-xs text-brand-text-secondary pt-1 border-t border-brand-border/50">
                {customer.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{customer.phone}</span>
                  </div>
                )}
              </div>

              {/* Submissions & Rating */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-brand-border/50">
                <span className="text-brand-text-secondary">
                  {customer.feedbackCount}{' '}
                  {customer.feedbackCount === 1 ? 'feedback submission' : 'submissions'}
                </span>
                {customer.avgRating !== null ? (
                  <div className="flex items-center gap-1 font-semibold text-brand-text-primary">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{customer.avgRating} / 5</span>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">No score</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-brand-text-secondary">
            Showing <span className="font-medium text-brand-text-primary">{startIndex}</span> to{' '}
            <span className="font-medium text-brand-text-primary">{endIndex}</span> of{' '}
            <span className="font-medium text-brand-text-primary">{total}</span> customers
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="text-xs h-8 px-2.5 gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </Button>

            <span className="text-xs text-brand-text-secondary px-2">
              Page {page} of {totalPages}
            </span>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="text-xs h-8 px-2.5 gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
