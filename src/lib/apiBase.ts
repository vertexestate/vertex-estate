import { siteConfig } from '../config/siteConfig';

/**
 * Our Express server mounts `/leads`, `/health`, etc. at the **host root** — not under `/api`.
 * If `VITE_API_BASE_URL` is mistakenly `http://localhost:3001/api`, strip the trailing `/api`.
 * We do **not** strip `http://localhost:5173/api` — that prefix is how the browser hits the Vite proxy.
 */
function normalizeConfiguredApiBase(raw: string): string {
  const base = raw.trim().replace(/\/+$/, '');
  if (!base) return '';
  try {
    const u = new URL(base);
    const local = u.hostname === 'localhost' || u.hostname === '127.0.0.1';
    const port = u.port || '';
    const isNodeApiPort = port === '3001';
    if (local && isNodeApiPort && /\/api$/i.test(base)) {
      return base.replace(/\/api$/i, '');
    }
  } catch {
    /* ignore invalid absolute URLs */
  }
  return base;
}

/**
 * API base for browser `fetch`:
 * - If `VITE_API_BASE_URL` is set → use it (no trailing slash), e.g. `https://api.yourdomain.com`
 *   or same origin `https://yourdomain.com` when the API is on that host at `/leads/*`.
 * - Otherwise `/api` (dev: Vite proxy to Node; Vercel: rewrite to the serverless handler).
 */
export function getClientApiBase(): string {
  const fromEnv = normalizeConfiguredApiBase(siteConfig.apiBaseUrl || '');
  if (fromEnv) return fromEnv;
  return '/api';
}

function trimSlash(url: string) {
  return url.replace(/\/+$/, '');
}

/**
 * Join API base with a path like `/leads/launch-interest` or `/health`.
 * Handles relative bases (`/api`) and absolute URLs (with or without a path segment on the host).
 */
export function joinApiUrl(apiBase: string, path: string): string {
  const rel = path.startsWith('/') ? path.slice(1) : path;
  const base = trimSlash(apiBase);
  if (base.startsWith('/')) {
    return `${base}/${rel}`.replace(/([^:])\/+/g, '$1/');
  }
  const baseForUrl = base.endsWith('/') ? base : `${base}/`;
  return new URL(rel, baseForUrl).href;
}
