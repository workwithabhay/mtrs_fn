import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AiStudioPage from '@/app/dashboard/ai-studio/page';
import * as authContext from '@/contexts/auth-context';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('AI Studio Page Route Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading skeleton while auth is loading', () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: null,
      business: null,
      isAuthenticated: false,
      isLoading: true,
      checkSession: vi.fn(),
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    render(<AiStudioPage />);
    expect(screen.getByRole('status', { name: /loading ai feedback studio/i })).toBeInTheDocument();
  });

  it('redirects to /login if user is not authenticated', () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: null,
      business: null,
      isAuthenticated: false,
      isLoading: false,
      checkSession: vi.fn(),
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    render(<AiStudioPage />);
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('renders AI studio container when authenticated', () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: {
        id: 'u-1',
        name: 'Maria Santos',
        email: 'maria@cafesantos.com',
        role: 'business_owner',
        status: 'active',
        isEmailVerified: true,
      },
      business: {
        id: 'b-1',
        name: 'Café Santos',
        category: 'Dining',
      },
      isAuthenticated: true,
      isLoading: false,
      checkSession: vi.fn(),
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    render(<AiStudioPage />);
    expect(screen.getByRole('heading', { name: /ai feedback studio/i })).toBeInTheDocument();
  });
});
