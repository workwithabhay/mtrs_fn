import { describe, it, expect, vi } from 'vitest';
import ShortTokenRedirectPage from '@/app/[token]/page';
import * as navigation from 'next/navigation';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

describe('ShortTokenRedirectPage (/[token])', () => {
  it('redirects valid short token to /qr/[token]', async () => {
    await ShortTokenRedirectPage({
      params: Promise.resolve({ token: 'y89' }),
      searchParams: Promise.resolve({}),
    });

    expect(navigation.redirect).toHaveBeenCalledWith('/qr/y89');
  });

  it('preserves query parameters during redirection', async () => {
    await ShortTokenRedirectPage({
      params: Promise.resolve({ token: 'campaign123' }),
      searchParams: Promise.resolve({ source: 'sms', ref: 'table_5' }),
    });

    expect(navigation.redirect).toHaveBeenCalledWith('/qr/campaign123?source=sms&ref=table_5');
  });

  it('triggers notFound for reserved routes like dashboard', async () => {
    await ShortTokenRedirectPage({
      params: Promise.resolve({ token: 'dashboard' }),
      searchParams: Promise.resolve({}),
    });

    expect(navigation.notFound).toHaveBeenCalled();
  });
});
