import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  requestSignupOtp,
  verifySignupOtp,
  requestLoginOtp,
  verifyLoginOtp,
  getCurrentSession,
  logout,
} from '@/lib/api/auth';

describe('Auth API Functions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('requestSignupOtp should make POST to /auth/signup/request-otp with correct payload', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: { message: 'Code sent', cooldownSeconds: 60 },
      }),
    });

    const payload = {
      name: 'John Doe',
      email: 'john@example.com',
      businessName: 'Doe Bakery',
      category: 'Restaurant & Dining',
      consentAccepted: true,
    };

    const res = await requestSignupOtp(payload, mockFetch as unknown as typeof fetch);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/signup/request-otp'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );
    expect(res).toEqual({ message: 'Code sent', cooldownSeconds: 60 });
  });

  it('verifySignupOtp should make POST to /auth/signup/verify-otp with email and 6-digit otp', async () => {
    const mockUser = {
      id: 'u1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'business_owner',
      status: 'active',
      isEmailVerified: true,
    };
    const mockBusiness = {
      id: 'b1',
      name: 'Doe Bakery',
      category: 'Restaurant & Dining',
      status: 'active',
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: { user: mockUser, business: mockBusiness },
      }),
    });

    const res = await verifySignupOtp(
      { email: 'john@example.com', otp: '123456' },
      mockFetch as unknown as typeof fetch,
    );

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/signup/verify-otp'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'john@example.com', otp: '123456' }),
      }),
    );
    expect(res.user.email).toBe('john@example.com');
  });

  it('requestLoginOtp should make POST to /auth/login/request-otp with email', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: {
          message:
            'If an active account is registered with this email, a verification code has been sent.',
          cooldownSeconds: 60,
        },
      }),
    });

    const res = await requestLoginOtp(
      { email: 'owner@example.com' },
      mockFetch as unknown as typeof fetch,
    );

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login/request-otp'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'owner@example.com' }),
      }),
    );
    expect(res.message).toContain('verification code has been sent');
  });

  it('verifyLoginOtp should make POST to /auth/login/verify-otp with email and otp', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: {
          user: { name: 'Owner', email: 'owner@example.com' },
          business: { name: 'Store' },
        },
      }),
    });

    const res = await verifyLoginOtp(
      { email: 'owner@example.com', otp: '654321' },
      mockFetch as unknown as typeof fetch,
    );

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login/verify-otp'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'owner@example.com', otp: '654321' }),
      }),
    );
    expect(res.user.email).toBe('owner@example.com');
  });

  it('getCurrentSession should return null when backend returns 401 Unauthorized', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. No session token provided.',
        },
      }),
    });

    const session = await getCurrentSession(mockFetch as unknown as typeof fetch);
    expect(session).toBeNull();
  });

  it('getCurrentSession should return session data when backend returns 200 OK', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: {
          user: { name: 'Active Owner', email: 'active@example.com', role: 'business_owner' },
          business: { name: 'Active Business', category: 'Retail' },
        },
      }),
    });

    const session = await getCurrentSession(mockFetch as unknown as typeof fetch);
    expect(session).not.toBeNull();
    expect(session?.user.name).toBe('Active Owner');
    expect(session?.business?.name).toBe('Active Business');
  });

  it('logout should call POST /auth/logout', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: { message: 'Successfully logged out.' },
      }),
    });

    await logout(mockFetch as unknown as typeof fetch);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/logout'),
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });
});
