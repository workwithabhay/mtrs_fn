'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { getPublicLanding, recordPublicScan } from '@/lib/api/feedback';
import { FeedbackForm } from '@/components/feedback/feedback-form';
import { FeedbackSuccess } from '@/components/feedback/feedback-success';
import { FeedbackError } from '@/components/feedback/feedback-error';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiError } from '@/lib/api/client';
import type { PublicQrLandingData, SubmitFeedbackResult } from '@/lib/api/types';

export default function QrCustomerLandingPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token;

  const [landingData, setLandingData] = React.useState<PublicQrLandingData | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [errorType, setErrorType] = React.useState<'inactive' | 'not_found' | 'network' | 'generic' | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Success state after submission
  const [submission, setSubmission] = React.useState<{
    result: SubmitFeedbackResult;
    rating: number;
    customerName: string;
  } | null>(null);

  // Guard against duplicate scan recordings in React 18/19 StrictMode
  const scanRecordedRef = React.useRef<string | null>(null);

  const handleRetry = React.useCallback(async (publicToken: string) => {
    setIsLoading(true);
    setErrorType(null);
    setErrorMessage(null);

    try {
      const data = await getPublicLanding(publicToken);
      setLandingData(data);

      if (scanRecordedRef.current !== publicToken) {
        scanRecordedRef.current = publicToken;
        recordPublicScan(publicToken).catch(() => {});
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 404) {
          const lowerMsg = (err.message || '').toLowerCase();
          setErrorType(lowerMsg.includes('inactive') ? 'inactive' : 'not_found');
        } else if (err.status === 0 || err.code === 'NETWORK_ERROR' || err.code === 'TIMEOUT_ERROR') {
          setErrorType('network');
          setErrorMessage(err.message);
        } else {
          setErrorType('generic');
          setErrorMessage(err.message);
        }
      } else {
        setErrorType('generic');
        setErrorMessage(err instanceof Error ? err.message : 'Unable to connect to the server.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    if (!token) {
      Promise.resolve().then(() => {
        if (!isMounted) return;
        setErrorType('not_found');
        setIsLoading(false);
      });
      return;
    }

    getPublicLanding(token)
      .then((data) => {
        if (!isMounted) return;
        setLandingData(data);
        if (scanRecordedRef.current !== token) {
          scanRecordedRef.current = token;
          recordPublicScan(token).catch(() => {});
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        if (err instanceof ApiError) {
          if (err.status === 404) {
            const lowerMsg = (err.message || '').toLowerCase();
            setErrorType(lowerMsg.includes('inactive') ? 'inactive' : 'not_found');
          } else if (err.status === 0 || err.code === 'NETWORK_ERROR' || err.code === 'TIMEOUT_ERROR') {
            setErrorType('network');
            setErrorMessage(err.message);
          } else {
            setErrorType('generic');
            setErrorMessage(err.message);
          }
        } else {
          setErrorType('generic');
          setErrorMessage(err instanceof Error ? err.message : 'Unable to connect to the server.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-brand-background flex flex-col justify-center py-12 px-4">
        <div
          role="status"
          aria-label="Loading customer feedback experience"
          className="w-full max-w-lg mx-auto space-y-6"
        >
          <div className="flex flex-col items-center gap-3">
            <Skeleton className="w-16 h-16 rounded-2xl" />
            <Skeleton className="h-4 w-28 rounded-full" />
            <Skeleton className="h-7 w-64 rounded-xl" />
            <Skeleton className="h-4 w-48 rounded-lg" />
          </div>

          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </main>
    );
  }

  if (errorType) {
    return (
      <main className="min-h-screen bg-brand-background flex flex-col justify-center py-12 px-4">
        <FeedbackError
          errorType={errorType}
          errorMessage={errorMessage || undefined}
          onRetry={errorType === 'network' || errorType === 'generic' ? () => token && handleRetry(token) : undefined}
        />
      </main>
    );
  }

  if (submission && landingData) {
    return (
      <main className="min-h-screen bg-brand-background flex flex-col justify-center py-12 px-4">
        <FeedbackSuccess
          businessName={landingData.business.name}
          customerName={submission.customerName}
          googleReviewUrl={submission.result.googleReviewUrl || landingData.googleReviewUrl}
          token={token || ''}
          rating={submission.rating}
        />
      </main>
    );
  }

  if (!landingData || !token) {
    return null;
  }

  return (
    <main className="min-h-screen bg-brand-background py-8 sm:py-12">
      <FeedbackForm
        token={token}
        landingData={landingData}
        onSuccess={(result, selectedRating, name) => {
          setSubmission({
            result,
            rating: selectedRating,
            customerName: name,
          });
        }}
      />
    </main>
  );
}
