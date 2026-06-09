import { motion } from 'framer-motion';
import { MapPinIcon } from 'lucide-react';
import { MARGALLA_LOCATION_HIGHLIGHTS } from '../../config/margallaAssets';

export function LocationShowcase() {
  return (
    <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
      {MARGALLA_LOCATION_HIGHLIGHTS.map((spot, i) => (
        <motion.div
          key={spot.label}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-navy-100 bg-gradient-to-br from-white to-cream/80 p-6 dark:border-navy-600 dark:from-navy-800 dark:to-navy-900/80"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-700 dark:text-gold-300">
            <MapPinIcon className="h-3 w-3" aria-hidden />
            {spot.detail}
          </span>
          <p className="mt-3 font-display text-xl font-bold text-navy-900 dark:text-cream">
            {spot.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
