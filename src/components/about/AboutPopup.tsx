import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  XIcon,
  TargetIcon,
  EyeIcon,
  HeartIcon,
  ArrowRightIcon,
  MapPinIcon,
  Building2Icon,
  SparklesIcon,
  AwardIcon,
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { WhatsAppContactButton } from '../ui/WhatsAppContactButton';

const SESSION_KEY = 'vertex-welcome-dismissed-v1';

const HIGHLIGHTS = [
  {
    icon: TargetIcon,
    title: 'Mission',
    text: 'Blending luxury, technology, and exceptional service in every property journey.',
  },
  {
    icon: EyeIcon,
    title: 'Vision',
    text: "To be Pakistan's most trusted name in premium real estate.",
  },
  {
    icon: HeartIcon,
    title: 'Values',
    text: 'Integrity, innovation, and an unwavering commitment to our clients.',
  },
] as const;

const VERTEX_STATS = [
  { icon: Building2Icon, label: 'Premium', detail: 'Advisory' },
  { icon: MapPinIcon, label: 'F-7 Markaz', detail: 'Islamabad' },
  { icon: AwardIcon, label: 'Trusted', detail: 'Service' },
] as const;

const panelSpring = { type: 'spring' as const, stiffness: 320, damping: 28 };

/**
 * Welcome popup — introduces Vertex Estate once per browser session.
 */
