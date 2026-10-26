import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info';
  size?: 'sm' | 'md';
  hasDot?: boolean;
}

export const badgeVariants = {
  variant: {
    default: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    destructive: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  dot: {
    default: 'bg-indigo-600',
    secondary: 'bg-slate-500',
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    destructive: 'bg-red-600',
    info: 'bg-sky-600',
  },
  size: {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  },
};

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  hasDot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border shrink-0 select-none tracking-tight',
        badgeVariants.variant[variant],
        badgeVariants.size[size],
        className,
      )}
      {...props}
    >
      {hasDot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', badgeVariants.dot[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
