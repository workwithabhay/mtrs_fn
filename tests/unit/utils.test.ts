import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn() utility', () => {
  it('should merge class names correctly', () => {
    expect(cn('px-4', 'py-2', 'bg-brand-primary')).toBe('px-4 py-2 bg-brand-primary');
  });

  it('should resolve conflicting Tailwind classes favoring the latter', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('should ignore falsey values', () => {
    expect(cn('block', false && 'hidden', null, undefined, 'text-sm')).toBe('block text-sm');
  });
});
