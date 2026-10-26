import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FeedbackForm } from '@/components/feedback/feedback-form';
import { FeedbackSuccess } from '@/components/feedback/feedback-success';
import * as feedbackApi from '@/lib/api/feedback';
import type { PublicQrLandingData } from '@/lib/api/types';

const baseLandingData: PublicQrLandingData = {
  campaign: {
    title: 'Cafe Stand',
    heading: 'Rate your coffee',
    description: null,
    branding: {},
  },
  business: {
    name: 'Espresso Bar',
  },
  googleReviewUrl: 'https://g.page/r/espresso-bar/review',
  feedbackQuestions: [],
};

describe('Google Review Routing & Feedback Behavior', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('provides Copy & Proceed CTA for 4 and 5 star ratings', () => {
    render(
      <FeedbackForm
        token="tok_policy"
        landingData={baseLandingData}
        onSuccess={vi.fn()}
      />,
    );

    // Initial state: comments & CTA hidden before rating selected
    expect(screen.queryByRole('button', { name: /copy & proceed/i })).not.toBeInTheDocument();

    // Select 4 stars
    fireEvent.click(screen.getByRole('radio', { name: /4 stars/i }));
    expect(screen.getByRole('button', { name: /copy & proceed/i })).toBeInTheDocument();

    // Select 5 stars
    fireEvent.click(screen.getByRole('radio', { name: /5 stars/i }));
    expect(screen.getByRole('button', { name: /copy & proceed/i })).toBeInTheDocument();
  });

  it('provides Post your review CTA for 1, 2, and 3 star ratings', () => {
    render(
      <FeedbackForm
        token="tok_policy"
        landingData={baseLandingData}
        onSuccess={vi.fn()}
      />,
    );

    // Select 1 star
    fireEvent.click(screen.getByRole('radio', { name: /1 star/i }));
    expect(screen.getByRole('button', { name: /post your review/i })).toBeInTheDocument();

    // Select 2 stars
    fireEvent.click(screen.getByRole('radio', { name: /2 stars/i }));
    expect(screen.getByRole('button', { name: /post your review/i })).toBeInTheDocument();

    // Select 3 stars
    fireEvent.click(screen.getByRole('radio', { name: /3 stars/i }));
    expect(screen.getByRole('button', { name: /post your review/i })).toBeInTheDocument();
  });

  it('FeedbackSuccess provides Proceed to Google Reviews button for 4+ star reviews and internal thank you for 1-3 stars', () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const trackClickSpy = vi.spyOn(feedbackApi, 'trackGoogleReviewClick').mockResolvedValue({
      destinationUrl: 'https://g.page/r/espresso-bar/review',
    });

    // Case A: 1-star review success
    const { rerender } = render(
      <FeedbackSuccess
        businessName="Espresso Bar"
        customerName="Robert"
        googleReviewUrl="https://g.page/r/espresso-bar/review"
        token="tok_policy"
        rating={1}
      />,
    );

    // For 1-3 stars, thank you message is delivered internally to management
    expect(screen.getByText(/delivered directly to the management team/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /proceed to google reviews/i })).not.toBeInTheDocument();

    // Case B: 5-star review success
    rerender(
      <FeedbackSuccess
        businessName="Espresso Bar"
        customerName="Alice"
        googleReviewUrl="https://g.page/r/espresso-bar/review"
        token="tok_policy"
        rating={5}
      />,
    );

    expect(screen.getByRole('button', { name: /proceed to google reviews/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /proceed to google reviews/i }));

    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://g.page/r/espresso-bar/review',
      '_blank',
      'noopener,noreferrer',
    );
    expect(trackClickSpy).toHaveBeenCalledWith('tok_policy');
  });
});
