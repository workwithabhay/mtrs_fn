'use client';

import * as React from 'react';
import {
  Copy,
  ExternalLink,
  Send,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StarRating } from './star-rating';
import { QuestionInput } from './question-input';
import { submitPublicFeedback, trackGoogleReviewClick } from '@/lib/api/feedback';
import type {
  PublicQrLandingData,
  SubmitFeedbackPayload,
  SubmitFeedbackResult,
} from '@/lib/api/types';
import { cn } from '@/lib/utils';

export interface FeedbackFormProps {
  token: string;
  landingData: PublicQrLandingData;
  onSuccess: (result: SubmitFeedbackResult, rating: number, customerName: string) => void;
}

const SUGGESTED_REVIEWS: Record<number, string[]> = {
  5: [
    'Food was absolutely delicious and freshly prepared! Highly recommended.',
    'Outstanding service, great ambiance, and very hospitable staff.',
    'Authentic flavors and top-notch quality. Will definitely visit again!',
    'Loved the hygiene, taste, and generous portion sizes.',
  ],
  4: [
    'Great experience overall! The food was flavorful and well-served.',
    'Good taste and pleasant atmosphere. Just a minor wait time.',
    'Really enjoyed the meal and prompt service. Keep it up!',
    'Tasty dishes and courteous staff. Would recommend to friends.',
  ],
  3: [
    'Average experience. Food was okay, but service could be faster.',
    'Decent taste, but expected better quality for the price.',
    'The atmosphere was fine, but wait time was longer than expected.',
    'Some dishes were good, but others were underwhelming.',
  ],
  2: [
    'Disappointing visit. Food took too long to arrive and was lukewarm.',
    'Service needs significant improvement in attentiveness and speed.',
    'Taste did not meet expectations, and portion sizes were small.',
    'Not satisfied with the cleanliness and dining setup.',
  ],
  1: [
    'Very poor experience. Food was subpar and service was inattentive.',
    'Unacceptable wait time and rude response from the staff.',
    'Order was delayed and food quality was far below standards.',
    'Would not recommend until management addresses food and service issues.',
  ],
};

