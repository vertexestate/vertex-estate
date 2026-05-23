import { motion } from 'framer-motion';
import { MapPinIcon, ArrowUpRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Representative luxury-residential photography (stock) paired with real
 * premium micro-markets Vertex Estate targets — not developer marketing assets.
 */
const LOCALITIES = [
  {
    title: 'DHA & CDA',
    subtitle: 'Islamabad, Lahore, and Karachi',
    tag: 'Defence and capital sectors',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&h=900&fit=crop&q=82',
  },
  {
    title: 'DHA Defence',
    subtitle: 'Lahore, Karachi, and Islamabad-Rawalpindi',
    tag: 'Boulevards and secure phases',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&h=900&fit=crop&q=82',
  },
  {
    title: 'Gulberg & Johar Town',
    subtitle: 'Lahore core',
    tag: 'High-street and corporate adjacency',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&h=900&fit=crop&q=82',
  },
  {
    title: 'F-6, F-7, and Diplomatic Enclave',
    subtitle: 'Islamabad',
    tag: 'Tree-lined avenues',
    image:
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1400&h=900&fit=crop&q=82',
  },
  {
    title: 'Clifton & DHA Phase 8',
    subtitle: 'Karachi waterfront belt',
    tag: 'Sea breeze and skyline',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&h=900&fit=crop&q=82',
  },
];

export function PremiumLocalities() {
  const navigate = useNavigate();

  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:gap-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex min-h-[240px] flex-col justify-end overflow-hidden rounded-3xl border border-navy-200/80 bg-navy-800 p-6 shadow-xl dark:border-white/10 dark:bg-navy-800/80 sm:col-span-2 sm:row-span-2 sm:min-h-[280px] lg:min-h-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${LOCALITIES[0].image}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/45 to-navy-900/20" />
        <div className="relative z-10 max-w-lg">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
            Where Pakistan invests
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold leading-tight text-cream sm:text-3xl lg:text-4xl">
            {LOCALITIES[0].title}
          </h3>
          <p className="mt-2 text-sm text-cream/80">{LOCALITIES[0].subtitle}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gold-300/90">
            {LOCALITIES[0].tag}
          </p>
          <button
            type="button"
            onClick={() => navigate('/listings')}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-cream backdrop-blur-md transition hover:border-gold-500/50 hover:bg-white/15"
          >
            Browse this corridor
            <ArrowUpRightIcon className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </motion.div>

      {LOCALITIES.slice(1).map((area, i) => (
        <motion.button
          key={area.title}
          type="button"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{
            duration: 0.45,
            delay: 0.06 * (i + 1),
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate('/listings')}
          className="group relative flex min-h-[170px] flex-col justify-end overflow-hidden rounded-2xl border border-navy-200/80 text-left shadow-lg dark:border-white/10 sm:min-h-[180px]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url('${area.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/92 via-navy-950/35 to-transparent" />
          <div className="relative z-10 flex flex-1 flex-col justify-end p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                  {area.tag}
                </p>
                <h3 className="mt-1 font-display text-lg font-bold text-cream sm:text-xl">
                  {area.title}
                </h3>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-cream/75">
                  <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-gold-500" aria-hidden />
                  {area.subtitle}
                </p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-cream backdrop-blur-sm transition group-hover:border-gold-500/40 group-hover:text-gold-300">
                <ArrowUpRightIcon className="h-4 w-4" aria-hidden />
              </span>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
