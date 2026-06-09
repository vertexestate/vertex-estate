import { motion } from 'framer-motion';
import { MARGALLA_GALLERY } from '../../config/margallaAssets';

export function ProjectGallery() {
  const promo = MARGALLA_GALLERY[0];

  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-3xl border border-navy-100 bg-navy-950 shadow-xl dark:border-navy-700"
    >
      <img
        src={promo.src}
        alt={promo.title}
        loading="lazy"
        decoding="async"
        className="w-full object-contain transition duration-700 group-hover:scale-[1.01]"
      />
      <figcaption className="border-t border-navy-800 bg-navy-950 px-6 py-4 sm:px-8 sm:py-5">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-300">
          {promo.caption}
        </p>
        <p className="mt-1 font-display text-xl font-bold text-cream sm:text-2xl">
          {promo.title}
        </p>
      </figcaption>
    </motion.figure>
  );
}
