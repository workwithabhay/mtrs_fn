import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QrDownloadActions } from '@/components/campaigns/qr-download-actions';
import * as campaignsApi from '@/lib/api/campaigns';

describe('QrDownloadActions Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should render buttons for all 3 supported formats: PNG, SVG, and PDF', () => {
    render(
      <QrDownloadActions campaignId="c-123" campaignTitle="Table Stand" />
    );

    expect(screen.getByRole('button', { name: /high-resolution png/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /scalable svg/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /printable pdf/i })).toBeInTheDocument();
  });

  it('should trigger PNG download when clicking PNG button', async () => {
    const downloadSpy = vi.spyOn(campaignsApi, 'triggerCampaignDownload').mockResolvedValue('qr-table-stand.png');

    render(
      <QrDownloadActions campaignId="c-123" campaignTitle="Table Stand" />
    );

    const pngBtn = screen.getByRole('button', { name: /high-resolution png/i });
    fireEvent.click(pngBtn);

    await waitFor(() => {
      expect(downloadSpy).toHaveBeenCalledWith('c-123', 'png', 'Table Stand');
    });
  });

  it('should trigger SVG download when clicking SVG button', async () => {
    const downloadSpy = vi.spyOn(campaignsApi, 'triggerCampaignDownload').mockResolvedValue('qr-table-stand.svg');

    render(
      <QrDownloadActions campaignId="c-123" campaignTitle="Table Stand" />
    );

    const svgBtn = screen.getByRole('button', { name: /scalable svg/i });
    fireEvent.click(svgBtn);

    await waitFor(() => {
      expect(downloadSpy).toHaveBeenCalledWith('c-123', 'svg', 'Table Stand');
    });
  });

  it('should trigger PDF download when clicking PDF button', async () => {
    const downloadSpy = vi.spyOn(campaignsApi, 'triggerCampaignDownload').mockResolvedValue('qr-table-stand.pdf');

    render(
      <QrDownloadActions campaignId="c-123" campaignTitle="Table Stand" />
    );

    const pdfBtn = screen.getByRole('button', { name: /printable pdf/i });
    fireEvent.click(pdfBtn);

    await waitFor(() => {
      expect(downloadSpy).toHaveBeenCalledWith('c-123', 'pdf', 'Table Stand');
    });
  });

  it('should render compact variant correctly', async () => {
    const downloadSpy = vi.spyOn(campaignsApi, 'triggerCampaignDownload').mockResolvedValue('qr.png');

    render(
      <QrDownloadActions campaignId="c-123" campaignTitle="Table Stand" variant="compact" />
    );

    const pngBtn = screen.getByRole('button', { name: /download table stand qr code as png/i });
    expect(pngBtn).toBeInTheDocument();
    fireEvent.click(pngBtn);

    await waitFor(() => {
      expect(downloadSpy).toHaveBeenCalledWith('c-123', 'png', 'Table Stand');
    });
  });

  it('should display error message if download fails', async () => {
    vi.spyOn(campaignsApi, 'triggerCampaignDownload').mockRejectedValue(
      new Error('Failed to generate PDF format from server.'),
    );

    render(
      <QrDownloadActions campaignId="c-123" campaignTitle="Table Stand" />
    );

    const pdfBtn = screen.getByRole('button', { name: /printable pdf/i });
    fireEvent.click(pdfBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Failed to generate PDF format from server.')).toBeInTheDocument();
    });
  });
});
