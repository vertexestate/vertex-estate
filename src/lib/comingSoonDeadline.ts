const LS_KEY = 'vertex-estate-coming-soon-deadline-ms-v2';

export function resolveComingSoonDeadlineMs(params: {
  fixedUntilMs: number;
  slidingDays: number;
}): number {
  if (typeof window === 'undefined') return 0;

  if (params.fixedUntilMs > 0) {
    return params.fixedUntilMs;
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const slidingMs = Math.max(params.slidingDays, 1 / 24) * msPerDay;

  const raw = window.localStorage.getItem(LS_KEY);
  if (raw) {
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) {
      if (parsed > Date.now()) return parsed;
      window.localStorage.removeItem(LS_KEY);
      return 0;
    }
  }

  const next = Date.now() + slidingMs;
  window.localStorage.setItem(LS_KEY, String(next));
  return next;
}
