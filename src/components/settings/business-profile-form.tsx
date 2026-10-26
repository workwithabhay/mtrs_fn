'use client';

import * as React from 'react';
import { Building2, Check, RotateCcw, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/toast';
import { updateBusinessProfile } from '@/lib/api/business';
import type { Business } from '@/lib/api/types';

interface BusinessProfileFormProps {
  business: Business;
  onBusinessUpdated: (updated: Business) => void;
}

const CATEGORY_PRESETS = [
  'Restaurant & Dining',
  'Retail & Shopping',
  'Health & Wellness',
  'Professional Services',
  'Automotive & Transport',
  'Hospitality & Travel',
];

export function BusinessProfileForm({ business, onBusinessUpdated }: BusinessProfileFormProps) {
  const [name, setName] = React.useState(business.name || '');
  const [category, setCategory] = React.useState(business.category || '');
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const hasChanges = name.trim() !== (business.name || '') || category.trim() !== (business.category || '');
  const isNameValid = name.trim().length >= 2 && name.trim().length <= 120;
  const isCategoryValid = category.trim().length >= 2 && category.trim().length <= 80;
  const isValid = isNameValid && isCategoryValid;

  const handleReset = () => {
    setName(business.name || '');
    setCategory(business.category || '');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSaving || !hasChanges) return;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const updated = await updateBusinessProfile({
        name: name.trim(),
        category: category.trim(),
      });
      onBusinessUpdated(updated);
      toast.success('Business profile updated successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update business profile.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const businessId = business._id || business.id || 'Active Tenant';

  return (
    <form onSubmit={handleSubmit} className="bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-6 space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-border">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-brand-text-primary">Business Profile</h2>
            <p className="text-xs text-brand-text-secondary">
              Core identity details displayed to customers across your QR touchpoints.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={business.status === 'suspended' ? 'destructive' : 'success'} className="capitalize text-[11px]">
            <ShieldCheck className="w-3 h-3 mr-1" />
            {business.status || 'Active'}
          </Badge>
        </div>
      </div>

      {errorMessage && (
        <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Input
            id="business-name-input"
            label="Business Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={120}
            disabled={isSaving}
            placeholder="e.g. Café Santos"
            helperText="2 to 120 characters."
            error={name.length > 0 && !isNameValid ? 'Name must be between 2 and 120 characters' : undefined}
          />
        </div>

        <div>
          <Input
            id="business-category-input"
            label="Business Category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            maxLength={80}
            disabled={isSaving}
            placeholder="e.g. Restaurant & Dining"
            helperText="Select a preset or type your industry."
            error={category.length > 0 && !isCategoryValid ? 'Category must be between 2 and 80 characters' : undefined}
          />

          <div className="mt-2 flex flex-wrap gap-1.5">
            {CATEGORY_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                disabled={isSaving}
                onClick={() => setCategory(preset)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-colors ${
                  category === preset
                    ? 'bg-brand-primary/10 border-brand-primary/40 text-brand-primary font-semibold'
                    : 'bg-slate-50 border-brand-border/60 text-brand-text-secondary hover:bg-slate-100 hover:text-brand-text-primary'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <label className="text-xs font-semibold text-brand-text-primary block mb-1">
            Tenant Account Identifier
          </label>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-brand-border font-mono text-xs text-brand-text-secondary">
            <span className="truncate">{businessId}</span>
            <span className="ml-auto text-[10px] uppercase font-semibold text-slate-600 bg-slate-200/70 px-1.5 py-0.5 rounded">
              Immutable
            </span>
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
          Save Changes
        </Button>
      </div>
    </form>
  );
}
