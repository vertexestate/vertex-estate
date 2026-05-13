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

  logoUrl: (import.meta.env.VITE_LOGO_URL || '').trim(),

  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || '').trim()
    ? trimSlash(import.meta.env.VITE_API_BASE_URL as string)
    : '',

  apiContactPath:
    (import.meta.env.VITE_API_CONTACT_PATH as string | undefined) || '/leads/contact',

  apiConciergePath:
    (import.meta.env.VITE_API_CONCIERGE_PATH as string | undefined) || '/leads/concierge',

  apiNewsletterPath:
    (import.meta.env.VITE_API_NEWSLETTER_PATH as string | undefined) || '/leads/newsletter',

  mapEmbedUrl:
    (import.meta.env.VITE_MAP_EMBED_URL as string | undefined) ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s',

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
} as const;

export function absoluteUrl(path: string) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const base = siteConfig.publicUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  if (!base) return path;
  return `${trimSlash(base)}${path.startsWith('/') ? path : `/${path}`}`;
}
