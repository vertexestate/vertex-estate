/**
 * Test GoDaddy / SMTP settings from project root .env
 * Usage: npm run test-mail
 * Optional: TEST_MAIL_TO=you@gmail.com npm run test-mail
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const {
  getMailStatus,
  isWaitlistEmailEnabled,
  sendWaitlistEmails,
  verifySmtpConnection,
} = await import('../server/mail.js');

const to = (process.env.TEST_MAIL_TO || process.env.SMTP_USER || '').trim();

console.log('Mail status:', JSON.stringify(getMailStatus(), null, 2));

if (!isWaitlistEmailEnabled()) {
  console.error('\n❌ Mail is not enabled. Add SMTP_USER and SMTP_PASS to .env (see .env.example).');
  process.exit(1);
}

console.log('\nVerifying SMTP login…');
const verify = await verifySmtpConnection();
if (!verify.ok) {
  console.error('❌ SMTP verify failed:', verify.error);
  console.error('\nGoDaddy tips:');
  console.error('  • Use full email as SMTP_USER (e.g. hello@yourdomain.com)');
  console.error('  • Try SMTP_HOST=smtpout.secureserver.net  SMTP_PORT=465  SMTP_SECURE=true');
  console.error('  • Or Microsoft 365: smtp.office365.com  port 587  SMTP_SECURE=false');
  process.exit(1);
}
console.log('✓ SMTP login OK');

if (!to) {
  console.error('\nSet TEST_MAIL_TO=your@gmail.com to send a test waitlist email.');
  process.exit(0);
}

console.log(`\nSending test waitlist email to ${to}…`);
const result = await sendWaitlistEmails({
  name: 'Test User',
  email: to,
  phone: '',
  description: 'SMTP test from npm run test-mail',
});
console.log('Result:', result);
console.log('\n✓ Done — check inbox and spam folder.');
