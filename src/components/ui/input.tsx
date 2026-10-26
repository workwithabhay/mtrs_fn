import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      id: customId,
      label,
      helperText,
      error,
      leadingIcon,
      trailingIcon,
      disabled,
      required,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    // Generate deterministic fallback ID if not provided
    const reactId = React.useId();
    const id = customId || reactId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const describedBy = [
      error ? errorId : null,
      helperText && !error ? helperId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={cn('flex flex-col gap-1.5 w-full text-left', containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-semibold text-brand-text-primary flex items-center justify-between"
          >
            <span>
              {label}
              {required && <span className="text-brand-error ml-0.5">*</span>}
            </span>
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leadingIcon && (
            <div className="absolute left-3.5 flex items-center justify-center text-brand-text-secondary pointer-events-none w-4 h-4">
              {leadingIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            type={type}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={cn(
              'w-full h-10 px-3.5 text-sm bg-brand-surface text-brand-text-primary rounded-xl border border-brand-border',
              'field-focus placeholder:text-brand-text-muted',
              leadingIcon && 'pl-10',
              trailingIcon && 'pr-10',
              error && 'field-error',
              disabled && 'bg-slate-100/70 text-brand-text-secondary cursor-not-allowed opacity-75',
              className,
            )}
            {...props}
          />

          {trailingIcon && (
            <div className="absolute right-3.5 flex items-center justify-center text-brand-text-secondary pointer-events-none w-4 h-4">
              {trailingIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={errorId} role="alert" className="text-xs font-medium text-brand-error mt-0.5">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className="text-xs text-brand-text-secondary mt-0.5">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
