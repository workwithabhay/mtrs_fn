import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from '@/components/ui/select';

describe('Select Component', () => {
  const options = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
  ];

  it('should render label associated with select element', () => {
    render(<Select label="Choose Category" id="category-select" options={options} />);

    expect(screen.getByLabelText('Choose Category')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute('id', 'category-select');
  });

  it('should render options and handle change events', () => {
    const handleChange = vi.fn();
    render(
      <Select label="Category" options={options} onChange={handleChange} defaultValue="a" />,
    );

    const select = screen.getByRole('combobox');
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();

    fireEvent.change(select, { target: { value: 'b' } });
    expect(handleChange).toHaveBeenCalled();
    expect(select).toHaveValue('b');
  });

  it('should display error message and set aria-invalid', () => {
    render(
      <Select
        id="sel-err"
        label="Category"
        error="Please select an option"
        options={options}
      />,
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(select).toHaveAttribute('aria-describedby', 'sel-err-error');
    expect(screen.getByRole('alert')).toHaveTextContent('Please select an option');
  });
});
