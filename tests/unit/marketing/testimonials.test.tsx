import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Testimonials } from '@/components/marketing/testimonials';

describe('Testimonials Marketing Component', () => {
  it('renders section heading and customer testimonial chips', () => {
    render(<Testimonials />);

    expect(
      screen.getByRole('heading', { name: /loved by 500\+ growing businesses/i })
    ).toBeInTheDocument();

    expect(screen.getAllByText(/Champaran Fish & Mutton/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pixelbloommedia/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Tycum Solar/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/DMS Solar/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ventex Inn/i).length).toBeGreaterThan(0);
  });

  it('opens interactive testimonial modal when a chip is clicked and closes on close button', () => {
    render(<Testimonials />);

    const chips = screen.getAllByRole('button', { name: /view testimonial from champaran fish & mutton/i });
    expect(chips.length).toBeGreaterThan(0);

    // Click chip to open modal
    fireEvent.click(chips[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByText(/our google rating surged from 4\.2 to 4\.9 within 60 days/i)
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Champaran Fish & Mutton/i).length
    ).toBeGreaterThan(0);

    // Close modal
    const closeBtn = screen.getByRole('button', { name: /close testimonial details/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
