import { config } from '../config/env';
import type { ApiErrorDetail, ApiErrorResponse, ApiSuccessResponse } from './types';

export class ApiError extends Error {
  code: string;
  status: number;
  details?: ApiErrorDetail[];

  constructor(code: string, message: string, status: number, details?: ApiErrorDetail[]) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('auth_token');
}

/**
 * Extracts the readable csrf_token cookie set by the backend.
 * Accessible to client-side JavaScript for Double-Submit CSRF protection.
 */
export function getCsrfTokenFromCookie(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export interface ApiFetchOptions extends RequestInit {
  timeoutMs?: number;
}

/**
 * Resolves an API endpoint against config.apiUrl.
 * Normalizes slashes and prevents duplicate `/api/v1/api/v1` prefixes.
 */
export function resolveApiUrl(endpoint: string): string {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const base = config.apiUrl.replace(/\/+$/, '');
  if (base.endsWith('/api/v1') && cleanEndpoint.startsWith('/api/v1/')) {
    return `${base}${cleanEndpoint.slice(7)}`;
  }
  if (base.endsWith('/api/v1') && cleanEndpoint === '/api/v1') {
    return base;
  }
  return `${base}${cleanEndpoint}`;
}

/**
 * Centralized fetch client for ReviewFlow backend API requests.
 * Automatically enforces:
 * - Base URL resolution from config.apiUrl
 * - credentials: 'include' for secure HTTP-only cookies
 * - x-csrf-token header on state-changing requests when csrf_token cookie exists
 * - Standardized error parsing into ApiError
 */
export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {},
  fetchFn: typeof fetch = fetch,
): Promise<T> {
  const url = resolveApiUrl(endpoint);

  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  // Set Authorization Bearer header if available and not explicitly provided
  if (!headers.has('Authorization')) {
    const token = getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // Set Content-Type for JSON payloads if not already set and body exists
  if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Double-submit CSRF protection for state-changing methods
  const isStateChanging = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
  if (isStateChanging && !headers.has('x-csrf-token')) {
    const csrfToken = getCsrfTokenFromCookie();
    if (csrfToken) {
      headers.set('x-csrf-token', csrfToken);
    }
  }

  const timeoutMs = options.timeoutMs ?? 15000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchFn(url, {
      ...options,
      method,
      headers,
      credentials: 'include', // Mandated for HTTP-only session cookie
      signal: options.signal || controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!response.ok) {
      if (isJson) {
        try {
          const errorPayload = (await response.json()) as ApiErrorResponse;
          if (errorPayload.error) {
            throw new ApiError(
              errorPayload.error.code || 'UNKNOWN_ERROR',
              errorPayload.error.message || `Request failed with status ${response.status}`,
              response.status,
              errorPayload.error.details,
            );
          }
        } catch (parseErr) {
          if (parseErr instanceof ApiError) {
            throw parseErr;
          }
        }
      }

      throw new ApiError(
        'HTTP_ERROR',
        `Request failed with status ${response.status} (${response.statusText || 'Error'})`,
        response.status,
      );
    }

    // Success response parsing
    if (response.status === 204) {
      return undefined as unknown as T;
    }

    if (isJson) {
      const json = await response.json();
      if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
        return (json as ApiSuccessResponse<T>).data;
      }
      return json as T;
    }

    return (await response.text()) as unknown as T;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) {
      throw err;
    }

    const message = err instanceof Error ? err.message : 'Unknown network failure';
    if (message.includes('aborted')) {
      throw new ApiError(
        'TIMEOUT_ERROR',
        `Request timed out after ${timeoutMs}ms. Please verify your connection and try again.`,
        408,
      );
    }

    throw new ApiError(
      'NETWORK_ERROR',
      'Unable to connect to the ReviewFlow server. Please check your internet connection.',
      0,
    );
  }
}

/**
 * Fetches JSON response and preserves the metadata payload (e.g. pagination).
 */
