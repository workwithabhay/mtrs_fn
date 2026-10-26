import { describe, it, expect, vi } from 'vitest';
import { listCustomers } from '@/lib/api/customers';

describe('Customer Directory API Client (listCustomers)', () => {
  it('calls /feedback/customers with default params and returns unwrapped data with meta', async () => {
    const mockResponse = {
      success: true,
      data: {
        customers: [
          {
            id: 'c-1',
            name: 'Sarah Connor',
            email: 'sarah@skynet.com',
            phone: '+15551234567',
            lastVisitedAt: '2026-10-20T10:00:00.000Z',
            createdAt: '2026-09-01T10:00:00.000Z',
            feedbackCount: 3,
            avgRating: 4.7,
            latestRating: 5,
            isRepeat: true,
          },
        ],
        stats: {
          totalCustomers: 1,
          repeatCustomers: 1,
          averageRating: 4.7,
        },
      },
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockResponse,
    });

    const result = await listCustomers({}, mockFetch as unknown as typeof fetch);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain('/api/v1/feedback/customers');

    expect(result.customers).toHaveLength(1);
    expect(result.customers[0].name).toBe('Sarah Connor');
    expect(result.stats.totalCustomers).toBe(1);
    expect(result.stats.repeatCustomers).toBe(1);
    expect(result.total).toBe(1);
  });

  it('serializes search, pagination, and sorting params into query string', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: { customers: [], stats: { totalCustomers: 0, repeatCustomers: 0, averageRating: null } },
        meta: { total: 0, page: 2, limit: 25, totalPages: 0 },
      }),
    });

    await listCustomers(
      {
        page: 2,
        limit: 25,
        search: 'bistro',
        sortBy: 'name',
        sortOrder: 'asc',
      },
      mockFetch as unknown as typeof fetch,
    );

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain('page=2');
    expect(calledUrl).toContain('limit=25');
    expect(calledUrl).toContain('search=bistro');
    expect(calledUrl).toContain('sortBy=name');
    expect(calledUrl).toContain('sortOrder=asc');
  });
});
