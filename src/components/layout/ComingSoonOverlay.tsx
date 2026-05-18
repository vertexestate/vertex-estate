import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, MapPinIcon, MapIcon, UserPlusIcon } from 'lucide-react';
import { ComingSoonPromoSlider } from './ComingSoonPromoSlider';
import { siteConfig, absoluteUrl } from '../../config/siteConfig';
import { applyPageSeo } from '../../lib/pageSeo';
import { buildPageTitle, seoConfig } from '../../config/seoConfig';
import { useCountdown } from '../../hooks/useCountdown';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { isValidLaunchInterestEmail, submitLaunchInterest } from '../../lib/submissions';
import { playWaitlistCelebration } from '../../lib/waitlistConfetti';
import { ComingSoonSocialLinks } from './ComingSoonSocialLinks';
import { EstateSkylineDecoration } from './EstateSkylineDecoration';

const LAUNCH_REGISTERED_LS = 'vertex-coming-soon-launch-registered';

const launchFieldClass =
  'border-white/15 bg-white/[0.06] text-base text-cream placeholder:text-navy-400/80 focus:border-gold-500/60 sm:text-sm';

type ComingSoonOverlayProps = {
  targetMs: number;
};

function TimeUnit({
  value,
  label,
  delay,
}: {
  value: number;
  label: string;
  delay: number;
}) {
  const display = String(value).padStart(2, '0');
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex w-full min-w-0 flex-col items-center rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-4 shadow-2xl shadow-black/40 backdrop-blur-md sm:w-auto sm:min-w-[5.5rem] sm:px-6 sm:py-7"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,rgba(212,255,63,0.12),transparent_55%)]" />
      <span className="relative font-display text-2xl font-bold tabular-nums text-cream sm:text-4xl md:text-5xl">
        {display}
      </span>
      <span className="relative mt-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-400/90 sm:mt-2 sm:text-xs sm:tracking-[0.2em]">
        {label}
      </span>
    </motion.div>
  );
}

