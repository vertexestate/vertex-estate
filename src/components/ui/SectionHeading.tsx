import { motion } from 'framer-motion';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.11, delayChildren: 0.04 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: SectionHeadingProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  const lineAlign =
    align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  const lineOrigin =
    align === 'center'
      ? 'origin-center'
      : align === 'right'
        ? 'origin-right'
        : 'origin-left';

  return (
    <motion.div
      className={alignClass[align]}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-48px' }}
    >
      {eyebrow && (
        <motion.span
          variants={fadeUp}
          className="mb-4 inline-flex items-center rounded-full border border-gold-500/30 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold-700 shadow-sm shadow-gold-500/10 backdrop-blur-md dark:border-gold-500/35 dark:bg-white/[0.06] dark:text-gold-200"
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        variants={fadeUp}
        className="font-display text-[2.1rem] font-bold leading-[1.06] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.35rem] lg:leading-[1.06]"
      >
        <span className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-600 bg-clip-text text-transparent dark:from-cream dark:via-gold-100 dark:to-navy-200">
          {title}
        </span>
      </motion.h2>
      <motion.div
        variants={fadeUp}
        className={`mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-gold-300 via-gold-500 to-gold-600 shadow-md shadow-gold-500/30 ${lineAlign} ${lineOrigin}`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      />
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className={`mt-5 max-w-2xl text-base leading-relaxed text-navy-600 dark:text-navy-300 sm:text-lg ${
            align === 'center' ? 'mx-auto' : ''
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
