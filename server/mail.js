/**
 * Transactional email (Microsoft 365 / GoDaddy SMTP). Used after waitlist signup.
 * Reads process.env at call time so `.env` is loaded before use.
 */
import nodemailer from 'nodemailer';

function envTruthy(name, defaultWhenUnset = true) {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return defaultWhenUnset;
  const s = String(raw).trim().toLowerCase();
  return s === 'true' || s === '1' || s === 'yes';
}

function readSmtpConfig() {
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

  const smtpSecure =
    process.env.SMTP_SECURE !== undefined && process.env.SMTP_SECURE !== ''
      ? envTruthy('SMTP_SECURE', true)
      : SMTP_PORT === 465;

  return {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    MAIL_FROM,
    MAIL_FROM_NAME,
    MAIL_SITE_URL,
    WAITLIST_NOTIFY_EMAIL,
    smtpSecure,
  };
}

export function isMailConfigured() {
  const { SMTP_USER, SMTP_PASS, MAIL_FROM } = readSmtpConfig();
  return Boolean(SMTP_USER && SMTP_PASS && MAIL_FROM);
}

export function isWaitlistEmailEnabled() {
  if (!isMailConfigured()) return false;
  return envTruthy('WAITLIST_EMAIL_ENABLED', true);
}

/** Safe summary for /health and logs (no passwords). */
export function getMailStatus() {
  const c = readSmtpConfig();
  const configured = isMailConfigured();
  const enabled = isWaitlistEmailEnabled();
  const user = c.SMTP_USER;
  const maskedUser = user
    ? user.replace(/^(.{1,2})(.*)(@.+)$/, (_, a, mid, domain) => `${a}${'*'.repeat(Math.min(mid.length, 6))}${domain}`)
    : null;
  return {
    configured,
    enabled,
    host: c.SMTP_HOST,
    port: c.SMTP_PORT,
    secure: c.smtpSecure,
    user: maskedUser,
    from: c.MAIL_FROM || null,
    notify: c.WAITLIST_NOTIFY_EMAIL || null,
    hint: !configured
      ? 'Set SMTP_USER and SMTP_PASS in .env (local) and Vercel env vars, then restart.'
      : !enabled
        ? 'WAITLIST_EMAIL_ENABLED is false.'
        : null,
  };
}

export function logMailStartupStatus() {
  const s = getMailStatus();
  if (s.enabled) {
    console.log(`[mail] Waitlist email ON — ${s.host}:${s.port} as ${s.user}`);
    return;
  }
  console.warn(`[mail] Waitlist email OFF — ${s.hint || 'check SMTP_* in .env'}`);
}

function createTransporter() {
  const c = readSmtpConfig();
  if (!c.SMTP_USER || !c.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: c.SMTP_HOST,
    port: c.SMTP_PORT,
    secure: c.smtpSecure,
    auth: { user: c.SMTP_USER, pass: c.SMTP_PASS },
    ...(c.SMTP_PORT === 587 && !c.smtpSecure ? { requireTLS: true } : {}),
  });
}

/** Verify SMTP login (for health / test script). */
export async function verifySmtpConnection() {
  if (!isMailConfigured()) {
    return { ok: false, error: 'SMTP_USER and SMTP_PASS are not set' };
  }
  const transport = createTransporter();
  if (!transport) {
    return { ok: false, error: 'Could not create mail transport' };
  }
  try {
    await transport.verify();
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
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

function buildWaitlistWelcomeHtml({ name }, c) {
  const greeting = escapeHtml(firstName(name));
  const site = escapeHtml(c.MAIL_SITE_URL);
  const brand = escapeHtml(c.MAIL_FROM_NAME);
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

function buildWaitlistWelcomeText({ name }, c) {
  const greeting = firstName(name);
  return `Hi ${greeting},

Thank you for joining the ${c.MAIL_FROM_NAME} launch waitlist. We've saved your details and will email you with updates before we go live.

Visit us: ${c.MAIL_SITE_URL}

— ${c.MAIL_FROM_NAME}`;
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
  if (!isWaitlistEmailEnabled()) {
    console.warn('[mail] Skipped waitlist email —', getMailStatus().hint);
    return { sent: false, reason: 'disabled_or_unconfigured' };
  }

  const c = readSmtpConfig();
  const transport = createTransporter();
  if (!transport) return { sent: false, reason: 'no_transport' };

  const to = String(lead.email).trim().toLowerCase();
  const from = `"${c.MAIL_FROM_NAME}" <${c.MAIL_FROM}>`;

  console.log(`[mail] Sending waitlist confirmation → ${to}`);

  await transport.sendMail({
    from,
    to,
    replyTo: c.MAIL_FROM,
    subject: `You're on the ${c.MAIL_FROM_NAME} waitlist`,
    text: buildWaitlistWelcomeText(lead, c),
    html: buildWaitlistWelcomeHtml(lead, c),
  });

  if (c.WAITLIST_NOTIFY_EMAIL) {
    await transport.sendMail({
      from,
      to: c.WAITLIST_NOTIFY_EMAIL,
      subject: `[Waitlist] ${lead.name} <${to}>`,
      text: buildAdminNotifyText(lead),
    });
    console.log(`[mail] Admin notify → ${c.WAITLIST_NOTIFY_EMAIL}`);
  }

  console.log(`[mail] Waitlist confirmation sent → ${to}`);
  return { sent: true };
}
