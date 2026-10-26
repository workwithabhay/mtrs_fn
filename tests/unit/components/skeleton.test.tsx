import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from '@/components/ui/skeleton';

describe('Skeleton Component', () => {
  it('should render with animate-pulse and rounded variant by default', () => {
    const { container } = render(<Skeleton className="w-20 h-4" />);
    const skeleton = container.firstChild;

    expect(skeleton).toHaveClass('animate-pulse');
    expect(skeleton).toHaveClass('rounded-xl');
    expect(skeleton).toHaveClass('w-20');
    expect(skeleton).toHaveClass('h-4');
  });

  it('should support circular variant for avatar placeholders', () => {
    const { container } = render(<Skeleton variant="circular" className="w-10 h-10" />);
    const skeleton = container.firstChild;

    expect(skeleton).toHaveClass('rounded-full');
  });
});
