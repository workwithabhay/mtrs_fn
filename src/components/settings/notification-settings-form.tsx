'use client';

import * as React from 'react';
import { Bell, Check, RotateCcw, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { updateBusinessSettings } from '@/lib/api/business';
import type { BusinessSettings } from '@/lib/api/types';

interface NotificationSettingsFormProps {
  settings: BusinessSettings;
  onSettingsUpdated: (updated: BusinessSettings) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NotificationSettingsForm({
  settings,
  onSettingsUpdated,
}: NotificationSettingsFormProps) {
  const [notificationEmail, setNotificationEmail] = React.useState(settings.notificationEmail || '');
  const [allowPublicReviews, setAllowPublicReviews] = React.useState(settings.allowPublicReviews ?? true);
  const [headingText, setHeadingText] = React.useState(settings.headingText || '');
  const [subheadingText, setSubheadingText] = React.useState(settings.subheadingText || '');
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const hasChanges =
    notificationEmail.trim() !== (settings.notificationEmail || '') ||
    allowPublicReviews !== (settings.allowPublicReviews ?? true) ||
    headingText.trim() !== (settings.headingText || '') ||
    subheadingText.trim() !== (settings.subheadingText || '');

  const isEmailValid = !notificationEmail.trim() || EMAIL_REGEX.test(notificationEmail.trim());
  const isHeadingValid = headingText.trim().length <= 120;
  const isSubheadingValid = subheadingText.trim().length <= 250;
  const isValid = isEmailValid && isHeadingValid && isSubheadingValid;

  const handleReset = () => {
    setNotificationEmail(settings.notificationEmail || '');
    setAllowPublicReviews(settings.allowPublicReviews ?? true);
    setHeadingText(settings.headingText || '');
    setSubheadingText(settings.subheadingText || '');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSaving || !hasChanges) return;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const updated = await updateBusinessSettings({
        notificationEmail: notificationEmail.trim() || null,
        allowPublicReviews,
        headingText: headingText.trim() || null,
        subheadingText: subheadingText.trim() || null,
      });
      onSettingsUpdated(updated);
      toast.success('Notification & feedback settings saved successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save settings.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-6 space-y-6 shadow-xs">
      <div className="flex items-center gap-2.5 pb-4 border-b border-brand-border">
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-brand-text-primary">
            Customer Experience &amp; Alerts
          </h2>
          <p className="text-xs text-brand-text-secondary">
            Configure default touchpoint copy, review link options, and feedback notification alerts.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="space-y-5">
        {/* Notification email */}
        <div>
          <Input
            id="notification-email-input"
            label="Feedback Alert Email"
            type="email"
            value={notificationEmail}
            onChange={(e) => setNotificationEmail(e.target.value)}
            disabled={isSaving}
            placeholder="alerts@yourbusiness.com"
            helperText="Where ReviewFlow sends immediate alerts whenever a customer leaves feedback. Leave blank if not desired."
            error={!isEmailValid ? 'Please enter a valid email address' : undefined}
          />
        </div>

        {/* Public review links toggle */}
        <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-brand-border bg-slate-50/60">
          <div className="space-y-1">
            <label htmlFor="allow-public-reviews-toggle" className="text-xs font-semibold text-brand-text-primary block cursor-pointer">
              Enable Public Google Review Link-Out
            </label>
            <p className="text-xs text-brand-text-secondary leading-relaxed max-w-lg">
              When enabled, customers are offered an un-gated button to leave a Google Review after submitting feedback.
            </p>
          </div>
          <input
            id="allow-public-reviews-toggle"
            type="checkbox"
            checked={allowPublicReviews}
            onChange={(e) => setAllowPublicReviews(e.target.checked)}
            disabled={isSaving}
            className="w-5 h-5 mt-0.5 rounded text-brand-primary focus:ring-brand-primary border-brand-border cursor-pointer shrink-0"
          />
        </div>

        {/* Default touchpoint heading */}
        <div>
          <Input
            id="default-heading-input"
            label="Default Touchpoint Heading"
            value={headingText}
            onChange={(e) => setHeadingText(e.target.value)}
            maxLength={120}
            disabled={isSaving}
            placeholder="e.g. How did we do today?"
            helperText="Default headline displayed on your customer feedback landing page (max 120 chars)."
          />
        </div>

        {/* Default touchpoint subheading */}
        <div>
          <Textarea
            id="default-subheading-input"
            label="Default Touchpoint Subheading"
            value={subheadingText}
            onChange={(e) => setSubheadingText(e.target.value)}
            maxLength={250}
            disabled={isSaving}
            rows={3}
            placeholder="e.g. We value your honest feedback to help us serve you better."
            helperText="Default explanatory note displayed below the rating stars (max 250 chars)."
          />
        </div>

        {/* Questions info note */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-brand-border/60 text-xs text-brand-text-secondary">
          <MessageSquare className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-brand-text-primary">Touchpoint Feedback Questions:</strong> Specific survey questions
            (e.g., &ldquo;How was our table service?&rdquo;) are customized directly inside each QR campaign to allow
            tailored questions per location, counter, or table.
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
          Save Experience Settings
        </Button>
      </div>
    </form>
  );
}
