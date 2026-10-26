import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { MobileNavigation } from '@/components/dashboard/mobile-navigation';
import * as authContext from '@/contexts/auth-context';

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

describe('Dashboard Navigation Components', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
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
  });

  describe('AppSidebar Component', () => {
    it('should render brand logo, active business context, and all navigation items', () => {
      render(<AppSidebar />);

      expect(screen.getByText('ReviewFlow')).toBeInTheDocument();
      expect(screen.getByText('Café Santos')).toBeInTheDocument();
      expect(screen.getByText('Restaurant & Dining')).toBeInTheDocument();

      // Navigation items
      expect(screen.getByRole('link', { name: /overview/i })).toBeInTheDocument();
      expect(screen.getByText(/qr campaigns/i)).toBeInTheDocument();
      expect(screen.getByText(/customer feedback/i)).toBeInTheDocument();
      expect(screen.getByText(/customers/i)).toBeInTheDocument();
      expect(screen.getByText(/analytics/i)).toBeInTheDocument();
      expect(screen.getByText(/ai assistant/i)).toBeInTheDocument();
      expect(screen.getByText(/settings/i)).toBeInTheDocument();
      expect(screen.getByText(/billing & plans/i)).toBeInTheDocument();
    });

    it('should mark active page with aria-current="page"', () => {
      render(<AppSidebar />);
      const overviewLink = screen.getByRole('link', { name: /overview/i });
      expect(overviewLink).toHaveAttribute('aria-current', 'page');
    });

    it('should render all dashboard modules as active navigation links', () => {
      render(<AppSidebar />);

      expect(screen.getByRole('link', { name: /qr campaigns/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /customer feedback/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^customers$/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /analytics/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /ai assistant/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /billing & plans/i })).toBeInTheDocument();
    });
  });

  describe('MobileNavigation Component', () => {
    it('should return null when isOpen is false', () => {
      const { container } = render(<MobileNavigation isOpen={false} onClose={vi.fn()} />);
      expect(container.firstChild).toBeNull();
    });

    it('should render dialog when isOpen is true and trigger onClose on close button click', () => {
      const handleClose = vi.fn();
      render(<MobileNavigation isOpen={true} onClose={handleClose} />);

      expect(screen.getByRole('dialog', { name: /mobile navigation menu/i })).toBeInTheDocument();
      const closeButton = screen.getByRole('button', { name: /close navigation menu/i });
      fireEvent.click(closeButton);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should close mobile navigation on Escape key press', () => {
      const handleClose = vi.fn();
      render(<MobileNavigation isOpen={true} onClose={handleClose} />);

      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should close mobile navigation when clicking an available link', () => {
      const handleClose = vi.fn();
      render(<MobileNavigation isOpen={true} onClose={handleClose} />);

      const overviewLink = screen.getByRole('link', { name: /overview/i });
      fireEvent.click(overviewLink);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
