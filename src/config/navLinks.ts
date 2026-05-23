import { MARGALLA_PROJECT_PATH } from '../data/margallaOrchardsContent';

export type NavLinkItem = {
  label: string;
  /** Section on Margalla project page */
  hash?: string;
  /** Full route path */
  path?: string;
};

/** Primary site navigation — Margalla sections on project guide page */
export const primaryNavLinks: NavLinkItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: MARGALLA_PROJECT_PATH, hash: 'overview' },
  { label: 'NOC', path: MARGALLA_PROJECT_PATH, hash: 'noc' },
  { label: 'Location', path: MARGALLA_PROJECT_PATH, hash: 'location' },
  { label: 'Amenities', path: MARGALLA_PROJECT_PATH, hash: 'amenities' },
  { label: 'WhatsApp', path: MARGALLA_PROJECT_PATH, hash: 'pricing' },
  { label: 'Plots', path: MARGALLA_PROJECT_PATH, hash: 'plots' },
  { label: 'Commercial', path: MARGALLA_PROJECT_PATH, hash: 'commercial' },
  { label: 'FAQ', path: MARGALLA_PROJECT_PATH, hash: 'faq' },
  { label: 'Contact', path: '/contact' },
];

export function navItemHref(item: NavLinkItem): string {
  if (item.path === '/' && !item.hash) return '/';
  if (item.path && item.hash) return `${item.path}#${item.hash}`;
  if (item.path) return item.path;
  return '/';
}

export function isNavItemActive(
  item: NavLinkItem,
  pathname: string,
  hash: string
): boolean {
  const bareHash = hash.replace(/^#/, '');
  if (item.path === '/contact') return pathname === '/contact';
  if (item.path === '/' && !item.hash) {
    return pathname === '/' && !bareHash;
  }
  if (item.path === MARGALLA_PROJECT_PATH && item.hash) {
    return pathname === MARGALLA_PROJECT_PATH && bareHash === item.hash;
  }
  if (item.path === MARGALLA_PROJECT_PATH && !item.hash) {
    return pathname === MARGALLA_PROJECT_PATH && !bareHash;
  }
  return false;
}
