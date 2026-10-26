import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getPublicLanding,
  recordPublicScan,
  submitPublicFeedback,
  trackGoogleReviewClick,
} from '@/lib/api/feedback';

describe('Public Feedback API Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getPublicLanding fetches public campaign data from /public/qr/:token', async () => {
    const mockData = {
      campaign: {
        title: 'Table 4',
        heading: 'How was lunch?',
        description: 'Help us improve',
        branding: { primaryColor: '#2563EB' },
      },
      business: { name: 'Corner Bistro' },
      googleReviewUrl: 'https://g.page/r/test/review',
      feedbackQuestions: [],
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: mockData,
      }),
    });

    const result = await getPublicLanding('tok_123', mockFetch as unknown as typeof fetch);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain('/public/qr/tok_123');
    expect(options.method).toBe('GET');
    expect(result.business.name).toBe('Corner Bistro');
  });

  it('recordPublicScan sends POST to /public/qr/:token/scan', async () => {
    const mockScanResult = {
      title: 'Table 4',
      heading: 'How was lunch?',
      description: null,
      branding: {},
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: mockScanResult,
      }),
    });

    const result = await recordPublicScan('tok_abc', mockFetch as unknown as typeof fetch);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain('/public/qr/tok_abc/scan');
    expect(options.method).toBe('POST');
    expect(result.title).toBe('Table 4');
  });

  it('submitPublicFeedback sends payload to /public/qr/:token/feedback', async () => {
    const mockSubmitResult = {
      message: 'Thank you for your feedback!',
      feedbackId: 'fb_12345',
      googleReviewUrl: 'https://g.page/r/test/review',
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: mockSubmitResult,
      }),
    });

    const payload = {
      rating: 5,
      customerName: 'Jane Doe',
      customerEmail: 'jane@example.com',
      text: 'Wonderful hospitality!',
      consentAccepted: true,
    };

    const result = await submitPublicFeedback('tok_xyz', payload, mockFetch as unknown as typeof fetch);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain('/public/qr/tok_xyz/feedback');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual(payload);
    expect(result.feedbackId).toBe('fb_12345');
  });

  it('trackGoogleReviewClick sends POST to /public/qr/:token/google-review-click', async () => {
    const mockResult = {
      destinationUrl: 'https://g.page/r/test/review',
      recorded: true,
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: mockResult,
      }),
    });

    const result = await trackGoogleReviewClick('tok_999', mockFetch as unknown as typeof fetch);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain('/public/qr/tok_999/google-review-click');
    expect(options.method).toBe('POST');
    expect(result.destinationUrl).toBe('https://g.page/r/test/review');
  });
});
