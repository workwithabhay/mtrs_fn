import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BusinessShowcase } from '@/components/marketing/business-showcase';

describe('BusinessShowcase Marketing Component', () => {
  it('renders section title and business categories', () => {
    render(<BusinessShowcase />);

    expect(
      screen.getByRole('heading', {
        name: /made for every business to win 5-star reviews/i,
      })
    ).toBeInTheDocument();

    expect(screen.getAllByText('Restro').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Cafe').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Beauty Salon').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Mart & Retail').length).toBeGreaterThan(0);

    // Check playful doodle annotations
    expect(screen.getByText(/skyrocket your reviews/i)).toBeInTheDocument();
    expect(screen.getByText(/it's free/i)).toBeInTheDocument();

    // Check Get Started CTA
    expect(
      screen.getByRole('link', { name: /get started/i })
    ).toBeInTheDocument();
  });

  it('opens interactive category modal on click and closes cleanly', () => {
    render(<BusinessShowcase />);

    const restroCards = screen.getAllByRole('button', {
      name: /view restaurants & bistros details/i,
    });
    expect(restroCards.length).toBeGreaterThan(0);

    fireEvent.click(restroCards[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByText(/turn dining guests into 5-star google promoters/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/recommended qr placements:/i)
    ).toBeInTheDocument();

    // Close button in modal
    const closeBtn = screen.getByRole('button', { name: /close details/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
