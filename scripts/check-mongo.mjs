/**
 * Quick MongoDB connectivity check (reads project root `.env`).
 * Run: npm run check-db
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB || 'vertex';

if (!uri.trim()) {
  console.error('MongoDB: NOT CONFIGURED — add MONGODB_URI to .env in the project root.');
  process.exit(1);
}

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 12_000 });

try {
  await client.connect();
  const db = client.db(dbName);
  await db.command({ ping: 1 });
  const leads = process.env.MONGODB_LEADS_COLLECTION || 'leads';
  const n = await db.collection(leads).estimatedDocumentCount();
  console.log('MongoDB: CONNECTED');
  console.log(`  Database: ${dbName}`);
  console.log(`  Collection "${leads}" (estimate): ${n} document(s)`);
  process.exit(0);
} catch (e) {
  console.error('MongoDB: CONNECTION FAILED');
  console.error(' ', e instanceof Error ? e.message : e);
  process.exit(1);
} finally {
  await client.close().catch(() => {});
}
