const DEFAULT_ORIGIN = 'https://vertexestatepvt.com';

function siteOrigin() {
  return (
    process.env.VITE_SITE_PUBLIC_URL ||
    process.env.SITE_PUBLIC_URL ||
    DEFAULT_ORIGIN
  ).replace(/\/+$/, '');
}

export function getRobotsTxt(origin = siteOrigin()) {
  const base = origin.replace(/\/+$/, '');
  return `# ${base}
User-agent: *
Allow: /

Disallow: /dashboard
Disallow: /dashboard/

Sitemap: ${base}/sitemap.xml
`;
}
