'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StarRatingProps {
  value: number; // 0 to 5 (0 means unselected)
  onChange: (rating: number) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  id?: string;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Needs Improvement',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Outstanding!',
};

export function StarRating({
  value,
  onChange,
  disabled = false,
  error,
  id = 'star-rating',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const displayedRating = hoverRating ?? value;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(5, (value || 0) + 1);
      onChange(next);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const prev = Math.max(1, (value || 2) - 1);
      onChange(prev);
    } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
      e.preventDefault();
      onChange(parseInt(e.key, 10));
    }
  };

  return (
    <div className="w-full text-center space-y-3">
      <div
        id={id}
        role="radiogroup"
        aria-label="Rating out of 5 stars"
        aria-required="true"
        aria-invalid={Boolean(error)}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        className={cn(
          'inline-flex items-center justify-center gap-2 sm:gap-3 p-2 rounded-2xl transition-all',
          'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
          error && 'ring-1 ring-brand-error/60 bg-brand-error/5',
        )}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayedRating;
          const isSelected = star === value;

          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${star} star${star > 1 ? 's' : ''}${RATING_LABELS[star] ? ` - ${RATING_LABELS[star]}` : ''}`}
              disabled={disabled}
              onClick={() => onChange(star)}
              onMouseEnter={() => !disabled && setHoverRating(star)}
              onMouseLeave={() => !disabled && setHoverRating(null)}
              className={cn(
                'min-w-[48px] min-h-[48px] p-2.5 rounded-2xl flex items-center justify-center transition-all duration-150',
                'touch-manipulation focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-primary',
                disabled && 'cursor-not-allowed opacity-60',
                !disabled && 'cursor-pointer hover:scale-110 active:scale-95',
                isSelected && 'bg-amber-500/10 shadow-xs',
              )}
            >
              <Star
                className={cn(
                  'w-8 h-8 sm:w-9 sm:h-9 transition-colors',
                  isFilled
                    ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                    : 'text-slate-300 fill-transparent hover:text-slate-400',
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Dynamic textual feedback */}
      <div className="min-h-[22px] flex items-center justify-center">
        {displayedRating > 0 ? (
          <span className="text-sm font-bold text-brand-text-primary tracking-tight animate-in fade-in duration-150">
            {RATING_LABELS[displayedRating]} ({displayedRating}/5)
          </span>
        ) : (
          <span className="text-xs text-brand-text-secondary">
            Tap a star to rate your experience
          </span>
        )}
      </div>

      {error && (
        <p role="alert" className="text-xs font-medium text-brand-error">
          {error}
        </p>
      )}
    </div>
  );
}
