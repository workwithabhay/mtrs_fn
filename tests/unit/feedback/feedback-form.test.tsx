import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FeedbackForm } from '@/components/feedback/feedback-form';
import * as feedbackApi from '@/lib/api/feedback';
import type { PublicQrLandingData } from '@/lib/api/types';

const mockLandingData: PublicQrLandingData = {
  campaign: {
    title: 'Front Counter',
    heading: 'How was your experience today?',
    description: 'We appreciate your time',
    branding: {
      primaryColor: '#2563EB',
    },
  },
  business: {
    name: 'Artisan Bakery',
  },
  googleReviewUrl: 'https://g.page/r/artisan-bakery/review',
  feedbackQuestions: [
    {
      id: 'freshness',
      label: 'Were the pastries fresh?',
      type: 'single_choice',
      required: true,
      options: ['Very Fresh', 'Moderate', 'Stale'],
    },
  ],
};

describe('FeedbackForm Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders business header, contact information first, and rating selector', () => {
    render(
      <FeedbackForm
        token="tok_test"
        landingData={mockLandingData}
        onSuccess={vi.fn()}
      />,
    );

    // Business Name & Heading & Description
    expect(screen.getByRole('heading', { level: 1, name: 'Artisan Bakery' })).toBeInTheDocument();
    expect(screen.getByText('How was your experience today?')).toBeInTheDocument();
    expect(screen.getByText('We appreciate your time')).toBeInTheDocument();

    // Contact Information
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText(/So Artisan Bakery can follow up with you directly if needed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();

    // Rating Selector
    expect(screen.getByText(/select your rating/i)).toBeInTheDocument();

    // Before selecting a rating, comments and CTA are not shown yet
    expect(screen.queryByText(/your comments & experience/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /copy & proceed/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /post your review/i })).not.toBeInTheDocument();
  });

  it('reveals comments, auto-suggested reviews, and Copy & Proceed button when 4 or 5 stars selected', () => {
    render(
      <FeedbackForm
        token="tok_test"
        landingData={mockLandingData}
        onSuccess={vi.fn()}
      />,
    );

    // Click 5 stars
    const star5 = screen.getByRole('radio', { name: /5 stars/i });
    fireEvent.click(star5);

    // Comments & suggestions revealed
    expect(screen.getByText(/your comments & experience/i)).toBeInTheDocument();
    expect(screen.getByText(/auto-suggested reviews/i)).toBeInTheDocument();

    // Verify 5-star suggestions exist
    const suggestionBtn = screen.getByRole('button', { name: /food was absolutely delicious/i });
    expect(suggestionBtn).toBeInTheDocument();

    // Verify CTA is "Copy & Proceed"
    expect(screen.getByRole('button', { name: /copy & proceed/i })).toBeInTheDocument();
  });

  it('reveals comments, constructive suggestions, and Post your review button when 1, 2, or 3 stars selected', () => {
    render(
      <FeedbackForm
        token="tok_test"
        landingData={mockLandingData}
        onSuccess={vi.fn()}
      />,
    );

    // Click 2 stars
    const star2 = screen.getByRole('radio', { name: /2 stars/i });
    fireEvent.click(star2);

    // Comments & suggestions revealed
    expect(screen.getByText(/your comments & experience/i)).toBeInTheDocument();

    // Verify constructive suggestions exist
    expect(screen.getByRole('button', { name: /disappointing visit/i })).toBeInTheDocument();

    // Verify CTA is "Post your review"
    expect(screen.getByRole('button', { name: /post your review/i })).toBeInTheDocument();
  });

  it('populates textarea when an auto-suggested review is clicked', () => {
    render(
      <FeedbackForm
        token="tok_test"
        landingData={mockLandingData}
        onSuccess={vi.fn()}
      />,
    );

    // Select 5 stars
    fireEvent.click(screen.getByRole('radio', { name: /5 stars/i }));

    // Click suggestion
    const suggestionBtn = screen.getByRole('button', { name: /food was absolutely delicious/i });
    fireEvent.click(suggestionBtn);

    const textarea = screen.getByPlaceholderText(/tell us what you loved/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain('Food was absolutely delicious');
  });

  it('validates contact details (name and at least email or phone)', async () => {
    render(
      <FeedbackForm
        token="tok_test"
        landingData={mockLandingData}
        onSuccess={vi.fn()}
      />,
    );

    // Select 3 stars
    fireEvent.click(screen.getByRole('radio', { name: /3 stars/i }));

    const submitBtn = screen.getByRole('button', { name: /post your review/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/please enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/please provide either an email address or phone number/i)).toBeInTheDocument();
  });

  it('submits 4-star review, copies to clipboard, and redirects to Google Review page', async () => {
    const handleSuccess = vi.fn();
    const submitSpy = vi.spyOn(feedbackApi, 'submitPublicFeedback').mockResolvedValue({
      message: 'Feedback submitted successfully',
      feedbackId: 'fb_123',
      googleReviewUrl: 'https://g.page/r/artisan-bakery/review',
    });

    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextSpy },
    });

    // Mock window.location
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
      configurable: true,
    });

    render(
      <FeedbackForm
        token="tok_test"
        landingData={mockLandingData}
        onSuccess={handleSuccess}
      />,
    );

    // Fill contact info
    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'Sarah Jenkins' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'sarah@example.com' } });

    // Select 4 stars
    fireEvent.click(screen.getByRole('radio', { name: /4 stars/i }));

    // Fill comment
    const textarea = screen.getByPlaceholderText(/tell us what you loved/i);
    fireEvent.change(textarea, { target: { value: 'Great bakery and excellent croissants!' } });

    // Answer required question
    fireEvent.click(screen.getByLabelText('Very Fresh'));

    // Click Copy & Proceed
    const proceedBtn = screen.getByRole('button', { name: /copy & proceed/i });
    fireEvent.click(proceedBtn);

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledTimes(1);
    });

    expect(submitSpy).toHaveBeenCalledWith('tok_test', expect.objectContaining({
      rating: 4,
      customerName: 'Sarah Jenkins',
      customerEmail: 'sarah@example.com',
      text: 'Great bakery and excellent croissants!',
      consentAccepted: true,
    }));

    // Clipboard copied
    expect(writeTextSpy).toHaveBeenCalledWith('Great bakery and excellent croissants!');

    // Redirected to Google review URL
    expect(window.location.href).toBe('https://g.page/r/artisan-bakery/review');

    // Restore location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  it('submits 2-star review internally and calls onSuccess', async () => {
    const handleSuccess = vi.fn();
    const submitSpy = vi.spyOn(feedbackApi, 'submitPublicFeedback').mockResolvedValue({
      message: 'Feedback submitted successfully',
      feedbackId: 'fb_low_rating',
      googleReviewUrl: null,
    });

    render(
      <FeedbackForm
        token="tok_test"
        landingData={mockLandingData}
        onSuccess={handleSuccess}
      />,
    );

    // Fill contact info
    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'Alex Morgan' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+1234567890' } });

    // Select 2 stars
    fireEvent.click(screen.getByRole('radio', { name: /2 stars/i }));

    // Answer required question
    fireEvent.click(screen.getByLabelText('Very Fresh'));

    // Click Post your review
    const postBtn = screen.getByRole('button', { name: /post your review/i });
    fireEvent.click(postBtn);

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledTimes(1);
    });

    expect(handleSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ feedbackId: 'fb_low_rating' }),
      2,
      'Alex Morgan',
    );
  });
});
