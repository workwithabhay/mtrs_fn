import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';
import * as authApi from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: vi.fn(),
  }),
}));

const mockSetSession = vi.fn();
vi.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    user: null,
    business: null,
    isAuthenticated: false,
    isLoading: false,
    setSession: mockSetSession,
    logout: vi.fn(),
    checkSession: vi.fn(),
  }),
}));

describe('LoginPage Flow', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockPush.mockReset();
    mockReplace.mockReset();
    mockSetSession.mockReset();
  });

  it('should render the login form with email input and submit button', () => {
    render(<LoginPage />);

    expect(screen.getByRole('heading', { name: /business owner log in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/registered email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send one-time code/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register business/i })).toBeInTheDocument();
  });

  it('should validate email format and reject empty input', async () => {
    const requestSpy = vi.spyOn(authApi, 'requestLoginOtp');
    render(<LoginPage />);

    fireEvent.click(screen.getByRole('button', { name: /send one-time code/i }));

    expect(await screen.findByText(/email address is required/i)).toBeInTheDocument();
    expect(requestSpy).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText(/registered email address/i), {
      target: { value: 'not-valid-email' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send one-time code/i }));

    expect(await screen.findByText(/please provide a valid email address/i)).toBeInTheDocument();
    expect(requestSpy).not.toHaveBeenCalled();
  });

  it('should request OTP and advance to verification step with account enumeration protection', async () => {
    const genericMsg =
      'If an active account is registered with this email, a verification code has been sent.';

    vi.spyOn(authApi, 'requestLoginOtp').mockResolvedValueOnce({
      message: genericMsg,
      cooldownSeconds: 60,
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/registered email address/i), {
      target: { value: 'owner@bistro.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send one-time code/i }));

    expect(await screen.findByRole('heading', { name: /enter verification code/i })).toBeInTheDocument();
    expect(screen.getByText(/owner@bistro.com/i)).toBeInTheDocument();
    expect(screen.getByText(genericMsg)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('123456')).toBeInTheDocument();
  });

  it('should verify OTP and navigate to /dashboard on success', async () => {
    vi.spyOn(authApi, 'requestLoginOtp').mockResolvedValueOnce({
      message: 'Code sent',
      cooldownSeconds: 60,
    });

    const mockSession = {
      user: {
        id: 'u999',
        name: 'Jane Doe',
        email: 'owner@bistro.com',
        role: 'business_owner' as const,
        status: 'active' as const,
        isEmailVerified: true,
      },
      business: {
        id: 'b999',
        name: 'Bluefin Bistro',
        category: 'Restaurant & Dining',
        status: 'active',
      },
    };

    const verifySpy = vi.spyOn(authApi, 'verifyLoginOtp').mockResolvedValueOnce(mockSession);

    render(<LoginPage />);

    // Step 1: Submit email
    fireEvent.change(screen.getByLabelText(/registered email address/i), {
      target: { value: 'owner@bistro.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send one-time code/i }));

    // Step 2: Enter 6 digits
    const otpInput = await screen.findByPlaceholderText('123456');
    fireEvent.change(otpInput, { target: { value: '654321' } });

    const verifyBtn = screen.getByRole('button', { name: /verify & log in/i });
    expect(verifyBtn).not.toBeDisabled();
    fireEvent.click(verifyBtn);

    await waitFor(() => {
      expect(verifySpy).toHaveBeenCalledWith({
        email: 'owner@bistro.com',
        otp: '654321',
      });
      expect(mockSetSession).toHaveBeenCalledWith(mockSession);
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should display server error message when verifyLoginOtp rejects invalid OTP', async () => {
    vi.spyOn(authApi, 'requestLoginOtp').mockResolvedValueOnce({
      message: 'Code sent',
      cooldownSeconds: 60,
    });

    vi.spyOn(authApi, 'verifyLoginOtp').mockRejectedValueOnce(
      new ApiError('VALIDATION_ERROR', 'Invalid verification code. 2 attempt(s) remaining.', 400),
    );

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/registered email address/i), {
      target: { value: 'owner@bistro.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send one-time code/i }));

    const otpInput = await screen.findByPlaceholderText('123456');
    fireEvent.change(otpInput, { target: { value: '000000' } });

    fireEvent.click(screen.getByRole('button', { name: /verify & log in/i }));

    expect(
      await screen.findByText(/invalid verification code\. 2 attempt\(s\) remaining\./i),
    ).toBeInTheDocument();
  });

  it('should allow returning to email step via use different email button', async () => {
    vi.spyOn(authApi, 'requestLoginOtp').mockResolvedValueOnce({
      message: 'Code sent',
      cooldownSeconds: 60,
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/registered email address/i), {
      target: { value: 'owner@bistro.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send one-time code/i }));

    await screen.findByRole('heading', { name: /enter verification code/i });

    const diffEmailBtn = screen.getByRole('button', { name: /use different email/i });
    fireEvent.click(diffEmailBtn);

    expect(screen.getByRole('heading', { name: /business owner log in/i })).toBeInTheDocument();
  });
});
