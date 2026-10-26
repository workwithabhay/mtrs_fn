'use client';

import * as React from 'react';
import {
  X,
  Star,
  User,
  Mail,
  Phone,
  Calendar,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FeedbackStatusBadge } from './feedback-status-badge';
import { updateOwnerFeedbackStatus } from '@/lib/api/feedback-inbox';
import type { OwnerFeedbackItem, FeedbackLifecycleStatus } from '@/lib/api/types';
import { cn } from '@/lib/utils';

export interface FeedbackDetailDrawerProps {
  feedback: OwnerFeedbackItem | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: (updated: OwnerFeedbackItem) => void;
}

export function FeedbackDetailDrawer({
  feedback,
  isOpen,
  onClose,
  onStatusUpdated,
}: FeedbackDetailDrawerProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState<boolean>(false);
  const [statusError, setStatusError] = React.useState<string | null>(null);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !feedback) {
    return null;
  }

  const handleStatusChange = async (nextStatus: FeedbackLifecycleStatus) => {
    if (nextStatus === feedback.status || isUpdatingStatus) return;

    setIsUpdatingStatus(true);
    setStatusError(null);

    try {
      const updated = await updateOwnerFeedbackStatus(feedback._id, nextStatus);
      onStatusUpdated(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update feedback status.';
      setStatusError(msg);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const customer = feedback.customerId || { name: 'Anonymous Customer' };
  const campaignTitle =
    typeof feedback.qrCampaignId === 'object' && feedback.qrCampaignId?.title
      ? feedback.qrCampaignId.title
      : 'QR Touchpoint';

  const formattedDate = new Date(feedback.createdAt).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-brand-surface rounded-2xl border border-brand-border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <h2 id="feedback-detail-title" className="text-base font-bold text-brand-text-primary tracking-tight">
              Customer Feedback Record
            </h2>
            <FeedbackStatusBadge status={feedback.status} />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close feedback detail"
            className="w-8 h-8 p-0 rounded-full text-brand-text-secondary hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-left">
          {statusError && (
            <div role="alert" className="p-3 rounded-xl bg-brand-error/10 border border-brand-error/20 flex items-center gap-2 text-xs text-brand-error">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{statusError}</span>
            </div>
          )}

          {/* Customer & Rating Overview Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-brand-border bg-slate-50/50 p-4 shadow-none">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-brand-text-secondary">
                  <User className="w-3.5 h-3.5" />
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Customer Details</span>
                </div>
                <p className="text-sm font-bold text-brand-text-primary">{customer.name}</p>
                <div className="space-y-1 text-xs text-brand-text-secondary">
                  {customer.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-brand-text-muted" />
                      <a href={`mailto:${customer.email}`} className="text-brand-primary hover:underline truncate">
                        {customer.email}
                      </a>
                    </div>
                  )}
                  {customer.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-brand-text-muted" />
                      <a href={`tel:${customer.phone}`} className="text-brand-primary hover:underline">
                        {customer.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card className="border-brand-border bg-slate-50/50 p-4 shadow-none">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-brand-text-secondary">
                  <Star className="w-3.5 h-3.5" />
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Experience Rating</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center" aria-label={`${feedback.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'w-4 h-4',
                          star <= feedback.rating
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-200 fill-transparent',
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-brand-text-primary">
                    {feedback.rating}/5 Stars
                  </span>
                </div>
                <div className="space-y-1 text-xs text-brand-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-brand-text-muted" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <QrCode className="w-3 h-3 text-brand-text-muted" />
                    <span>Touchpoint: {campaignTitle}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Feedback Commentary */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
              Customer Feedback Text
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-brand-border/80 text-sm text-brand-text-primary leading-relaxed whitespace-pre-wrap">
              {feedback.text || (
                <span className="italic text-brand-text-muted">
                  No written comments provided with this rating.
                </span>
              )}
            </div>
          </div>

          {/* Business Question Answers */}
          {feedback.answers && feedback.answers.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                Touchpoint Questions & Answers
              </h3>
              <div className="border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden bg-brand-surface">
                {feedback.answers.map((ans, idx) => (
                  <div key={idx} className="p-3 text-xs space-y-1">
                    <p className="font-semibold text-brand-text-secondary">{ans.questionLabel}</p>
                    <p className="font-medium text-brand-text-primary">{ans.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lifecycle Status Management */}
          <div className="p-4 rounded-xl bg-brand-surface border border-brand-border space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-brand-text-primary">Manage Feedback Status</h4>
                <p className="text-[11px] text-brand-text-secondary">
                  Update this record as your team reviews and resolves customer concerns.
                </p>
              </div>

              {isUpdatingStatus && <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={feedback.status === 'new' ? 'primary' : 'secondary'}
                size="sm"
                disabled={isUpdatingStatus || feedback.status === 'new'}
                onClick={() => handleStatusChange('new')}
                className="text-xs h-8"
              >
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                Mark as New
              </Button>

              <Button
                type="button"
                variant={feedback.status === 'reviewed' ? 'primary' : 'secondary'}
                size="sm"
                disabled={isUpdatingStatus || feedback.status === 'reviewed'}
                onClick={() => handleStatusChange('reviewed')}
                className="text-xs h-8"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                Mark as Reviewed
              </Button>

              <Button
                type="button"
                variant={feedback.status === 'resolved' ? 'primary' : 'secondary'}
                size="sm"
                disabled={isUpdatingStatus || feedback.status === 'resolved'}
                onClick={() => handleStatusChange('resolved')}
                className="text-xs h-8"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                Mark as Resolved
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-brand-border bg-slate-50/50 flex justify-end shrink-0">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
