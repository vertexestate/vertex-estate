import { useEffect } from 'react';
import { buildCanonicalUrl, buildOgImageUrl, getSiteOrigin, seoConfig } from '../../config/seoConfig';
import { siteConfig } from '../../config/siteConfig';

const SCRIPT_ID = 'vertex-site-jsonld';

function buildJsonLd() {
  const origin = getSiteOrigin();
  const logo = buildOgImageUrl(siteConfig.logoUrl);

  const organization = {
    '@type': 'RealEstateAgent',
    '@id': `${origin}/#organization`,
    name: seoConfig.siteName,
    url: origin,
    logo,
    image: logo,
    email: seoConfig.contactEmail,
    telephone: seoConfig.contactPhone,
    address: {
      '@type': 'PostalAddress',
      ...seoConfig.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: seoConfig.geo.latitude,
      longitude: seoConfig.geo.longitude,
    },
    areaServed: [
      { '@type': 'City', name: 'Islamabad' },
      { '@type': 'Country', name: 'Pakistan' },
    ],
    sameAs: [
      siteConfig.comingSoonSocial.facebook,
      siteConfig.comingSoonSocial.instagram,
      siteConfig.comingSoonSocial.tiktok,
    ].filter(Boolean),
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    url: origin,
    name: seoConfig.siteName,
    description: seoConfig.defaultDescription,
    publisher: { '@id': `${origin}/#organization` },
    inLanguage: seoConfig.locale.replace('_', '-'),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${origin}/listings?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const webPage = {
    '@type': 'WebPage',
    '@id': `${origin}/#webpage`,
    url: buildCanonicalUrl('/'),
    name: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    isPartOf: { '@id': `${origin}/#website` },
    about: { '@id': `${origin}/#organization` },
    inLanguage: seoConfig.locale.replace('_', '-'),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, website, webPage],
  };
}

/** Global Organization + WebSite structured data for Google. */
export function SiteJsonLd() {
  useEffect(() => {
    let el = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = SCRIPT_ID;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(buildJsonLd());
  }, []);

  return null;
}
