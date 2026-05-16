/**
 * Vercel serverless entry — default export is the Express app (`server/app.js`).
 */
import '../server/bootstrap-env.js';
import app from '../server/app.js';

export default app;
