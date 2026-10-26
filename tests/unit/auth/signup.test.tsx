import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from '@/app/(auth)/signup/page';
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

describe('SignupPage Flow', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockPush.mockReset();
    mockReplace.mockReset();
    mockSetSession.mockReset();
  });

  it('should render all required business information fields and consent checkbox', () => {
    render(<SignupPage />);

    expect(screen.getByRole('heading', { name: /create your business account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/owner \/ manager full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/business name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/business category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/google business profile review url/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /request verification code/i })).toBeInTheDocument();
  });

  it('should display validation errors when submitting with empty or invalid fields', async () => {
    const requestSpy = vi.spyOn(authApi, 'requestSignupOtp');
    render(<SignupPage />);

    fireEvent.click(screen.getByRole('button', { name: /request verification code/i }));

    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/business name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/you must accept the terms of service/i)).toBeInTheDocument();
    expect(requestSpy).not.toHaveBeenCalled();
  });

  it('should validate email format and reject invalid emails', async () => {
    const requestSpy = vi.spyOn(authApi, 'requestSignupOtp');
    render(<SignupPage />);

    fireEvent.change(screen.getByLabelText(/owner \/ manager full name/i), {
      target: { value: 'Alex Morgan' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'not-an-email' },
    });
    fireEvent.change(screen.getByLabelText(/business name/i), {
      target: { value: 'Morgan Dental' },
    });
    fireEvent.click(screen.getByRole('checkbox'));

    fireEvent.click(screen.getByRole('button', { name: /request verification code/i }));

    expect(await screen.findByText(/please provide a valid email address/i)).toBeInTheDocument();
    expect(requestSpy).not.toHaveBeenCalled();
  });

  it('should advance to OTP verification step on successful requestSignupOtp', async () => {
    vi.spyOn(authApi, 'requestSignupOtp').mockResolvedValueOnce({
      message: 'Verification code sent to your email.',
      cooldownSeconds: 60,
    });

    render(<SignupPage />);

    fireEvent.change(screen.getByLabelText(/owner \/ manager full name/i), {
      target: { value: 'Alex Morgan' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'alex@morgandental.com' },
    });
    fireEvent.change(screen.getByLabelText(/business name/i), {
      target: { value: 'Morgan Dental Care' },
    });
    fireEvent.click(screen.getByRole('checkbox'));

    fireEvent.click(screen.getByRole('button', { name: /request verification code/i }));

    expect(await screen.findByRole('heading', { name: /enter verification code/i })).toBeInTheDocument();
    expect(screen.getByText(/alex@morgandental.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('123456')).toBeInTheDocument();
  });

  it('should display server error message when requestSignupOtp fails with ConflictError', async () => {
    vi.spyOn(authApi, 'requestSignupOtp').mockRejectedValueOnce(
      new ApiError(
        'CONFLICT',
        'An account with this email address already exists. Please log in instead.',
        409,
      ),
    );

    render(<SignupPage />);

    fireEvent.change(screen.getByLabelText(/owner \/ manager full name/i), {
      target: { value: 'Alex Morgan' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'existing@business.com' },
    });
    fireEvent.change(screen.getByLabelText(/business name/i), {
      target: { value: 'Morgan Clinic' },
    });
    fireEvent.click(screen.getByRole('checkbox'));

    fireEvent.click(screen.getByRole('button', { name: /request verification code/i }));

    expect(
      await screen.findByText(/an account with this email address already exists/i),
    ).toBeInTheDocument();
  });

  it('should verify OTP and navigate to /dashboard on success', async () => {
    vi.spyOn(authApi, 'requestSignupOtp').mockResolvedValueOnce({
      message: 'Code sent',
      cooldownSeconds: 60,
    });

    const mockSession = {
      user: {
        id: 'u123',
        name: 'Alex Morgan',
        email: 'alex@morgandental.com',
        role: 'business_owner' as const,
        status: 'active' as const,
        isEmailVerified: true,
      },
      business: {
        id: 'b123',
        name: 'Morgan Dental Care',
        category: 'Healthcare & Dental Clinic',
        status: 'active',
      },
    };

    const verifySpy = vi.spyOn(authApi, 'verifySignupOtp').mockResolvedValueOnce(mockSession);

    render(<SignupPage />);

    // Step 1: Fill and submit form
    fireEvent.change(screen.getByLabelText(/owner \/ manager full name/i), {
      target: { value: 'Alex Morgan' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'alex@morgandental.com' },
    });
    fireEvent.change(screen.getByLabelText(/business name/i), {
      target: { value: 'Morgan Dental Care' },
    });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /request verification code/i }));

    // Step 2: Enter 6-digit OTP
    const otpInput = await screen.findByPlaceholderText('123456');
    fireEvent.change(otpInput, { target: { value: '123456' } });

    const verifyButton = screen.getByRole('button', { name: /verify & create account/i });
    expect(verifyButton).not.toBeDisabled();
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(verifySpy).toHaveBeenCalledWith({
        email: 'alex@morgandental.com',
        otp: '123456',
      });
      expect(mockSetSession).toHaveBeenCalledWith(mockSession);
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should allow returning to edit details from the OTP step', async () => {
    vi.spyOn(authApi, 'requestSignupOtp').mockResolvedValueOnce({
      message: 'Code sent',
      cooldownSeconds: 60,
    });

    render(<SignupPage />);

    fireEvent.change(screen.getByLabelText(/owner \/ manager full name/i), {
      target: { value: 'Alex Morgan' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'alex@morgandental.com' },
    });
    fireEvent.change(screen.getByLabelText(/business name/i), {
      target: { value: 'Morgan Dental Care' },
    });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /request verification code/i }));

    await screen.findByRole('heading', { name: /enter verification code/i });

    const editButton = screen.getByRole('button', { name: /edit details or email/i });
    fireEvent.click(editButton);

    // Form inputs must still be preserved
    expect(screen.getByLabelText(/owner \/ manager full name/i)).toHaveValue('Alex Morgan');
    expect(screen.getByLabelText(/email address/i)).toHaveValue('alex@morgandental.com');
  });
});
