import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  SearchIcon,
  ChevronDownIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CompassIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useSiteContent } from '../../context/SiteContentContext';

const statVariants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.85 + i * 0.07, duration: 0.48, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Hero() {
  const navigate = useNavigate();
  const reduceMotion = usePrefersReducedMotion();
  const [activeTab, setActiveTab] = useState<'buy' | 'rent' | 'sell'>('buy');
  const { heroHeadlineLead, heroHeadlineAccent, heroSubheading } = useSiteContent();

  const panelEnter = reduceMotion
    ? { opacity: 0, y: 24 }
    : { opacity: 0, y: 48, rotate: -1.2 };
  const panelAnimate = reduceMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 1, y: 0, rotate: 0 };

  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-navy-950 supports-[min-height:100dvh]:min-h-[100dvh]">
      {/* Background — CSS Ken Burns (no scroll listeners) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&h=1080&fit=crop&q=85"
          alt="Premium gated-community style residence"
          fetchPriority="high"
          decoding="async"
          className={`h-full w-full min-h-[105%] min-w-[105%] max-w-none object-cover will-change-transform ${
            reduceMotion ? '' : 'animate-hero-burns'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/[0.97] via-navy-950/75 to-navy-900/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/35 to-navy-900/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_0%_20%,rgba(212,255,63,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_80%,rgba(212,255,63,0.08),transparent_50%)]" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.05]" />
      </div>

      {/* Texture layers */}
      <div
        className="pointer-events-none absolute inset-0 z-[3] opacity-[0.2] mix-blend-overlay"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden
      />
      {!reduceMotion && (
        <div
          className="pointer-events-none absolute inset-0 z-[3] animate-starfield bg-[length:200%_200%] opacity-[0.1]"
          style={{
            backgroundImage:
              'linear-gradient(118deg, transparent 38%, rgba(255,255,255,0.22) 50%, transparent 62%)',
          }}
          aria-hidden
        />
      )}

      {!reduceMotion && (
        <>
          <motion.div
            className="pointer-events-none absolute -left-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-gold-500/12 blur-[120px]"
            animate={{ scale: [1, 1.06, 1], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="pointer-events-none absolute -right-32 bottom-1/4 h-[22rem] w-[22rem] rounded-full bg-gold-400/8 blur-[100px]"
            animate={{ x: [0, -16, 0], opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      <div className="pointer-events-none absolute left-0 top-0 z-[8] h-full w-1 max-w-[3px] bg-gradient-to-b from-gold-400/80 via-gold-500/40 to-transparent opacity-80 sm:w-1.5" />

      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-28 pt-24 sm:px-6 sm:pb-32 sm:pt-28 lg:px-8">
        <div className="grid flex-1 items-center gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          {/* Copy + actions */}
          <div className="relative lg:col-span-6 xl:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute -left-3 top-2 hidden h-24 w-px bg-gradient-to-b from-gold-400/90 to-transparent sm:block"
              aria-hidden
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 flex flex-wrap items-center justify-center gap-2 sm:justify-start lg:justify-start"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-white/[0.06] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-gold-100 shadow-lg shadow-black/30 backdrop-blur-md sm:text-xs">
                <SparklesIcon className="h-3.5 w-3.5 text-gold-400" aria-hidden />
                Curated — DHA & Bahria
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cream/75 backdrop-blur-md sm:text-xs">
                <ShieldCheckIcon className="h-3.5 w-3.5 text-gold-500" aria-hidden />
                Owner-reviewed
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-300/90 sm:text-left"
            >
              Vertex Estate
            </motion.p>

            <motion.h1
              className="text-center font-display text-[2.75rem] font-bold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl lg:text-left lg:text-[3.5rem] xl:text-[4rem]"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="block text-cream drop-shadow-[0_6px_32px_rgba(0,0,0,0.55)]">
                {heroHeadlineLead}
              </span>
              <span className="mt-2 block bg-gradient-to-r from-gold-100 via-gold-400 to-gold-600 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] sm:mt-3">
                {heroHeadlineAccent}
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-xl text-center text-base leading-relaxed text-navy-100/95 sm:text-lg lg:mx-0 lg:text-left lg:text-xl"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              {heroSubheading}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-start lg:justify-start"
            >
              <Button
                variant="primary"
                size="lg"
                className="h-14 min-w-[200px] justify-center rounded-xl text-base shadow-xl shadow-gold-500/30"
                onClick={() => navigate('/listings')}
              >
                <SearchIcon className="mr-2 h-5 w-5" aria-hidden />
                Search properties
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="h-14 min-w-[200px] justify-center rounded-xl border-white/25 bg-white/[0.06] text-cream backdrop-blur-md hover:border-gold-400/50 hover:bg-white/[0.1] hover:text-cream"
                onClick={() => navigate('/contact')}
              >
                Talk to our team
                <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden />
              </Button>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              className="mx-auto mt-10 flex max-w-xl flex-wrap justify-center gap-2 sm:gap-3 lg:mx-0 lg:justify-start"
            >
              {[
                { label: 'Verified inventory', value: '2,400+' },
                { label: 'Pakistan cities', value: '12' },
                { label: 'Families served', value: '18k+' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  custom={index}
                  variants={statVariants}
                  whileHover={reduceMotion ? undefined : { y: -3, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                  className="min-w-[108px] flex-1 rounded-2xl border border-white/[0.12] bg-white/[0.05] px-4 py-3 text-center shadow-lg shadow-black/25 backdrop-blur-md sm:min-w-[120px] sm:flex-none sm:px-5"
                >
                  <div className="font-display text-xl font-bold tabular-nums text-gold-200 sm:text-2xl">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-cream/50 sm:text-xs">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Command deck */}
          <motion.div
            initial={panelEnter}
            animate={panelAnimate}
            transition={
              reduceMotion
                ? { duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }
                : { type: 'spring', stiffness: 200, damping: 26, delay: 0.18 }
            }
            className="relative lg:col-span-6 xl:col-span-5"
          >
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-gold-500/25 via-transparent to-navy-500/20 opacity-80 blur-2xl" />

            <div className="relative mb-4 flex items-center justify-center gap-2 lg:justify-end">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-navy-900/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-200/90 backdrop-blur-md">
                <CompassIcon className="h-3.5 w-3.5" aria-hidden />
                Live search
              </span>
            </div>

            <motion.div
              className="relative overflow-hidden rounded-[1.65rem] border border-white/[0.14] bg-gradient-to-br from-white/[0.16] via-white/[0.06] to-white/[0.02] p-[1px] shadow-[0_28px_90px_-16px_rgba(0,0,0,0.65)] shadow-gold-500/20 backdrop-blur-xl sm:rounded-[1.85rem]"
              whileHover={reduceMotion ? undefined : { y: -4 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            >
              {!reduceMotion && (
                <motion.div
                  className="pointer-events-none absolute -inset-[1px] rounded-[1.7rem] opacity-50"
                  style={{
                    background:
                      'conic-gradient(from 180deg at 50% 50%, transparent 0deg, rgba(212,255,63,0.5) 60deg, transparent 120deg, transparent 240deg, rgba(255,255,255,0.12) 300deg, transparent 360deg)',
                  }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                  aria-hidden
                />
              )}

              <div className="relative z-10 rounded-[1.6rem] bg-navy-950/55 p-5 sm:p-6 md:p-7">
                <div className="mb-1 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-200/85">
                    Refine your move
                  </p>
                  <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cream/50">
                    {activeTab}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-1.5 rounded-2xl border border-white/[0.08] bg-black/35 p-1.5 sm:gap-2">
                  {(['buy', 'rent', 'sell'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`relative overflow-hidden rounded-xl py-2.5 text-xs font-bold capitalize tracking-wide sm:text-sm ${
                        activeTab === tab
                          ? 'text-navy-950 shadow-lg shadow-black/30'
                          : 'text-cream/65 hover:bg-white/[0.05] hover:text-cream'
                      }`}
                    >
                      {activeTab === tab && (
                        <motion.span
                          layoutId="heroTabDeck"
                          className="absolute inset-0 rounded-xl bg-gradient-to-b from-gold-200 to-gold-600"
                          transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                        />
                      )}
                      <span className="relative z-10">{tab}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-5 space-y-3">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-cream/45">
                      Location
                    </label>
                    <Input
                      placeholder="e.g. DHA Phase 6, Bahria Town, Gulberg…"
                      className="h-12 rounded-xl border-white/12 bg-white/95 text-navy-900 shadow-inner shadow-black/5 placeholder:text-navy-400 dark:border-navy-600 dark:bg-navy-800/95 dark:text-cream dark:placeholder:text-navy-400"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-cream/45">
                        Budget
                      </label>
                      <Select
                        options={[
                          { value: '', label: 'Budget (PKR)' },
                          { value: '0-25000000', label: 'Up to 2.5 Crore' },
                          { value: '25000000-75000000', label: '2.5 – 7.5 Crore' },
                          { value: '75000000-150000000', label: '7.5 – 15 Crore' },
                          { value: '150000000+', label: '15 Crore+' },
                        ]}
                        className="h-12 rounded-xl border-white/12 bg-white/95 dark:border-navy-600 dark:bg-navy-800/95"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-cream/45">
                        Beds
                      </label>
                      <Select
                        options={[
                          { value: '', label: 'Bedrooms' },
                          { value: '1', label: '1+' },
                          { value: '2', label: '2+' },
                          { value: '3', label: '3+' },
                          { value: '4', label: '4+' },
                          { value: '5', label: '5+' },
                        ]}
                        className="h-12 rounded-xl border-white/12 bg-white/95 dark:border-navy-600 dark:bg-navy-800/95"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="mt-6 h-14 w-full rounded-xl text-base font-semibold shadow-lg shadow-gold-500/30 sm:h-14"
                  size="lg"
                  onClick={() => navigate('/listings')}
                >
                  <SearchIcon className="mr-2 h-5 w-5" aria-hidden />
                  Search matching homes
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {!reduceMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.55 }}
            className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-cream/35 lg:left-[42%] lg:translate-x-0"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em]">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDownIcon className="h-6 w-6" aria-hidden />
            </motion.div>
          </motion.div>
        )}
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[12] h-32 bg-gradient-to-t from-cream/95 via-cream/45 to-transparent dark:from-navy-900 dark:via-navy-900/75 dark:to-transparent"
        aria-hidden
      />
    </section>
  );
}
