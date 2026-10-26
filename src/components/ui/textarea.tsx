import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  showCount?: boolean;
  containerClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      id: customId,
      label,
      helperText,
      error,
      showCount,
      maxLength,
      value,
      defaultValue,
      disabled,
      required,
      containerClassName,
      rows = 4,
      onChange,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();
    const id = customId || reactId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    // Local state for character counter if unmanaged
    const [charCount, setCharCount] = React.useState<number>(() => {
      if (typeof value === 'string') return value.length;
      if (typeof defaultValue === 'string') return defaultValue.length;
      return 0;
    });

    React.useEffect(() => {
      if (typeof value === 'string') {
        setCharCount(value.length);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    const describedBy = [
      error ? errorId : null,
      helperText && !error ? helperId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={cn('flex flex-col gap-1.5 w-full text-left', containerClassName)}>
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={id}
              className="text-xs font-semibold text-brand-text-primary"
            >
              {label}
              {required && <span className="text-brand-error ml-0.5">*</span>}
            </label>
          )}

          {showCount && maxLength && (
            <span
              className={cn(
                'text-[11px] font-mono text-brand-text-secondary ml-auto',
                charCount >= maxLength && 'text-brand-error font-semibold',
              )}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          id={id}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            'w-full p-3.5 text-sm bg-brand-surface text-brand-text-primary rounded-xl border border-brand-border',
            'field-focus placeholder:text-brand-text-muted resize-y min-h-[96px]',
            error && 'field-error',
            disabled && 'bg-slate-100/70 text-brand-text-secondary cursor-not-allowed opacity-75',
            className,
          )}
          {...props}
        />

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

Textarea.displayName = 'Textarea';
