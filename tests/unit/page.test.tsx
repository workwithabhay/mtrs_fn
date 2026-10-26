import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('HomePage Marketing Landing Page', () => {
  it('should render skip to content link for accessibility', () => {
    render(<HomePage />);
    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('should render all core marketing sections with proper headings', () => {
    render(<HomePage />);

    // Hero Section
    expect(
      screen.getByRole('heading', {
        name: /turn customer feedback into your next opportunity/i,
      }),
    ).toBeInTheDocument();

    // Value Proposition Section
    expect(
      screen.getByRole('heading', {
        name: /why reviewflow/i,
      }),
    ).toBeInTheDocument();

    // Features Section
    expect(
      screen.getByRole('heading', {
        name: /everything you need to collect feedback & grow 5-star reviews/i,
      }),
    ).toBeInTheDocument();

    // How It Works Section
    expect(
      screen.getByRole('heading', {
        name: /simple 3-step process/i,
      }),
    ).toBeInTheDocument();

    // Pricing Section
    expect(
      screen.getByRole('heading', {
        name: /predictable plans for growing businesses/i,
      }),
    ).toBeInTheDocument();

    // FAQ Section
    expect(
      screen.getByRole('heading', {
        name: /clear answers to common questions/i,
      }),
    ).toBeInTheDocument();

    // Final CTA Banner
    expect(
      screen.getByRole('heading', {
        name: /turn customer visits into your greatest growth engine/i,
      }),
    ).toBeInTheDocument();
  });

  it('should render primary CTAs pointing to intentional signup and how-it-works routes', () => {
    render(<HomePage />);

    const getStartedLinks = screen.getAllByRole('link', { name: /get started/i });
    expect(getStartedLinks.length).toBeGreaterThan(0);
    expect(getStartedLinks[0]).toHaveAttribute('href', '/signup');

    const howItWorksLinks = screen.getAllByRole('link', { name: /how it works/i });
    expect(howItWorksLinks.length).toBeGreaterThan(0);
    expect(howItWorksLinks[0]).toHaveAttribute('href', '#how-it-works');
  });

  it('should render footer and navigation with design system links and non-gating policy disclaimer', () => {
    render(<HomePage />);

    const dsLinks = screen.getAllByRole('link', { name: /design system/i });
    expect(dsLinks.length).toBeGreaterThan(0);
    dsLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/design-system');
    });

    expect(screen.getByText(/notice on review authenticity/i)).toBeInTheDocument();
  });
});
