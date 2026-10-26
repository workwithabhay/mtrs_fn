import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FAQ } from '@/components/marketing/faq';

describe('FAQ Component', () => {
  it('should render section heading and FAQ questions', () => {
    render(<FAQ />);

    expect(
      screen.getByRole('heading', { name: /clear answers to common questions/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/how do customers access the feedback form/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/do customers need to download an app or sign in/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/does reviewflow publish reviews to google automatically/i),
    ).toBeInTheDocument();
  });

  it('should have the first question expanded by default with accessible aria-expanded', () => {
    render(<FAQ />);

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByText(/customers simply point their smartphone camera/i),
    ).toBeInTheDocument();
  });

  it('should toggle accordion open and closed when clicked', () => {
    render(<FAQ />);

    const buttons = screen.getAllByRole('button');
    const firstButton = buttons[0];
    const secondButton = buttons[1];

    // Clicking the first button collapses it
    fireEvent.click(firstButton);
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');

    // Clicking the second button opens it
    fireEvent.click(secondButton);
    expect(secondButton).toHaveAttribute('aria-expanded', 'true');
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.getByText(/no app download or account creation is required/i),
    ).toBeInTheDocument();
  });
});
