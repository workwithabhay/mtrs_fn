import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/marketing/footer';

describe('Footer Component', () => {
  it('renders the brand name, description and compliance note', () => {
    render(<Footer />);

    expect(screen.getByText('ReviewFlow')).toBeInTheDocument();
    expect(screen.getByText(/compliant with google customer review guidelines/i)).toBeInTheDocument();
    expect(screen.getByText(/notice on review authenticity/i)).toBeInTheDocument();
  });

  it('renders navigation links and design system link', () => {
    render(<Footer />);

    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Platform')).toBeInTheDocument();

    const dsLink = screen.getByRole('link', { name: /design system/i });
    expect(dsLink).toHaveAttribute('href', '/design-system');
  });
});
