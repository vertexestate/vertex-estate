/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Canonical public site URL (https://yourdomain.com) — used in links/meta. */
  readonly VITE_SITE_PUBLIC_URL?: string;
  /** Short brand name shown next to logo. */
  readonly VITE_SITE_NAME?: string;
  /** Browser tab title. */
  readonly VITE_SITE_TITLE?: string;
  /** Public path or absolute URL to logo image (e.g. /brand/logo.png). */
  readonly VITE_LOGO_URL?: string;
  /** Backend base URL for leads + optional listings JSON (no trailing slash). */
  readonly VITE_API_BASE_URL?: string;
  /** POST path for contact form (appended to VITE_API_BASE_URL). Default /leads/contact */
  readonly VITE_API_CONTACT_PATH?: string;
  /** POST path for home concierge / multi-step form. Default /leads/concierge */
  readonly VITE_API_CONCIERGE_PATH?: string;
  /** POST path for footer newsletter. Default /leads/newsletter */
  readonly VITE_API_NEWSLETTER_PATH?: string;
  /** POST path for coming-soon waitlist. Default /leads/launch-interest */
  readonly VITE_API_LAUNCH_INTEREST_PATH?: string;
  /** Google Maps embed URL for contact page iframe */
  readonly VITE_MAP_EMBED_URL?: string;
  /** Full URL returning a JSON array of Property objects (optional CDN or API). */
  readonly VITE_PROPERTIES_JSON_URL?: string;
  /** Include bundled demo listings when remote URL is set or fails. true | false */
  readonly VITE_INCLUDE_SEED_PROPERTIES?: string;
  /** Bootstrap estate owner email (client demo only — replace with real auth). */
  readonly VITE_ESTATE_OWNER_EMAIL?: string;
  readonly VITE_ESTATE_OWNER_PHONE?: string;
  readonly VITE_ESTATE_OWNER_NAME?: string;
  readonly VITE_ESTATE_OWNER_PASSWORD?: string;
  /** Show global coming soon overlay (default true; set false to disable). */
  readonly VITE_SHOW_COMING_SOON?: string;
  /** ISO 8601 instant when the coming-soon gate lifts (same for all visitors). Overrides built-in default. */
  readonly VITE_COMING_SOON_UNTIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
