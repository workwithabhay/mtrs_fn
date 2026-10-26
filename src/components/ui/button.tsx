import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  asChild?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const buttonVariants = {
  variant: {
    primary:
      'bg-brand-primary text-white hover:bg-brand-primary-hover active:bg-indigo-800 shadow-subtle border border-transparent',
    secondary:
      'bg-brand-surface text-brand-text-primary hover:bg-slate-50 active:bg-slate-100 border border-brand-border shadow-subtle',
    outline:
      'bg-transparent text-brand-text-primary hover:bg-slate-100/80 active:bg-slate-200/80 border border-brand-border',
    ghost:
      'bg-transparent text-brand-text-primary hover:bg-slate-100 active:bg-slate-200 border border-transparent',
    destructive:
      'bg-brand-error text-white hover:bg-brand-error-hover active:bg-red-800 shadow-subtle border border-transparent',
    link:
      'bg-transparent text-brand-primary hover:underline underline-offset-4 p-0 h-auto border-transparent shadow-none',
  },
  size: {
    sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
    md: 'h-10 px-4 text-sm rounded-xl gap-2',
    lg: 'h-12 px-6 text-base rounded-xl gap-2.5',
    icon: 'h-10 w-10 p-0 rounded-xl justify-center',
  },
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      asChild = false,
      disabled,
      leadingIcon,
      trailingIcon,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        disabled={asChild ? undefined : isDisabled}
        aria-busy={isLoading ? 'true' : undefined}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all select-none',
          'focus-ring',
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          isDisabled && 'opacity-60 cursor-not-allowed pointer-events-none shadow-none',
          className,
        )}
        {...props}
      >
        {asChild ? (
          children
        ) : isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leadingIcon && <span className="shrink-0">{leadingIcon}</span>}
            {children}
            {trailingIcon && <span className="shrink-0">{trailingIcon}</span>}
          </>
        )}
      </Comp>
    );
  },
);

Button.displayName = 'Button';
