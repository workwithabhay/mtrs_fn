import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserMenu } from '@/components/dashboard/user-menu';
import * as authContext from '@/contexts/auth-context';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
  }),
}));

describe('UserMenu Component', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    mockLogout.mockReset();
    mockPush.mockReset();

    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: {
        id: 'u-1',
        name: 'Alex Rivera',
        email: 'alex@riveralaw.com',
        role: 'business_owner',
        status: 'active',
        isEmailVerified: true,
      },
      business: {
        id: 'b-1',
        name: 'Rivera Legal Group',
        category: 'Professional & Legal Services',
        status: 'active',
      },
      isAuthenticated: true,
      isLoading: false,
      checkSession: vi.fn(),
      setSession: vi.fn(),
      logout: mockLogout,
    });
  });

  it('should render trigger button with user initials', () => {
    render(<UserMenu />);
    expect(screen.getByRole('button', { name: /open user account menu/i })).toBeInTheDocument();
    expect(screen.getByText('AR')).toBeInTheDocument();
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
  });

  it('should open and close menu when clicking trigger button', () => {
    render(<UserMenu />);

    const trigger = screen.getByRole('button', { name: /open user account menu/i });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.getByRole('menu', { name: /user account actions/i })).toBeInTheDocument();
    expect(screen.getByText('alex@riveralaw.com')).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should close menu on Escape key press', () => {
    render(<UserMenu />);

    const trigger = screen.getByRole('button', { name: /open user account menu/i });
    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should call logout and navigate to /login on Log Out click', async () => {
    mockLogout.mockResolvedValueOnce(undefined);
    render(<UserMenu />);

    fireEvent.click(screen.getByRole('button', { name: /open user account menu/i }));
    const logoutBtn = screen.getByRole('button', { name: /log out/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('should display error message when logout fails', async () => {
    mockLogout.mockRejectedValueOnce(new Error('Server error'));
    render(<UserMenu />);

    fireEvent.click(screen.getByRole('button', { name: /open user account menu/i }));
    const logoutBtn = screen.getByRole('button', { name: /log out/i });
    fireEvent.click(logoutBtn);

    expect(
      await screen.findByText(/failed to revoke session on server\. please try again\./i),
    ).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
