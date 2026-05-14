/**
 * Production-facing values from Vite env (set in `.env` / hosting dashboard).
 * Anything optional falls back so local dev keeps working without a `.env` file.
 */

function trimSlash(url: string) {
  return url.replace(/\/+$/, '');
}

export const siteConfig = {
  /** Public site URL for canonical links (add your domain in `.env`). */
  publicUrl: (import.meta.env.VITE_SITE_PUBLIC_URL || '').replace(/\/+$/, ''),

  siteName: import.meta.env.VITE_SITE_NAME || 'Vertex Estate',

  documentTitle: import.meta.env.VITE_SITE_TITLE || 'Vertex Estate — Premium real estate',

  logoUrl: (import.meta.env.VITE_LOGO_URL || '').trim() || '/brand/logo.png',

  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || '').trim()
    ? trimSlash(import.meta.env.VITE_API_BASE_URL as string)
    : '',

  apiContactPath:
    (import.meta.env.VITE_API_CONTACT_PATH as string | undefined) || '/leads/contact',

  apiConciergePath:
    (import.meta.env.VITE_API_CONCIERGE_PATH as string | undefined) || '/leads/concierge',

  apiNewsletterPath:
    (import.meta.env.VITE_API_NEWSLETTER_PATH as string | undefined) || '/leads/newsletter',

  apiLaunchInterestPath:
    (import.meta.env.VITE_API_LAUNCH_INTEREST_PATH as string | undefined) ||
    '/leads/launch-interest',

  mapEmbedUrl:
    (import.meta.env.VITE_MAP_EMBED_URL as string | undefined) ||
    'https://maps.google.com/maps?q=Chaudhry%20Plaza%20F-7%20Markaz%20Islamabad%20Pakistan&z=17&output=embed',

  propertiesJsonUrl: (import.meta.env.VITE_PROPERTIES_JSON_URL || '').trim(),

  includeSeedProperties:
    (import.meta.env.VITE_INCLUDE_SEED_PROPERTIES ?? 'true').toLowerCase() !== 'false',

  estateOwnerEmail:
    import.meta.env.VITE_ESTATE_OWNER_EMAIL || 'owner@vertex.estate',
  estateOwnerPhone:
    import.meta.env.VITE_ESTATE_OWNER_PHONE || '+10000000001',
  estateOwnerName:
    import.meta.env.VITE_ESTATE_OWNER_NAME || 'Vertex Estate Owner',
  estateOwnerPassword:
    import.meta.env.VITE_ESTATE_OWNER_PASSWORD || 'owner123',

  /**
   * Full-screen coming soon gate. Default on; set `VITE_SHOW_COMING_SOON=false` to disable.
   * One wall-clock launch instant for **every** visitor (`VITE_COMING_SOON_UNTIL` ISO, or the
   * built-in default below — same countdown in all browsers and profiles).
   */
  showComingSoon:
    (import.meta.env.VITE_SHOW_COMING_SOON ?? 'true').toLowerCase() !== 'false',
  /**
   * Parsed `VITE_COMING_SOON_UNTIL` (ISO 8601). If unset or invalid, uses the same default for everyone.
   * Change the default string here or set env per deploy.
   */
  comingSoonUntilMs: (() => {
    const raw = (import.meta.env.VITE_COMING_SOON_UNTIL || '').trim();
    if (raw) {
      const t = Date.parse(raw);
      if (Number.isFinite(t)) return t;
    }
    return Date.parse('2026-08-01T00:00:00+05:00');
  })(),
} as const;

export function absoluteUrl(path: string) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const base = siteConfig.publicUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  if (!base) return path;
  return `${trimSlash(base)}${path.startsWith('/') ? path : `/${path}`}`;
}
