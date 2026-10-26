import { apiFetch } from './client';
import type {
  PublicQrLandingData,
  PublicScanResult,
  SubmitFeedbackPayload,
  SubmitFeedbackResult,
  GoogleReviewClickResult,
} from './types';

/**
 * Resolves the public landing page data for a scanned QR campaign.
 * Returns public campaign branding, business name, Google review URL, and custom questions.
 * Throws ApiError with status 404 if the campaign is inactive or the token is invalid.
 */
export async function getPublicLanding(
  token: string,
  fetchFn?: typeof fetch,
): Promise<PublicQrLandingData> {
  const cleanToken = encodeURIComponent(token.trim());
  return apiFetch<PublicQrLandingData>(
    `/public/qr/${cleanToken}`,
    {
      method: 'GET',
    },
    fetchFn,
  );
}

/**
 * Records a scan event for an active campaign, incrementing its scan counter atomically.
 * Rate-limited by the backend scan limiter.
 */
export async function recordPublicScan(
  token: string,
  fetchFn?: typeof fetch,
): Promise<PublicScanResult> {
  const cleanToken = encodeURIComponent(token.trim());
  return apiFetch<PublicScanResult>(
    `/public/qr/${cleanToken}/scan`,
    {
      method: 'POST',
    },
    fetchFn,
  );
}

/**
 * Submits customer feedback and rating.
 * Google review option is provided without gating regardless of selected rating.
 */
export async function submitPublicFeedback(
  token: string,
  payload: SubmitFeedbackPayload,
  fetchFn?: typeof fetch,
): Promise<SubmitFeedbackResult> {
  const cleanToken = encodeURIComponent(token.trim());
  return apiFetch<SubmitFeedbackResult>(
    `/public/qr/${cleanToken}/feedback`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    fetchFn,
  );
}

/**
 * Records a customer click on the Google review action button.
 * Preserves audit tracking without interfering with customer navigation.
 */
export async function trackGoogleReviewClick(
  token: string,
  fetchFn?: typeof fetch,
): Promise<GoogleReviewClickResult> {
  const cleanToken = encodeURIComponent(token.trim());
  return apiFetch<GoogleReviewClickResult>(
    `/public/qr/${cleanToken}/google-review-click`,
    {
      method: 'POST',
    },
    fetchFn,
  );
}
