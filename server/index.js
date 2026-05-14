/**
 * Vertex Estate API — local process entry (`npm run server` / `npm run dev`).
 * Vercel uses `api/index.js` (no listen).
 */
import app, { closeMongo } from './app.js';

const PORT = Number(process.env.API_PORT || 3001);

async function shutdown() {
  await closeMongo();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

app.listen(PORT, () => {
  console.log(
    `Vertex API http://localhost:${PORT}  (health, /properties, /leads/*, /stats/launch-interest-count)`
  );
  if (!process.env.MONGODB_URI) {
    console.warn('Set MONGODB_URI in project root .env — leads & properties require it.');
  }
});
