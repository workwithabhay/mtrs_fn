'use client';

import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { AiDisclaimerBanner } from './ai-disclaimer-banner';
import { AiStudioWorkspace } from './ai-studio-workspace';

export function AiStudioContainer() {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header section */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-text-primary">
            AI Feedback Studio
          </h1>
        </div>
        <p className="text-sm text-brand-text-secondary max-w-2xl">
          Improve the wording, clarity, and tone of feedback you have written or received, while
          strictly preserving the original author&apos;s meaning, facts, and sentiment.
        </p>
      </div>

      {/* Ethical Boundaries / Human-in-the-loop Banner */}
      <AiDisclaimerBanner />

      {/* Main Side-by-Side Comparison Workspace */}
      <AiStudioWorkspace />
    </div>
  );
}
