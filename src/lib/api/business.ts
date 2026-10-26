import { apiFetch } from './client';
import type {
  Business,
  BusinessSettings,
  UpdateBusinessProfilePayload,
  UpdateBusinessSettingsPayload,
} from './types';

/**
 * Retrieves the authenticated business profile.
 * Scoped to the session owner's tenant.
 * Endpoint: GET /api/v1/business
 */
export async function getBusinessProfile(fetchFn?: typeof fetch): Promise<Business> {
  return apiFetch<Business>('/business', { method: 'GET' }, fetchFn);
}

/**
 * Partially updates permitted business profile fields (name, category, googleReviewUrl, branding).
 * Enforces mass-assignment protection and CSRF validation.
 * Endpoint: PATCH /api/v1/business
 */
export async function updateBusinessProfile(
  payload: UpdateBusinessProfilePayload,
  fetchFn?: typeof fetch,
): Promise<Business> {
  return apiFetch<Business>(
    '/business',
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
    fetchFn,
  );
}

/**
 * Retrieves the business settings (language, allowPublicReviews, notificationEmail, headingText, subheadingText).
 * Endpoint: GET /api/v1/business/settings
 */
export async function getBusinessSettings(fetchFn?: typeof fetch): Promise<BusinessSettings> {
  return apiFetch<BusinessSettings>('/business/settings', { method: 'GET' }, fetchFn);
}

/**
 * Updates business settings.
 * Enforces CSRF validation and validates permitted fields.
 * Endpoint: PATCH /api/v1/business/settings
 */
export async function updateBusinessSettings(
  payload: UpdateBusinessSettingsPayload,
  fetchFn?: typeof fetch,
): Promise<BusinessSettings> {
  return apiFetch<BusinessSettings>(
    '/business/settings',
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
    fetchFn,
  );
}
