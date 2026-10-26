import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Loader2, AlertCircle, Palette } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { createCampaign } from '@/lib/api/campaigns';
import type { CreateQrCampaignPayload } from '@/lib/api/types';

const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const COLOR_PRESETS = [
  { name: 'Indigo', hex: '#2563EB' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Violet', hex: '#7C3AED' },
  { name: 'Rose', hex: '#E11D48' },
  { name: 'Amber', hex: '#D97706' },
  { name: 'Slate', hex: '#1E293B' },
];

export function CampaignForm() {
  const router = useRouter();

  const [title, setTitle] = React.useState('');
  const [heading, setHeading] = React.useState('Scan with your camera to share feedback or review');
  const [description, setDescription] = React.useState('');
  const [primaryColor, setPrimaryColor] = React.useState('#2563EB');
  const backgroundColor = '#FFFFFF';

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      errs.title = 'Campaign title is required.';
    } else if (trimmedTitle.length < 2) {
      errs.title = 'Title must be at least 2 characters.';
    } else if (trimmedTitle.length > 100) {
      errs.title = 'Title cannot exceed 100 characters.';
    }

    const trimmedHeading = heading.trim();
    if (!trimmedHeading) {
      errs.heading = 'Landing page heading is required.';
    } else if (trimmedHeading.length < 2) {
      errs.heading = 'Heading must be at least 2 characters.';
    } else if (trimmedHeading.length > 120) {
      errs.heading = 'Heading cannot exceed 120 characters.';
    }

    if (description && description.trim().length > 250) {
      errs.description = 'Description cannot exceed 250 characters.';
    }

    if (!HEX_COLOR_REGEX.test(primaryColor)) {
      errs.primaryColor = 'Primary color must be a valid hex code (e.g. #2563EB).';
    }

    if (!HEX_COLOR_REGEX.test(backgroundColor)) {
      errs.backgroundColor = 'Background color must be a valid hex code (e.g. #FFFFFF).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload: CreateQrCampaignPayload = {
        title: title.trim(),
        heading: heading.trim(),
        description: description.trim() || undefined,
        branding: {
          primaryColor,
          backgroundColor,
        },
      };

      const campaign = await createCampaign(payload);
      router.push(`/dashboard/campaigns/${campaign._id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create QR campaign. Please try again.';
      setApiError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl">
      {/* Form Area */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Button asChild variant="ghost" size="sm" className="h-8 px-2 -ml-2 text-brand-text-secondary">
            <Link href="/dashboard/campaigns">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Campaigns
            </Link>
          </Button>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary tracking-tight">
            New QR Campaign
          </h2>
          <p className="text-xs text-brand-text-secondary mt-1">
            Configure placement details and branding. ReviewFlow will automatically generate high-resolution PNG, vector SVG, and printable PDF assets.
          </p>
        </div>

        {apiError && (
          <div
            className="p-3.5 rounded-xl bg-brand-error/10 border border-brand-error/20 flex items-start gap-2.5 text-xs text-brand-error"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Campaign Title */}
          <Input
            id="campaign-title"
            label="Campaign Placement Title"
            required
            placeholder="e.g. Front Counter Stand, Table 12, Delivery Bag"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            error={errors.title}
            helperText="Internal name to organize your physical touchpoints (2-100 characters)."
            maxLength={100}
            disabled={isSubmitting}
          />

          {/* Customer Facing Heading */}
          <Input
            id="campaign-heading"
            label="Customer Scan Heading"
            required
            placeholder="e.g. How was your coffee today?"
            value={heading}
            onChange={(e) => {
              setHeading(e.target.value);
              if (errors.heading) setErrors((prev) => ({ ...prev, heading: '' }));
            }}
            error={errors.heading}
            helperText="Appears on customer feedback landing page and printed PDF posters (2-120 characters)."
            maxLength={120}
            disabled={isSubmitting}
          />

          {/* Description */}
          <Textarea
            id="campaign-description"
            label="Optional Description or Subtext"
            placeholder="e.g. We value your feedback. Scan to leave a quick Google review or share direct thoughts."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
            }}
            error={errors.description}
            helperText="Optional context displayed under the main heading (max 250 characters)."
            maxLength={250}
            showCount
            rows={3}
            disabled={isSubmitting}
          />

          {/* Branding Customization */}
          <div className="p-4 rounded-xl bg-brand-surface border border-brand-border space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-brand-primary" />
              <h3 className="text-xs font-bold text-brand-text-primary uppercase tracking-wider">
                Touchpoint Colors
              </h3>
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-text-primary block mb-2">
                QR Primary Color
              </label>

              {/* Color Presets */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(preset.hex);
                      if (errors.primaryColor) setErrors((prev) => ({ ...prev, primaryColor: '' }));
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                      primaryColor === preset.hex
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary ring-1 ring-brand-primary'
                        : 'border-brand-border bg-brand-surface hover:border-brand-border-strong text-brand-text-secondary'
                    }`}
                    aria-label={`Select ${preset.name} color (${preset.hex})`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/10 inline-block"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-brand-border cursor-pointer p-0.5 bg-brand-surface"
                  aria-label="Pick custom primary color"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => {
                    setPrimaryColor(e.target.value);
                    if (errors.primaryColor) setErrors((prev) => ({ ...prev, primaryColor: '' }));
                  }}
                  error={errors.primaryColor}
                  placeholder="#2563EB"
                  className="font-mono text-xs w-36 uppercase"
                  maxLength={7}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <Button asChild variant="secondary" size="md" disabled={isSubmitting}>
              <Link href="/dashboard/campaigns">Cancel</Link>
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              className="min-w-36"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Campaign
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Live Preview Column */}
      <div className="lg:col-span-5">
        <div className="sticky top-24 space-y-4">
          <h3 className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">
            Live Touchpoint Preview
          </h3>

          <Card className="border-brand-border bg-brand-surface overflow-hidden shadow-sm">
            <CardHeader className="pb-3 border-b border-brand-border">
              <CardTitle className="text-base font-bold text-brand-text-primary">
                {title.trim() || 'Untitled Campaign Placement'}
              </CardTitle>
              <CardDescription className="text-xs text-brand-text-secondary">
                {heading.trim() || 'Customer Scan Heading'}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-4 flex flex-col items-center text-center">
              {/* Illustrative QR placeholder showing chosen color */}
              <div
                className="w-48 h-48 rounded-xl p-3 border border-brand-border flex flex-col items-center justify-center shadow-xs transition-colors"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <div
                  className="w-full h-full rounded-lg flex flex-col items-center justify-center p-4 border border-dashed"
                  style={{ borderColor: primaryColor }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-2 shadow-xs transition-colors"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-brand-text-primary">
                    Verified QR Generated on Save
                  </span>
                  <span className="text-[10px] text-brand-text-muted mt-0.5">
                    Encodes direct review landing URL
                  </span>
                </div>
              </div>

              {description.trim() && (
                <p className="text-xs text-brand-text-secondary max-w-xs leading-relaxed">
                  {description}
                </p>
              )}

              <div className="text-[11px] text-brand-text-muted p-2 rounded-lg bg-brand-surface-raised w-full">
                <span>Color: <code className="font-mono">{primaryColor}</code></span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
