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
          className="group relative overflow-hidden rounded-2xl"
        >
          <img
            src={spot.image}
            alt={spot.label}
            loading="lazy"
            className="aspect-[5/4] w-full object-cover transition duration-700 group-hover:scale-105 sm:aspect-[4/3]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-navy-900/10" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cream backdrop-blur-md">
              <MapPinIcon className="h-3 w-3 text-gold-400" aria-hidden />
              {spot.detail}
            </span>
            <p className="mt-2 font-display text-xl font-bold text-white">{spot.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
