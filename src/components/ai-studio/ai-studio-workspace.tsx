'use client';

import * as React from 'react';
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  AlertCircle,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/toast';
import { AiActionSelector, EDITING_ACTIONS } from './ai-action-selector';
import { requestAiAssistance } from '@/lib/api/ai-studio';
import type { AiEditingAction } from '@/lib/api/types';
import { cn } from '@/lib/utils';

const MIN_LENGTH = 10;
const MAX_LENGTH = 2000;

interface SampleDraft {
  label: string;
  action: AiEditingAction;
  text: string;
}

const SAMPLE_DRAFTS: SampleDraft[] = [
  {
    label: 'Grammar Sample',
    action: 'fix_grammar',
    text: 'teh dessert was recieved late and i was unhappy with the wait staff.',
  },
  {
    label: 'Wordy Sample',
    action: 'make_concise',
    text: 'In my personal opinion and from my perspective, the service provided by the staff was very fast.',
  },
  {
    label: 'Informal Sample',
    action: 'professional_tone',
    text: 'We wanna come back because we are gonna recommend this place to all our friends.',
  },
  {
    label: 'Clarity Sample',
    action: 'improve_clarity',
    text: 'The food it had flavor but the place was full of noise and hard to talk with friends.',
  },
];

export function AiStudioWorkspace() {
  const [originalText, setOriginalText] = React.useState('');
  const [selectedAction, setSelectedAction] = React.useState<AiEditingAction>('fix_grammar');
  const [suggestedText, setSuggestedText] = React.useState('');
  const [appliedMode, setAppliedMode] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isOutdated, setIsOutdated] = React.useState(false);
  const [isAccepted, setIsAccepted] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Snapshot of source text used for generation
  const lastGeneratedSourceRef = React.useRef<string>('');

  const trimmedLength = originalText.trim().length;
  const isInputValid = trimmedLength >= MIN_LENGTH && trimmedLength <= MAX_LENGTH;

  // Handle source text changes
  const handleOriginalTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setOriginalText(val);
    setErrorMessage(null);

    if (suggestedText) {
      if (val.trim() !== lastGeneratedSourceRef.current.trim()) {
        setIsOutdated(true);
      } else {
        setIsOutdated(false);
      }
    }
  };

  // Generate revision
  const handleGenerate = async () => {
    if (!isInputValid || isGenerating) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setIsAccepted(false);

    try {
      const response = await requestAiAssistance({
        draftText: originalText.trim(),
        action: selectedAction,
      });

      setSuggestedText(response.suggestedText);
      setAppliedMode(response.mode || selectedAction);
      lastGeneratedSourceRef.current = originalText.trim();
      setIsOutdated(false);
      toast.success('Proposed revision generated successfully');
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to generate revision. Please check your network and try again.';
      setErrorMessage(msg);
      toast.error('Failed to generate revision');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (!suggestedText) return;

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(suggestedText);
      }
      setCopied(true);
      toast.success('Revised text copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Could not copy to clipboard. Please copy manually.');
    }
  };

  // Explicit Accept
  const handleAccept = () => {
    if (!suggestedText) return;
    setIsAccepted(true);
    toast.success('Revision accepted in workspace. Content remains unchanged until saved.');
  };

  // Discard revision
  const handleDiscard = () => {
    setSuggestedText('');
    setAppliedMode(null);
    setIsOutdated(false);
    setIsAccepted(false);
    lastGeneratedSourceRef.current = '';
    toast.info('Proposed revision discarded');
  };

  // Load sample draft
  const handleLoadSample = (sample: SampleDraft) => {
    setOriginalText(sample.text);
    setSelectedAction(sample.action);
    setErrorMessage(null);
    if (suggestedText) {
      setIsOutdated(true);
    }
  };

  // Clear workspace
  const handleClearOriginal = () => {
    setOriginalText('');
    setErrorMessage(null);
    if (suggestedText) {
      setIsOutdated(true);
    }
  };

  const actionMeta = EDITING_ACTIONS.find((a) => a.id === (appliedMode || selectedAction));

  return (
    <div className="space-y-6">
      {/* Sample presets bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-brand-surface rounded-xl border border-brand-border text-xs">
        <span className="font-semibold text-brand-text-secondary flex items-center gap-1.5 shrink-0">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Quick test samples:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {SAMPLE_DRAFTS.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => handleLoadSample(sample)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-brand-primary/10 hover:text-brand-primary text-brand-text-secondary font-medium transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT COLUMN: Original Text & Actions */}
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-primary" />
              <h2 className="text-sm font-semibold text-brand-text-primary">
                Original Feedback
              </h2>
            </div>
            {originalText && (
              <button
                type="button"
                onClick={handleClearOriginal}
                className="text-xs text-brand-text-secondary hover:text-brand-error transition-colors flex items-center gap-1"
                aria-label="Clear original text"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            <Textarea
              id="original-feedback-input"
              label="Feedback draft or review text"
              placeholder="Paste or write customer feedback, internal review notes, or draft responses here (10 to 2,000 characters)..."
              value={originalText}
              onChange={handleOriginalTextChange}
              rows={8}
              maxLength={MAX_LENGTH}
              showCount
              disabled={isGenerating}
              error={
                originalText.length > 0 && trimmedLength < MIN_LENGTH
                  ? `Please enter at least ${MIN_LENGTH} characters (${trimmedLength}/${MIN_LENGTH})`
                  : undefined
              }
              helperText="ReviewFlow will never alter meaning, facts, customer complaints, or ratings."
            />
          </div>

          <AiActionSelector
            selectedAction={selectedAction}
            onSelectAction={setSelectedAction}
            disabled={isGenerating}
          />

          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-2.5 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Action could not be completed</p>
                <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!isInputValid || isGenerating}
              isLoading={isGenerating}
              onClick={handleGenerate}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Revision
            </Button>
            {!isInputValid && originalText.length === 0 && (
              <p className="text-[11px] text-center text-brand-text-secondary mt-2">
                Type at least 10 characters to generate an AI revision.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Proposed Revision & Controls */}
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-6 space-y-5 shadow-xs flex flex-col justify-between min-h-[460px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-primary" />
                <h2 className="text-sm font-semibold text-brand-text-primary">
                  Proposed Revision
                </h2>
              </div>

              {suggestedText && (
                <div className="flex items-center gap-2">
                  {isAccepted ? (
                    <Badge variant="success" className="text-[10px] gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Accepted
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">
                      {actionMeta?.badge || 'Revision'}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Outdated warning if source was altered */}
            {isOutdated && suggestedText && (
              <div
                role="status"
                className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Original draft changed since this revision was generated.</span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs px-2.5 shrink-0 bg-white"
                  onClick={handleGenerate}
                  disabled={!isInputValid || isGenerating}
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Regenerate
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!suggestedText && !isGenerating && (
              <div
                className="py-16 text-center rounded-xl border border-dashed border-brand-border bg-slate-50/50 flex flex-col items-center justify-center p-6 text-brand-text-secondary"
                aria-live="polite"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-brand-text-primary mb-1">
                  Ready to Polish Feedback
                </h3>
                <p className="text-xs max-w-xs leading-relaxed text-brand-text-secondary">
                  Enter your draft feedback on the left, pick an editing action, and click{' '}
                  <strong className="text-brand-text-primary">Generate Revision</strong> to review
                  side-by-side improvements.
                </p>
              </div>
            )}

            {/* Loading State */}
            {isGenerating && (
              <div
                className="py-16 text-center rounded-xl border border-brand-border bg-slate-50/30 flex flex-col items-center justify-center p-6"
                aria-live="polite"
              >
                <div className="w-10 h-10 rounded-full border-2 border-brand-primary border-t-transparent animate-spin mb-4" />
                <h3 className="text-sm font-semibold text-brand-text-primary mb-1">
                  Polishing Feedback Expression...
                </h3>
                <p className="text-xs text-brand-text-secondary max-w-xs">
                  Constraining model to preserve your exact facts, customer claims, and sentiment.
                </p>
              </div>
            )}

            {/* Revision Editor */}
            {suggestedText && !isGenerating && (
              <div className="space-y-3">
                <Textarea
                  id="revised-feedback-output"
                  label="Editable Proposed Text"
                  aria-label="Editable AI proposed revision"
                  value={suggestedText}
                  onChange={(e) => {
                    setSuggestedText(e.target.value);
                    setIsAccepted(false);
                  }}
                  rows={8}
                  helperText="You can manually edit every word of the proposed revision above."
                  className={cn(
                    'bg-white transition-colors',
                    isAccepted && 'border-emerald-500 ring-1 ring-emerald-500/30',
                  )}
                />

                <div className="flex items-center justify-between text-xs text-brand-text-secondary pt-1 px-1">
                  <span>
                    Word count:{' '}
                    <strong className="text-brand-text-primary">
                      {suggestedText.trim() ? suggestedText.trim().split(/\s+/).length : 0}
                    </strong>{' '}
                    (original:{' '}
                    {originalText.trim() ? originalText.trim().split(/\s+/).length : 0})
                  </span>
                  <span>
                    Action applied:{' '}
                    <strong className="text-brand-text-primary">
                      {actionMeta?.title || 'Custom'}
                    </strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons for Revision */}
          {suggestedText && !isGenerating && (
            <div className="pt-4 border-t border-brand-border space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={isAccepted ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={handleAccept}
                    disabled={isAccepted}
                    aria-label="Accept proposed revision"
                  >
                    <Check className="w-4 h-4 mr-1.5" />
                    {isAccepted ? 'Accepted' : 'Accept Revision'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    aria-label="Copy proposed revision to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-1.5 text-emerald-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1.5" />
                        Copy Text
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerate}
                    disabled={!isInputValid || isGenerating}
                    title="Regenerate revision"
                    aria-label="Regenerate revision"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Regenerate
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDiscard}
                    className="text-brand-text-secondary hover:text-brand-error"
                    aria-label="Discard revision"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Discard
                  </Button>
                </div>
              </div>

              <p className="text-[11px] text-brand-text-secondary leading-normal">
                * Note: Accepting or copying this revision does not publish or overwrite any saved records.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
