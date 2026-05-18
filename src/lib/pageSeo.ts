import {
  buildCanonicalUrl,
  buildOgImageUrl,
  buildPageTitle,
  getSiteOrigin,
  seoConfig,
  type PageSeoInput,
} from '../config/seoConfig';

function upsertMeta(
  attr: 'name' | 'property',
  key: string,
  content: string
) {
  if (!content) return;
  const selector = `meta[${attr}="${key}"]`;
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

/** Apply title, meta, canonical, and Open Graph tags (client-side SPA). */
export function applyPageSeo(input: PageSeoInput) {
  const title = input.title || seoConfig.defaultTitle;
  const description = input.description || seoConfig.defaultDescription;
  const keywords = input.keywords || seoConfig.defaultKeywords;
  const canonical = buildCanonicalUrl(input.path || '/');
  const image = buildOgImageUrl(input.image);
  const origin = getSiteOrigin();
  const robots = input.noindex ? 'noindex, nofollow' : 'index, follow';

  document.title = title;
  document.documentElement.lang = seoConfig.locale.split('_')[0] || 'en';

  upsertMeta('name', 'description', description);
  upsertMeta('name', 'keywords', keywords);
  upsertMeta('name', 'robots', robots);
  upsertMeta('name', 'author', seoConfig.siteName);
  upsertMeta('name', 'geo.region', 'PK-IS');
  upsertMeta('name', 'geo.placename', 'Islamabad');
  upsertMeta(
    'name',
    'geo.position',
    `${seoConfig.geo.latitude};${seoConfig.geo.longitude}`
  );
  upsertMeta('name', 'ICBM', `${seoConfig.geo.latitude}, ${seoConfig.geo.longitude}`);

  upsertLink('canonical', canonical);

  upsertMeta('property', 'og:site_name', seoConfig.siteName);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', canonical);
  upsertMeta('property', 'og:type', input.type || 'website');
  upsertMeta('property', 'og:image', image);
  upsertMeta('property', 'og:locale', seoConfig.locale.replace('_', '-'));

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', image);
  if (seoConfig.twitterHandle) {
    upsertMeta('name', 'twitter:site', seoConfig.twitterHandle);
  }

}

export function propertySeoFromListing(property: {
  title: string;
  location: string;
  description?: string;
  type: string;
  images?: string[];
  id: string;
}): PageSeoInput {
  const desc =
    property.description?.slice(0, 155) ||
    `${property.type} in ${property.location} — listed on Vertex Estate, Islamabad. Book a viewing today.`;
  return {
    title: buildPageTitle(`${property.title} — ${property.location}`),
    description: desc,
    keywords: `${property.title}, ${property.location}, ${property.type}, Vertex Estate, property Pakistan`,
    path: `/property/${property.id}`,
    image: property.images?.[0],
    type: 'product',
  };
}
