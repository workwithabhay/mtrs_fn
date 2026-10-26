'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { FeedbackQuestion } from '@/lib/api/types';

export interface QuestionInputProps {
  question: FeedbackQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function QuestionInput({
  question,
  value,
  onChange,
  error,
  disabled = false,
}: QuestionInputProps) {
  const inputId = `question-${question.id}`;

  if (question.type === 'single_choice' && question.options && question.options.length > 0) {
    return (
      <div className="space-y-2 text-left">
        <label id={`${inputId}-label`} className="text-xs font-semibold text-brand-text-primary block">
          {question.label}
          {question.required && <span className="text-brand-error ml-0.5">*</span>}
        </label>

        <div
          role="radiogroup"
          aria-labelledby={`${inputId}-label`}
          aria-required={question.required}
          aria-invalid={Boolean(error)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2"
        >
          {question.options.map((option) => {
            const isSelected = value === option;
            const optionId = `${inputId}-${option.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

            return (
              <label
                key={option}
                htmlFor={optionId}
                className={cn(
                  'flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all',
                  'touch-manipulation select-none active:scale-[0.98]',
                  isSelected
                    ? 'border-brand-primary bg-brand-primary/10 text-brand-primary font-semibold shadow-xs'
                    : 'border-brand-border bg-brand-surface text-brand-text-primary hover:bg-slate-50',
                  disabled && 'cursor-not-allowed opacity-60',
                )}
              >
                <input
                  id={optionId}
                  type="radio"
                  name={inputId}
                  value={option}
                  checked={isSelected}
                  disabled={disabled}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-4 h-4 text-brand-primary border-brand-border focus:ring-brand-primary focus:ring-offset-0"
                />
                <span className="flex-1">{option}</span>
              </label>
            );
          })}
        </div>

        {error && (
          <p role="alert" className="text-xs font-medium text-brand-error mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (question.type === 'long_text') {
    return (
      <Textarea
        id={inputId}
        label={question.label}
        required={question.required}
        placeholder="Type your response here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        disabled={disabled}
        rows={3}
        maxLength={1000}
        showCount
      />
    );
  }

  // Default to text input
  return (
    <Input
      id={inputId}
      label={question.label}
      required={question.required}
      placeholder="Type your answer here..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      disabled={disabled}
      maxLength={500}
    />
  );
}
