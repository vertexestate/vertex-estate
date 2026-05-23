/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Canonical public site URL (https://yourdomain.com) — used in links/meta. */
  readonly VITE_SITE_PUBLIC_URL?: string;
  readonly VITE_SEO_DEFAULT_TITLE?: string;
  readonly VITE_SEO_DEFAULT_DESCRIPTION?: string;
  readonly VITE_SEO_KEYWORDS?: string;
  readonly VITE_SEO_OG_IMAGE?: string;
  readonly VITE_SEO_TWITTER?: string;
  readonly VITE_SEO_CONTACT_EMAIL?: string;
  readonly VITE_SEO_CONTACT_PHONE?: string;
  readonly VITE_SITE_LOCALE?: string;
  /** WhatsApp number for wa.me links (digits only, e.g. 923109882888). */
  readonly VITE_WHATSAPP_PHONE?: string;
  readonly VITE_WHATSAPP_DEFAULT_MESSAGE?: string;
  /** Show PKR prices on listing cards (default false). */
  readonly VITE_SHOW_PUBLIC_PRICES?: string;
  /** Short brand name shown next to logo. */
  readonly VITE_SITE_NAME?: string;
  /** Browser tab title. */
  readonly VITE_SITE_TITLE?: string;
  /** Public path or absolute URL to logo image (e.g. /brand/logo.png). */
  readonly VITE_LOGO_URL?: string;
  /**
   * API origin for leads + optional `GET /properties` (no trailing slash).
   * Examples: `https://api.vertexestatepvt.com`, or same host as the site if routes are at `/leads/*`.
   * Omit to use `/api` (Vite proxy in dev; Vercel rewrite when deployed there).
   */
  readonly VITE_API_BASE_URL?: string;
  /** POST path for contact form (appended to VITE_API_BASE_URL). Default /leads/contact */
  readonly VITE_API_CONTACT_PATH?: string;
  /** POST path for home concierge / multi-step form. Default /leads/concierge */
  readonly VITE_API_CONCIERGE_PATH?: string;
  /** POST path for footer newsletter. Default /leads/newsletter */
  readonly VITE_API_NEWSLETTER_PATH?: string;
  /** POST path for coming-soon waitlist. Default /leads/launch-interest */
  readonly VITE_API_LAUNCH_INTEREST_PATH?: string;
  /** Google Analytics 4 measurement ID (e.g. G-RS7J0522BQ). Must match index.html if changed. */
  readonly VITE_GA_MEASUREMENT_ID?: string;
  /** Google Maps embed URL for contact page iframe */
  readonly VITE_MAP_EMBED_URL?: string;
  /** Full URL returning a JSON array of Property objects (optional CDN or API). */
  readonly VITE_PROPERTIES_JSON_URL?: string;
  /** Include bundled demo listings. Default off — set true only for local demos. */
  readonly VITE_INCLUDE_SEED_PROPERTIES?: string;
  /** Show OTP on-screen (dev). Default off in production builds. */
  readonly VITE_AUTH_DEMO_MODE?: string;
  /** Bootstrap estate owner email (client demo only — replace with real auth). */
  readonly VITE_ESTATE_OWNER_EMAIL?: string;
  readonly VITE_ESTATE_OWNER_PHONE?: string;
  readonly VITE_ESTATE_OWNER_NAME?: string;
  readonly VITE_ESTATE_OWNER_PASSWORD?: string;
  /** Show global coming soon overlay (default off after launch). */
  readonly VITE_SHOW_COMING_SOON?: string;
  /** ISO 8601 instant when the coming-soon gate lifts (same for all visitors). Overrides built-in default. */
  readonly VITE_COMING_SOON_UNTIL?: string;
  /** Short line next to the coming-soon map (default F7 Markaz; full address is in the map). */
  readonly VITE_COMING_SOON_LOCATION_LINE?: string;
  /** Top tagline on coming-soon (waitlist discount offer). */
  readonly VITE_COMING_SOON_TAGLINE?: string;
  /** Promo slider messages, pipe-separated (e.g. Offer A|Offer B|Offer C). */
  readonly VITE_COMING_SOON_PROMO_SLIDES?: string;
  /** Full URL — coming-soon social row (optional; defaults in siteConfig). */
  readonly VITE_SOCIAL_FACEBOOK_URL?: string;
  readonly VITE_SOCIAL_INSTAGRAM_URL?: string;
  readonly VITE_SOCIAL_TIKTOK_URL?: string;
  /** Google Maps link for the coming-soon “Open live map” (optional; defaults to lat/lng pin in siteConfig). */
  readonly VITE_COMING_SOON_MAP_URL?: string;
  /** Override default office map pin (optional; defaults to Chaudhry Plaza, F-7 Markaz coordinates). */
  readonly VITE_VERTEX_OFFICE_MAP_URL?: string;
  /** Label on map pin (default Vertex Estate). */
  readonly VITE_VERTEX_OFFICE_MAP_LABEL?: string;
  /** Full address under map label. */
  readonly VITE_VERTEX_OFFICE_ADDRESS?: string;
  /** Decimal latitude for default map embed + “Open in Maps” when env URLs are unset. */
  readonly VITE_VERTEX_OFFICE_LAT?: string;
  /** Decimal longitude — pair with `VITE_VERTEX_OFFICE_LAT`. */
  readonly VITE_VERTEX_OFFICE_LNG?: string;
  /** Google Maps iframe embed `src` for the coming-soon live map (optional; default in siteConfig). */
  readonly VITE_COMING_SOON_MAP_EMBED_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}
