import * as React from 'react';
import { FileImage, FileCode, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { triggerCampaignDownload } from '@/lib/api/campaigns';
import type { QrExportFormat } from '@/lib/api/types';

interface QrDownloadActionsProps {
  campaignId: string;
  campaignTitle: string;
  size?: 'sm' | 'md';
  variant?: 'buttons' | 'compact';
}

export function QrDownloadActions({
  campaignId,
  campaignTitle,
  size = 'md',
  variant = 'buttons',
}: QrDownloadActionsProps) {
  const [downloadingFormat, setDownloadingFormat] = React.useState<QrExportFormat | null>(null);
  const [downloadError, setDownloadError] = React.useState<string | null>(null);

  const handleDownload = async (format: QrExportFormat) => {
    if (downloadingFormat) return;
    setDownloadingFormat(format);
    setDownloadError(null);

    try {
      await triggerCampaignDownload(campaignId, format, campaignTitle);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `Failed to download ${format.toUpperCase()} export.`;
      setDownloadError(msg);
    } finally {
      setDownloadingFormat(null);
    }
  };

  if (variant === 'compact') {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => handleDownload('png')}
            disabled={downloadingFormat !== null}
            aria-label={`Download ${campaignTitle} QR code as PNG`}
            className="text-xs h-8 px-2.5"
          >
            {downloadingFormat === 'png' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
            ) : (
              <FileImage className="w-3.5 h-3.5 mr-1.5 text-brand-primary" />
            )}
            PNG
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => handleDownload('svg')}
            disabled={downloadingFormat !== null}
            aria-label={`Download ${campaignTitle} QR code as SVG`}
            className="text-xs h-8 px-2.5"
          >
            {downloadingFormat === 'svg' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
            ) : (
              <FileCode className="w-3.5 h-3.5 mr-1.5 text-brand-success" />
            )}
            SVG
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => handleDownload('pdf')}
            disabled={downloadingFormat !== null}
            aria-label={`Download ${campaignTitle} QR code as printable PDF`}
            className="text-xs h-8 px-2.5"
          >
            {downloadingFormat === 'pdf' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
            ) : (
              <FileText className="w-3.5 h-3.5 mr-1.5 text-brand-warning" />
            )}
            PDF
          </Button>
        </div>

        {downloadError && (
          <p className="text-xs text-brand-error flex items-center gap-1 mt-1" role="alert">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{downloadError}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
        <Button
          type="button"
          variant="secondary"
          size={size}
          onClick={() => handleDownload('png')}
          disabled={downloadingFormat !== null}
          aria-label={`Download high-resolution PNG for ${campaignTitle}`}
          className="flex items-center justify-center gap-2 border-brand-border hover:border-brand-primary/40 h-11"
        >
          {downloadingFormat === 'png' ? (
            <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
          ) : (
            <FileImage className="w-4 h-4 text-brand-primary" />
          )}
          <span className="font-semibold text-xs">High-Res PNG</span>
          <span className="text-[10px] text-brand-text-muted font-normal">600px</span>
        </Button>

        <Button
          type="button"
          variant="secondary"
          size={size}
          onClick={() => handleDownload('svg')}
          disabled={downloadingFormat !== null}
          aria-label={`Download scalable SVG for ${campaignTitle}`}
          className="flex items-center justify-center gap-2 border-brand-border hover:border-brand-primary/40 h-11"
        >
          {downloadingFormat === 'svg' ? (
            <Loader2 className="w-4 h-4 animate-spin text-brand-success" />
          ) : (
            <FileCode className="w-4 h-4 text-brand-success" />
          )}
          <span className="font-semibold text-xs">Scalable SVG</span>
          <span className="text-[10px] text-brand-text-muted font-normal">Vector</span>
        </Button>

        <Button
          type="button"
          variant="secondary"
          size={size}
          onClick={() => handleDownload('pdf')}
          disabled={downloadingFormat !== null}
          aria-label={`Download printable PDF sheet for ${campaignTitle}`}
          className="flex items-center justify-center gap-2 border-brand-border hover:border-brand-primary/40 h-11"
        >
          {downloadingFormat === 'pdf' ? (
            <Loader2 className="w-4 h-4 animate-spin text-brand-warning" />
          ) : (
            <FileText className="w-4 h-4 text-brand-warning" />
          )}
          <span className="font-semibold text-xs">Printable PDF</span>
          <span className="text-[10px] text-brand-text-muted font-normal">A4 Sheet</span>
        </Button>
      </div>

      {downloadError && (
        <div
          className="p-2.5 rounded-lg bg-brand-error/10 border border-brand-error/20 text-xs text-brand-error flex items-start gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{downloadError}</span>
        </div>
      )}
    </div>
  );
}
