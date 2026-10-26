import * as React from 'react';
import Link from 'next/link';
import { MessageSquareOff, QrCode, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FeedbackEmptyStateProps {
  isFiltered?: boolean;
  onResetFilters?: () => void;
}

export function FeedbackEmptyState({
  isFiltered = false,
  onResetFilters,
}: FeedbackEmptyStateProps) {
  if (isFiltered) {
    return (
      <Card className="border-brand-border bg-brand-surface shadow-xs">
        <CardContent className="p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-brand-text-muted flex items-center justify-center mx-auto">
            <MessageSquareOff className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-brand-text-primary">
              No Feedback Matches Selected Filters
            </h3>
            <p className="text-xs text-brand-text-secondary max-w-sm mx-auto leading-relaxed">
              Try adjusting your rating, status, or search keywords to view other customer responses.
            </p>
          </div>
          {onResetFilters && (
            <div className="pt-2">
              <Button type="button" variant="secondary" size="sm" onClick={onResetFilters}>
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                <span>Reset Filters</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-brand-border bg-brand-surface shadow-xs">
      <CardContent className="p-12 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto shadow-inner">
          <QrCode className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-brand-text-primary">
            No Customer Feedback Yet
          </h3>
          <p className="text-xs text-brand-text-secondary max-w-md mx-auto leading-relaxed">
            Your private feedback inbox is ready. Once customers scan your QR touchpoints (on tables, receipts, or counters), their ratings and comments will appear here instantly.
          </p>
        </div>
        <div className="pt-2">
          <Button asChild variant="primary" size="md">
            <Link href="/dashboard/campaigns">
              <QrCode className="w-4 h-4 mr-2" />
              Manage QR Campaigns
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
