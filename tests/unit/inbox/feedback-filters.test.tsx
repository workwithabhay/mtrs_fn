import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FeedbackFilters } from '@/components/inbox/feedback-filters';

describe('FeedbackFilters Component', () => {
  it('renders search input, rating select, status select, and sort select', () => {
    render(
      <FeedbackFilters
        filters={{}}
        onChange={vi.fn()}
        onReset={vi.fn()}
        totalResults={42}
      />,
    );

    expect(screen.getByPlaceholderText(/search name or comments/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/all ratings/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/all statuses/i)).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('triggers onChange when rating filter is selected', () => {
    const handleChange = vi.fn();
    render(
      <FeedbackFilters
        filters={{}}
        onChange={handleChange}
        onReset={vi.fn()}
        totalResults={10}
      />,
    );

    const ratingSelect = screen.getByDisplayValue(/all ratings/i);
    fireEvent.change(ratingSelect, { target: { value: '5' } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ rating: 5 }),
    );
  });

  it('triggers onChange when status filter is selected', () => {
    const handleChange = vi.fn();
    render(
      <FeedbackFilters
        filters={{}}
        onChange={handleChange}
        onReset={vi.fn()}
        totalResults={10}
      />,
    );

    const statusSelect = screen.getByDisplayValue(/all statuses/i);
    fireEvent.change(statusSelect, { target: { value: 'reviewed' } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'reviewed' }),
    );
  });

  it('triggers onReset when Reset Filters button is clicked', () => {
    const handleReset = vi.fn();
    render(
      <FeedbackFilters
        filters={{ rating: 1 }}
        onChange={vi.fn()}
        onReset={handleReset}
        totalResults={3}
      />,
    );

    const resetBtn = screen.getByRole('button', { name: /reset filters/i });
    fireEvent.click(resetBtn);

    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
