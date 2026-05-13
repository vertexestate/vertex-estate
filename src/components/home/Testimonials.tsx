import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon, QuoteIcon } from 'lucide-react';
import { testimonials as seedTestimonials } from '../../data/properties';
import { fetchJson } from '../../lib/fetchJson';
import type { SiteTestimonialsFile } from '../../types/siteFiles';

export function Testimonials() {
  const [items, setItems] = useState(seedTestimonials);

  useEffect(() => {
    fetchJson<SiteTestimonialsFile>('/site/testimonials.json').then((file) => {
      if (file?.testimonials && file.testimonials.length > 0) {
        setItems(file.testimonials);
      }
    });
  }, []);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, Math.max(0, items.length - 1)));
  }, [items.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);
  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };
  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };
  const t = items[currentIndex];

  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="pointer-events-none absolute -left-6 top-0 hidden h-40 w-40 rounded-full bg-gold-400/15 blur-3xl lg:block" />
      <div className="pointer-events-none absolute -right-4 bottom-8 hidden h-36 w-36 rounded-full bg-navy-500/20 blur-3xl lg:block dark:bg-gold-600/10" />
      <div className="absolute -left-4 top-8 hidden text-gold-500/15 lg:block xl:-left-8">
        <QuoteIcon className="h-32 w-32 rotate-180" aria-hidden />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-navy-100/90 bg-gradient-to-br from-white via-white to-cream/70 p-8 shadow-2xl shadow-black/10 ring-1 ring-gold-500/10 backdrop-blur-sm dark:border-navy-600 dark:from-navy-800 dark:via-navy-800 dark:to-navy-900/95 dark:ring-gold-500/15 md:p-12"
        >
          <div className="absolute right-0 top-0 h-40 w-40 translate-x-1/4 -translate-y-1/4 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="relative flex flex-wrap items-center gap-1.5">
            {[...Array(t.rating)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 18,
                  delay: i * 0.06,
                }}
              >
                <StarIcon
                  className="h-5 w-5 fill-gold-500 text-gold-500 drop-shadow-sm"
                  aria-hidden
                />
              </motion.span>
            ))}
            <span className="ml-2 text-sm font-semibold text-navy-500 dark:text-navy-400">
              {t.rating}.0 client rating
            </span>
          </div>
          <blockquote className="relative mt-8 border-l-4 border-gold-500 pl-5 font-display text-xl not-italic leading-relaxed text-navy-800 dark:text-navy-100 md:text-2xl md:pl-6">
            {t.quote}
          </blockquote>
          <div className="relative mt-10 flex items-center gap-4 border-t border-navy-100 pt-8 dark:border-navy-600">
            <img
              src={t.photo}
              alt=""
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-gold-500/30"
            />
            <div>
              <div className="font-display text-lg font-bold text-navy-900 dark:text-cream">
                {t.name}
              </div>
              <div className="text-sm text-navy-600 dark:text-navy-400">{t.role}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mx-auto mt-5 h-1 max-w-lg overflow-hidden rounded-full bg-navy-200/80 dark:bg-navy-700">
        <motion.div
          key={currentIndex}
          className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 6, ease: 'linear' }}
          style={{ transformOrigin: 'left center' }}
        />
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <motion.button
          type="button"
          onClick={prev}
          aria-label="Previous testimonial"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="rounded-full border border-navy-200 bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-colors hover:border-gold-500/45 dark:border-navy-600 dark:bg-navy-800/90"
        >
          <ChevronLeftIcon className="h-6 w-6 text-navy-900 dark:text-cream" />
        </motion.button>
        <div className="flex items-center gap-2 px-2">
          {items.map((_, index) => (
            <motion.button
              key={index}
              type="button"
              aria-label={`Show testimonial ${index + 1}`}
              aria-current={index === currentIndex}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className={`h-2 rounded-full transition-colors duration-300 ${
                index === currentIndex
                  ? 'w-9 bg-gradient-to-r from-gold-400 to-gold-600 shadow-sm shadow-gold-500/25'
                  : 'w-2 bg-navy-200 dark:bg-navy-600'
              }`}
            />
          ))}
        </div>
        <motion.button
          type="button"
          onClick={next}
          aria-label="Next testimonial"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="rounded-full border border-navy-200 bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-colors hover:border-gold-500/45 dark:border-navy-600 dark:bg-navy-800/90"
        >
          <ChevronRightIcon className="h-6 w-6 text-navy-900 dark:text-cream" />
        </motion.button>
      </div>
    </div>
  );
}
