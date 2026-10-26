import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StarRating } from '@/components/feedback/star-rating';

describe('StarRating Component', () => {
  it('renders 5 accessible star rating buttons', () => {
    const handleChange = vi.fn();
    render(<StarRating value={0} onChange={handleChange} />);

    const group = screen.getByRole('radiogroup', { name: /rating out of 5 stars/i });
    expect(group).toBeInTheDocument();

    const starButtons = screen.getAllByRole('radio');
    expect(starButtons).toHaveLength(5);
  });

  it('selects star rating upon click and notifies parent', () => {
    const handleChange = vi.fn();
    render(<StarRating value={0} onChange={handleChange} />);

    const star4 = screen.getByRole('radio', { name: /4 stars/i });
    fireEvent.click(star4);

    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it('allows changing an existing rating', () => {
    const handleChange = vi.fn();
    const { rerender } = render(<StarRating value={3} onChange={handleChange} />);

    expect(screen.getByText(/good \(3\/5\)/i)).toBeInTheDocument();

    const star5 = screen.getByRole('radio', { name: /5 stars/i });
    fireEvent.click(star5);
    expect(handleChange).toHaveBeenCalledWith(5);

    rerender(<StarRating value={5} onChange={handleChange} />);
    expect(screen.getByText(/outstanding! \(5\/5\)/i)).toBeInTheDocument();
  });

  it('supports keyboard navigation via Arrow keys and number keys', () => {
    const handleChange = vi.fn();
    render(<StarRating value={2} onChange={handleChange} />);

    const group = screen.getByRole('radiogroup');

    // ArrowRight increases
    fireEvent.keyDown(group, { key: 'ArrowRight' });
    expect(handleChange).toHaveBeenCalledWith(3);

    // ArrowLeft decreases
    fireEvent.keyDown(group, { key: 'ArrowLeft' });
    expect(handleChange).toHaveBeenCalledWith(1);

    // Number key '5'
    fireEvent.keyDown(group, { key: '5' });
    expect(handleChange).toHaveBeenCalledWith(5);
  });

  it('displays field-level error message when error prop is provided', () => {
    render(<StarRating value={0} onChange={vi.fn()} error="Rating is required" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Rating is required');
  });

  it('disables rating buttons when disabled is true', () => {
    const handleChange = vi.fn();
    render(<StarRating value={3} onChange={handleChange} disabled={true} />);

    const starButtons = screen.getAllByRole('radio');
    for (const btn of starButtons) {
      expect(btn).toBeDisabled();
    }

    fireEvent.click(starButtons[0]);
    expect(handleChange).not.toHaveBeenCalled();
  });
});
