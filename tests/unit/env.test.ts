import { describe, it, expect } from 'vitest';
import { validateAndParseConfig } from '@/lib/config/env';

describe('Frontend Environment Configuration', () => {
  it('should parse default configuration when no env variables are passed', () => {
    const config = validateAndParseConfig({});
    expect(config.apiUrl).toBe('https://mtrs-bg.vercel.app/api/v1');
    expect(config.backendBaseUrl).toBe('https://mtrs-bg.vercel.app');
    expect(config.appUrl).toBe('https://mtrs-fn.vercel.app/');
    expect(config.isProduction).toBe(false);
    expect(config.isDevelopment).toBe(true);
  });

  it('should parse custom NEXT_PUBLIC_API_URL and derive correct backendBaseUrl', () => {
    const config = validateAndParseConfig({
      NEXT_PUBLIC_API_URL: 'https://api.myreviewapp.com/api/v1',
      NEXT_PUBLIC_APP_URL: 'https://myreviewapp.com',
      NODE_ENV: 'production',
    });

    expect(config.apiUrl).toBe('https://api.myreviewapp.com/api/v1');
    expect(config.backendBaseUrl).toBe('https://api.myreviewapp.com');
    expect(config.appUrl).toBe('https://myreviewapp.com');
    expect(config.isProduction).toBe(true);
  });

  it('should throw clear descriptive error when NEXT_PUBLIC_API_URL is invalid', () => {
    expect(() => {
      validateAndParseConfig({
        NEXT_PUBLIC_API_URL: 'invalid-url-without-protocol',
      });
    }).toThrow('Invalid NEXT_PUBLIC_API_URL');
  });
});
