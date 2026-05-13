import type { ReactNode } from 'react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, ArrowUpIcon } from 'lucide-react';
import { Hero } from '../components/home/Hero';
import { Categories } from '../components/home/Categories';
import { Stats } from '../components/home/Stats';
import { CTA } from '../components/home/CTA';
import { PremiumLocalities } from '../components/home/PremiumLocalities';
import { SectionHeading } from '../components/ui/SectionHeading';

const FeaturedSlider = lazy(() =>
  import('../components/home/FeaturedSlider').then((m) => ({ default: m.FeaturedSlider }))
);
const DealOfTheDay = lazy(() =>
  import('../components/home/DealOfTheDay').then((m) => ({ default: m.DealOfTheDay }))
);
const Testimonials = lazy(() =>
  import('../components/home/Testimonials').then((m) => ({ default: m.Testimonials }))
);
const MultiStepForm = lazy(() =>
  import('../components/ui/MultiStepForm').then((m) => ({ default: m.MultiStepForm }))
);
import { Button } from '../components/ui/Button';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const revealSoft = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

const revealReduced = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0, transition: { duration: 0 } },
};

function SectionShell({
  children,
  className = '',
  id,
  pattern = false,
  beam = false,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  pattern?: boolean;
  /** Soft animated top highlight */
  beam?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 ${className}`}
    >
      {beam && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent"
          initial={{ opacity: 0, scaleX: 0.3 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
      {pattern && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.28] dark:opacity-[0.12]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(100, 116, 139, 0.09) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(100, 116, 139, 0.09) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,rgba(212,255,63,0.05),transparent_62%)] dark:bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,rgba(212,255,63,0.04),transparent_62%)]" />
      <div className="relative z-[2]">{children}</div>
    </section>
  );
}

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = usePrefersReducedMotion();
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -12% 0px', amount: 0.12 }}
      variants={reduce ? revealReduced : revealSoft}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AmbientBackdrop({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <motion.div
        className="absolute -left-[18%] top-[8%] h-[min(72vw,520px)] w-[min(72vw,520px)] rounded-full bg-gold-500/[0.09] blur-[120px] will-change-transform"
        animate={{ x: [0, 24, 0], y: [0, -18, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-[12%] top-[38%] h-[min(60vw,440px)] w-[min(60vw,440px)] rounded-full bg-navy-500/[0.12] blur-[100px] will-change-transform dark:bg-gold-600/[0.06]"
        animate={{ x: [0, -20, 0], y: [0, 28, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[95] h-[3px] origin-left bg-gradient-to-r from-gold-300 via-gold-500 to-gold-400 shadow-[0_0_22px_rgba(212,255,63,0.5)]"
      style={{ scaleX: scrollYProgress, willChange: 'transform' }}
      aria-hidden
    />
  );
}

function SectionDeferredFallback() {
  return (
    <div
      className="flex min-h-[12rem] items-center justify-center gap-2"
      aria-hidden
    >
      <span className="h-1 w-10 animate-pulse rounded-full bg-gold-500/35" />
      <span className="h-1 w-6 animate-pulse rounded-full bg-gold-500/25 [animation-delay:120ms]" />
      <span className="h-1 w-14 animate-pulse rounded-full bg-gold-500/30 [animation-delay:240ms]" />
    </div>
  );
}

export function Home() {
  const navigate = useNavigate();
  const [showTop, setShowTop] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="relative isolate overflow-x-hidden bg-gradient-to-b from-cream via-[#f6f4ef] to-cream dark:from-navy-900 dark:via-[#050a14] dark:to-navy-900">
      <AmbientBackdrop active={!reduceMotion} />
      <ScrollProgress />

      <div className="relative z-10">
        <Hero />

        <SectionShell
          beam
          className="z-10 -mt-10 rounded-t-[1.75rem] border-t border-white/60 bg-cream shadow-[0_-16px_60px_-14px_rgba(4,8,13,0.14)] dark:border-white/[0.06] dark:bg-navy-900 dark:shadow-[0_-16px_60px_-14px_rgba(0,0,0,0.5)] sm:-mt-14 sm:rounded-t-[2.25rem]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_42%_at_50%_-8%,rgba(212,255,63,0.1),transparent_58%)] dark:bg-[radial-gradient(ellipse_70%_42%_at_50%_-8%,rgba(212,255,63,0.07),transparent_58%)]" />
          <div className="relative mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Neighbourhood intelligence"
              title="Bahria Town, DHA & capital belts"
              subtitle="Photography showcases premium gated-community architecture — tours and paperwork are always verified against the actual plot or unit."
            />
            <Reveal className="mt-10 sm:mt-12">
              <PremiumLocalities />
            </Reveal>
          </div>
        </SectionShell>

        <SectionShell
          beam
          id="featured-deal"
          className="border-t border-navy-100/70 bg-cream/90 dark:border-white/[0.06] dark:bg-navy-950/90"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_42%_at_50%_-8%,rgba(212,255,63,0.08),transparent_58%)] dark:bg-[radial-gradient(ellipse_70%_42%_at_50%_-8%,rgba(212,255,63,0.06),transparent_58%)]" />
          <div className="relative mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Exclusive offer"
              title="Featured luxury deal"
              subtitle="A hand-rotated spotlight property — refined finishes, prime locations, limited-time presentation."
            />
            <Reveal className="mt-12 sm:mt-14 lg:mt-16">
              <Suspense fallback={<SectionDeferredFallback />}>
                <DealOfTheDay />
              </Suspense>
            </Reveal>
          </div>
        </SectionShell>

        <SectionShell
          beam
          pattern
          className="border-y border-navy-100/80 bg-white/90 dark:border-navy-700/80 dark:bg-navy-800/95"
        >
          <div className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-25">
            <div className="absolute right-0 top-0 h-[480px] w-[480px] translate-x-1/4 -translate-y-1/4 rounded-full bg-gold-500/[0.1] blur-3xl" />
            <div className="absolute bottom-0 left-0 h-[360px] w-[360px] -translate-x-1/3 translate-y-1/4 rounded-full bg-navy-500/[0.06] blur-3xl dark:bg-gold-600/[0.05]" />
          </div>
          <div className="relative mx-auto max-w-7xl">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <SectionHeading
                  eyebrow="Featured properties"
                  title="Signature homes & penthouses"
                  subtitle="Live inventory across Bahria Town, DHA, Gulberg, Clifton, and Islamabad’s F-sectors — each card opens verified photography and specs."
                  align="left"
                />
              </div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="secondary"
                  className="shrink-0 border-gold-500/35 bg-white/80 shadow-md shadow-gold-500/10 backdrop-blur-sm hover:border-gold-500/55 dark:bg-navy-900/60"
                  onClick={() => navigate('/listings')}
                >
                  View all listings
                  <ArrowRightIcon className="h-4 w-4" aria-hidden />
                </Button>
              </motion.div>
            </div>
            <Reveal className="mt-12 sm:mt-14 lg:mt-16">
              <Suspense fallback={<SectionDeferredFallback />}>
                <FeaturedSlider />
              </Suspense>
            </Reveal>
          </div>
        </SectionShell>

        <SectionShell
          beam
          pattern
          id="categories"
          className="bg-gradient-to-b from-cream to-[#f3f1eb] dark:from-navy-900 dark:to-navy-950"
        >
          <div className="relative mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="What we offer"
              title="Property categories"
              subtitle="Choose how you want to move — buy, rent, luxury, or commercial — and we will shape the experience around you."
            />
            <Reveal className="mt-12 sm:mt-14 lg:mt-16">
              <Categories />
            </Reveal>
          </div>
        </SectionShell>

        <SectionShell
          beam
          pattern
          className="border-y border-navy-100/80 bg-white/90 dark:border-navy-700/80 dark:bg-navy-800/95"
        >
          <div className="relative mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Our impact"
              title="Trusted by thousands"
              subtitle="Numbers that reflect a global community of owners, renters, and investors who expect more from a real estate brand."
            />
            <Reveal className="mt-12 sm:mt-14 lg:mt-16">
              <Stats />
            </Reveal>
          </div>
        </SectionShell>

        <SectionShell
          beam
          id="concierge"
          className="bg-gradient-to-b from-[#f3f1eb] to-cream dark:from-navy-950 dark:to-navy-900"
        >
          <div className="relative mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Personalized search"
              title="Find your perfect match"
              subtitle="Share your goals in a few guided steps — our team uses your answers to curate options that actually fit your life."
            />
            <Reveal className="mt-12 sm:mt-14">
              <Suspense fallback={<SectionDeferredFallback />}>
                <MultiStepForm />
              </Suspense>
            </Reveal>
          </div>
        </SectionShell>

        <SectionShell
          beam
          pattern
          className="border-y border-navy-100/80 bg-white/90 dark:border-navy-700/80 dark:bg-navy-800/95"
        >
          <div className="relative mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Client stories"
              title="What our clients say"
              subtitle="Honest words from people who trusted Vertex Estate with one of life’s biggest decisions."
            />
            <Reveal className="mt-12 sm:mt-14 lg:mt-16">
              <Suspense fallback={<SectionDeferredFallback />}>
                <Testimonials />
              </Suspense>
            </Reveal>
          </div>
        </SectionShell>

        <SectionShell className="bg-gradient-to-b from-cream to-[#ebe8e0] pb-20 dark:from-navy-900 dark:to-navy-950 sm:pb-24 lg:pb-28">
          <Reveal>
            <div className="relative mx-auto max-w-7xl">
              <CTA />
            </div>
          </Reveal>
        </SectionShell>
      </div>

      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 12 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.94 }}
            className="fixed bottom-6 right-6 z-[100] flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/45 bg-navy-900 text-gold-400 shadow-xl shadow-black/35 transition-colors hover:bg-navy-800 hover:text-gold-300 dark:bg-navy-800 dark:hover:bg-navy-700"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
          >
            <ArrowUpIcon className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}
