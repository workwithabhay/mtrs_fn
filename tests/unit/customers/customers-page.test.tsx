import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import CustomersPage from '@/app/dashboard/customers/page';
import * as authContext from '@/contexts/auth-context';
import * as customersApi from '@/lib/api/customers';

vi.mock('@/lib/api/customers', () => ({
  listCustomers: vi.fn(),
}));

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('Customers Page Route Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(customersApi.listCustomers).mockResolvedValue({
      customers: [],
      stats: { totalCustomers: 0, repeatCustomers: 0, averageRating: null },
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  it('renders loading skeleton when auth is loading', () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: null,
      business: null,
      isAuthenticated: false,
      isLoading: true,
      checkSession: vi.fn(),
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    render(<CustomersPage />);
    expect(screen.getByRole('status', { name: /loading customers page/i })).toBeInTheDocument();
  });

  it('redirects to /login when unauthenticated', () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: null,
      business: null,
      isAuthenticated: false,
      isLoading: false,
      checkSession: vi.fn(),
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    render(<CustomersPage />);
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('renders CustomerDirectory when authenticated', () => {
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
        category: 'Restaurant & Dining',
        status: 'active',
      },
      isAuthenticated: true,
      isLoading: false,
      checkSession: vi.fn(),
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    render(<CustomersPage />);
    expect(screen.getByRole('heading', { name: /customers directory/i })).toBeInTheDocument();
  });
});
