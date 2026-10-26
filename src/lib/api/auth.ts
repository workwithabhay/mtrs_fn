import { apiFetch, ApiError } from './client';
import type {
  AuthSessionData,
  LoginRequestOtpPayload,
  LoginVerifyOtpPayload,
  OtpChallengeResult,
  SignupRequestOtpPayload,
  SignupVerifyOtpPayload,
} from './types';

/**
 * Requests an OTP code for business owner registration.
 * Endpoint: POST /api/v1/auth/signup/request-otp
 */
export async function requestSignupOtp(
  payload: SignupRequestOtpPayload,
  fetchFn?: typeof fetch,
): Promise<OtpChallengeResult> {
  return apiFetch<OtpChallengeResult>(
    '/auth/signup/request-otp',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    fetchFn,
  );
}

/**
 * Verifies a signup OTP code, atomically creating user + business and establishing an HTTP-only session.
 * Endpoint: POST /api/v1/auth/signup/verify-otp
 */
export async function verifySignupOtp(
  payload: SignupVerifyOtpPayload,
  fetchFn?: typeof fetch,
): Promise<AuthSessionData> {
  return apiFetch<AuthSessionData>(
    '/auth/signup/verify-otp',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    fetchFn,
  );
}

/**
 * Requests an OTP code for an existing business owner account.
 * Endpoint: POST /api/v1/auth/login/request-otp
 */
export async function requestLoginOtp(
  payload: LoginRequestOtpPayload,
  fetchFn?: typeof fetch,
): Promise<OtpChallengeResult> {
  return apiFetch<OtpChallengeResult>(
    '/auth/login/request-otp',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    fetchFn,
  );
}

/**
 * Verifies a login OTP code and establishes an authenticated session.
 * Endpoint: POST /api/v1/auth/login/verify-otp
 */
export async function verifyLoginOtp(
  payload: LoginVerifyOtpPayload,
  fetchFn?: typeof fetch,
): Promise<AuthSessionData> {
  return apiFetch<AuthSessionData>(
    '/auth/login/verify-otp',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    fetchFn,
  );
}

/**
 * Checks if the current browser request has an active, valid session cookie.
 * Endpoint: GET /api/v1/auth/me
 * Returns the authenticated user & business, or null if not authenticated.
 */
export async function getCurrentSession(fetchFn?: typeof fetch): Promise<AuthSessionData | null> {
  try {
    return await apiFetch<AuthSessionData>('/auth/me', { method: 'GET' }, fetchFn);
  } catch (err) {
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      return null;
    }
    // Network or other transient issues also mean no confirmed active session
    return null;
  }
}

/**
 * Revokes the current session and clears cookies on the server.
 * Endpoint: POST /api/v1/auth/logout
 */
export async function logout(fetchFn?: typeof fetch): Promise<void> {
  try {
    await apiFetch<{ message: string }>(
      '/auth/logout',
      {
        method: 'POST',
      },
      fetchFn,
    );
  } catch (err) {
    // Even if server call fails, we continue with client-side cleanup
    if (err instanceof ApiError && err.status === 401) {
      return;
    }
    throw err;
  }
}
