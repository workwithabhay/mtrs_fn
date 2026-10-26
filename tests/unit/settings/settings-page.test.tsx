import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import SettingsPage from '@/app/dashboard/settings/page';
import * as authContext from '@/contexts/auth-context';
import * as businessApi from '@/lib/api/business';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('Settings Page Route Component', () => {
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

    render(<SettingsPage />);
    expect(screen.getByRole('status', { name: /loading settings page/i })).toBeInTheDocument();
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

    render(<SettingsPage />);
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('renders SettingsContainer when authenticated', async () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: {
        id: 'u-1',
        name: 'Maria Santos',
        email: 'maria@santos.com',
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

    vi.spyOn(businessApi, 'getBusinessProfile').mockResolvedValue({
      id: 'b-1',
      name: 'Café Santos',
      category: 'Dining',
    });
    vi.spyOn(businessApi, 'getBusinessSettings').mockResolvedValue({
      allowPublicReviews: true,
      defaultLanguage: 'en',
    });

    render(<SettingsPage />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /settings & profile management/i })).toBeInTheDocument();
    });
  });
});