export function FeedbackForm({ token, landingData, onSuccess }: FeedbackFormProps) {
  const { campaign, business, googleReviewUrl, feedbackQuestions } = landingData;

  const [rating, setRating] = React.useState<number>(0);
  const [customerName, setCustomerName] = React.useState<string>('');
  const [customerEmail, setCustomerEmail] = React.useState<string>('');
  const [customerPhone, setCustomerPhone] = React.useState<string>('');
  const [text, setText] = React.useState<string>('');
  const [answers, setAnswers] = React.useState<Record<string, string>>({});

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = React.useState<boolean>(false);

  const handleAnswerChange = (questionId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
    if (errors[`q_${questionId}`]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`q_${questionId}`];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!rating || rating < 1 || rating > 5) {
      nextErrors.rating = 'Please select a star rating from 1 to 5.';
    }

    if (!customerName.trim() || customerName.trim().length < 2) {
      nextErrors.customerName = 'Please enter your name (at least 2 characters).';
    } else if (customerName.trim().length > 100) {
      nextErrors.customerName = 'Name cannot exceed 100 characters.';
    }

    const emailTrimmed = customerEmail.trim();
    const phoneTrimmed = customerPhone.trim();

    if (!emailTrimmed && !phoneTrimmed) {
      nextErrors.contact = 'Please provide either an email address or phone number.';
    }

    if (emailTrimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      nextErrors.customerEmail = 'Please provide a valid email address.';
    }

    if (text.length > 2000) {
      nextErrors.text = 'Feedback text cannot exceed 2000 characters.';
    }

    if (feedbackQuestions && feedbackQuestions.length > 0) {
      for (const q of feedbackQuestions) {
        if (q.required) {
          const ans = answers[q.id]?.trim();
          if (!ans) {
            nextErrors[`q_${q.id}`] = 'Please answer this question.';
          }
        }
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedAnswers = Object.entries(answers)
        .filter(([, a]) => a.trim().length > 0)
        .map(([qId, a]) => ({
          questionId: qId,
          answer: a.trim(),
        }));

      const payload: SubmitFeedbackPayload = {
        rating,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        text: text.trim() || null,
        answers: formattedAnswers.length > 0 ? formattedAnswers : undefined,
        consentAccepted: true,
      };

      // 1. Submit review to backend so it's recorded in the business dashboard
      const result = await submitPublicFeedback(token, payload);

      // CASE 1: 4 or 5 stars -> Copy review & proceed to Google Review page
      if (rating >= 4) {
        // Copy text to clipboard if provided
        if (text.trim() && typeof navigator !== 'undefined' && navigator.clipboard) {
          try {
            await navigator.clipboard.writeText(text.trim());
            setCopiedNotification(true);
          } catch {
            // Non-fatal if clipboard permissions blocked
          }
        }

        // Track Google review click telemetry
        if (googleReviewUrl) {
          trackGoogleReviewClick(token).catch(() => {});
          // Smooth redirect to Google Review page
          window.location.href = googleReviewUrl;
          return;
        }

        onSuccess(result, rating, customerName.trim());
      } else {
        // CASE 2: 1, 2, or 3 stars -> Post review internally to business dashboard
        onSuccess(result, rating, customerName.trim());
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit feedback. Please try again.';
      setApiError(msg);
      setIsSubmitting(false);
    }
  };

  const suggestedReviews = rating in SUGGESTED_REVIEWS ? SUGGESTED_REVIEWS[rating] : [];

  return (
    <div className="w-full max-w-xl mx-auto py-6 px-4 space-y-6">
      {/* 1. Header Information */}
      <header className="text-center space-y-2">
        {campaign.branding?.logoUrl && (
          <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden border border-brand-border bg-brand-surface shadow-xs p-1 mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={campaign.branding.logoUrl}
              alt={`${business.name} logo`}
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text-primary tracking-tight">
          {business.name}
        </h1>
        <h2 className="text-base sm:text-lg font-medium text-brand-text-secondary leading-snug">
          {campaign.heading || 'Scan with your camera to share feedback or review'}
        </h2>
        {campaign.description && (
          <p className="text-xs sm:text-sm text-brand-text-muted max-w-md mx-auto leading-relaxed">
            {campaign.description}
          </p>
        )}
      </header>

      {/* Submission Error Banner */}
      {apiError && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-brand-error/10 border border-brand-error/20 flex items-start gap-3 text-xs text-brand-error shadow-xs"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Unable to submit feedback</p>
            <p>{apiError}</p>
          </div>
        </div>
      )}

      {/* Main Feedback Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* 2. Contact Information Card */}
        <Card className="border-brand-border bg-brand-surface shadow-xs">
          <CardHeader className="pb-3 border-b border-brand-border/60">
            <CardTitle className="text-base font-bold text-brand-text-primary">
              Contact Information
            </CardTitle>
            <p className="text-xs text-brand-text-secondary mt-0.5">
              So {business.name} can follow up with you directly if needed.
            </p>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <Input
              id="customer-name"
              label="Your Name"
              required
              placeholder="e.g. Sarah Jenkins"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (errors.customerName) {
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.customerName;
                    return copy;
                  });
                }
              }}
              error={errors.customerName}
              disabled={isSubmitting}
              maxLength={100}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                id="customer-email"
                type="email"
                label="Email Address"
                placeholder="sarah@example.com"
                value={customerEmail}
                onChange={(e) => {
                  setCustomerEmail(e.target.value);
                  if (errors.customerEmail || errors.contact) {
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.customerEmail;
                      delete copy.contact;
                      return copy;
                    });
                  }
                }}
                error={errors.customerEmail}
                disabled={isSubmitting}
              />

              <Input
                id="customer-phone"
                type="tel"
                label="Phone Number"
                placeholder="+1 (555) 000-0000"
                value={customerPhone}
                onChange={(e) => {
                  setCustomerPhone(e.target.value);
                  if (errors.contact) {
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.contact;
                      return copy;
                    });
                  }
                }}
                disabled={isSubmitting}
              />
            </div>

            {errors.contact && (
              <p role="alert" className="text-xs font-medium text-brand-error">
                {errors.contact}
              </p>
            )}
          </CardContent>
        </Card>

        {/* 3. Rating Selection Card */}
        <Card className="border-brand-border bg-brand-surface shadow-xs">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-base font-bold text-brand-text-primary">
              Select Your Rating <span className="text-brand-error">*</span>
            </CardTitle>
            <p className="text-xs text-brand-text-muted mt-0.5">
              {rating === 0 ? 'Tap a star to rate your experience' : `${rating} out of 5 stars`}
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            <StarRating
              value={rating}
              onChange={(nextRating) => {
                setRating(nextRating);
                if (errors.rating) {
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.rating;
                    return copy;
                  });
                }
              }}
              disabled={isSubmitting}
              error={errors.rating}
            />
          </CardContent>
        </Card>

        {/* 4. When rating is selected -> Reveal Comments & Suggested Reviews & CTA */}
        {rating > 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Comments Card */}
            <Card className="border-brand-border bg-brand-surface shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-brand-text-primary">
                  Your Comments & Experience
                </CardTitle>
                <p className="text-xs text-brand-text-secondary mt-0.5">
                  Tap an auto-suggested review below or write your own comments.
                </p>
              </CardHeader>
              <CardContent className="pt-2 space-y-3.5">
                {/* Auto Suggestions Chips */}
                {suggestedReviews.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-brand-text-muted uppercase tracking-wider">
                      Auto-Suggested Reviews
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {suggestedReviews.map((suggestion, idx) => {
                        const isSelected = text === suggestion;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setText(isSelected ? '' : suggestion);
                              if (errors.text) {
                                setErrors((prev) => {
                                  const copy = { ...prev };
                                  delete copy.text;
                                  return copy;
                                });
                              }
                            }}
                            className={cn(
                              'text-left text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer',
                              isSelected
                                ? 'bg-brand-primary text-white border-brand-primary shadow-xs font-medium'
                                : 'bg-brand-background/60 hover:bg-brand-surface border-brand-border text-brand-text-secondary hover:text-brand-text-primary',
                            )}
                          >
                            {isSelected && <span className="mr-1.5 font-bold">✓</span>}
                            {suggestion}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Textarea
                  id="customer-text"
                  placeholder="Tell us what you loved, or how we could do better next time..."
                  rows={4}
                  maxLength={2000}
                  showCount
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    if (errors.text) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.text;
                        return copy;
                      });
                    }
                  }}
                  error={errors.text}
                  disabled={isSubmitting}
                />
              </CardContent>
            </Card>

            {/* Optional Questions configured by business */}
            {feedbackQuestions && feedbackQuestions.length > 0 && (
              <Card className="border-brand-border bg-brand-surface shadow-xs">
                <CardHeader className="pb-3 border-b border-brand-border/60">
                  <CardTitle className="text-sm font-bold text-brand-text-primary">
                    A Few Quick Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {feedbackQuestions.map((q) => (
                    <QuestionInput
                      key={q.id}
                      question={q}
                      value={answers[q.id] || ''}
                      onChange={(val) => handleAnswerChange(q.id, val)}
                      error={errors[`q_${q.id}`]}
                      disabled={isSubmitting}
                    />
                  ))}
                </CardContent>
              </Card>
            )}

            {/* 5. CTA Button with 2 cases */}
            <div className="pt-2 space-y-2">
              {rating >= 4 ? (
                /* CASE 1: 4 or 5 stars -> Copy & Proceed */
                <>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full justify-center h-12 text-sm font-semibold rounded-xl shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>Saving & Redirecting to Google...</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        <span>Copy & Proceed</span>
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  <p className="text-[11px] text-center text-brand-text-muted">
                    Copies your review to clipboard and opens the Google Review page.
                  </p>
                </>
              ) : (
                /* CASE 2: 1, 2 or 3 stars -> Post your review */
                <>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full justify-center h-12 text-sm font-semibold rounded-xl shadow-xs"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>Posting Your Review...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        <span>Post your review</span>
                      </>
                    )}
                  </Button>
                  <p className="text-[11px] text-center text-brand-text-muted">
                    Your feedback will be delivered directly to {business.name} management.
                  </p>
                </>
              )}
            </div>

            {copiedNotification && (
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Review copied to clipboard!</span>
              </div>
            )}
          </div>
        )}

        {/* Security / Privacy footer */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-text-muted pt-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Protected by ReviewFlow • Customer Privacy First</span>
        </div>
      </form>
    </div>
  );
}
