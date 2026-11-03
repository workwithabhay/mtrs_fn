import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HowItWorks from '@/components/marketing/how-it-works';

describe('HowItWorks Section Component', () => {
  it('renders kicker, main heading, and get started CTA button', () => {
    render(<HowItWorks />);

    expect(
      screen.getByRole('heading', { name: /simple 3-step process/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /how reviewflow works/i }),
    ).toBeInTheDocument();

    const cta = screen.getByRole('link', { name: /get started/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href', '/signup');
  });

  it('renders all three numbered step nodes with original ReviewFlow content', () => {
    render(<HowItWorks />);

    expect(
      screen.getAllByRole('heading', { name: /set up your business profile/i }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('heading', { name: /generate & place qr codes/i }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('heading', { name: /collect feedback & guide reviews/i }).length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText(/setup takes less than 2 minutes with email otp verification/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/customize campaigns for different tables, counters, or receipts/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/happy patrons are guided to your google review link with one tap/i).length,
    ).toBeGreaterThan(0);
  });
});
