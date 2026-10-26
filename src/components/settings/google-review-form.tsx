'use client';

import * as React from 'react';
import { ExternalLink, Check, RotateCcw, ShieldCheck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { updateBusinessProfile } from '@/lib/api/business';
import type { Business } from '@/lib/api/types';

interface GoogleReviewFormProps {
  business: Business;
  onBusinessUpdated: (updated: Business) => void;
}

export function GoogleReviewForm({ business, onBusinessUpdated }: GoogleReviewFormProps) {
  const [googleReviewUrl, setGoogleReviewUrl] = React.useState(business.googleReviewUrl || '');
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const hasChanges = googleReviewUrl.trim() !== (business.googleReviewUrl || '');

  // Validation: empty is allowed, or valid http/https URL
  const isValidUrl = (url: string) => {
    if (!url.trim()) return true;
    try {
      const parsed = new URL(url.trim());
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const isValid = isValidUrl(googleReviewUrl);

  const handleReset = () => {
    setGoogleReviewUrl(business.googleReviewUrl || '');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSaving || !hasChanges) return;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const updated = await updateBusinessProfile({
        googleReviewUrl: googleReviewUrl.trim() || null,
      });
      onBusinessUpdated(updated);
      toast.success('Google review destination updated successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update Google review destination.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-6 space-y-6 shadow-xs">
      <div className="flex items-center gap-2.5 pb-4 border-b border-brand-border">
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
          <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-brand-text-primary">Google Review Destination</h2>
          <p className="text-xs text-brand-text-secondary">
            The external review link offered to customers after completing feedback touchpoints.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Anti-gating policy alert */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/60 text-blue-900 space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-blue-950">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Strict Anti-Gating Policy Compliance</span>
        </div>
        <p className="text-blue-800 leading-relaxed">
          Google strictly prohibits review gating. ReviewFlow provides this public review destination link to all
          patrons regardless of their star rating or sentiment.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            id="google-review-url-input"
            label="Google Review Link (URL)"
            value={googleReviewUrl}
            onChange={(e) => setGoogleReviewUrl(e.target.value)}
            disabled={isSaving}
            placeholder="https://g.page/r/your-place-id/review"
            helperText="Direct Google Place review URL or Google Maps link. Leave blank if not yet configured."
            error={!isValid ? 'Please enter a valid HTTP or HTTPS URL (e.g. https://g.page/r/...)' : undefined}
          />
        </div>

        {googleReviewUrl && isValid && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-brand-border text-xs">
            <span className="text-brand-text-secondary">Verify that your link opens your Google review modal:</span>
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-brand-primary hover:underline"
            >
              Test Link
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-border/60 text-xs text-brand-text-secondary space-y-1">
          <p className="font-medium text-brand-text-primary">Campaign Inheritance Behavior:</p>
          <p className="leading-relaxed">
            Updating your business-level destination sets the default URL for newly generated QR touchpoints.
            Existing QR campaigns maintain their specific link settings unless edited individually in the Campaign Builder.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-brand-border gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={!hasChanges || isSaving}
          className="text-brand-text-secondary"
        >
          <RotateCcw className="w-4 h-4 mr-1.5" />
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!hasChanges || !isValid || isSaving}
          isLoading={isSaving}
        >
          <Check className="w-4 h-4 mr-1.5" />
          Save Destination
        </Button>
      </div>
    </form>
  );
}
