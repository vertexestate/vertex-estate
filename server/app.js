/**
 * Express app (MongoDB leads + property catalog).
 * Used by `server/index.js` locally and `api/index.js` on Vercel (serverless).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import { isWaitlistEmailEnabled, sendWaitlistEmails } from './mail.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || 'vertex';
const LEADS_COLLECTION = process.env.MONGODB_LEADS_COLLECTION || 'leads';
const PROPERTIES_COLLECTION = process.env.MONGODB_PROPERTIES_COLLECTION || 'properties';

const DEFAULT_CORS_ORIGINS = [
  'https://vertexestatepvt.com',
  'https://www.vertexestatepvt.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

function buildAllowedCorsOrigins() {
  const fromEnv = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return new Set([...DEFAULT_CORS_ORIGINS, ...fromEnv]);
}

const allowedCorsOrigins = buildAllowedCorsOrigins();

/** True if env asks to skip strict TLS (dev / locked-down debugging only — not for production). */
function mongoTlsRelaxRequested() {
  const t = (v) => String(v ?? '').trim().toLowerCase();
  const on = (v) => {
    const s = t(v);
    return s === 'true' || s === '1' || s === 'yes';
  };
  return on(process.env.MONGODB_TLS_INSECURE) || on(process.env.MONGODB_TLS_RELAX);
}

/** Escape hatch for "certificate validation failed" (VPN, HTTPS scanning, CRLF in .env values). */
function getMongoClientOptions() {
  const relax = mongoTlsRelaxRequested();
  if (relax) {
    console.warn(
      '[mongo] TLS verification relaxed — unset MONGODB_TLS_INSECURE / MONGODB_TLS_RELAX for production.'
    );
  }
  return {
    serverSelectionTimeoutMS: 25_000,
    connectTimeoutMS: 20_000,
    ...(relax
      ? {
          tlsAllowInvalidCertificates: true,
          tlsAllowInvalidHostnames: true,
        }
      : {}),
  };
}

let mongoClient;
let mongoConnectPromise;

async function getMongoClient() {
  if (!MONGODB_URI) {
    const err = new Error('MONGODB_URI is not set in .env');
    err.code = 'NO_URI';
    throw err;
  }
  if (!mongoConnectPromise) {
    mongoConnectPromise = (async () => {
      mongoClient = new MongoClient(MONGODB_URI, getMongoClientOptions());
      await mongoClient.connect();
      await maybeSeedProperties();
      return mongoClient;
    })();
  }
  return mongoConnectPromise;
}

async function maybeSeedProperties() {
  if (process.env.MONGODB_AUTO_SEED !== 'true') return;
  const db = mongoClient.db(MONGODB_DB);
  const col = db.collection(PROPERTIES_COLLECTION);
  const n = await col.countDocuments();
  if (n > 0) return;
  const seedPath = path.join(__dirname, 'seed-catalog.json');
  if (!fs.existsSync(seedPath)) {
    console.warn('[mongo] MONGODB_AUTO_SEED=true but server/seed-catalog.json is missing — skip seed.');
    return;
  }
  try {
    const raw = fs.readFileSync(seedPath, 'utf8');
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr) || arr.length === 0) return;
    await col.insertMany(arr, { ordered: false });
    console.log(`[mongo] Seeded ${arr.length} documents into "${PROPERTIES_COLLECTION}"`);
  } catch (e) {
    console.error('[mongo] Auto-seed failed:', e instanceof Error ? e.message : e);
  }
}

async function getLeadsCollection() {
  const c = await getMongoClient();
  return c.db(MONGODB_DB).collection(LEADS_COLLECTION);
}

async function getPropertiesCollection() {
  const c = await getMongoClient();
  return c.db(MONGODB_DB).collection(PROPERTIES_COLLECTION);
}

async function insertLead(document) {
  const col = await getLeadsCollection();
  await col.insertOne({
    ...document,
    createdAt: new Date(),
  });
}

function stripMongoDoc(doc) {
  const { _id, ...rest } = doc;
  return rest;
}

export async function closeMongo() {
  try {
    if (mongoClient) {
      await mongoClient.close();
    }
  } catch {
    /* noop */
  }
  mongoClient = undefined;
  mongoConnectPromise = undefined;
}

const app = express();

/** Vercel rewrites `/api/*` → `/api`; restore the public path so `/api` strip + routes match. */
app.use((req, _res, next) => {
  if (!process.env.VERCEL) return next();
  const orig = req.originalUrl || '';
  const curPath = (req.url || '').split('?')[0] || '';
  const origPath = orig.split('?')[0] || '';
  if (origPath.startsWith('/api/') && (!curPath.startsWith('/api/') || curPath === '/api')) {
    req.url = orig;
  }
  next();
});

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      callback(null, allowedCorsOrigins.has(origin));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);
app.use(express.json({ limit: '512kb' }));

/**
 * Some setups POST to `/api/leads/...` directly against this server (e.g. wrong proxy or
 * `VITE_API_*_PATH` including `/api`). Our routes live at `/leads/*`, `/health`, `/stats/*`.
 */
app.use((req, _res, next) => {
  const pathOnly = req.url.split('?')[0] || '';
  if (pathOnly === '/api' || pathOnly.startsWith('/api/')) {
    const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    let stripped = pathOnly.replace(/^\/api(?=\/|$)/, '') || '/';
    if (!stripped.startsWith('/')) stripped = `/${stripped}`;
    req.url = stripped + qs;
  }
  next();
});

