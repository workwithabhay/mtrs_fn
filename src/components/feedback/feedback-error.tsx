'use client';

import * as React from 'react';
import { AlertCircle, RefreshCw, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export interface FeedbackErrorProps {
  errorType: 'inactive' | 'not_found' | 'network' | 'generic';
  errorMessage?: string;
  onRetry?: () => void;
}

export function FeedbackError({
  errorType,
  errorMessage,
  onRetry,
}: FeedbackErrorProps) {
  const isInactive = errorType === 'inactive';
  const isNotFound = errorType === 'not_found';
  const isNetwork = errorType === 'network';

  return (
    <div className="w-full max-w-md mx-auto py-12 px-4 text-center space-y-6">
      <div className="w-14 h-14 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center mx-auto shadow-xs text-brand-text-secondary">
        {isInactive || isNotFound ? (
          <QrCode className="w-7 h-7 text-brand-text-muted" />
        ) : (
          <AlertCircle className="w-7 h-7 text-brand-error" />
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-xl font-bold text-brand-text-primary tracking-tight">
          {isInactive
            ? 'Touchpoint Inactive'
            : isNotFound
              ? 'Campaign Not Found'
              : isNetwork
                ? 'Connection Error'
                : 'Something Went Wrong'}
        </h1>

        <p className="text-sm text-brand-text-secondary max-w-sm mx-auto leading-relaxed">
          {isInactive
            ? 'This QR campaign has been marked inactive by the business. You can ask staff for an updated QR code.'
            : isNotFound
              ? 'The QR code you scanned does not match an active ReviewFlow campaign. Please scan the code again.'
              : errorMessage || 'We were unable to load the feedback page. Please check your connection.'}
        </p>
      </div>

      {onRetry && (
        <Card className="border-brand-border bg-brand-surface shadow-xs p-4">
          <CardContent className="p-0 flex flex-col items-center gap-3">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={onRetry}
              className="w-full justify-center h-11 text-sm font-semibold rounded-xl"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
