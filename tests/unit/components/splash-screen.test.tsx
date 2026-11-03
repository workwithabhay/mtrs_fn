import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { SplashScreen } from '@/components/ui/splash-screen';

describe('SplashScreen Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with accessible role and text', () => {
    render(<SplashScreen duration={2000} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/ReviewFlow/i)).toBeInTheDocument();
    expect(screen.getByText(/for every business/i)).toBeInTheDocument();
  });

  it('automatically unmounts after duration and transition', () => {
    const onComplete = vi.fn();
    render(<SplashScreen duration={2000} onComplete={onComplete} />);

    expect(screen.getByRole('status')).toBeInTheDocument();

    // Fast-forward past duration + fade transition
    act(() => {
      vi.advanceTimersByTime(2600);
    });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
