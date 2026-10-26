'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { CampaignForm } from '@/components/campaigns/campaign-form';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewCampaignPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl" role="status" aria-label="Loading campaign form">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <Skeleton className="h-8 w-64 rounded-lg" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <CampaignForm />;
}
