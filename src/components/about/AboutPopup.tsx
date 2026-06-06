import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  XIcon,
  Building2Icon,
  TargetIcon,
  EyeIcon,
  HeartIcon,
  ArrowRightIcon,
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

const HIGHLIGHTS = [
  {
    icon: TargetIcon,
    title: 'Mission',
    text: 'Blending luxury, technology, and service in every property journey.',
  },
  {
    icon: EyeIcon,
    title: 'Vision',
    text: "To be Pakistan's most trusted name in premium real estate.",
  },
  {
    icon: HeartIcon,
    title: 'Values',
    text: 'Integrity, innovation, and an unwavering commitment to clients.',
  },
];

/**
 * Animated welcome popup that introduces the brand on every page load/refresh.
 * `active` should be true only once the app is interactive (after the loading
 * screen and not behind the coming-soon gate).
 */
export function AboutPopup({ active }: { active: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!active) return;
    if (typeof window === 'undefined') return;

    const timer = window.setTimeout(() => setIsOpen(true), 600);
    return () => window.clearTimeout(timer);
  }, [active]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[80] bg-navy-900/70 backdrop-blur-md"
          />

          <div className="fixed inset-0 z-[80] flex items-end justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pointer-events-none sm:items-center sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="relative pointer-events-auto max-h-[min(92dvh,680px)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-3xl border border-gold-500/20 bg-white shadow-2xl dark:bg-navy-800"
            >
              <button
                onClick={close}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 p-2 rounded-lg transition-colors hover:bg-navy-100 dark:hover:bg-navy-700"
              >
                <XIcon className="h-5 w-5 text-navy-700 dark:text-cream" />
              </button>

              <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-navy-900 to-navy-800 px-8 pt-10 pb-8 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.15 }}
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-lg"
                >
                  <Building2Icon className="h-8 w-8 text-navy-900" />
                </motion.div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
                  Welcome to
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold text-cream">
                  {siteConfig.siteName}
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-navy-200">
                  Redefining premium real estate in Islamabad through innovation,
                  trust, and exceptional service.
                </p>
              </div>

              <div className="px-8 py-7">
                <div className="space-y-3">
                  {HIGHLIGHTS.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: 0.25 + index * 0.1 }}
                      className="flex items-start gap-4 rounded-2xl border border-navy-100 bg-cream/60 p-4 dark:border-navy-700 dark:bg-navy-900/40"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/10">
                        <item.icon className="h-5 w-5 text-gold-500" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-navy-900 dark:text-cream">
                          {item.title}
                        </h3>
                        <p className="text-sm text-navy-600 dark:text-navy-400">
                          {item.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/about"
                    onClick={close}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-gold-300 via-gold-500 to-gold-600 px-6 py-3 text-sm font-bold tracking-[0.06em] text-navy-900 shadow-btn-primary transition-all hover:from-gold-200 hover:via-gold-400 hover:to-gold-500"
                  >
                    Learn More About Us
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={close}
                    className="inline-flex flex-1 items-center justify-center rounded-xl border-2 border-navy-900/15 px-6 py-3 text-sm font-bold tracking-[0.06em] text-navy-800 transition-all hover:border-gold-600 hover:bg-gold-500/10 dark:border-cream/25 dark:text-cream dark:hover:border-gold-400"
                  >
                    Explore Site
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
