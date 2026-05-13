/** GET JSON from same origin (e.g. /site/contact.json) or absolute URL. */
export async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { credentials: 'same-origin' });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
