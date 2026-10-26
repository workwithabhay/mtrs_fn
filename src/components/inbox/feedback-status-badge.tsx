import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import type { FeedbackLifecycleStatus } from '@/lib/api/types';

interface FeedbackStatusBadgeProps {
  status: FeedbackLifecycleStatus;
  className?: string;
}

export function FeedbackStatusBadge({ status, className }: FeedbackStatusBadgeProps) {
  switch (status) {
    case 'new':
      return (
        <Badge variant="info" hasDot className={className}>
          New
        </Badge>
      );
    case 'reviewed':
      return (
        <Badge variant="warning" hasDot className={className}>
          Reviewed
        </Badge>
      );
    case 'resolved':
      return (
        <Badge variant="success" hasDot className={className}>
          Resolved
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className={className}>
          {status}
        </Badge>
      );
  }
}
