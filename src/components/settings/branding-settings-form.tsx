'use client';

import * as React from 'react';
import { Palette, Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { updateBusinessProfile } from '@/lib/api/business';
import type { Business } from '@/lib/api/types';

interface BrandingSettingsFormProps {
  business: Business;
  onBusinessUpdated: (updated: Business) => void;
}

const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const BRAND_PALETTES = [
  { name: 'Royal Blue', primary: '#2563EB', secondary: '#1E293B' },
  { name: 'Emerald', primary: '#10B981', secondary: '#064E3B' },
  { name: 'Indigo', primary: '#6366F1', secondary: '#1E1B4B' },
  { name: 'Violet', primary: '#8B5CF6', secondary: '#2E1065' },
  { name: 'Amber', primary: '#F59E0B', secondary: '#451A03' },
  { name: 'Rose', primary: '#F43F5E', secondary: '#4C0519' },
];

export function BrandingSettingsForm({ business, onBusinessUpdated }: BrandingSettingsFormProps) {
  const initialPrimary = business.branding?.primaryColor || '#2563EB';
  const initialSecondary = business.branding?.secondaryColor || '#1E293B';

  const [primaryColor, setPrimaryColor] = React.useState(initialPrimary);
  const [secondaryColor, setSecondaryColor] = React.useState(initialSecondary);
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const hasChanges =
    primaryColor.toUpperCase() !== initialPrimary.toUpperCase() ||
    secondaryColor.toUpperCase() !== initialSecondary.toUpperCase();

  const isPrimaryValid = HEX_COLOR_REGEX.test(primaryColor.trim());
  const isSecondaryValid = HEX_COLOR_REGEX.test(secondaryColor.trim());
  const isValid = isPrimaryValid && isSecondaryValid;

  const handleReset = () => {
    setPrimaryColor(initialPrimary);
    setSecondaryColor(initialSecondary);
    setErrorMessage(null);
  };

  const handleApplyPalette = (primary: string, secondary: string) => {
    setPrimaryColor(primary);
    setSecondaryColor(secondary);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSaving || !hasChanges) return;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const updated = await updateBusinessProfile({
        branding: {
          primaryColor: primaryColor.trim(),
          secondaryColor: secondaryColor.trim(),
        },
      });
      onBusinessUpdated(updated);
      toast.success('Branding defaults updated successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update branding settings.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-6 space-y-6 shadow-xs">
      <div className="flex items-center gap-2.5 pb-4 border-b border-brand-border">
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-brand-text-primary">Branding Defaults</h2>
          <p className="text-xs text-brand-text-secondary">
            Default color palette used for newly generated QR touchpoints and customer feedback cards.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Preset palettes */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-brand-text-primary block">
          Preset Palettes
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {BRAND_PALETTES.map((palette) => {
            const isSelected =
              primaryColor.toUpperCase() === palette.primary.toUpperCase() &&
              secondaryColor.toUpperCase() === palette.secondary.toUpperCase();

            return (
              <button
                key={palette.name}
                type="button"
                disabled={isSaving}
                onClick={() => handleApplyPalette(palette.primary, palette.secondary)}
                className={`flex flex-col items-center gap-2 p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary/40'
                    : 'border-brand-border bg-slate-50/60 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center -space-x-1.5">
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white shadow-xs"
                    style={{ backgroundColor: palette.primary }}
                  />
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white shadow-xs"
                    style={{ backgroundColor: palette.secondary }}
                  />
                </div>
                <span className="text-[11px] font-medium text-brand-text-primary truncate w-full">
                  {palette.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color inputs & live preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-brand-text-primary block mb-1">
              Primary Brand Color
            </label>
            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={isPrimaryValid ? primaryColor : '#2563EB'}
                onChange={(e) => setPrimaryColor(e.target.value)}
                disabled={isSaving}
                className="w-10 h-10 rounded-xl cursor-pointer border border-brand-border p-1 bg-white shrink-0"
                aria-label="Pick primary brand color"
              />
              <Input
                id="primary-color-input"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                maxLength={7}
                disabled={isSaving}
                placeholder="#2563EB"
                className="font-mono text-xs uppercase"
                error={!isPrimaryValid ? 'Valid hex code required (e.g. #2563EB)' : undefined}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-text-primary block mb-1">
              Secondary / Dark Accent Color
            </label>
            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={isSecondaryValid ? secondaryColor : '#1E293B'}
                onChange={(e) => setSecondaryColor(e.target.value)}
                disabled={isSaving}
                className="w-10 h-10 rounded-xl cursor-pointer border border-brand-border p-1 bg-white shrink-0"
                aria-label="Pick secondary brand color"
              />
              <Input
                id="secondary-color-input"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                maxLength={7}
                disabled={isSaving}
                placeholder="#1E293B"
                className="font-mono text-xs uppercase"
                error={!isSecondaryValid ? 'Valid hex code required (e.g. #1E293B)' : undefined}
              />
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="p-4 rounded-xl border border-brand-border bg-slate-50/70 space-y-3 flex flex-col justify-center">
          <span className="text-[11px] font-semibold uppercase text-brand-text-secondary tracking-wider">
            Live Touchpoint Preview
          </span>
          <div className="p-4 rounded-xl bg-white border border-brand-border/60 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-text-primary">
                {business.name || 'Your Business Name'}
              </span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: isSecondaryValid ? secondaryColor : '#1E293B' }}
              >
                Feedback
              </span>
            </div>
            <p className="text-[11px] text-brand-text-secondary">
              How was your service today? Tap a star to tell us.
            </p>
            <button
              type="button"
              className="w-full py-1.5 rounded-lg text-xs font-semibold text-white shadow-xs transition-opacity"
              style={{ backgroundColor: isPrimaryValid ? primaryColor : '#2563EB' }}
            >
              Continue to Review
            </button>
          </div>
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
          Save Branding
        </Button>
      </div>
    </form>
  );
}
