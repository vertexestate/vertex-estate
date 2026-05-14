import { getClientApiBase } from './apiBase';

/** Response shape from `GET /health` (Express + MongoDB). */
export type ApiHealthResponse = {
  ok: boolean;
  mongoConnected?: boolean;
  error?: string;
  db?: string;
  leadsCollection?: string;
  propertiesCollection?: string;
  /** Approximate total documents in the leads collection. */
  leadDocumentEstimate?: number;
  /** Exact count of coming-soon waitlist rows (`source: coming_soon_launch`). */
  launchWaitlistCount?: number;
  propertyCount?: number;
};

/**
 * Calls the Vertex API `/health` (same `/api` proxy in dev).
 * Use this to confirm MongoDB is reachable and to read aggregate lead stats.
 */
export async function fetchApiHealth(): Promise<ApiHealthResponse> {
  const base = getClientApiBase();
  if (!base) {
    return {
      ok: false,
      error:
        'No API URL — set VITE_API_BASE_URL for production, or run `npm run dev` so /api proxies to the Node server.',
    };
  }
  try {
    const res = await fetch(`${base}/health`);
    const data = (await res.json()) as ApiHealthResponse;
    return data;
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'Could not reach the API',
    };
  }
}