export function AboutPopup({ active }: { active: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const reduceMotion = usePrefersReducedMotion();

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!active) return;
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const timer = window.setTimeout(() => setIsOpen(true), 900);
    return () => window.clearTimeout(timer);
  }, [active]);

  const dismiss = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, dismiss]);

  const current = HIGHLIGHTS[activeTab];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close welcome dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="fixed inset-0 z-[80] bg-navy-950/75 backdrop-blur-md"
          />

          <div className="fixed inset-0 z-[80] flex items-end justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pointer-events-none sm:items-center sm:p-5">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="welcome-popup-title"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 16 }}
              transition={panelSpring}
              className="relative pointer-events-auto flex max-h-[min(92dvh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-[1.75rem] border border-gold-500/25 bg-white shadow-[0_32px_80px_-20px_rgba(2,22,22,0.55)] ring-1 ring-white/10 dark:border-gold-500/30 dark:bg-navy-900 dark:ring-white/5 sm:max-w-3xl sm:rounded-[2rem]"
            >
              {!reduceMotion && (
                <>
                  <motion.div
                    className="pointer-events-none absolute -left-16 top-8 h-40 w-40 rounded-full bg-gold-500/20 blur-3xl"
                    animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.08, 1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                    aria-hidden
                  />
                  <motion.div
                    className="pointer-events-none absolute -right-10 bottom-16 h-36 w-36 rounded-full bg-navy-500/25 blur-3xl dark:bg-gold-600/10"
                    animate={{ opacity: [0.2, 0.4, 0.2], x: [0, -10, 0] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                    aria-hidden
                  />
                </>
              )}

              <button
                type="button"
                onClick={dismiss}
                aria-label="Close"
                className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-navy-950/40 text-cream backdrop-blur-md transition-colors hover:bg-navy-950/70 sm:right-4 sm:top-4"
              >
                <XIcon className="h-5 w-5" />
              </button>

              {/* Vertex Estate header */}
              <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 px-5 pb-6 pt-10 sm:px-7 sm:pb-7 sm:pt-12">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_80%_10%,rgba(212,255,63,0.15),transparent_55%)]" />
                <div className="absolute inset-0 opacity-[0.07]" style={{
                  backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }} aria-hidden />

                <div className="relative text-center">
                  <motion.div
                    initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-lg shadow-gold-500/25"
                  >
                    <Building2Icon className="h-8 w-8 text-navy-900" />
                  </motion.div>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/35 bg-gold-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-200">
                    <SparklesIcon className="h-3 w-3" aria-hidden />
                    Welcome
                  </span>

                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold-300/90">
                    About us
                  </p>
                  <h2
                    id="welcome-popup-title"
                    className="mt-2 font-display text-3xl font-bold text-cream sm:text-4xl"
                  >
                    {siteConfig.siteName}
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-navy-200">
                    Redefining premium real estate in Islamabad through innovation,
                    trust, and exceptional service.
                  </p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-navy-300">
                    <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-gold-400" aria-hidden />
                    {siteConfig.vertexOfficeAddress}
                  </p>
                </div>
              </div>

              <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
                <p className="text-sm leading-relaxed text-navy-600 dark:text-cream/80">
                  {siteConfig.siteName} is a premium real estate advisory based in
                  Islamabad. We help buyers and investors compare properties, book
                  site visits, and move forward with confidence — backed by clear
                  communication and WhatsApp-first support.
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {VERTEX_STATS.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.06 }}
                      className="rounded-xl border border-navy-100 bg-cream/80 px-2 py-2.5 text-center dark:border-navy-600 dark:bg-navy-800/60"
                    >
                      <stat.icon className="mx-auto mb-1 h-4 w-4 text-gold-500" aria-hidden />
                      <p className="font-display text-sm font-bold text-navy-900 dark:text-gold-300 sm:text-base">
                        {stat.label}
                      </p>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-navy-500 dark:text-cream/55">
                        {stat.detail}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-5">
                  <div
                    className="flex gap-1.5 rounded-xl border border-navy-100 bg-navy-50/80 p-1 dark:border-navy-600 dark:bg-navy-800/50"
                    role="tablist"
                    aria-label={`About ${siteConfig.siteName}`}
                  >
                    {HIGHLIGHTS.map((item, index) => (
                      <button
                        key={item.title}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === index}
                        onClick={() => setActiveTab(index)}
                        className={`relative flex-1 rounded-lg px-2 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors sm:text-xs ${
                          activeTab === index
                            ? 'text-navy-900 dark:text-navy-900'
                            : 'text-navy-600 hover:text-navy-900 dark:text-cream/70 dark:hover:text-cream'
                        }`}
                      >
                        {activeTab === index && (
                          <motion.span
                            layoutId="welcome-tab-pill"
                            className="absolute inset-0 rounded-lg bg-gradient-to-b from-gold-300 via-gold-500 to-gold-600 shadow-sm"
                            transition={panelSpring}
                          />
                        )}
                        <span className="relative z-[1]">{item.title}</span>
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.title}
                      role="tabpanel"
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.22 }}
                      className="mt-3 flex items-start gap-3 rounded-2xl border border-gold-500/20 bg-gradient-to-br from-gold-500/8 via-transparent to-navy-500/5 p-4 dark:from-gold-500/10 dark:to-navy-800/40"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 ring-1 ring-gold-500/25">
                        <current.icon className="h-5 w-5 text-gold-600 dark:text-gold-400" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-navy-900 dark:text-cream">
                          {current.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-navy-600 dark:text-cream/75">
                          {current.text}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                  <Link
                    to="/about"
                    onClick={dismiss}
                    className="inline-flex min-h-[3rem] flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-gold-300 via-gold-500 to-gold-600 px-5 py-3 text-sm font-bold tracking-wide text-navy-900 shadow-btn-primary transition-all hover:from-gold-200 hover:via-gold-400 hover:to-gold-500 sm:min-w-[10rem]"
                  >
                    Learn more about us
                    <ArrowRightIcon className="h-4 w-4" aria-hidden />
                  </Link>
                  <WhatsAppContactButton
                    size="md"
                    variant="solid"
                    label="Chat on WhatsApp"
                    className="min-h-[3rem] flex-1 sm:min-w-[10rem]"
                    onClick={dismiss}
                  />
                </div>

                <div className="mt-3 text-center">
                  <button
                    type="button"
                    onClick={dismiss}
                    className="text-xs font-semibold text-navy-500 underline-offset-2 hover:text-navy-800 hover:underline dark:text-cream/55 dark:hover:text-cream"
                  >
                    Explore site
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
