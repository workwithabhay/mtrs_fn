'use client';

import * as React from 'react';
import { Star, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedbackStatusBadge } from './feedback-status-badge';
import type { OwnerFeedbackItem, PaginationMeta } from '@/lib/api/types';
import { cn } from '@/lib/utils';

export interface FeedbackTableProps {
  feedbacks: OwnerFeedbackItem[];
  meta: PaginationMeta;
  onPageChange: (newPage: number) => void;
  onSelectFeedback: (item: OwnerFeedbackItem) => void;
}

export function FeedbackTable({
  feedbacks,
  meta,
  onPageChange,
  onSelectFeedback,
}: FeedbackTableProps) {
  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-brand-border bg-brand-surface shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-brand-border bg-slate-50/75 text-brand-text-secondary font-semibold uppercase tracking-wider text-[11px]">
              <th scope="col" className="py-3.5 px-4">Rating</th>
              <th scope="col" className="py-3.5 px-4">Customer</th>
              <th scope="col" className="py-3.5 px-4">Comments</th>
              <th scope="col" className="py-3.5 px-4">Touchpoint</th>
              <th scope="col" className="py-3.5 px-4">Status</th>
              <th scope="col" className="py-3.5 px-4">Date</th>
              <th scope="col" className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/60">
            {feedbacks.map((item) => {
              const customerName = item.customerId?.name || 'Customer';
              const campaignTitle =
                typeof item.qrCampaignId === 'object' && item.qrCampaignId?.title
                  ? item.qrCampaignId.title
                  : 'QR Stand';

              const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <tr
                  key={item._id}
                  onClick={() => onSelectFeedback(item)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  {/* Rating */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-brand-text-primary mr-1">{item.rating}</span>
                      <div className="flex items-center" aria-label={`${item.rating} stars`}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              'w-3.5 h-3.5',
                              star <= item.rating
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-slate-200 fill-transparent',
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-4">
                    <p className="font-semibold text-brand-text-primary">{customerName}</p>
                    {item.customerId?.email && (
                      <p className="text-[11px] text-brand-text-muted truncate max-w-[150px]">
                        {item.customerId.email}
                      </p>
                    )}
                  </td>

                  {/* Comments snippet */}
                  <td className="py-3 px-4 max-w-xs">
                    <p className="line-clamp-2 text-brand-text-secondary">
                      {item.text || <span className="italic text-brand-text-muted">No text provided</span>}
                    </p>
                  </td>

                  {/* Touchpoint */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-brand-text-secondary font-medium text-[11px]">
                      {campaignTitle}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <FeedbackStatusBadge status={item.status} />
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 whitespace-nowrap text-brand-text-secondary text-[11px]">
                    {formattedDate}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectFeedback(item);
                      }}
                      className="h-8 px-2 text-brand-primary"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (< md) */}
      <div className="md:hidden space-y-3">
        {feedbacks.map((item) => {
          const customerName = item.customerId?.name || 'Customer';
          const campaignTitle =
            typeof item.qrCampaignId === 'object' && item.qrCampaignId?.title
              ? item.qrCampaignId.title
              : 'QR Stand';

          const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={item._id}
              onClick={() => onSelectFeedback(item)}
              className="p-4 rounded-2xl border border-brand-border bg-brand-surface shadow-xs active:scale-[0.99] transition-all space-y-3 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'w-4 h-4',
                          star <= item.rating
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-200 fill-transparent',
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-xs text-brand-text-primary ml-1">{item.rating}/5</span>
                </div>

                <FeedbackStatusBadge status={item.status} />
              </div>

              {item.text && (
                <p className="text-xs text-brand-text-primary line-clamp-3 leading-relaxed">
                  {item.text}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-brand-border/40 text-[11px] text-brand-text-secondary">
                <span className="font-medium text-brand-text-primary">{customerName}</span>
                <span className="text-brand-text-muted">{formattedDate} • {campaignTitle}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 px-1 text-xs text-brand-text-secondary">
          <span>
            Page <strong className="text-brand-text-primary">{meta.page}</strong> of{' '}
            <strong className="text-brand-text-primary">{meta.totalPages}</strong> ({meta.total} total)
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => onPageChange(meta.page - 1)}
              className="h-8 px-2 text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              Previous
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => onPageChange(meta.page + 1)}
              className="h-8 px-2 text-xs"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
