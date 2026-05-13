import type { SiteContactFile } from '../types/siteFiles';
import { fetchJson } from './fetchJson';

let contactPromise: Promise<SiteContactFile | null> | null = null;

/** Cached GET /site/contact.json (same-origin). */
export function loadSiteContact(): Promise<SiteContactFile | null> {
  if (!contactPromise) {
    contactPromise = fetchJson<SiteContactFile>('/site/contact.json');
  }
  return contactPromise;
}
