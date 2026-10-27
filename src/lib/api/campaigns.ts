import { apiFetch, apiFetchWithMeta, apiFetchBlob, type BlobResponse } from './client';
import type {
  QrCampaign,
  CreateQrCampaignPayload,
  UpdateQrCampaignPayload,
  ListQrCampaignsQuery,
  PaginatedResult,
  QrExportFormat,
  PaginationMeta,
} from './types';
import { config } from '../config/env';

/**
 * Lists QR campaigns for the authenticated business owner.
 */
export async function listCampaigns(
  query: ListQrCampaignsQuery = {},
  fetchFn?: typeof fetch,
): Promise<PaginatedResult<QrCampaign>> {
  const searchParams = new URLSearchParams();
  if (query.page) searchParams.set('page', query.page.toString());
  if (query.limit) searchParams.set('limit', query.limit.toString());
  if (query.status) searchParams.set('status', query.status);

  const queryString = searchParams.toString();
  const endpoint = `/qr-campaigns${queryString ? `?${queryString}` : ''}`;

  const res = await apiFetchWithMeta<QrCampaign[]>(endpoint, { method: 'GET' }, fetchFn);

  const meta: PaginationMeta = {
    total: typeof res.meta?.total === 'number' ? res.meta.total : res.data.length,
    page: typeof res.meta?.page === 'number' ? res.meta.page : 1,
    limit: typeof res.meta?.limit === 'number' ? res.meta.limit : 10,
    totalPages: typeof res.meta?.totalPages === 'number' ? res.meta.totalPages : 1,
  };

  return {
    campaigns: res.data || [],
    meta,
  };
}

/**
 * Retrieves a single campaign by ID ensuring tenant boundaries.
 */
export async function getCampaignById(
  id: string,
  fetchFn?: typeof fetch,
): Promise<QrCampaign> {
  return apiFetch<QrCampaign>(`/qr-campaigns/${id}`, { method: 'GET' }, fetchFn);
}

/**
 * Creates a new QR campaign using the backend validation schema.
 */
export async function createCampaign(
  payload: CreateQrCampaignPayload,
  fetchFn?: typeof fetch,
): Promise<QrCampaign> {
  return apiFetch<QrCampaign>(
    '/qr-campaigns',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    fetchFn,
  );
}

/**
 * Updates an existing campaign's title, heading, description, or branding.
 */
export async function updateCampaign(
  id: string,
  payload: UpdateQrCampaignPayload,
  fetchFn?: typeof fetch,
): Promise<QrCampaign> {
  return apiFetch<QrCampaign>(
    `/qr-campaigns/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
    fetchFn,
  );
}

/**
 * Deactivates a campaign.
 */
export async function deactivateCampaign(
  id: string,
  fetchFn?: typeof fetch,
): Promise<QrCampaign> {
  return apiFetch<QrCampaign>(
    `/qr-campaigns/${id}/deactivate`,
    {
      method: 'POST',
    },
    fetchFn,
  );
}

/**
 * Fetches exported QR code file blob (PNG, SVG, or PDF).
 */
export async function exportCampaignQr(
  id: string,
  format: QrExportFormat,
  fetchFn?: typeof fetch,
): Promise<BlobResponse> {
  return apiFetchBlob(`/qr-campaigns/${id}/export?format=${format}`, { method: 'GET' }, fetchFn);
}

/**
 * Triggers a secure browser file download for a generated QR campaign export.
 */
export async function triggerCampaignDownload(
  id: string,
  format: QrExportFormat,
  campaignTitle: string,
  fetchFn?: typeof fetch,
): Promise<string> {
  const { blob, filename: headerFilename } = await exportCampaignQr(id, format, fetchFn);

  const sanitizedSlug = campaignTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'campaign';
  const defaultFilename = `qr-${sanitizedSlug}.${format}`;
  const finalFilename = headerFilename || defaultFilename;

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const objectUrl = window.URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = objectUrl;
    downloadAnchor.download = finalFilename;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);

    // Clean up temporary object URL after browser download starts
    setTimeout(() => {
      window.URL.revokeObjectURL(objectUrl);
    }, 2000);
  }

  return finalFilename;
}

/**
 * Builds the canonical public customer feedback destination URL for a campaign token.
 */
export function getPublicCampaignLandingUrl(publicToken: string): string {
  // If running in browser on a production/deployed host, use window.location.origin.
  // When running locally on localhost/127.0.0.1 or during SSR, use config.appUrl
  // so that scanned QR codes and copied links point to the live deployment (https://mtrs-fn.vercel.app).
  if (
    typeof window !== 'undefined' &&
    window.location.origin &&
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('127.0.0.1')
  ) {
    return `${window.location.origin}/qr/${publicToken}`;
  }
  const appBase = config.appUrl.replace(/\/+$/, '');
  return `${appBase}/qr/${publicToken}`;
}