export function ComingSoonOverlay({ targetMs }: ComingSoonOverlayProps) {
  const cd = useCountdown(targetMs);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [bhp, setBhp] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [savedMode, setSavedMode] = useState<'api' | 'offline' | null>(null);
  const [done, setDone] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem(LAUNCH_REGISTERED_LS) === '1' : false
  );

  useEffect(() => {
    if (!cd.isExpired) {
      applyPageSeo({
        title: buildPageTitle(`Official Website — ${seoConfig.officialDomain}`),
        description: seoConfig.defaultDescription,
        keywords: seoConfig.defaultKeywords,
        path: '/',
      });
    }
  }, [cd.isExpired]);

  useEffect(() => {
    if (cd.isExpired) {
      document.body.style.overflow = '';
      document.body.style.overflowX = '';
      document.documentElement.style.overflowX = '';
      document.title = siteConfig.documentTitle;
      return;
    }
    const prevOverflow = document.body.style.overflow;
    const prevOverflowX = document.body.style.overflowX;
    const prevHtmlOverflowX = document.documentElement.style.overflowX;
    document.body.style.overflow = 'hidden';
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    const base = siteConfig.documentTitle.split('—')[0]?.trim() || siteConfig.siteName;
    document.title = `${base} — Opening soon`;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.overflowX = prevOverflowX;
      document.documentElement.style.overflowX = prevHtmlOverflowX;
      document.title = siteConfig.documentTitle;
    };
  }, [cd.isExpired]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-soon-title"
      aria-describedby="coming-soon-desc"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-[200] flex min-h-[100dvh] min-w-0 max-w-[100vw] flex-col overflow-x-hidden overflow-y-auto overscroll-x-none overscroll-y-contain bg-[#030a0c]"
    >
      <ComingSoonPromoSlider slides={siteConfig.comingSoonPromoSlides} />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(212,255,63,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(212,255,63,0.04) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
      <div className="pointer-events-none absolute -left-1/4 top-0 h-[min(80vh,560px)] w-[min(80vh,560px)] rounded-full bg-gold-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-1/4 bottom-0 h-[min(70vh,480px)] w-[min(70vh,480px)] rounded-full bg-navy-400/25 blur-[100px] dark:bg-gold-600/8" />

      <EstateSkylineDecoration />

      <motion.div
        className="relative z-10 mx-auto flex w-full min-w-0 max-w-4xl flex-1 flex-col items-center justify-start px-4 pb-[max(1.75rem,env(safe-area-inset-bottom,0px))] pt-[max(1rem,env(safe-area-inset-top,0px))] text-center sm:justify-center sm:px-8 sm:pb-12 sm:pt-8 md:py-20"
      >
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.5 }}
          className="mb-6 flex max-w-[min(100%,22rem)] flex-col items-center gap-3 sm:mb-8 sm:max-w-none sm:flex-row sm:gap-4"
        >
          <img
            src={siteConfig.logoUrl}
            alt=""
            width={112}
            height={112}
            className="h-20 w-20 shrink-0 object-contain sm:h-28 sm:w-28"
            decoding="async"
          />
          <span className="font-display text-xl font-bold leading-tight text-cream sm:text-3xl">
            {siteConfig.siteName}
          </span>
        </motion.div>

        <p className="mb-3 text-center text-xs font-medium text-gold-400/95 sm:text-sm">
          Official website:{' '}
          <a
            href={absoluteUrl('/')}
            className="font-semibold text-gold-300 underline decoration-gold-500/40 underline-offset-2 hover:text-gold-200"
          >
            {seoConfig.officialDomain}
          </a>
        </p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.12 }}
          className="mb-5 inline-flex max-w-[calc(100vw-2rem)] flex-wrap items-center justify-center gap-2 rounded-full border border-gold-500/35 bg-gold-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-300 shadow-lg shadow-gold-500/10 sm:mb-6 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.25em]"
        >
          <SparklesIcon className="h-4 w-4 text-gold-400" aria-hidden />
          Launching Soon
        </motion.div>

        <motion.h1
          id="coming-soon-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[min(100%,20rem)] font-display text-[clamp(1.6rem,5.2vw+0.6rem,2.25rem)] font-bold leading-[1.12] tracking-tight text-cream text-balance sm:max-w-none sm:text-5xl md:text-6xl"
        >
          Something{' '}
          <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-500 bg-clip-text text-transparent">
            bigger
          </span>{' '}
          is coming
        </motion.h1>

        <motion.p
          id="coming-soon-desc"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.5 }}
          className="mt-4 max-w-xl px-0.5 text-sm leading-relaxed text-navy-200/95 text-pretty sm:mt-6 sm:text-base md:text-lg"
        >
          <strong>Vertex Estate</strong> is launching a new experience at{' '}
          <strong>{seoConfig.officialDomain}</strong> — premium homes and commercial property in{' '}
          {siteConfig.comingSoonLocationLine}, Islamabad (Chaudhry Plaza, F-7 Markaz). Curated
          listings, sharper tools, and the same trust you expect across Pakistan. Join the waitlist
          below for early access and launch discounts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
          className="mt-3 flex w-full min-w-0 max-w-lg flex-col items-center justify-center gap-2.5 text-xs sm:text-sm"
        >
          <p className="flex flex-wrap items-center justify-center gap-2 text-sm text-gold-400/90 sm:text-base">
            <MapPinIcon className="h-4 w-4 shrink-0" aria-hidden />
            <span className="font-medium text-cream/95">{siteConfig.comingSoonLocationLine}</span>
          </p>
          {siteConfig.comingSoonGoogleMapsUrl ? (
            <a
              href={siteConfig.comingSoonGoogleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] max-w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-[10px] font-bold uppercase leading-snug tracking-[0.12em] text-gold-300 shadow-md shadow-black/20 transition hover:border-gold-500/40 hover:bg-white/[0.1] hover:text-gold-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 sm:text-xs sm:tracking-[0.18em]"
            >
              <MapIcon className="h-4 w-4 shrink-0 text-gold-400" aria-hidden />
              Open live map
            </a>
          ) : null}
          {siteConfig.comingSoonMapEmbedUrl ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.45 }}
              className="mt-1 w-full min-w-0 max-w-lg overflow-hidden rounded-xl border border-white/12 bg-black/30 shadow-xl ring-1 ring-white/5"
            >
              <iframe
                title="Vertex Estate — Chaudhry Plaza, F-7 Markaz, Islamabad"
                src={siteConfig.comingSoonMapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-[min(42vh,260px)] w-full border-0 sm:h-auto sm:min-h-[240px] sm:aspect-video"
              />
            </motion.div>
          ) : null}
        </motion.div>

        <div className="mt-8 grid w-full max-w-[20rem] grid-cols-2 gap-2 sm:mt-12 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-3 md:gap-4">
          <TimeUnit value={cd.days} label="Days" delay={0.32} />
          <TimeUnit value={cd.hours} label="Hours" delay={0.38} />
          <TimeUnit value={cd.minutes} label="Minutes" delay={0.44} />
          <TimeUnit value={cd.seconds} label="Seconds" delay={0.5} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.5 }}
          className="relative mt-8 w-full max-w-md rounded-2xl border border-gold-500/25 bg-white/[0.05] px-4 py-6 text-left shadow-2xl shadow-black/30 backdrop-blur-md sm:mt-14 sm:px-6 sm:py-7"
        >
          <div className="mb-4 flex items-start gap-2 text-gold-300 sm:mb-5">
            <UserPlusIcon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <p className="font-display text-base font-bold leading-snug text-cream sm:text-lg">
              Register for early access
            </p>
          </div>
          {done ? (
            <div className="space-y-3 text-xs leading-relaxed text-navy-200/95 [overflow-wrap:anywhere] sm:text-sm">
              {savedMode === 'api' ? (
                <p>
                 Welcome aboard 🚀 You're officially on the waitlist. We'll keep you updated before launch.
                </p>
              ) : savedMode === 'offline' ? (
                <p>
                  {import.meta.env.DEV ? (
                    <>
                      You are on the list in this browser only — the API was not reached. For local
                      dev, run <span className="font-mono">npm run dev</span> (starts Vite + Node) and
                      set <span className="font-mono">MONGODB_URI</span> in <span className="font-mono">.env</span>.
                      Queued data: <span className="font-mono">vertex-lead-queue</span> in localStorage.
                    </>
                  ) : (
                    <>
                      You are on the list in this browser only — the live site did not reach the API.
                      Configure your host to forward <span className="font-mono">/api</span> to your Node
                      server (same origin), or rebuild with{' '}
                      <span className="font-mono">VITE_API_BASE_URL=https://your-api-host</span> pointing at
                      where <span className="font-mono">server/index.js</span> runs with{' '}
                      <span className="font-mono">MONGODB_URI</span> set there.
                    </>
                  )}
                </p>
              ) : (
                <p>
                  You are already registered from this device. If you need to change your details,
                  email us or clear site data and sign up again once the site is live.
                </p>
              )}
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setError('');
                const nameT = name.trim();
                const emailT = email.trim();
                if (!nameT) {
                  setError('Please enter your name.');
                  return;
                }
                if (!emailT) {
                  setError('Please enter your email.');
                  return;
                }
                if (!isValidLaunchInterestEmail(emailT)) {
                  setError('Please enter a valid email address.');
                  return;
                }
                if (bhp.trim()) {
                  setError('Unable to submit.');
                  return;
                }
                setBusy(true);
                try {
                  const result = await submitLaunchInterest({
                    name: nameT,
                    email: emailT,
                    phone: phone.trim(),
                    description: description.trim(),
                    bhp,
                  });
                  if (!result.ok) {
                    setError(result.error || 'Something went wrong. Try again in a moment.');
                    return;
                  }
                  try {
                    localStorage.setItem(LAUNCH_REGISTERED_LS, '1');
                  } catch {
                    /* noop */
                  }
                  playWaitlistCelebration();
                  setSavedMode(result.mode);
                  setDone(true);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <input
                type="text"
                name="bhp"
                value={bhp}
                onChange={(e) => setBhp(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute -left-[9999px] h-px w-px opacity-0"
              />
              <Input
                label="Full name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={launchFieldClass}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={launchFieldClass}
              />
              <Input
                label="Phone (optional)"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={launchFieldClass}
              />
              <div>
                <label className="mb-2 block text-sm font-medium text-cream sm:text-base">
                  Message (optional)
                </label>
                <textarea
                  name="description"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full resize-none rounded-lg border-2 px-4 py-3 text-base outline-none transition focus:ring-2 focus:ring-gold-500/20 sm:text-sm ${launchFieldClass}`}
                  placeholder="City, budget range, or how we should contact you"
                />
              </div>
              {error ? <p className="text-sm text-red-400">{error}</p> : null}
              <Button type="submit" variant="primary" className="w-full" disabled={busy}>
                {busy ? 'Sending…' : 'Join the waitlist'}
              </Button>
              <p className="text-center text-[10px] leading-relaxed text-navy-400/90 sm:text-[11px]">
                By registering you agree we may email you about this launch. Unsubscribe any time.
              </p>
            </form>
          )}
        </motion.div>

        <ComingSoonSocialLinks urls={siteConfig.comingSoonSocial} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 max-w-md rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-4 text-xs leading-relaxed text-navy-200/90 backdrop-blur-sm sm:mt-10 sm:px-6 sm:py-5 sm:text-sm"
        >
          <p className="font-semibold text-cream">Why the wait?</p>
          <p className="mt-2 text-navy-300/95">
            A major platform upgrade is landing soon. The timer is tied to one official launch
            moment for everyone.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

