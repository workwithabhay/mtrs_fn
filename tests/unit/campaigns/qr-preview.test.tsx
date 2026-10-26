import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { QrPreview } from '@/components/campaigns/qr-preview';
import * as campaignsApi from '@/lib/api/campaigns';
import type { QrCampaign } from '@/lib/api/types';

describe('QrPreview Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockCampaign: QrCampaign = {
    _id: 'c-preview-1',
    businessId: 'b-1',
    title: 'Bar Counter Flyer',
    heading: 'Scan to review our drinks',
    description: 'We appreciate your support',
    branding: { primaryColor: '#2563EB', backgroundColor: '#FFFFFF' },
    status: 'active',
    publicToken: 'preview-token-abcdef123456',
    scanCount: 12,
    createdAt: '2026-10-24T12:00:00.000Z',
    updatedAt: '2026-10-24T12:00:00.000Z',
  };

  it('should fetch SVG export and render preview in safe img element', async () => {
    const mockBlob = new Blob(['<svg></svg>'], { type: 'image/svg+xml' });
    vi.spyOn(campaignsApi, 'exportCampaignQr').mockResolvedValue({
      blob: mockBlob,
      contentType: 'image/svg+xml',
      filename: 'qr-bar-counter-flyer.svg',
    });

    const createObjectURLMock = vi.fn().mockReturnValue('blob:http://localhost/mock-qr-svg');
    const revokeObjectURLMock = vi.fn();
    window.URL.createObjectURL = createObjectURLMock;
    window.URL.revokeObjectURL = revokeObjectURLMock;

    render(<QrPreview campaign={mockCampaign} />);

    await waitFor(() => {
      const img = screen.getByRole('img', { name: /official qr code for bar counter flyer/i });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'blob:http://localhost/mock-qr-svg');
    });

    expect(screen.getByText('Bar Counter Flyer')).toBeInTheDocument();
    expect(screen.getByText('Scan to review our drinks')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should display destination URL and copy to clipboard on click', async () => {
    const mockBlob = new Blob(['<svg></svg>'], { type: 'image/svg+xml' });
    vi.spyOn(campaignsApi, 'exportCampaignQr').mockResolvedValue({
      blob: mockBlob,
      contentType: 'image/svg+xml',
      filename: 'qr.svg',
    });
    window.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock');
    window.URL.revokeObjectURL = vi.fn();

    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<QrPreview campaign={mockCampaign} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/scan destination url/i)).toBeInTheDocument();
    });

    const copyBtn = screen.getByRole('button', { name: /copy destination url/i });
    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(writeTextMock).toHaveBeenCalledWith(
      expect.stringContaining('/qr/preview-token-abcdef123456'),
    );
  });

  it('should show error and retry if preview loading fails', async () => {
    const exportSpy = vi.spyOn(campaignsApi, 'exportCampaignQr')
      .mockRejectedValueOnce(new Error('Export service unavailable'))
      .mockResolvedValueOnce({
        blob: new Blob(['<svg></svg>'], { type: 'image/svg+xml' }),
        contentType: 'image/svg+xml',
        filename: 'qr.svg',
      });

    window.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock');
    window.URL.revokeObjectURL = vi.fn();

    render(<QrPreview campaign={mockCampaign} />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Preview failed')).toBeInTheDocument();
    });

    const retryBtn = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByRole('img', { name: /official qr code/i })).toBeInTheDocument();
    });

    expect(exportSpy).toHaveBeenCalledTimes(2);
  });
});
