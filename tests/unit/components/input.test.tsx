import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/ui/input';

describe('Input Component', () => {
  it('should render label and associate it with the input field', () => {
    render(<Input label="Email Address" id="email-input" placeholder="test@domain.com" />);

    const label = screen.getByText('Email Address');
    const input = screen.getByLabelText('Email Address');

    expect(label).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'email-input');
  });

  it('should associate error message with aria-describedby and set aria-invalid', () => {
    render(
      <Input
        id="user-input"
        label="Username"
        error="Username is already taken"
      />,
    );

    const input = screen.getByLabelText('Username');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'user-input-error');

    const errorMsg = screen.getByRole('alert');
    expect(errorMsg).toHaveTextContent('Username is already taken');
  });

  it('should render helper text when no error is present', () => {
    render(
      <Input
        id="helper-test"
        label="Password"
        helperText="Must be at least 8 characters long"
      />,
    );

    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('aria-describedby', 'helper-test-helper');
    expect(screen.getByText('Must be at least 8 characters long')).toBeInTheDocument();
  });

  it('should handle user input correctly', () => {
    const handleChange = vi.fn();
    render(<Input label="Name" onChange={handleChange} />);

    const input = screen.getByLabelText('Name');
    fireEvent.change(input, { target: { value: 'Abhay' } });

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('Abhay');
  });
});
