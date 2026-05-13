import { siteConfig } from '../config/siteConfig';

const OFFLINE_QUEUE_KEY = 'vertex-lead-queue';

export type SubmitResult = { ok: true } | { ok: false; error: string };

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
  const base = siteConfig.apiBaseUrl;
  if (!base) {
    queueOffline(path, body);
    return { ok: true };
  }
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return {
        ok: false,
        error: text || `Server returned ${res.status}`,
      };
    }
    return { ok: true };
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
