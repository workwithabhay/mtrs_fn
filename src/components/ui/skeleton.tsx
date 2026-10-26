import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'rounded' | 'circular';
}

export function Skeleton({
  className,
  variant = 'rounded',
  ...props
}: SkeletonProps) {
  const variantStyles = {
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
    circular: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'bg-slate-200/80 animate-pulse select-none',
        variantStyles[variant],
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  );
}
