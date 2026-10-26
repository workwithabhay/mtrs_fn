import * as React from 'react';
import Link from 'next/link';
import { Eye, Calendar, BarChart2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QrDownloadActions } from './qr-download-actions';
import type { QrCampaign } from '@/lib/api/types';

interface CampaignCardProps {
  campaign: QrCampaign;
  onDeactivate?: (id: string) => Promise<void>;
}

export function CampaignCard({ campaign, onDeactivate }: CampaignCardProps) {
  const [isDeactivating, setIsDeactivating] = React.useState(false);

  const formattedDate = React.useMemo(() => {
    try {
      return new Date(campaign.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return campaign.createdAt;
    }
  }, [campaign.createdAt]);

  const handleDeactivate = async () => {
    if (!onDeactivate || isDeactivating) return;
    const confirmed = window.confirm(`Are you sure you want to deactivate "${campaign.title}"? Deactivated campaigns will stop accepting scans.`);
    if (!confirmed) return;

    setIsDeactivating(true);
    try {
      await onDeactivate(campaign._id);
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <Card className="border-brand-border bg-brand-surface hover:border-brand-primary/30 transition-colors flex flex-col justify-between shadow-xs">
      <div>
        <CardHeader className="pb-3 border-b border-brand-border/60">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-brand-text-primary line-clamp-1">
                  {campaign.title}
                </CardTitle>
              </div>
              <p className="text-xs font-medium text-brand-primary line-clamp-1">
                {campaign.heading}
              </p>
            </div>

            <Badge variant={campaign.status === 'active' ? 'success' : 'secondary'} hasDot>
              {campaign.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-3 pb-3 space-y-3">
          {campaign.description && (
            <p className="text-xs text-brand-text-secondary line-clamp-2 leading-relaxed">
              {campaign.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-brand-text-muted">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                <strong className="text-brand-text-primary font-semibold">{campaign.scanCount}</strong> scans
              </span>
            </div>
          </div>

          {/* Color swatch & token snippet */}
          <div className="flex items-center justify-between text-[11px] text-brand-text-muted pt-1 border-t border-brand-border/40">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                style={{ backgroundColor: campaign.branding.primaryColor || '#2563EB' }}
                aria-hidden="true"
              />
              <span className="font-mono">{campaign.branding.primaryColor || '#2563EB'}</span>
            </div>
            <span className="font-mono text-brand-text-muted">token: {campaign.publicToken.slice(0, 6)}...</span>
          </div>
        </CardContent>
      </div>

      <CardFooter className="pt-3 border-t border-brand-border/60 flex flex-col gap-3">
        {/* Quick download triggers */}
        <div className="w-full">
          <QrDownloadActions
            campaignId={campaign._id}
            campaignTitle={campaign.title}
            variant="compact"
          />
        </div>

        {/* View Details / Deactivate */}
        <div className="flex items-center justify-between w-full pt-1">
          <Button asChild variant="primary" size="sm" className="h-8 text-xs">
            <Link href={`/dashboard/campaigns/${campaign._id}`}>
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              View & Preview QR
            </Link>
          </Button>

          {campaign.status === 'active' && onDeactivate && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDeactivate}
              disabled={isDeactivating}
              className="text-xs text-brand-text-muted hover:text-brand-error h-8 px-2"
            >
              {isDeactivating ? 'Deactivating...' : 'Deactivate'}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
