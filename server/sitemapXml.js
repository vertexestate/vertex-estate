const DEFAULT_ORIGIN = 'https://www.vertexestatepvt.com';

function siteOrigin() {
  return (
    process.env.VITE_SITE_PUBLIC_URL ||
    process.env.SITE_PUBLIC_URL ||
    DEFAULT_ORIGIN
  ).replace(/\/+$/, '');
}

const STATIC_PATHS = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/listings', changefreq: 'daily', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
];

/** Valid XML sitemap for Google Search Console. */
export function getSitemapXml(origin = siteOrigin()) {
  const base = origin.replace(/\/+$/, '');
  const urls = STATIC_PATHS.map(
    ({ path, changefreq, priority }) => `  <url>
    <loc>${base}${path === '/' ? '/' : path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
