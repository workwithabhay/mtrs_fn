import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FeedbackDetailDrawer } from '@/components/inbox/feedback-detail-drawer';
import * as inboxApi from '@/lib/api/feedback-inbox';
import type { OwnerFeedbackItem } from '@/lib/api/types';

const mockFeedback: OwnerFeedbackItem = {
  _id: 'fb_100',
  businessId: 'biz_1',
  qrCampaignId: { title: 'Patio Table 2' },
  customerId: { name: 'Eleanor Vance', email: 'eleanor@hillhouse.com', phone: '+15559876543' },
  rating: 4,
  text: 'Atmosphere was lovely and prompt service.',
  answers: [
    { questionId: 'q1', questionLabel: 'Seating Comfort', answer: 'Very comfortable' },
  ],
  status: 'new',
  consentAccepted: true,
  createdAt: '2026-10-24T15:30:00.000Z',
  updatedAt: '2026-10-24T15:30:00.000Z',
};

describe('FeedbackDetailDrawer Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders customer name, contact details, rating, touchpoint, and question answers', () => {
    render(
      <FeedbackDetailDrawer
        feedback={mockFeedback}
        isOpen={true}
        onClose={vi.fn()}
        onStatusUpdated={vi.fn()}
      />,
    );

    expect(screen.getByText('Eleanor Vance')).toBeInTheDocument();
    expect(screen.getByText('eleanor@hillhouse.com')).toBeInTheDocument();
    expect(screen.getByText('+15559876543')).toBeInTheDocument();
    expect(screen.getByText('4/5 Stars')).toBeInTheDocument();
    expect(screen.getByText(/touchpoint: patio table 2/i)).toBeInTheDocument();
    expect(screen.getByText('Atmosphere was lovely and prompt service.')).toBeInTheDocument();
    expect(screen.getByText('Seating Comfort')).toBeInTheDocument();
    expect(screen.getByText('Very comfortable')).toBeInTheDocument();
  });

  it('updates status to reviewed when Mark as Reviewed is clicked', async () => {
    const handleStatusUpdated = vi.fn();
    const updateSpy = vi.spyOn(inboxApi, 'updateOwnerFeedbackStatus').mockResolvedValue({
      ...mockFeedback,
      status: 'reviewed',
    });

    render(
      <FeedbackDetailDrawer
        feedback={mockFeedback}
        isOpen={true}
        onClose={vi.fn()}
        onStatusUpdated={handleStatusUpdated}
      />,
    );

    const markReviewedBtn = screen.getByRole('button', { name: /mark as reviewed/i });
    fireEvent.click(markReviewedBtn);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith('fb_100', 'reviewed');
    });

    expect(handleStatusUpdated).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'reviewed' }),
    );
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <FeedbackDetailDrawer
        feedback={mockFeedback}
        isOpen={true}
        onClose={handleClose}
        onStatusUpdated={vi.fn()}
      />,
    );

    const closeBtn = screen.getByRole('button', { name: /close feedback detail/i });
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
