import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FeedbackInbox } from '@/components/inbox/feedback-inbox';
import * as inboxApi from '@/lib/api/feedback-inbox';
import type { OwnerFeedbackPaginatedResult } from '@/lib/api/types';

const mockPaginatedResult: OwnerFeedbackPaginatedResult = {
  feedbacks: [
    {
      _id: 'fb_1',
      businessId: 'biz_1',
      qrCampaignId: { title: 'Main Dining Room' },
      customerId: { name: 'Marcus Cole', email: 'marcus@example.com' },
      rating: 5,
      text: 'Best steak in town!',
      answers: [],
      status: 'new',
      consentAccepted: true,
      createdAt: '2026-10-24T16:00:00.000Z',
      updatedAt: '2026-10-24T16:00:00.000Z',
    },
    {
      _id: 'fb_2',
      businessId: 'biz_1',
      qrCampaignId: { title: 'Bar Touchpoint' },
      customerId: { name: 'Diana Troy', email: 'diana@example.com' },
      rating: 2,
      text: 'Cocktails were too sweet.',
      answers: [],
      status: 'reviewed',
      consentAccepted: true,
      createdAt: '2026-10-24T16:15:00.000Z',
      updatedAt: '2026-10-24T16:15:00.000Z',
    },
  ],
  meta: {
    total: 2,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
};

describe('FeedbackInbox Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading skeleton then loads feedback records and KPI counts', async () => {
    vi.spyOn(inboxApi, 'listOwnerFeedbacks').mockResolvedValue(mockPaginatedResult);

    render(<FeedbackInbox />);

    expect(screen.getByRole('status', { name: /loading feedback records/i })).toBeInTheDocument();

    const marcusElements = await screen.findAllByText('Marcus Cole');
    expect(marcusElements[0]).toBeInTheDocument();
    expect(screen.getAllByText('Diana Troy')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Best steak in town!')[0]).toBeInTheDocument();
    expect(screen.getAllByText('2').length).toBeGreaterThan(0); // KPI count and rating
  });

  it('renders truthful empty state when no customer feedback has been received', async () => {
    vi.spyOn(inboxApi, 'listOwnerFeedbacks').mockResolvedValue({
      feedbacks: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
    });

    render(<FeedbackInbox />);

    expect(await screen.findByText('No Customer Feedback Yet')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /manage qr campaigns/i })).toBeInTheDocument();
  });

  it('renders no-matching-filters state when filtering produces 0 results', async () => {
    vi.spyOn(inboxApi, 'listOwnerFeedbacks').mockResolvedValue({
      feedbacks: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
    });

    render(<FeedbackInbox />);

    // Apply rating filter
    const ratingSelect = await screen.findByDisplayValue(/all ratings/i);
    fireEvent.change(ratingSelect, { target: { value: '1' } });

    expect(await screen.findByText('No Feedback Matches Selected Filters')).toBeInTheDocument();
  });

  it('opens detail drawer when a feedback row is clicked', async () => {
    vi.spyOn(inboxApi, 'listOwnerFeedbacks').mockResolvedValue(mockPaginatedResult);

    render(<FeedbackInbox />);

    const customers = await screen.findAllByText('Marcus Cole');
    fireEvent.click(customers[0]);

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Customer Feedback Record')).toBeInTheDocument();
  });
});
