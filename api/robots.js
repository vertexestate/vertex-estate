import { getRobotsTxt } from '../server/robotsTxt.js';

/** Vercel serverless — serves plain text robots.txt. */
export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(getRobotsTxt());
}
