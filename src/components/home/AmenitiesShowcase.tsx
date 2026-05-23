import { motion } from 'framer-motion';
import { MARGALLA_AMENITIES } from '../../config/margallaAssets';

export function AmenitiesShowcase() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {MARGALLA_AMENITIES.map((item, i) => (
        <motion.article
          key={item.title}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6 }}
          className="group overflow-hidden rounded-2xl border border-navy-100/90 bg-white shadow-lg shadow-navy-900/5 dark:border-navy-700 dark:bg-navy-800/90"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent" />
          </div>
          <div className="p-5">
            <h3 className="font-display text-lg font-bold text-navy-900 dark:text-cream">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-navy-600 dark:text-cream/75">
              {item.description}
            </p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
