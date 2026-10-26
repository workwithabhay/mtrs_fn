import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '@/components/marketing/navbar';

describe('Navbar Component', () => {
  it('should render brand logo and wordmark', () => {
    render(<Navbar />);
    expect(screen.getByText('ReviewFlow')).toBeInTheDocument();
  });

  it('should render desktop navigation links with correct href anchors', () => {
    render(<Navbar />);

    const featuresLinks = screen.getAllByRole('link', { name: 'Features' });
    expect(featuresLinks[0]).toHaveAttribute('href', '#features');

    const howItWorksLinks = screen.getAllByRole('link', { name: 'How It Works' });
    expect(howItWorksLinks[0]).toHaveAttribute('href', '#how-it-works');

    const pricingLinks = screen.getAllByRole('link', { name: 'Pricing' });
    expect(pricingLinks[0]).toHaveAttribute('href', '#pricing');

    const faqLinks = screen.getAllByRole('link', { name: 'FAQ' });
    expect(faqLinks[0]).toHaveAttribute('href', '#faq');
  });

  it('should render Log In and Get Started links with intentional placeholder routes', () => {
    render(<Navbar />);

    const loginLinks = screen.getAllByRole('link', { name: 'Log In' });
    expect(loginLinks[0]).toHaveAttribute('href', '/login');

    const getStartedLinks = screen.getAllByRole('link', { name: 'Get Started' });
    expect(getStartedLinks[0]).toHaveAttribute('href', '/signup');
  });

  it('should toggle mobile menu open and closed with accessible attributes', () => {
    render(<Navbar />);

    const menuToggle = screen.getByRole('button', { name: /open navigation menu/i });
    expect(menuToggle).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    fireEvent.click(menuToggle);
    expect(screen.getByRole('button', { name: /close navigation menu/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    // Click to close
    fireEvent.click(screen.getByRole('button', { name: /close navigation menu/i }));
    expect(screen.getByRole('button', { name: /open navigation menu/i })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('should close mobile menu on Escape key press', () => {
    render(<Navbar />);

    const openBtn = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(openBtn);
    expect(screen.getByRole('button', { name: /close navigation menu/i })).toBeInTheDocument();

    // Trigger Escape
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(screen.getByRole('button', { name: /open navigation menu/i })).toBeInTheDocument();
  });
});
