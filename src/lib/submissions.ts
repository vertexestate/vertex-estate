import { siteConfig } from '../config/siteConfig';
import { getClientApiBase, joinApiUrl } from './apiBase';

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
 * POST JSON to your backend. Uses `joinApiUrl` so `VITE_API_BASE_URL` resolves paths correctly
 * (absolute host or relative `/api` proxy).
 */
export async function postLead(path: string, body: unknown): Promise<SubmitResult> {
  const base = getClientApiBase();
  if (!base) {
    queueOffline(path, body);
    return { ok: true, mode: 'offline' };
  }
  const p = path.startsWith('/') ? path : `/${path}`;
  const url = joinApiUrl(base, p);
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidLaunchInterestEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim().toLowerCase());
}

/**
 * Coming-soon waitlist. Server persists only: name, email, phone, description, source, submittedAt.
 */
export async function submitLaunchInterest(payload: {
  name: string;
  email: string;
  phone: string;
  description: string;
  /** Honeypot — leave empty; bots may fill it. */
  bhp?: string;
}): Promise<SubmitResult> {
  return postLead(siteConfig.apiLaunchInterestPath, {
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    description: payload.description.trim().slice(0, 4000),
    bhp: (payload.bhp || '').trim(),
  });
}
