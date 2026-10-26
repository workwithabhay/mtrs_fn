import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from '@/components/ui/textarea';

describe('Textarea Component', () => {
  it('should render label associated with textarea element', () => {
    render(<Textarea label="Feedback Message" id="feedback-field" />);

    expect(screen.getByLabelText('Feedback Message')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'feedback-field');
  });

  it('should display character count guidance when showCount and maxLength are provided', () => {
    render(<Textarea label="Notes" maxLength={100} showCount defaultValue="Hello" />);

    expect(screen.getByText('5/100')).toBeInTheDocument();
  });

  it('should associate error message with aria-describedby and alert role', () => {
    render(
      <Textarea
        id="notes-area"
        label="Notes"
        error="Message is too short"
      />,
    );

    const textarea = screen.getByLabelText('Notes');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-describedby', 'notes-area-error');
    expect(screen.getByRole('alert')).toHaveTextContent('Message is too short');
  });

  it('should update character count on user typing', () => {
    const handleChange = vi.fn();
    render(<Textarea label="Description" maxLength={50} showCount onChange={handleChange} />);

    const textarea = screen.getByLabelText('Description');
    fireEvent.change(textarea, { target: { value: 'Great service' } });

    expect(handleChange).toHaveBeenCalled();
    expect(screen.getByText('13/50')).toBeInTheDocument();
  });
});
