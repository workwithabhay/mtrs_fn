import * as React from 'react';
import { Copy, Check, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { exportCampaignQr, getPublicCampaignLandingUrl } from '@/lib/api/campaigns';
import { QrDownloadActions } from './qr-download-actions';
import type { QrCampaign } from '@/lib/api/types';

interface QrPreviewProps {
  campaign: QrCampaign;
  showDownloads?: boolean;
}

export function QrPreview({ campaign, showDownloads = true }: QrPreviewProps) {
  const [svgUrl, setSvgUrl] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [isCopied, setIsCopied] = React.useState<boolean>(false);

  const destinationUrl = getPublicCampaignLandingUrl(campaign.publicToken);

  const reloadPreview = React.useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const { blob } = await exportCampaignQr(campaign._id, 'svg');
      const url = window.URL.createObjectURL(blob);
      setSvgUrl((prev) => {
        if (prev) window.URL.revokeObjectURL(prev);
        return url;
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate QR code preview.';
      setLoadError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [campaign._id]);

  React.useEffect(() => {
    let isMounted = true;

    exportCampaignQr(campaign._id, 'svg')
      .then(({ blob }) => {
        if (!isMounted) return;
        const url = window.URL.createObjectURL(blob);
        setSvgUrl((prev) => {
          if (prev) window.URL.revokeObjectURL(prev);
          return url;
        });
        setLoadError(null);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Failed to generate QR code preview.';
        setLoadError(msg);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
      setSvgUrl((prev) => {
        if (prev) window.URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, [campaign._id]);

  const handleCopyUrl = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(destinationUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <Card className="border-brand-border bg-brand-surface overflow-hidden shadow-sm">
      <CardHeader className="pb-4 border-b border-brand-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider">
                Touchpoint QR
              </span>
              <Badge variant={campaign.status === 'active' ? 'success' : 'secondary'} hasDot>
                {campaign.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <CardTitle className="text-lg font-bold text-brand-text-primary">
              {campaign.title}
            </CardTitle>
            <CardDescription className="text-xs text-brand-text-secondary mt-0.5">
              {campaign.heading}
            </CardDescription>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={reloadPreview}
            disabled={isLoading}
            aria-label="Refresh QR preview"
            className="text-brand-text-muted hover:text-brand-text-primary h-8 px-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* QR Code Container with High-Contrast White Background & Quiet Zone */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl p-4 bg-white border border-brand-border/80 shadow-md flex items-center justify-center">
            {isLoading && (
              <div
                className="flex flex-col items-center justify-center gap-2 text-brand-text-muted"
                role="status"
                aria-label="Generating QR preview"
              >
                <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                <span className="text-xs font-medium">Generating verified QR...</span>
              </div>
            )}

            {!isLoading && loadError && (
              <div
                className="flex flex-col items-center justify-center p-4 text-center text-brand-error"
                role="alert"
              >
                <AlertCircle className="w-8 h-8 mb-2" />
                <span className="text-xs font-semibold mb-1">Preview failed</span>
                <p className="text-[11px] text-brand-text-secondary mb-3">{loadError}</p>
                <Button variant="secondary" size="sm" onClick={reloadPreview} className="text-xs h-7">
                  Retry
                </Button>
              </div>
            )}

            {!isLoading && !loadError && svgUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={svgUrl}
                alt={`Official QR Code for ${campaign.title}`}
                className="w-full h-full object-contain select-none"
              />
            )}
          </div>

          {/* Color palette indicator */}
          <div className="mt-3 flex items-center gap-3 text-xs text-brand-text-muted">
            <span className="flex items-center gap-1.5">
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                style={{ backgroundColor: campaign.branding.primaryColor || '#2563EB' }}
                aria-hidden="true"
              />
              <span className="font-mono text-[11px]">{campaign.branding.primaryColor || '#2563EB'}</span>
            </span>
            <span className="text-brand-border">•</span>
            <span>Error Correction: Level M (15%)</span>
          </div>
        </div>

        {/* Scan Destination Details */}
        <div className="p-3.5 rounded-xl bg-brand-surface-raised border border-brand-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-text-primary">
              Scan Destination URL
            </span>
            <span className="text-[11px] text-brand-text-muted">Token: {campaign.publicToken.slice(0, 8)}...</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={destinationUrl}
              aria-label="Scan Destination URL"
              className="flex-1 text-xs font-mono bg-brand-surface border border-brand-border rounded-lg px-2.5 py-1.5 text-brand-text-secondary select-all focus-ring"
            />

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCopyUrl}
              aria-label="Copy destination URL to clipboard"
              className="text-xs h-8 px-2.5 flex-shrink-0"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-brand-success mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <p className="text-[11px] text-brand-text-muted leading-relaxed">
            Encodes the verified ReviewFlow customer landing endpoint. Public customer review submission and private feedback journey will be active in Phase 7.
          </p>
        </div>

        {/* Multi-Format Downloads */}
        {showDownloads && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-brand-text-primary uppercase tracking-wider">
                Download Print & Web Assets
              </h4>
              <span className="text-[11px] text-brand-text-muted">3 verified formats</span>
            </div>
            <QrDownloadActions campaignId={campaign._id} campaignTitle={campaign.title} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
