import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FeedbackStatusBadge } from '@/components/inbox/feedback-status-badge';

describe('FeedbackStatusBadge Component', () => {
  it('renders "New" badge for new status', () => {
    render(<FeedbackStatusBadge status="new" />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders "Reviewed" badge for reviewed status', () => {
    render(<FeedbackStatusBadge status="reviewed" />);
    expect(screen.getByText('Reviewed')).toBeInTheDocument();
  });

  it('renders "Resolved" badge for resolved status', () => {
    render(<FeedbackStatusBadge status="resolved" />);
    expect(screen.getByText('Resolved')).toBeInTheDocument();
  });
});
