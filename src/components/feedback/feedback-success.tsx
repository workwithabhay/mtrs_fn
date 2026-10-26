'use client';

import * as React from 'react';
import { CheckCircle2, ExternalLink, MessageSquare, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { trackGoogleReviewClick } from '@/lib/api/feedback';

export interface FeedbackSuccessProps {
  businessName: string;
  customerName: string;
  googleReviewUrl?: string | null;
  token: string;
  rating: number;
}

export function FeedbackSuccess({
  businessName,
  customerName,
  googleReviewUrl,
  token,
  rating,
}: FeedbackSuccessProps) {
  const [hasClickedGoogle, setHasClickedGoogle] = React.useState<boolean>(false);

  const handleOpenGoogle = () => {
    if (!googleReviewUrl) return;

    trackGoogleReviewClick(token).catch(() => {});
    setHasClickedGoogle(true);
    window.open(googleReviewUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-lg mx-auto py-8 px-4 space-y-6 text-center animate-in fade-in duration-200">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-brand-text-primary tracking-tight">
          Thank you, {customerName}!
        </h1>
        <p className="text-sm text-brand-text-secondary max-w-sm mx-auto leading-relaxed">
          {rating >= 4 ? (
            <>
              Your positive feedback has been saved and your review text was copied to your clipboard.
            </>
          ) : (
            <>
              Your {rating}-star feedback has been delivered directly to the management team at{' '}
              <strong className="text-brand-text-primary font-semibold">{businessName}</strong>. We appreciate your honesty and will use it to improve our service.
            </>
          )}
        </p>
      </div>

      {/* Google Review option for 4+ stars */}
      {rating >= 4 && googleReviewUrl && (
        <Card className="border-brand-primary/20 bg-brand-surface shadow-sm overflow-hidden text-left">
          <CardHeader className="pb-3 bg-brand-primary/5 border-b border-brand-primary/10">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-primary">
              <MessageSquare className="w-4 h-4" />
              <span>Share on Google</span>
            </div>
            <CardTitle className="text-base font-bold text-brand-text-primary mt-1">
              Paste Your Review on Google
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <p className="text-xs text-brand-text-secondary leading-relaxed">
              Reviews on Google help local customers find and evaluate{' '}
              <strong className="text-brand-text-primary">{businessName}</strong>. Your comments are already on your clipboard—simply paste and submit!
            </p>

            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleOpenGoogle}
              className="w-full justify-center h-12 text-sm font-semibold rounded-xl shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <span>{hasClickedGoogle ? 'Open Google Reviews Again' : 'Proceed to Google Reviews'}</span>
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Privacy note */}
      <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-brand-text-muted">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Your response was transmitted securely via ReviewFlow.</span>
      </div>
    </div>
  );
}
