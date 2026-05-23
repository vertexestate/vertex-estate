import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from 'lucide-react';
import { margallaFaq } from '../../data/margallaOrchardsContent';

export function MargallaFaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {margallaFaq.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className="overflow-hidden rounded-xl border border-navy-100 dark:border-navy-600"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 bg-navy-50/80 px-4 py-4 text-left font-semibold text-navy-900 transition-colors hover:bg-navy-100/80 dark:bg-navy-900/50 dark:text-cream dark:hover:bg-navy-900/80"
            >
              <span>{item.q}</span>
              <ChevronDownIcon
                className={`h-5 w-5 shrink-0 text-gold-600 transition-transform dark:text-gold-400 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28 }}
                >
                  <p className="border-t border-navy-100 px-4 py-4 text-sm leading-relaxed text-navy-600 dark:border-navy-600 dark:text-cream/75">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
