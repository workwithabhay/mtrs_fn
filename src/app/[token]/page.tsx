import { redirect, notFound } from 'next/navigation';

/**
 * Top-level reserved paths that must not be treated as campaign tokens.
 */
const RESERVED_PATHS = new Set([
  'dashboard',
  'pricing',
  'design-system',
  'qr',
  'login',
  'signup',
  'api',
  '_next',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
]);

interface ShortTokenPageProps {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Short-link redirect handler:
 * Resolves short links like `https://mtrs-fn.vercel.app/:token`
 * and redirects directly to the canonical customer feedback route `/qr/:token`.
 */
export default async function ShortTokenRedirectPage({
  params,
  searchParams,
}: ShortTokenPageProps) {
  const { token } = await params;
  const cleanToken = token?.trim();

  if (!cleanToken || RESERVED_PATHS.has(cleanToken.toLowerCase())) {
    notFound();
  }

  const sp = await searchParams;
  const search = new URLSearchParams();
  for (const [key, val] of Object.entries(sp)) {
    if (typeof val === 'string') {
      search.set(key, val);
    } else if (Array.isArray(val)) {
      val.forEach((v) => search.append(key, v));
    }
  }

  const queryStr = search.toString() ? `?${search.toString()}` : '';
  redirect(`/qr/${encodeURIComponent(cleanToken)}${queryStr}`);
}
