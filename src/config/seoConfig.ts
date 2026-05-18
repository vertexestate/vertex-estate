import { absoluteUrl, siteConfig } from './siteConfig';

const DEFAULT_ORIGIN = 'https://www.vertexestatepvt.com';

export function getSiteOrigin() {
  return (siteConfig.publicUrl || DEFAULT_ORIGIN).replace(/\/+$/, '');
}

export const seoConfig = {
  siteName: siteConfig.siteName,
  defaultOrigin: DEFAULT_ORIGIN,
  locale: (import.meta.env.VITE_SITE_LOCALE || 'en_PK').trim(),
  defaultTitle:
    (import.meta.env.VITE_SEO_DEFAULT_TITLE || '').trim() ||
    'Vertex Estate — Premium Real Estate in Islamabad, Pakistan',
  titleSuffix: ' | Vertex Estate',
  defaultDescription:
    (import.meta.env.VITE_SEO_DEFAULT_DESCRIPTION || '').trim() ||
    'Vertex Estate — premium residential and commercial property in Islamabad F-7 Markaz and across Pakistan. Browse listings, book visits, and join the launch waitlist for exclusive offers.',
  defaultKeywords:
    (import.meta.env.VITE_SEO_KEYWORDS || '').trim() ||
    'Vertex Estate, real estate Pakistan, property Islamabad, F-7 Markaz, houses for sale Islamabad, commercial property Pakistan, luxury homes Islamabad, vertexestatepvt.com',
  ogImage:
    (import.meta.env.VITE_SEO_OG_IMAGE || '').trim() ||
    '/brand/logo.png',
  twitterHandle: (import.meta.env.VITE_SEO_TWITTER || '').trim() || '@vertexestate0',
  contactEmail:
    (import.meta.env.VITE_SEO_CONTACT_EMAIL || '').trim() || 'contact@vertexestate.com',
  contactPhone: (import.meta.env.VITE_SEO_CONTACT_PHONE || '').trim() || '+923109882888',
  address: {
    streetAddress:
      '2nd Floor, Chaudhry Plaza, F-7 Markaz, up to Subway near Mr Chips',
    addressLocality: 'Islamabad',
    addressRegion: 'Islamabad Capital Territory',
    postalCode: '44000',
    addressCountry: 'PK',
  },
  geo: {
    latitude: 33.718722,
    longitude: 73.054125,
  },
} as const;

export type PageSeoInput = {
  title?: string;
  description?: string;
  keywords?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
};

export function buildPageTitle(title?: string) {
  if (!title) return seoConfig.defaultTitle;
  if (title.includes(seoConfig.siteName)) return title;
  return `${title}${seoConfig.titleSuffix}`;
}

export function buildCanonicalUrl(path = '/') {
  const p = path.startsWith('/') ? path : `/${path}`;
  return absoluteUrl(p) || `${getSiteOrigin()}${p}`;
}

export function buildOgImageUrl(image?: string) {
  const img = image || seoConfig.ogImage;
  return absoluteUrl(img) || `${getSiteOrigin()}${img.startsWith('/') ? img : `/${img}`}`;
}

/** Static routes for sitemap + default meta. */
export const staticRouteSeo: Record<
  string,
  { title: string; description: string; keywords?: string }
> = {
  '/': {
    title: 'Premium Real Estate in Islamabad & Pakistan',
    description:
      'Discover premium homes, apartments, and commercial property with Vertex Estate. Based in F-7 Markaz, Islamabad — trusted listings, expert guidance, and launch waitlist perks.',
    keywords:
      'Vertex Estate Pakistan, real estate Islamabad, property listings F-7 Markaz, buy house Islamabad',
  },
  '/listings': {
    title: 'Property Listings — Homes & Commercial',
    description:
      'Browse curated property listings across Islamabad and Pakistan. Filter by type, location, and budget on Vertex Estate.',
    keywords: 'property listings Pakistan, homes for sale, commercial plots Islamabad',
  },
  '/about': {
    title: 'About Vertex Estate',
    description:
      'Learn about Vertex Estate — our mission, team, and commitment to premium real estate service in Islamabad and beyond.',
  },
  '/contact': {
    title: 'Contact Vertex Estate — F-7 Markaz, Islamabad',
    description:
      'Contact Vertex Estate in F-7 Markaz, Islamabad. Call, email, WhatsApp, or visit our office at Chaudhry Plaza for viewings and inquiries.',
    keywords: 'Vertex Estate contact, real estate office F-7 Islamabad',
  },
};

export function getSeoForPath(pathname: string): PageSeoInput {
  const base = staticRouteSeo[pathname];
  if (base) {
    return {
      title: buildPageTitle(base.title),
      description: base.description,
      keywords: base.keywords ?? seoConfig.defaultKeywords,
      path: pathname,
    };
  }
  if (pathname.startsWith('/property/')) {
    return { path: pathname, type: 'product' };
  }
  if (pathname.startsWith('/dashboard')) {
    return {
      title: buildPageTitle('Account'),
      description: 'Vertex Estate account dashboard.',
      path: pathname,
      noindex: true,
    };
  }
  return {
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    keywords: seoConfig.defaultKeywords,
    path: pathname,
  };
}
