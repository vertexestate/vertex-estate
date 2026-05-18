/**
 * Production-facing values from Vite env (set in `.env` / hosting dashboard).
 * Anything optional falls back so local dev keeps working without a `.env` file.
 */

function trimSlash(url: string) {
  return url.replace(/\/+$/, '');
}

/**
 * Precise Google Maps pin for Vertex @ Chaudhry Plaza, F-7 Markaz (text search often lands in the wrong sector).
 * Override with `VITE_VERTEX_OFFICE_LAT` / `VITE_VERTEX_OFFICE_LNG` if you need to nudge the pin.
 */
const VERTEX_OFFICE_LAT_DEFAULT = '33.718722';
const VERTEX_OFFICE_LNG_DEFAULT = '73.054125';

function vertexOfficeLatLng(): { lat: string; lng: string } {
  const lat = (import.meta.env.VITE_VERTEX_OFFICE_LAT || '').trim() || VERTEX_OFFICE_LAT_DEFAULT;
  const lng = (import.meta.env.VITE_VERTEX_OFFICE_LNG || '').trim() || VERTEX_OFFICE_LNG_DEFAULT;
  return { lat, lng };
}

function defaultVertexMapsEmbedUrl() {
  const { lat, lng } = vertexOfficeLatLng();
  return `https://www.google.com/maps?q=${lat},${lng}&z=18&hl=en&output=embed`;
}

function defaultVertexMapsOpenUrl() {
  const { lat, lng } = vertexOfficeLatLng();
  return `https://www.google.com/maps?q=${lat},${lng}&z=18&hl=en`;
}

export const siteConfig = {
  /** Public site URL for canonical links (add your domain in `.env`). */
  publicUrl: (
    import.meta.env.VITE_SITE_PUBLIC_URL || 'https://www.vertexestatepvt.com'
  ).replace(/\/+$/, ''),

  siteName: import.meta.env.VITE_SITE_NAME || 'Vertex Estate',

  documentTitle: import.meta.env.VITE_SITE_TITLE || 'Vertex Estate — Premium real estate',

  /** Google Analytics 4 measurement ID (must match `index.html` gtag if you change it). */
  googleAnalyticsId:
    (import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim() || 'G-RS7J0522BQ',

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
    (import.meta.env.VITE_MAP_EMBED_URL as string | undefined) || defaultVertexMapsEmbedUrl(),

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

  /**
   * Google Maps (opens in app / browser). Coming-soon “Open live map”. Override with
   * `VITE_COMING_SOON_MAP_URL` or `VITE_VERTEX_OFFICE_MAP_URL`.
   */
  comingSoonGoogleMapsUrl:
    (import.meta.env.VITE_COMING_SOON_MAP_URL || import.meta.env.VITE_VERTEX_OFFICE_MAP_URL || '')
      .trim() || defaultVertexMapsOpenUrl(),

  /** Same office pin as `comingSoonGoogleMapsUrl` — contact page “Visit us” default. */
  vertexOfficeMapsOpenUrl:
    (import.meta.env.VITE_VERTEX_OFFICE_MAP_URL || import.meta.env.VITE_COMING_SOON_MAP_URL || '')
      .trim() || defaultVertexMapsOpenUrl(),

  /**
   * Live Google Maps iframe `src` on the coming-soon screen (embed URL from Maps → Share → Embed a map,
   * or a `.../maps?q=...&output=embed` style URL). Override with `VITE_COMING_SOON_MAP_EMBED_URL`.
   */
  comingSoonMapEmbedUrl:
    (import.meta.env.VITE_COMING_SOON_MAP_EMBED_URL || import.meta.env.VITE_MAP_EMBED_URL || '')
      .trim() || defaultVertexMapsEmbedUrl(),

  /** Short location line next to the map on coming soon (full address is in the map pin only). */
  comingSoonLocationLine:
    (import.meta.env.VITE_COMING_SOON_LOCATION_LINE || '').trim() || 'F7 Markaz, Islamabad',

  /** Promo ticker slides at the top of coming soon (pipe-separated in env). */
  comingSoonPromoSlides: (() => {
    const fromEnv = (import.meta.env.VITE_COMING_SOON_PROMO_SLIDES || '').trim();
    if (fromEnv) {
      const parsed = fromEnv.split('|').map((s) => s.trim()).filter(Boolean);
      if (parsed.length > 0) return parsed;
    }
    const single = (import.meta.env.VITE_COMING_SOON_TAGLINE || '').trim();
    if (single) return [single];
    return [
      'Fill out the waitlist form — get a special launch discount',
      'Early members get priority access before public launch',
      'Exclusive offers on Joining The Waitlist',
    ];
  })(),

  /** Social profiles linked from the coming-soon overlay (override with VITE_SOCIAL_* if URLs change). */
  comingSoonSocial: {
    facebook:
      (import.meta.env.VITE_SOCIAL_FACEBOOK_URL || '').trim() ||
      'https://www.facebook.com/profile.php?id=61589176933977',
    instagram:
      (import.meta.env.VITE_SOCIAL_INSTAGRAM_URL || '').trim() ||
      'https://www.instagram.com/vertexestate0/',
    tiktok:
      (import.meta.env.VITE_SOCIAL_TIKTOK_URL || '').trim() ||
      'https://www.tiktok.com/@vertexestate0?is_from_webapp=1&sender_device=pc',
  },
} as const;

export function absoluteUrl(path: string) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const base = siteConfig.publicUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  if (!base) return path;
  return `${trimSlash(base)}${path.startsWith('/') ? path : `/${path}`}`;
}
