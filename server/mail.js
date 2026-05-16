/**
 * Transactional email (GoDaddy / any SMTP). Used after waitlist signup.
 */
import nodemailer from 'nodemailer';

const SMTP_HOST = (process.env.SMTP_HOST || 'smtpout.secureserver.net').trim();
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = (process.env.SMTP_USER || '').trim();
const SMTP_PASS = (process.env.SMTP_PASS || '').trim();
const MAIL_FROM = (process.env.MAIL_FROM || SMTP_USER).trim();
const MAIL_FROM_NAME = (process.env.MAIL_FROM_NAME || 'Vertex Estate').trim();
const MAIL_SITE_URL = (
  process.env.MAIL_SITE_URL ||
  process.env.SITE_PUBLIC_URL ||
  'https://www.vertexestatepvt.com'
).replace(/\/+$/, '');
const WAITLIST_NOTIFY_EMAIL = (process.env.WAITLIST_NOTIFY_EMAIL || '').trim();

function envTruthy(name, defaultWhenUnset = true) {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return defaultWhenUnset;
  const s = String(raw).trim().toLowerCase();
  return s === 'true' || s === '1' || s === 'yes';
}

function smtpSecure() {
  if (process.env.SMTP_SECURE !== undefined && process.env.SMTP_SECURE !== '') {
    return envTruthy('SMTP_SECURE', true);
  }
  return SMTP_PORT === 465;
}

export function isMailConfigured() {
  return Boolean(SMTP_USER && SMTP_PASS && MAIL_FROM);
}

export function isWaitlistEmailEnabled() {
  if (!isMailConfigured()) return false;
  return envTruthy('WAITLIST_EMAIL_ENABLED', true);
}

let transporter;

function getTransporter() {
  if (!isMailConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: smtpSecure(),
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      ...(SMTP_PORT === 587 && !smtpSecure() ? { requireTLS: true } : {}),
    });
  }
  return transporter;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function firstName(fullName) {
  const n = String(fullName || '').trim();
  if (!n) return 'there';
  return n.split(/\s+/)[0];
}

function buildWaitlistWelcomeHtml({ name }) {
  const greeting = escapeHtml(firstName(name));
  const site = escapeHtml(MAIL_SITE_URL);
  const brand = escapeHtml(MAIL_FROM_NAME);
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#030a0c;font-family:Inter,Segoe UI,system-ui,sans-serif;color:#eff5f3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#030a0c;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:520px;background:#0a2a2a;border:1px solid rgba(212,255,63,0.2);border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 28px 8px;">
          <p style="margin:0;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#d4ff3f;font-weight:700;">${brand}</p>
          <h1 style="margin:12px 0 0;font-size:22px;font-weight:700;color:#eff5f3;">You&rsquo;re on the waitlist</h1>
        </td></tr>
        <tr><td style="padding:8px 28px 24px;">
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#c8d6d2;">Hi ${greeting},</p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#c8d6d2;">Thank you for joining our launch waitlist. We&rsquo;ve saved your details and will email you with early access news and updates before we go live.</p>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#c8d6d2;">Premium real estate in Pakistan — starting from F-7 Markaz, Islamabad.</p>
          <a href="${site}" style="display:inline-block;padding:12px 22px;background:#d4ff3f;color:#021616;text-decoration:none;font-weight:700;font-size:14px;border-radius:8px;">Visit ${brand}</a>
        </td></tr>
        <tr><td style="padding:16px 28px;background:rgba(0,0,0,0.25);border-top:1px solid rgba(255,255,255,0.08);">
          <p style="margin:0;font-size:12px;line-height:1.5;color:#7a9490;">You received this because you signed up on our coming-soon page. If this wasn&rsquo;t you, you can ignore this email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildWaitlistWelcomeText({ name }) {
  const greeting = firstName(name);
  return `Hi ${greeting},

Thank you for joining the ${MAIL_FROM_NAME} launch waitlist. We've saved your details and will email you with updates before we go live.

Visit us: ${MAIL_SITE_URL}

— ${MAIL_FROM_NAME}`;
}

function buildAdminNotifyText({ name, email, phone, description }) {
  return `New waitlist signup

Name: ${name}
Email: ${email}
Phone: ${phone || '—'}
Notes: ${description || '—'}

Time: ${new Date().toISOString()}`;
}

/**
 * @param {{ name: string; email: string; phone?: string; description?: string }} lead
 */
export async function sendWaitlistEmails(lead) {
  if (!isWaitlistEmailEnabled()) return { sent: false, reason: 'disabled_or_unconfigured' };

  const transport = getTransporter();
  if (!transport) return { sent: false, reason: 'no_transport' };

  const to = String(lead.email).trim().toLowerCase();
  const from = `"${MAIL_FROM_NAME}" <${MAIL_FROM}>`;

  await transport.sendMail({
    from,
    to,
    replyTo: MAIL_FROM,
    subject: `You're on the ${MAIL_FROM_NAME} waitlist`,
    text: buildWaitlistWelcomeText(lead),
    html: buildWaitlistWelcomeHtml(lead),
  });

  if (WAITLIST_NOTIFY_EMAIL) {
    await transport.sendMail({
      from,
      to: WAITLIST_NOTIFY_EMAIL,
      subject: `[Waitlist] ${lead.name} <${to}>`,
      text: buildAdminNotifyText(lead),
    });
  }

  return { sent: true };
}
