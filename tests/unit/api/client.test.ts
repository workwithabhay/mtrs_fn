import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiFetch, ApiError, getCsrfTokenFromCookie } from '@/lib/api/client';

describe('API Client (apiFetch)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    // Clear document cookie in jsdom
    if (typeof document !== 'undefined') {
      document.cookie = 'csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  });

  it('should parse getCsrfTokenFromCookie correctly', () => {
    expect(getCsrfTokenFromCookie()).toBeNull();

    document.cookie = 'csrf_token=test-csrf-token-123; path=/';
    expect(getCsrfTokenFromCookie()).toBe('test-csrf-token-123');
  });

  it('should include credentials: include on all requests', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true, data: { status: 'ok' } }),
    });

    await apiFetch('/test', {}, mockFetch as unknown as typeof fetch);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        credentials: 'include',
      }),
    );
  });

  it('should attach x-csrf-token on state-changing requests when cookie exists', async () => {
    document.cookie = 'csrf_token=valid-csrf-token-abc; path=/';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true, data: { created: true } }),
    });

    await apiFetch(
      '/create',
      {
        method: 'POST',
        body: JSON.stringify({ item: 'value' }),
      },
      mockFetch as unknown as typeof fetch,
    );

    const callArgs = mockFetch.mock.calls[0][1];
    expect(callArgs.headers.get('x-csrf-token')).toBe('valid-csrf-token-abc');
  });

  it('should NOT attach x-csrf-token on safe GET requests', async () => {
    document.cookie = 'csrf_token=valid-csrf-token-abc; path=/';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true, data: [] }),
    });

    await apiFetch('/items', { method: 'GET' }, mockFetch as unknown as typeof fetch);

    const callArgs = mockFetch.mock.calls[0][1];
    expect(callArgs.headers.get('x-csrf-token')).toBeNull();
  });

  it('should throw ApiError with structured code, status and details on failure', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: [{ field: 'email', message: 'Email is required' }],
        },
      }),
    });

    await expect(
      apiFetch('/fail', { method: 'POST' }, mockFetch as unknown as typeof fetch),
    ).rejects.toThrow(ApiError);

    try {
      await apiFetch('/fail', { method: 'POST' }, mockFetch as unknown as typeof fetch);
    } catch (err) {
      const apiErr = err as ApiError;
      expect(apiErr.code).toBe('VALIDATION_ERROR');
      expect(apiErr.message).toBe('Request validation failed');
      expect(apiErr.status).toBe(400);
      expect(apiErr.details).toEqual([{ field: 'email', message: 'Email is required' }]);
    }
  });

  it('should unwrap data field from ApiSuccessResponse', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: { message: 'Code dispatched', cooldownSeconds: 60 },
      }),
    });

    const result = await apiFetch<{ message: string; cooldownSeconds: number }>(
      '/auth/signup/request-otp',
      { method: 'POST' },
      mockFetch as unknown as typeof fetch,
    );

    expect(result).toEqual({ message: 'Code dispatched', cooldownSeconds: 60 });
  });
});
