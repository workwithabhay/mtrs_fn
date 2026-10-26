import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardPage from '@/app/dashboard/page';
import * as authContext from '@/contexts/auth-context';

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: vi.fn(),
  }),
}));

describe('DashboardPage Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockPush.mockReset();
    mockReplace.mockReset();
  });

  it('should render loading indicator when session is loading', () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: null,
      business: null,
      isAuthenticated: false,
      isLoading: true,
      checkSession: vi.fn(),
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    render(<DashboardPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/loading your business dashboard/i)).toBeInTheDocument();
  });

  it('should redirect unauthenticated user to /login and show sign in prompt', () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: null,
      business: null,
      isAuthenticated: false,
      isLoading: false,
      checkSession: vi.fn(),
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    render(<DashboardPage />);

    expect(mockReplace).toHaveBeenCalledWith('/login');
    expect(screen.getByRole('heading', { name: /sign in required/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go to log in/i })).toHaveAttribute('href', '/login');
  });

  it('should render verified owner and business details without fabricated data', () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: {
        id: 'u-1',
        name: 'Carlos Mendez',
        email: 'carlos@tacos.com',
        role: 'business_owner',
        status: 'active',
        isEmailVerified: true,
      },
      business: {
        id: 'b-1',
        name: 'Mendez Taqueria',
        category: 'Restaurant & Dining',
        status: 'active',
        googleReviewUrl: 'https://g.page/r/mendeztaqueria/review',
      },
      isAuthenticated: true,
      isLoading: false,
      checkSession: vi.fn(),
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    render(<DashboardPage />);

    // Welcome Section & Profile Card
    expect(screen.getByRole('heading', { name: /welcome back, carlos mendez/i })).toBeInTheDocument();
    expect(screen.getAllByText(/mendez taqueria/i).length).toBeGreaterThan(0);

    // Business Profile Card
    expect(screen.getAllByText('carlos@tacos.com').length).toBeGreaterThan(0);
    expect(screen.getByText('Restaurant & Dining')).toBeInTheDocument();

    // Onboarding checklist verification
    expect(screen.getByText(/business account & owner profile provisioned/i)).toBeInTheDocument();
    expect(screen.getByText(/google business profile review link/i)).toBeInTheDocument();

    // Truthful empty states (no fake metrics)
    expect(screen.getByRole('heading', { name: /no customer activity recorded yet/i })).toBeInTheDocument();
    expect(screen.getByText(/0 active/i)).toBeInTheDocument();
    expect(screen.getByText(/0 feedbacks/i)).toBeInTheDocument();
  });

  it('should safely handle missing optional Google Review URL', () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: {
        id: 'u-2',
        name: 'Dr. Evelyn Reed',
        email: 'evelyn@reeddental.com',
        role: 'business_owner',
        status: 'active',
        isEmailVerified: true,
      },
      business: {
        id: 'b-2',
        name: 'Reed Dental Studio',
        category: 'Healthcare & Dental Clinic',
        status: 'active',
        googleReviewUrl: null, // absent
      },
      isAuthenticated: true,
      isLoading: false,
      checkSession: vi.fn(),
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    render(<DashboardPage />);

    expect(screen.getByText(/pending configuration in settings/i)).toBeInTheDocument();
    expect(screen.getAllByText('Reed Dental Studio').length).toBeGreaterThan(0);
  });
});
