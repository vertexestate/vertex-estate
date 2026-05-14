import { motion, useReducedMotion } from 'framer-motion';

/**
 * Soft city / estate skyline — decorative only (sits behind main content).
 */
export function EstateSkylineDecoration() {
  const reduceMotion = useReducedMotion();

  const loop = reduceMotion
    ? { duration: 0 }
    : { repeat: Infinity, ease: 'easeInOut' as const };

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center overflow-hidden"
      aria-hidden
    >
      <motion.div
        className="w-[min(1100px,160vw)] max-w-none shrink-0 text-cream/[0.09]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg
          viewBox="0 0 1200 220"
          className="h-[min(28vh,200px)] w-full sm:h-[min(32vh,240px)]"
          preserveAspectRatio="xMidYMax meet"
          role="presentation"
        >
          <defs>
            <linearGradient id="estate-skyline-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="55%" stopColor="currentColor" stopOpacity="0.45" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.65" />
            </linearGradient>
            <linearGradient id="estate-skyline-gold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d4ff3f" stopOpacity="0.06" />
              <stop offset="50%" stopColor="#d4ff3f" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#d4ff3f" stopOpacity="0.06" />
            </linearGradient>
          </defs>
          {/* Back row — shorter blocks, slower drift */}
          <motion.g
            fill="currentColor"
            opacity={0.35}
            animate={reduceMotion ? { y: 0 } : { y: [0, -5, 0] }}
            transition={{ ...loop, duration: reduceMotion ? 0 : 26 }}
          >
            <rect x="-40" y="140" width="100" height="80" rx="1" />
            <rect x="130" y="155" width="70" height="65" rx="1" />
            <rect x="280" y="125" width="90" height="95" rx="1" />
            <rect x="520" y="150" width="75" height="70" rx="1" />
            <rect x="720" y="135" width="95" height="85" rx="1" />
            <rect x="980" y="160" width="80" height="60" rx="1" />
            <rect x="1120" y="145" width="120" height="75" rx="1" />
          </motion.g>
          {/* Front skyline — slightly faster / larger motion for depth */}
          <motion.g
            animate={reduceMotion ? { y: 0 } : { y: [0, -7, 0] }}
            transition={{ ...loop, duration: reduceMotion ? 0 : 17, delay: reduceMotion ? 0 : 0.4 }}
          >
            <path
              fill="url(#estate-skyline-fade)"
              d="M0,220 L0,118 L48,118 L48,88 L92,88 L92,132 L140,132 L140,72 L188,72 L188,108 L236,108 L236,52 L312,52 L312,98 L368,98 L368,68 L420,68 L420,124 L472,124 L472,82 L528,82 L528,138 L596,138 L596,96 L652,96 L652,58 L708,58 L708,112 L768,112 L768,78 L824,78 L824,128 L884,128 L884,64 L948,64 L948,104 L1008,104 L1008,74 L1068,74 L1068,118 L1128,118 L1128,88 L1200,88 L1200,220 Z"
            />
            <motion.path
              fill="url(#estate-skyline-gold)"
              animate={reduceMotion ? { opacity: 0.9 } : { opacity: [0.55, 0.95, 0.55] }}
              transition={{ ...loop, duration: reduceMotion ? 0 : 11 }}
              d="M0,220 L0,118 L48,118 L48,88 L92,88 L92,132 L140,132 L140,72 L188,72 L188,108 L236,108 L236,52 L312,52 L312,98 L368,98 L368,68 L420,68 L420,124 L472,124 L472,82 L528,82 L528,138 L596,138 L596,96 L652,96 L652,58 L708,58 L708,112 L768,112 L768,78 L824,78 L824,128 L884,128 L884,64 L948,64 L948,104 L1008,104 L1008,74 L1068,74 L1068,118 L1128,118 L1128,88 L1200,88 L1200,220 Z"
            />
            {/* Window hints — twinkle in sync with front mass */}
            <motion.g
              fill="currentColor"
              animate={reduceMotion ? { opacity: 0.2 } : { opacity: [0.08, 0.32, 0.08] }}
              transition={{ ...loop, duration: reduceMotion ? 0 : 4.2, delay: reduceMotion ? 0 : 0.2 }}
            >
              <rect x="252" y="72" width="6" height="6" rx="0.5" />
              <rect x="264" y="72" width="6" height="6" rx="0.5" />
              <rect x="252" y="84" width="6" height="6" rx="0.5" />
              <rect x="656" y="70" width="5" height="5" rx="0.5" />
              <rect x="666" y="70" width="5" height="5" rx="0.5" />
              <rect x="656" y="82" width="5" height="5" rx="0.5" />
              <rect x="900" y="78" width="5" height="5" rx="0.5" />
              <rect x="912" y="78" width="5" height="5" rx="0.5" />
            </motion.g>
          </motion.g>
        </svg>
      </motion.div>
      {/* Soft reflection / ground line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
    </div>
  );
}
