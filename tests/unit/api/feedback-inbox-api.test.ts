import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  listOwnerFeedbacks,
  getOwnerFeedbackById,
  updateOwnerFeedbackStatus,
} from '@/lib/api/feedback-inbox';
import type { OwnerFeedbackItem } from '@/lib/api/types';

describe('Owner Feedback Inbox API Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('listOwnerFeedbacks sends GET request to /feedback with query parameters', async () => {
    const mockFeedbacks: OwnerFeedbackItem[] = [
      {
        _id: 'fb_1',
        businessId: 'biz_1',
        qrCampaignId: { _id: 'cmp_1', title: 'Table 1', publicToken: 'tok_1' },
        customerId: { name: 'Alice', email: 'alice@test.com' },
        rating: 5,
        text: 'Wonderful dinner!',
        answers: [],
        status: 'new',
        consentAccepted: true,
        createdAt: '2026-10-24T12:00:00.000Z',
        updatedAt: '2026-10-24T12:00:00.000Z',
      },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: mockFeedbacks,
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      }),
    });

    const result = await listOwnerFeedbacks(
      { rating: 5, status: 'new', page: 1, limit: 10 },
      mockFetch as unknown as typeof fetch,
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain('/feedback?page=1&limit=10&rating=5&status=new');
    expect(options.method).toBe('GET');
    expect(result.feedbacks).toHaveLength(1);
    expect(result.meta.total).toBe(1);
    expect(result.feedbacks[0].customerId.name).toBe('Alice');
  });

  it('getOwnerFeedbackById sends GET request to /feedback/:id', async () => {
    const mockFeedback: OwnerFeedbackItem = {
      _id: 'fb_detail',
      businessId: 'biz_1',
      qrCampaignId: { title: 'Bar Stand' },
      customerId: { name: 'Bob', phone: '+15551234567' },
      rating: 4,
      text: 'Good drinks',
      answers: [{ questionId: 'q1', questionLabel: 'Speed', answer: 'Fast' }],
      status: 'reviewed',
      consentAccepted: true,
      createdAt: '2026-10-24T13:00:00.000Z',
      updatedAt: '2026-10-24T13:00:00.000Z',
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: mockFeedback,
      }),
    });

    const result = await getOwnerFeedbackById('fb_detail', mockFetch as unknown as typeof fetch);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain('/feedback/fb_detail');
    expect(options.method).toBe('GET');
    expect(result._id).toBe('fb_detail');
    expect(result.status).toBe('reviewed');
  });

  it('updateOwnerFeedbackStatus sends PATCH to /feedback/:id/status with JSON body', async () => {
    const mockUpdated: OwnerFeedbackItem = {
      _id: 'fb_status',
      businessId: 'biz_1',
      qrCampaignId: 'cmp_1',
      customerId: { name: 'Charlie' },
      rating: 3,
      answers: [],
      status: 'resolved',
      consentAccepted: true,
      createdAt: '2026-10-24T14:00:00.000Z',
      updatedAt: '2026-10-24T14:10:00.000Z',
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: mockUpdated,
      }),
    });

    const result = await updateOwnerFeedbackStatus('fb_status', 'resolved', mockFetch as unknown as typeof fetch);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain('/feedback/fb_status/status');
    expect(options.method).toBe('PATCH');
    expect(JSON.parse(options.body)).toEqual({ status: 'resolved' });
    expect(result.status).toBe('resolved');
  });
});
