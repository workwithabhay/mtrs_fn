import * as React from 'react';
import Link from 'next/link';
import { QrCode, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CampaignEmptyStateProps {
  onResetFilter?: () => void;
  isFiltered?: boolean;
}

export function CampaignEmptyState({ onResetFilter, isFiltered }: CampaignEmptyStateProps) {
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-brand-border bg-brand-surface/40">
        <div className="w-12 h-12 rounded-xl bg-brand-surface-raised flex items-center justify-center text-brand-text-secondary mb-4 border border-brand-border">
          <QrCode className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-brand-text-primary mb-1">
          No campaigns match your filter
        </h3>
        <p className="text-sm text-brand-text-secondary max-w-sm mb-6">
          Try adjusting your status filter or search parameters to view your campaigns.
        </p>
        {onResetFilter && (
          <Button variant="secondary" size="sm" onClick={onResetFilter}>
            Clear filter
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-brand-border bg-brand-surface/40">
      <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mb-4 shadow-sm">
        <QrCode className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-brand-text-primary mb-2">
        Create Your First QR Touchpoint
      </h3>

      <p className="text-sm text-brand-text-secondary max-w-md mb-6 leading-relaxed">
        Generate custom, multi-format QR codes for table tents, counters, window stickers, or receipts.
        Customers scan with their phone camera to leave direct Google reviews or share private feedback.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button asChild variant="primary" size="md">
          <Link href="/dashboard/campaigns/new">
            <Plus className="w-4 h-4 mr-2" />
            Create QR Campaign
          </Link>
        </Button>
      </div>

      <div className="mt-8 pt-6 border-t border-brand-border/60 flex flex-wrap items-center justify-center gap-6 text-xs text-brand-text-muted">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
          <span>Vector SVG (infinite scale)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
          <span>High-Res 600px PNG</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
          <span>Printable A4 PDF Sheet</span>
        </div>
      </div>
    </div>
  );
}
