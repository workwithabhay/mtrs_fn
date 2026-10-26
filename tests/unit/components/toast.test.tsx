import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Toaster, toast } from '@/components/ui/toast';

describe('Toast & Toaster Primitives', () => {
  it('should render Toaster container without errors', () => {
    const { container } = render(<Toaster />);
    expect(container).toBeInTheDocument();
  });

  it('should expose standard toast helper methods', () => {
    expect(typeof toast.success).toBe('function');
    expect(typeof toast.error).toBe('function');
    expect(typeof toast.info).toBe('function');
    expect(typeof toast.warning).toBe('function');
    expect(typeof toast.dismiss).toBe('function');
  });
});
