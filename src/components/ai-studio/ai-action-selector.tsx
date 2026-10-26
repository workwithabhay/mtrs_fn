'use client';

import * as React from 'react';
import { SpellCheck, Sparkles, Minimize2, Briefcase } from 'lucide-react';
import type { AiEditingAction } from '@/lib/api/types';
import { cn } from '@/lib/utils';

export interface ActionOption {
  id: AiEditingAction;
  title: string;
  badge: string;
  description: string;
  icon: React.ElementType;
}

export const EDITING_ACTIONS: ActionOption[] = [
  {
    id: 'fix_grammar',
    title: 'Fix Grammar',
    badge: 'Accuracy',
    description: 'Fix spelling, punctuation, and typos while keeping original words and meaning intact.',
    icon: SpellCheck,
  },
  {
    id: 'improve_clarity',
    title: 'Improve Clarity',
    badge: 'Readability',
    description: 'Untangle awkward sentences to make customer feedback clear and straightforward.',
    icon: Sparkles,
  },
  {
    id: 'make_concise',
    title: 'Make Concise',
    badge: 'Brevity',
    description: 'Eliminate filler phrases and repetition while preserving all factual details.',
    icon: Minimize2,
  },
  {
    id: 'professional_tone',
    title: 'Professional Tone',
    badge: 'Polished',
    description: 'Refine colloquial or informal phrasing into courteous, business-ready language.',
    icon: Briefcase,
  },
];

interface AiActionSelectorProps {
  selectedAction: AiEditingAction;
  onSelectAction: (action: AiEditingAction) => void;
  disabled?: boolean;
}

export function AiActionSelector({
  selectedAction,
  onSelectAction,
  disabled = false,
}: AiActionSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-brand-text-primary block">
        Editing Action
      </label>
      <div
        role="radiogroup"
        aria-label="Select AI editing action"
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
      >
        {EDITING_ACTIONS.map((action) => {
          const isSelected = selectedAction === action.id;
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onSelectAction(action.id)}
              className={cn(
                'relative flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1',
                isSelected
                  ? 'border-brand-primary bg-brand-primary/5 text-brand-text-primary shadow-xs ring-1 ring-brand-primary/40'
                  : 'border-brand-border bg-brand-surface hover:bg-slate-50 text-brand-text-primary',
                disabled && 'opacity-60 cursor-not-allowed hover:bg-brand-surface',
              )}
            >
              <div
                className={cn(
                  'p-2 rounded-lg shrink-0 transition-colors',
                  isSelected
                    ? 'bg-brand-primary text-white'
                    : 'bg-slate-100 text-brand-text-secondary',
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-sm font-semibold text-brand-text-primary truncate">
                    {action.title}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0',
                      isSelected
                        ? 'bg-brand-primary/15 text-brand-primary font-semibold'
                        : 'bg-slate-100 text-brand-text-secondary',
                    )}
                  >
                    {action.badge}
                  </span>
                </div>
                <p className="text-xs text-brand-text-secondary line-clamp-2 leading-relaxed">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
