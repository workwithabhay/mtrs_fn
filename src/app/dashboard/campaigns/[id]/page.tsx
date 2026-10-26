'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { getCampaignById } from '@/lib/api/campaigns';
import { QrPreview } from '@/components/campaigns/qr-preview';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { QrCampaign } from '@/lib/api/types';

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const campaignId = params?.id;

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [campaign, setCampaign] = React.useState<QrCampaign | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const loadData = React.useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCampaignById(id);
      setCampaign(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to find or load this QR campaign.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    if (isAuthenticated && campaignId) {
      getCampaignById(campaignId)
        .then((data) => {
          if (!isMounted) return;
          setCampaign(data);
          setError(null);
        })
        .catch((err: unknown) => {
          if (!isMounted) return;
          const msg = err instanceof Error ? err.message : 'Unable to find or load this QR campaign.';
          setError(msg);
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, campaignId]);

  if (authLoading || (isLoading && !campaign && !error)) {
    return (
      <div className="space-y-6 max-w-5xl" role="status" aria-label="Loading campaign details">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-32 rounded-lg" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-brand-error/10 text-brand-error flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-brand-text-primary">
          Campaign Not Found or Access Unauthorized
        </h2>
        <p className="text-sm text-brand-text-secondary max-w-md mx-auto">
          {error || 'This QR campaign does not exist or belongs to another business account.'}
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Button asChild variant="secondary" size="md">
            <Link href="/dashboard/campaigns">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Link>
          </Button>
          <Button variant="primary" size="md" onClick={() => campaignId && loadData(campaignId)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const formattedCreated = new Date(campaign.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back button and page title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="h-8 px-2 -ml-2 text-brand-text-secondary">
            <Link href="/dashboard/campaigns">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Campaigns
            </Link>
          </Button>
          <span className="text-brand-border">/</span>
          <h1 className="text-xl font-bold text-brand-text-primary tracking-tight">
            {campaign.title}
          </h1>
          <Badge variant={campaign.status === 'active' ? 'success' : 'secondary'} hasDot>
            {campaign.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="secondary" size="sm" className="text-xs h-8">
            <Link href="/dashboard/campaigns/new">New Campaign</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* QR Preview & Downloads */}
        <div className="lg:col-span-7">
          <QrPreview campaign={campaign} showDownloads={true} />
        </div>

        {/* Campaign Metadata & Info */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="border-brand-border bg-brand-surface shadow-xs">
            <CardHeader className="pb-3 border-b border-brand-border/60">
              <CardTitle className="text-sm font-bold text-brand-text-primary">
                Campaign Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-brand-border/40">
                <span className="text-brand-text-secondary">Status</span>
                <span className="font-semibold capitalize text-brand-text-primary">{campaign.status}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-brand-border/40">
                <span className="text-brand-text-secondary">Total Scans Recorded</span>
                <span className="font-bold text-brand-primary">{campaign.scanCount}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-brand-border/40">
                <span className="text-brand-text-secondary">Created On</span>
                <span className="text-brand-text-primary font-medium">{formattedCreated}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-brand-border/40">
                <span className="text-brand-text-secondary">Public Token</span>
                <code className="font-mono text-brand-text-primary font-semibold">{campaign.publicToken}</code>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-brand-text-secondary">Branding Color</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span
                    className="w-3 h-3 rounded-full border border-black/10 inline-block"
                    style={{ backgroundColor: campaign.branding.primaryColor || '#2563EB' }}
                  />
                  <span>{campaign.branding.primaryColor || '#2563EB'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Placement Best Practices Notice */}
          <Card className="border-brand-primary/20 bg-brand-primary/5 shadow-xs">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-primary">
                <ShieldCheck className="w-4 h-4" />
                <span>Print & Placement Guidelines</span>
              </div>
              <ul className="text-[11px] text-brand-text-secondary space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>For tables and counters, print the A4 PDF or PNG at minimum 2 × 2 inches (5 × 5 cm).</li>
                <li>Keep the surrounding white quiet zone intact to ensure fast smartphone autofocus.</li>
                <li>For storefront windows, use the vector SVG for ultra-sharp infinite enlargement.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
