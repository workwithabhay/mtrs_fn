/**
 * Frontend Environment Configuration Helper
 * Validates and surfaces strongly-typed frontend configuration.
 *
 * NOTE: Any variable prefixed with NEXT_PUBLIC_ is bundled into client-side
 * JavaScript and visible to anyone inspecting network traffic. Never place
 * server secrets, private keys, or credentials here.
 */

export interface FrontendConfig {
  apiUrl: string;
  backendBaseUrl: string;
  appUrl: string;
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;
}

export function validateAndParseConfig(env: Record<string, string | undefined> = process.env): FrontendConfig {
  // const apiUrl = env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api/v1';
  const apiUrl = env.NEXT_PUBLIC_API_URL || 'https://mtrs-bg.vercel.app/api/v1';
  const appUrl = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    const parsed = new URL(apiUrl);
    const backendBaseUrl = `${parsed.protocol}//${parsed.host}`;
    const nodeEnv = env.NODE_ENV || 'development';

    return {
      apiUrl,
      backendBaseUrl,
      appUrl,
      isProduction: nodeEnv === 'production',
      isDevelopment: nodeEnv === 'development',
      isTest: nodeEnv === 'test',
    };
  } catch {
    throw new Error(
      `Invalid NEXT_PUBLIC_API_URL: '${apiUrl}'. Must be a valid absolute URL (e.g. 'http://localhost:5050/api/v1').`,
    );
  }
}

export const config = validateAndParseConfig();
