import { describe, it, expect, vi } from 'vitest';
import { checkBackendHealth } from '@/lib/api/health';

describe('checkBackendHealth probe', () => {
  it('should return isReachable: true when backend returns healthy status', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: {
          status: 'healthy',
          timestamp: '2026-10-24T12:00:00.000Z',
          uptimeSeconds: 120,
          environment: 'development',
        },
      }),
    } as unknown as Response);

    const result = await checkBackendHealth(1000, mockFetch as unknown as typeof fetch);

    expect(result.isReachable).toBe(true);
    expect(result.status).toBe('healthy');
    expect(result.uptimeSeconds).toBe(120);
    expect(result.environment).toBe('development');
  });

  it('should return isReachable: false when backend returns non-200 HTTP status', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
    } as unknown as Response);

    const result = await checkBackendHealth(1000, mockFetch as unknown as typeof fetch);

    expect(result.isReachable).toBe(false);
    expect(result.status).toBe('unhealthy');
    expect(result.error).toContain('HTTP 503');
  });

  it('should return isReachable: false when network request fails', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'));

    const result = await checkBackendHealth(1000, mockFetch as unknown as typeof fetch);

    expect(result.isReachable).toBe(false);
    expect(result.status).toBe('unhealthy');
    expect(result.error).toContain('ECONNREFUSED');
  });
});