app.get('/health', async (_req, res) => {
  try {
    if (!MONGODB_URI) {
      return res.status(503).json({ ok: false, error: 'MONGODB_URI not configured in .env' });
    }
    await getMongoClient();
    const leadCol = await getLeadsCollection();
    const leadEstimated = await leadCol.estimatedDocumentCount();
    const launchWaitlistCount = await leadCol.countDocuments({
      source: 'coming_soon_launch',
    });
    const pcol = await getPropertiesCollection();
    const propCount = await pcol.estimatedDocumentCount();
    return res.json({
      ok: true,
      mongoConnected: true,
      db: MONGODB_DB,
      leadsCollection: LEADS_COLLECTION,
      propertiesCollection: PROPERTIES_COLLECTION,
      /** Kept for older clients; same as `leadsCollection`. */
      leads: LEADS_COLLECTION,
      properties: PROPERTIES_COLLECTION,
      leadDocumentEstimate: leadEstimated,
      launchWaitlistCount,
      propertyCount: propCount,
    });
  } catch (e) {
    console.error('[health]', e);
    return res.status(503).json({
      ok: false,
      error: e instanceof Error ? e.message : 'MongoDB unavailable',
    });
  }
});

/** Public catalog — documents should match frontend `Property` shape. */
app.get('/properties', async (_req, res) => {
  try {
    if (!MONGODB_URI) {
      return res.status(503).json({ error: 'MONGODB_URI not configured' });
    }
    const col = await getPropertiesCollection();
    const docs = await col.find({}).toArray();
    const list = docs.map(stripMongoDoc);
    return res.json(list);
  } catch (e) {
    console.error('[properties]', e);
    return res.status(500).json({
      error: e instanceof Error ? e.message : 'Failed to read properties',
    });
  }
});

app.post('/leads/contact', async (req, res) => {
  try {
    const b = req.body || {};
    if (!b.name || !b.email || !b.message) {
      return res.status(400).json({ error: 'name, email, and message are required' });
    }
    await insertLead({
      source: b.source || 'contact_page',
      name: String(b.name),
      email: String(b.email),
      phone: String(b.phone || ''),
      subject: String(b.subject || ''),
      message: String(b.message),
      submittedAt: b.submittedAt || new Date().toISOString(),
    });
    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error('[leads/contact]', e);
    return res.status(500).json({
      error: e instanceof Error ? e.message : 'Failed to save',
    });
  }
});

app.post('/leads/concierge', async (req, res) => {
  try {
    const b = req.body || {};
    await insertLead({
      source: b.source || 'home_concierge',
      payload: b,
      submittedAt: b.submittedAt || new Date().toISOString(),
    });
    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error('[leads/concierge]', e);
    return res.status(500).json({
      error: e instanceof Error ? e.message : 'Failed to save',
    });
  }
});

app.post('/leads/newsletter', async (req, res) => {
  try {
    const b = req.body || {};
    if (!b.email || !/\S+@\S+\.\S+/.test(String(b.email))) {
      return res.status(400).json({ error: 'Valid email required' });
    }
    await insertLead({
      source: b.source || 'footer_newsletter',
      email: String(b.email).toLowerCase().trim(),
      submittedAt: b.submittedAt || new Date().toISOString(),
    });
    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error('[leads/newsletter]', e);
    return res.status(500).json({
      error: e instanceof Error ? e.message : 'Failed to save',
    });
  }
});

/**
 * Coming-soon waitlist — inserts **only** into db `vertex` / collection `leads` (via env defaults):
 * name, email, phone, description, source, submittedAt (Date).
 */
app.post('/leads/launch-interest', async (req, res) => {
  try {
    if (!MONGODB_URI) {
      console.error('[leads/launch-interest] MONGODB_URI is not set');
      return res.status(500).json({ error: 'Service unavailable' });
    }

    const b = req.body;
    if (!b || typeof b !== 'object' || Array.isArray(b)) {
      return res.status(400).json({ error: 'Expected a JSON object body' });
    }

    if (b.bhp && String(b.bhp).trim()) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const name = String(b.name || '').trim();
    const email = String(b.email || '').trim().toLowerCase();
    const phone = String(b.phone ?? '').trim();
    const description = String(b.description ?? '').trim().slice(0, 4000);

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const col = await getLeadsCollection();
    const doc = {
      name,
      email,
      phone,
      description,
      source: 'coming_soon_launch',
      submittedAt: new Date(),
    };
    await col.insertOne(doc);

    if (isWaitlistEmailEnabled()) {
      void sendWaitlistEmails(doc).catch((mailErr) => {
        console.error(
          '[leads/launch-interest] waitlist email failed:',
          mailErr instanceof Error ? mailErr.message : mailErr
        );
      });
    }

    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error('[leads/launch-interest] insert failed:', e instanceof Error ? e.stack || e.message : e);
    return res.status(500).json({ error: 'Failed to save lead' });
  }
});

/** Public aggregate: how many people joined the coming-soon waitlist (no personal data). */
app.get('/stats/launch-interest-count', async (_req, res) => {
  try {
    if (!MONGODB_URI) {
      return res.json({ count: 0 });
    }
    const col = await getLeadsCollection();
    const count = await col.countDocuments({ source: 'coming_soon_launch' });
    return res.json({ count });
  } catch (e) {
    console.error('[stats/launch-interest-count]', e);
    return res.status(500).json({
      error: e instanceof Error ? e.message : 'Failed to read stats',
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;
