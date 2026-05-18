import { getSitemapXml } from '../server/sitemapXml.js';

/** Vercel serverless — serves real XML (not SPA index.html). */
export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(getSitemapXml());
}
