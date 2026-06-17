import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  SearchIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  ChevronDownIcon,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { MARGALLA_PROJECT_PATH, margallaHero } from '../../data/margallaOrchardsContent';
import { Button } from '../ui/Button';
import { WhatsAppContactButton } from '../ui/WhatsAppContactButton';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useSiteContent } from '../../context/SiteContentContext';
import { siteConfig } from '../../config/siteConfig';
import { MARGALLA_HERO_IMAGE, MARGALLA_HERO_FALLBACK } from '../../config/margallaAssets';

const PLOT_SIZES = ['10 Marla', '14 Marla', '1 Kanal'] as const;
const PARTNERS = ['DHA Islamabad', 'SCBAP', 'FGEHA'] as const;

export function Hero() {
  const navigate = useNavigate();
  const reduceMotion = usePrefersReducedMotion();
  const { heroSubheading } = useSiteContent();

  return (
    <section
      id="home"
      className="relative scroll-mt-header overflow-hidden bg-cream text-navy-900 dark:bg-navy-950 dark:text-cream"
    >
      <div className="mx-auto max-w-[90rem] px-4 pt-page sm:px-5 lg:px-8 lg:pt-28">
        <div className="grid items-stretch gap-6 lg:min-h-[calc(100dvh-7rem)] lg:grid-cols-2 lg:gap-10 xl:gap-14">
          {/* Copy panel */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center py-6 sm:py-8 lg:py-12"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-700/20 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-900 dark:border-gold-500/30 dark:bg-gold-500/10 dark:text-gold-300">
                <ShieldCheckIcon className="mr-1.5 inline h-3.5 w-3.5" aria-hidden />
                DHA supervised
              </span>
              <span className="rounded-full border border-navy-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-navy-600 dark:border-navy-600 dark:bg-navy-800 dark:text-cream/85">
                <MapPinIcon className="mr-1.5 inline h-3.5 w-3.5" aria-hidden />
                Park Road, Islamabad
              </span>
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.32em] text-navy-500 dark:text-gold-300">
              {siteConfig.siteName} presents
            </p>

            <h1 className="mt-3 font-display text-[1.75rem] font-bold leading-[1.08] tracking-tight text-navy-900 dark:text-gold-300 min-[400px]:text-[2rem] sm:text-5xl xl:text-[3.25rem]">
              {margallaHero.title}
            </h1>

            <p className="mt-2 font-display text-xl font-semibold text-emerald-800 dark:text-gold-300 sm:text-3xl">
              {margallaHero.subtitle}
            </p>

            <p className="mt-6 max-w-lg text-base font-medium leading-relaxed text-navy-600 dark:text-cream/85 sm:text-lg">
              {heroSubheading}
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {PLOT_SIZES.map((size) => (
                <span
                  key={size}
                  className="rounded-full border border-navy-200/90 bg-white px-5 py-2.5 text-sm font-bold text-navy-900 shadow-sm dark:border-navy-600 dark:bg-navy-800 dark:text-cream"
                >
                  {size}
                </span>
              ))}
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-navy-500 dark:text-cream/55">
              {PARTNERS.join(', ')}
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => navigate(MARGALLA_PROJECT_PATH)}
              >
                Project guide
                <ArrowRightIcon className="h-5 w-5" aria-hidden />
              </Button>
              <WhatsAppContactButton
                size="lg"
                variant="solid"
                label="Chat on WhatsApp"
                className="w-full sm:min-w-[12rem] sm:w-auto"
              />
              <Link
                to={`${MARGALLA_PROJECT_PATH}#plots`}
                className="inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-xl border-2 border-navy-900/15 px-6 text-sm font-bold tracking-wide text-navy-800 transition-colors hover:border-gold-600 hover:bg-gold-500/10 sm:w-auto dark:border-cream/30 dark:text-cream dark:hover:border-gold-400 dark:hover:text-gold-300"
              >
                Explore plots
              </Link>
            </div>

            {/* Compact search */}
            <div className="mt-10 rounded-2xl border border-navy-100 bg-white p-4 shadow-xl shadow-navy-900/5 dark:border-navy-600 dark:bg-navy-800/90 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-navy-500 dark:text-gold-300">
                Quick plot search
              </p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <Input
                  placeholder="Park Road, sector…"
                  className="h-11 flex-1 rounded-xl border-navy-200 dark:border-navy-500 dark:bg-navy-900 dark:text-cream dark:placeholder:text-cream/40"
                />
                <Select
                  options={[
                    { value: '10', label: '10 Marla' },
                    { value: '14', label: '14 Marla' },
                    { value: '20', label: '1 Kanal' },
                  ]}
                  className="h-11 w-full rounded-xl border-navy-200 dark:border-navy-500 dark:bg-navy-900 dark:text-cream sm:w-36"
                />
                <Button
                  variant="primary"
                  size="md"
                  className="min-w-[3rem] shrink-0 px-5"
                  onClick={() => navigate('/listings')}
                  aria-label="Search plots"
                >
                  <SearchIcon className="h-5 w-5" aria-hidden />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Hero imagery stack */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col gap-3 pb-8 lg:pb-12"
          >
         <div className=" mt-40 relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-[0_32px_80px_-24px_rgba(2,22,22,0.35)] dark:border-navy-700 dark:bg-navy-900 sm:rounded-[2rem]">
  <img
    src={MARGALLA_HERO_IMAGE}
    alt="DHA Margalla Orchard"
    className="block w-full h-auto"
  />
</div>
          </motion.div>
        </div>
      </div>

      {!reduceMotion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center pb-8"
        >
          <motion.button
            type="button"
            onClick={() =>
              document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="flex flex-col items-center gap-1 text-navy-400 hover:text-emerald-700 dark:text-cream/50 dark:hover:text-gold-400"
            aria-label="Scroll to gallery"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em]">
              Explore
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              <ChevronDownIcon className="h-5 w-5" />
            </motion.div>
          </motion.button>
        </motion.div>
      )}

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent dark:from-navy-950"
        aria-hidden
      />
    </section>
  );
}
