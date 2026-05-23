import { absoluteUrl, siteConfig } from './siteConfig';

/** Primary URL — must match Google canonical (non-www). www redirects here in vercel.json. */
const DEFAULT_ORIGIN = 'https://vertexestatepvt.com';

export function getSiteOrigin() {
  return (siteConfig.publicUrl || DEFAULT_ORIGIN).replace(/\/+$/, '');
}

export const seoConfig = {
  siteName: siteConfig.siteName,
  /** Legal / brand line used in schema and copy */
  legalName:
    (import.meta.env.VITE_SEO_LEGAL_NAME || '').trim() || 'Vertex Estate (Private) Limited',
  officialDomain: 'vertexestatepvt.com',
  defaultOrigin: DEFAULT_ORIGIN,
  locale: (import.meta.env.VITE_SITE_LOCALE || 'en_PK').trim(),
  defaultTitle:
    (import.meta.env.VITE_SEO_DEFAULT_TITLE || '').trim() ||
    'Vertex Estate | Official website | vertexestatepvt.com | Islamabad',
  titleSuffix: ' | Vertex Estate',
  defaultDescription:
    (import.meta.env.VITE_SEO_DEFAULT_DESCRIPTION || '').trim() ||
    'Vertex Estate official website (vertexestatepvt.com). Premium real estate in F-7 Markaz, Islamabad, Pakistan. Houses, apartments, and commercial property. Join the launch waitlist.',
  defaultKeywords:
    (import.meta.env.VITE_SEO_KEYWORDS || '').trim() ||
    'Vertex Estate, vertexestatepvt.com, Vertex Estate Islamabad, Vertex Estate F-7 Markaz, real estate Pakistan, property Islamabad, Chaudhry Plaza F-7',
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
    latitude: 33.7192848,
    longitude: 73.053537,
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
    title: 'Official website | vertexestatepvt.com | F-7 Markaz Islamabad',
    description:
      'Vertex Estate official site at vertexestatepvt.com. Premium property in F-7 Markaz, Islamabad (Chaudhry Plaza). Join the waitlist for curated listings and launch offers.',
    keywords:
      'Vertex Estate, vertexestatepvt.com, Vertex Estate official website, real estate F-7 Islamabad, Vertex Estate Pakistan',
  },
  '/listings': {
    title: 'Property listings: homes and commercial',
    description:
      'Browse curated property listings across Islamabad and Pakistan. Filter by type, location, and budget on Vertex Estate.',
    keywords: 'property listings Pakistan, homes for sale, commercial plots Islamabad',
  },
  '/about': {
    title: 'About Vertex Estate',
    description:
      'Learn about Vertex Estate, our mission, team, and commitment to premium real estate service in Islamabad and beyond.',
  },
  '/contact': {
    title: 'Contact Vertex Estate, F-7 Markaz, Islamabad',
    description:
      'Contact Vertex Estate in F-7 Markaz, Islamabad. Call, email, WhatsApp, or visit our office at Chaudhry Plaza for viewings and inquiries.',
    keywords: 'Vertex Estate contact, real estate office F-7 Islamabad',
  },
  '/dha-margalla-orchards': {
    title: 'DHA Margalla Orchards: plots, NOC and location',
    description:
      'Guide to DHA Margalla Orchards Islamabad: 10 Marla, 14 Marla, and 1 Kanal plots on Park Road opposite COMSATS. CDA NOC, amenities, master plan, FAQ, and WhatsApp inquiries.',
    keywords:
      'DHA Margalla Orchards, Margalla Orchards Islamabad, Park Road plots, DHA housing society',
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
