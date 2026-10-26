'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CancelSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (immediate: boolean) => Promise<void>;
  isCancelling: boolean;
}

export function CancelSubscriptionDialog({
  isOpen,
  onClose,
  onConfirm,
  isCancelling,
}: CancelSubscriptionDialogProps) {
  const [immediate, setImmediate] = React.useState(false);

  const handleConfirm = async () => {
    await onConfirm(immediate);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <DialogTitle className="text-base font-bold text-brand-text-primary">
            Cancel Subscription
          </DialogTitle>
          <DialogDescription className="text-xs text-brand-text-secondary leading-relaxed">
            Are you sure you want to cancel your ReviewFlow subscription? Your business will lose access
            to premium touchpoints and advanced scan capacity.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <label className="flex items-start gap-2.5 p-3 rounded-xl border border-brand-border bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={immediate}
              onChange={(e) => setImmediate(e.target.checked)}
              className="mt-0.5 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
            />
            <div className="text-xs">
              <span className="font-semibold text-brand-text-primary block">
                Cancel immediately
              </span>
              <span className="text-brand-text-secondary">
                If unchecked, your plan remains active until the end of your current billing period.
              </span>
            </div>
          </label>
        </div>

        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isCancelling}
          >
            Keep Plan
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleConfirm}
            isLoading={isCancelling}
          >
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
