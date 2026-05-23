import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { margallaNavItems, type MargallaSectionId } from '../../data/margallaOrchardsContent';

type Props = {
  activeId: MargallaSectionId;
  onSelect: (id: MargallaSectionId) => void;
  /** sidebar = left nav (desktop); pills = horizontal scroll (mobile) */
  variant: 'sidebar' | 'pills';
};

export function MargallaSectionNav({ activeId, onSelect, variant }: Props) {
  if (variant === 'sidebar') {
    return (
      <nav aria-label="Project sections" className="lg:sticky lg:top-28">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-navy-500 dark:text-gold-400">
          Jump to section
        </p>
        <ul className="space-y-1 rounded-2xl border border-navy-100 bg-white p-2 shadow-lg shadow-navy-900/5 dark:border-navy-700 dark:bg-navy-800 dark:shadow-black/20">
          {margallaNavItems.map((item) => {
            const active = activeId === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-gold-500/25 text-navy-900 dark:bg-gold-500/20 dark:text-gold-300'
                      : 'text-navy-800 hover:bg-navy-50 dark:text-cream dark:hover:bg-navy-700/80'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="Project sections" className="lg:hidden">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-gold-600 dark:text-gold-400">
        Jump to section
      </p>
      <div className="snap-x-mandatory flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
        {margallaNavItems.map((item) => {
          const active = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`snap-start shrink-0 rounded-full px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-wide transition-colors sm:px-4 sm:text-xs ${
                active
                  ? 'bg-gold-500 text-navy-900 shadow-md shadow-gold-500/25'
                  : 'border border-navy-200 bg-white text-navy-800 dark:border-navy-600 dark:bg-navy-800 dark:text-cream'
              }`}
            >
              {item.shortLabel ?? item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function MargallaSection({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5% 0px' }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-header rounded-2xl border border-navy-100/90 bg-white p-4 text-navy-900 shadow-lg shadow-navy-900/5 dark:border-navy-600 dark:bg-navy-800 dark:text-cream dark:shadow-black/25 sm:scroll-mt-32 sm:rounded-[1.5rem] sm:p-8"
    >
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-700 dark:text-gold-300">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 font-display text-xl font-bold leading-tight text-navy-900 dark:text-cream sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-base leading-relaxed text-navy-700 dark:text-cream/80">{subtitle}</p>
      )}
      <div className="mt-6 text-navy-700 dark:text-cream/85">{children}</div>
    </motion.section>
  );
}
