import { motion } from 'framer-motion';
import { ShieldIcon, RouteIcon, TreesIcon, GraduationCapIcon } from 'lucide-react';
import { MARGALLA_AMENITIES } from '../../config/margallaAssets';

const icons = [ShieldIcon, RouteIcon, TreesIcon, GraduationCapIcon];

export function AmenitiesShowcase() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {MARGALLA_AMENITIES.map((item, i) => {
        const Icon = icons[i] ?? ShieldIcon;
        return (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-navy-100/90 bg-white p-5 shadow-lg shadow-navy-900/5 dark:border-navy-700 dark:bg-navy-800/90"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/15 text-gold-600 dark:text-gold-400">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="mt-4 font-display text-lg font-bold text-navy-900 dark:text-cream">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-navy-600 dark:text-cream/75">
              {item.description}
            </p>
          </motion.article>
        );
      })}
    </div>
  );
}
