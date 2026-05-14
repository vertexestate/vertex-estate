import { siteConfig } from '../config/siteConfig';

/**
 * Our Express server mounts `/leads`, `/health`, etc. at the **host root** — not under `/api`.
 * If `VITE_API_BASE_URL` is mistakenly `http://localhost:3001/api`, strip the trailing `/api`
 * for localhost / 127.0.0.1 only (so real hosted APIs at `https://x.com/api` stay unchanged).
 */
function normalizeConfiguredApiBase(raw: string): string {
  const base = raw.trim().replace(/\/+$/, '');
  if (!base) return '';
  try {
    const u = new URL(base);
    const local = u.hostname === 'localhost' || u.hostname === '127.0.0.1';
    if (local && /\/api$/i.test(base)) {
      return base.replace(/\/api$/i, '');
    }
  } catch {
    /* ignore invalid absolute URLs */
  }
  return base;
}

/** Same-origin `/api` in dev (Vite proxy → Express). Production: set `VITE_API_BASE_URL`. */
export function getClientApiBase(): string {
  const fromEnv = normalizeConfiguredApiBase(siteConfig.apiBaseUrl || '');
  if (fromEnv) return fromEnv;
  if (import.meta.env.DEV) return '/api';
  return '';
}
