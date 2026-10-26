'use client';

import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';

/**
 * Reusable Toaster container mounted at root layout.
 * Provides accessible ARIA live regions and consistent typography/colors.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        className:
          'font-sans text-sm rounded-xl border border-brand-border bg-brand-surface text-brand-text-primary shadow-elevated p-4',
        duration: 4000,
      }}
    />
  );
}

/**
 * Programmatic toast helper API.
 * Supports:
 * - toast.success(message, options)
 * - toast.error(message, options)
 * - toast.info(message, options)
 * - toast.warning(message, options)
 * - toast(message, options)
 * - toast.dismiss(id)
 */
export const toast = sonnerToast;
