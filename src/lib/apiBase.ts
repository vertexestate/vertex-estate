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
 * - If `VITE_API_BASE_URL` is set → use it (e.g. `https://api.yourdomain.com`).
 * - Otherwise `/api` (dev: Vite proxy; **production**: your host must reverse-proxy `/api` to Node).
 */
export function getClientApiBase(): string {
  const fromEnv = normalizeConfiguredApiBase(siteConfig.apiBaseUrl || '');
  if (fromEnv) return fromEnv;
  return '/api';
}
