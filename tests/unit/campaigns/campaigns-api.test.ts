import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  listCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deactivateCampaign,
  exportCampaignQr,
  triggerCampaignDownload,
  getPublicCampaignLandingUrl,
} from '@/lib/api/campaigns';
import type { QrCampaign } from '@/lib/api/types';

describe('QR Campaigns API Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockCampaign: QrCampaign = {
    _id: '65f123456789abcdef012345',
    businessId: '65f111111111abcdef000001',
    title: 'Front Counter Stand',
    heading: 'How was your coffee today?',
    description: 'Help us improve our morning service',
    branding: {
      primaryColor: '#2563EB',
      backgroundColor: '#FFFFFF',
    },
    status: 'active',
    publicToken: 'a1b2c3d4e5f6789012345678',
    scanCount: 14,
    createdAt: '2026-10-24T10:00:00.000Z',
    updatedAt: '2026-10-24T10:00:00.000Z',
  };

  it('listCampaigns should query /api/v1/qr-campaigns with parameters and return paginated data', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: [mockCampaign],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      }),
    });

    const result = await listCampaigns({ page: 1, limit: 10, status: 'active' }, mockFetch as unknown as typeof fetch);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/qr-campaigns?page=1&limit=10&status=active'),
      expect.objectContaining({ method: 'GET' }),
    );
    expect(result.campaigns).toHaveLength(1);
    expect(result.campaigns[0].title).toBe('Front Counter Stand');
    expect(result.meta.total).toBe(1);
  });

  it('getCampaignById should query /api/v1/qr-campaigns/:id', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: mockCampaign,
      }),
    });

    const result = await getCampaignById('65f123456789abcdef012345', mockFetch as unknown as typeof fetch);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/qr-campaigns/65f123456789abcdef012345'),
      expect.objectContaining({ method: 'GET' }),
    );
    expect(result._id).toBe('65f123456789abcdef012345');
    expect(result.scanCount).toBe(14);
  });

  it('createCampaign should POST payload to /api/v1/qr-campaigns', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: mockCampaign,
      }),
    });

    const payload = {
      title: 'Table 14',
      heading: 'Rate your lunch',
      description: 'Quick feedback',
      branding: { primaryColor: '#059669' },
    };

    const result = await createCampaign(payload, mockFetch as unknown as typeof fetch);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/qr-campaigns'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );
    expect(result.title).toBe('Front Counter Stand');
  });

  it('updateCampaign should PATCH /api/v1/qr-campaigns/:id', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: { ...mockCampaign, title: 'Updated Title' },
      }),
    });

    const result = await updateCampaign(
      '65f123456789abcdef012345',
      { title: 'Updated Title' },
      mockFetch as unknown as typeof fetch,
    );

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/qr-campaigns/65f123456789abcdef012345'),
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ title: 'Updated Title' }),
      }),
    );
    expect(result.title).toBe('Updated Title');
  });

  it('deactivateCampaign should POST to /api/v1/qr-campaigns/:id/deactivate', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: { ...mockCampaign, status: 'inactive' },
      }),
    });

    const result = await deactivateCampaign('65f123456789abcdef012345', mockFetch as unknown as typeof fetch);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/qr-campaigns/65f123456789abcdef012345/deactivate'),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(result.status).toBe('inactive');
  });

  it('exportCampaignQr should fetch binary blob with requested format', async () => {
    const mockBlob = new Blob(['<svg></svg>'], { type: 'image/svg+xml' });
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({
        'content-type': 'image/svg+xml',
        'content-disposition': 'attachment; filename="qr-front-counter-stand.svg"',
      }),
      blob: async () => mockBlob,
    });

    const result = await exportCampaignQr('65f123456789abcdef012345', 'svg', mockFetch as unknown as typeof fetch);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/qr-campaigns/65f123456789abcdef012345/export?format=svg'),
      expect.objectContaining({ method: 'GET' }),
    );
    expect(result.contentType).toBe('image/svg+xml');
    expect(result.filename).toBe('qr-front-counter-stand.svg');
    expect(result.blob).toBe(mockBlob);
  });

  it('triggerCampaignDownload should download file in browser and sanitize filename', async () => {
    const mockBlob = new Blob(['PNG_DATA'], { type: 'image/png' });
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({
        'content-type': 'image/png',
      }),
      blob: async () => mockBlob,
    });

    // Mock DOM URL.createObjectURL and revokeObjectURL
    const createObjectURLMock = vi.fn().mockReturnValue('blob:http://localhost/test-blob');
    const revokeObjectURLMock = vi.fn();
    window.URL.createObjectURL = createObjectURLMock;
    window.URL.revokeObjectURL = revokeObjectURLMock;

    const filename = await triggerCampaignDownload(
      '65f123456789abcdef012345',
      'png',
      'Table 14 / Stand!',
      mockFetch as unknown as typeof fetch,
    );

    expect(filename).toBe('qr-table-14-stand.png');
    expect(createObjectURLMock).toHaveBeenCalledWith(mockBlob);
  });

  it('getPublicCampaignLandingUrl should return canonical public URL on live deployment', () => {
    const url = getPublicCampaignLandingUrl('a1b2c3d4e5f6789012345678');
    expect(url).toContain('/qr/a1b2c3d4e5f6789012345678');
    expect(url).toBe('https://mtrs-fn.vercel.app/qr/a1b2c3d4e5f6789012345678');
  });

  it('getPublicCampaignLandingUrl should avoid localhost origin and return live deployment URL', () => {
    // jsdom defaults to localhost
    const url = getPublicCampaignLandingUrl('tok_123');
    expect(url).toBe('https://mtrs-fn.vercel.app/qr/tok_123');
  });
});
