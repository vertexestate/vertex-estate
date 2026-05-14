import { siteConfig } from '../config/siteConfig';
import { getClientApiBase } from './apiBase';

const OFFLINE_QUEUE_KEY = 'vertex-lead-queue';

/** `api` = POST reached your Node server (writes to MongoDB when configured). `offline` = queued in localStorage. */
export type SubmitResult =
  | { ok: true; mode: 'api' | 'offline' }
  | { ok: false; error: string };

function queueOffline(path: string, body: unknown) {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    const q = (raw ? JSON.parse(raw) : []) as Array<{ path: string; body: unknown; ts: number }>;
    q.push({ path, body, ts: Date.now() });
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(q));
  } catch {
    /* noop */
  }
}

/**
 * POST JSON to your backend when `VITE_API_BASE_URL` is set.
 * If unset, payloads are appended to localStorage under `vertex-lead-queue`
 * so you can export them until the API is live.
 */
export async function postLead(path: string, body: unknown): Promise<SubmitResult> {
  const base = getClientApiBase();
  if (!base) {
    queueOffline(path, body);
    return { ok: true, mode: 'offline' };
  }
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      let text = await res.text().catch(() => '');
      try {
        const j = JSON.parse(text) as { error?: string };
        if (j?.error && typeof j.error === 'string') text = j.error;
      } catch {
        /* keep raw text */
      }
      return {
        ok: false,
        error: text || `Server returned ${res.status}`,
      };
    }
    return { ok: true, mode: 'api' };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    return { ok: false, error: msg };
  }
}

export async function submitContactMessage(payload: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): Promise<SubmitResult> {
  return postLead(siteConfig.apiContactPath, {
    source: 'contact_page',
    ...payload,
    submittedAt: new Date().toISOString(),
  });
}

export async function submitConciergeLead(payload: Record<string, unknown>): Promise<SubmitResult> {
  return postLead(siteConfig.apiConciergePath, {
    source: 'home_concierge',
    ...payload,
    submittedAt: new Date().toISOString(),
  });
}

export async function submitNewsletterEmail(email: string): Promise<SubmitResult> {
  return postLead(siteConfig.apiNewsletterPath, {
    source: 'footer_newsletter',
    email,
    submittedAt: new Date().toISOString(),
  });
}

export async function submitLaunchInterest(payload: {
  name: string;
  email: string;
  phone?: string;
  note?: string;
  /** Honeypot — leave empty; bots may fill it (not named "website" to avoid autofill). */
  bhp?: string;
}): Promise<SubmitResult> {
  return postLead(siteConfig.apiLaunchInterestPath, {
    source: 'coming_soon_launch',
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: (payload.phone || '').trim(),
    note: (payload.note || '').trim().slice(0, 2000),
    bhp: (payload.bhp || '').trim(),
    submittedAt: new Date().toISOString(),
  });
}
