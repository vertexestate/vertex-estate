import { motion } from 'framer-motion';
import { ArrowRightIcon, SparklesIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { WhatsAppContactButton } from '../ui/WhatsAppContactButton';
import { useNavigate } from 'react-router-dom';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function CTA() {
  const navigate = useNavigate();
  const reduce = usePrefersReducedMotion();

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-gold-500/25 shadow-2xl shadow-black/25 ring-1 ring-white/10 dark:border-gold-500/30 dark:ring-white/5 sm:rounded-[2rem]">
      {!reduce && (
        <>
          <motion.div
            className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-gold-500/20 blur-3xl"
            animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute -bottom-16 right-0 h-64 w-64 rounded-full bg-navy-500/30 blur-3xl dark:bg-gold-600/15"
            animate={{ opacity: [0.25, 0.45, 0.25], x: [0, -12, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          />
        </>
      )}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&h=800&fit=crop&q=82"
          alt=""
          className="h-full min-h-[280px] w-full object-cover sm:min-h-[320px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-900/88 to-navy-900/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_50%,rgba(212,255,63,0.12),transparent_50%)]" />
      </div>

      <div className="pointer-events-none absolute inset-5 z-[11] rounded-[1.2rem] border border-white/15 sm:inset-7 sm:rounded-[1.35rem]" />

      <div className="relative z-10 flex min-h-[280px] flex-col items-center justify-center px-6 py-16 text-center sm:min-h-[320px] sm:px-10 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold-200 backdrop-blur-sm">
            <SparklesIcon className="h-3.5 w-3.5" aria-hidden />
            Start today
          </span>
          <h2 className="font-display text-3xl font-bold leading-tight text-cream sm:text-4xl md:text-5xl lg:text-6xl">
            Find your next chapter
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-navy-100/95 sm:text-lg">
            Browse listings or say hello on WhatsApp. We help you compare plots, book visits,
            and move forward at your pace.
          </p>
          <div className="mt-10 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:mx-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => navigate('/listings')}
            >
              Browse properties
              <ArrowRightIcon className="h-5 w-5" aria-hidden />
            </Button>
            <WhatsAppContactButton
              size="lg"
              variant="solid"
              label="Chat on WhatsApp"
              className="w-full sm:w-auto"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