export async function apiFetchWithMeta<T>(
  endpoint: string,
  options: ApiFetchOptions = {},
  fetchFn: typeof fetch = fetch,
): Promise<{ data: T; meta?: Record<string, unknown> }> {
  const url = resolveApiUrl(endpoint);

  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  // Set Authorization Bearer header if available and not explicitly provided
  if (!headers.has('Authorization')) {
    const token = getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const isStateChanging = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
  if (isStateChanging && !headers.has('x-csrf-token')) {
    const csrfToken = getCsrfTokenFromCookie();
    if (csrfToken) {
      headers.set('x-csrf-token', csrfToken);
    }
  }

  const timeoutMs = options.timeoutMs ?? 15000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchFn(url, {
      ...options,
      method,
      headers,
      credentials: 'include',
      signal: options.signal || controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!response.ok) {
      if (isJson) {
        try {
          const errorPayload = (await response.json()) as ApiErrorResponse;
          if (errorPayload.error) {
            throw new ApiError(
              errorPayload.error.code || 'UNKNOWN_ERROR',
              errorPayload.error.message || `Request failed with status ${response.status}`,
              response.status,
              errorPayload.error.details,
            );
          }
        } catch (parseErr) {
          if (parseErr instanceof ApiError) {
            throw parseErr;
          }
        }
      }

      throw new ApiError(
        'HTTP_ERROR',
        `Request failed with status ${response.status} (${response.statusText || 'Error'})`,
        response.status,
      );
    }

    if (isJson) {
      const json = (await response.json()) as ApiSuccessResponse<T>;
      return {
        data: json.data,
        meta: json.meta,
      };
    }

    throw new ApiError('RESPONSE_ERROR', 'Expected JSON response format with metadata.', response.status);
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) {
      throw err;
    }

    const message = err instanceof Error ? err.message : 'Unknown network failure';
    if (message.includes('aborted')) {
      throw new ApiError(
        'TIMEOUT_ERROR',
        `Request timed out after ${timeoutMs}ms. Please verify your connection and try again.`,
        408,
      );
    }

    throw new ApiError(
      'NETWORK_ERROR',
      'Unable to connect to the ReviewFlow server. Please check your internet connection.',
      0,
    );
  }
}

export interface BlobResponse {
  blob: Blob;
  contentType: string;
  filename: string;
}

/**
 * Fetches binary/blob responses (PNG, SVG, PDF downloads and previews).
 * Standardizes error parsing if the server returns JSON error payload.
 */
export async function apiFetchBlob(
  endpoint: string,
  options: ApiFetchOptions = {},
  fetchFn: typeof fetch = fetch,
): Promise<BlobResponse> {
  const url = resolveApiUrl(endpoint);

  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers || {});

  // Set Authorization Bearer header if available and not explicitly provided
  if (!headers.has('Authorization')) {
    const token = getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const timeoutMs = options.timeoutMs ?? 20000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchFn(url, {
      ...options,
      method,
      headers,
      credentials: 'include',
      signal: options.signal || controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';

    if (!response.ok) {
      // If error returned as JSON, parse it as structured ApiError
      if (contentType.includes('application/json')) {
        try {
          const errorPayload = (await response.json()) as ApiErrorResponse;
          if (errorPayload.error) {
            throw new ApiError(
              errorPayload.error.code || 'UNKNOWN_ERROR',
              errorPayload.error.message || `Export failed with status ${response.status}`,
              response.status,
              errorPayload.error.details,
            );
          }
        } catch (parseErr) {
          if (parseErr instanceof ApiError) {
            throw parseErr;
          }
        }
      }

      throw new ApiError(
        'HTTP_ERROR',
        `Download request failed with status ${response.status}`,
        response.status,
      );
    }

    // Extract filename from Content-Disposition header if available
    const disposition = response.headers.get('content-disposition') || '';
    let filename = '';
    const filenameMatch = disposition.match(/filename=["']?([^"';]+)["']?/i);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1].trim();
    }

    const blob = await response.blob();
    return {
      blob,
      contentType,
      filename,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) {
      throw err;
    }

    const message = err instanceof Error ? err.message : 'Unknown network failure';
    if (message.includes('aborted')) {
      throw new ApiError(
        'TIMEOUT_ERROR',
        `Download request timed out after ${timeoutMs}ms. Please try again.`,
        408,
      );
    }

    throw new ApiError(
      'NETWORK_ERROR',
      'Unable to connect to the ReviewFlow server for file download.',
      0,
    );
  }
}
