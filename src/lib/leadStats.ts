import { getClientApiBase, joinApiUrl } from './apiBase';

/** Public count of coming-soon waitlist rows in MongoDB (`source: coming_soon_launch`). */
export async function fetchLaunchSignupCount(): Promise<number | null> {
  const base = getClientApiBase();
  if (!base) return null;
  try {
    const res = await fetch(joinApiUrl(base, '/stats/launch-interest-count'));
    if (!res.ok) return null;
    const data = (await res.json()) as { count?: number };
    return typeof data.count === 'number' ? data.count : null;
  } catch {
    return null;
  }
}
