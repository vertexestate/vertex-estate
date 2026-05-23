import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { HomeIcon, MapPinIcon, UsersIcon, AwardIcon } from 'lucide-react';
import { fetchJson } from '../../lib/fetchJson';
import { siteConfig } from '../../config/siteConfig';
import type { SiteStatsFile } from '../../types/siteFiles';

const list = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 26 },
  },
};

const DEFAULT_ICONS = [HomeIcon, MapPinIcon, UsersIcon, AwardIcon] as const;

type StatRow = {
  icon: (typeof DEFAULT_ICONS)[number];
  value: number;
  suffix: string;
  label: string;
};

const defaultStats: StatRow[] = [
  {
    icon: HomeIcon,
    value: 10000,
    suffix: '+',
    label: 'Properties listed',
  },
  {
    icon: MapPinIcon,
    value: 50,
    suffix: '+',
    label: 'Cities worldwide',
  },
  {
    icon: UsersIcon,
    value: 25000,
    suffix: '+',
    label: 'Happy clients',
  },
  {
    icon: AwardIcon,
    value: 15,
    suffix: '+',
    label: 'Years of excellence',
  },
];

export function Stats() {
  const [stats, setStats] = useState<StatRow[]>(() =>
    siteConfig.includeSeedProperties ? defaultStats : []
  );

  useEffect(() => {
    fetchJson<SiteStatsFile>('/site/stats.json').then((file) => {
      if (!file?.stats?.length) return;
      const next = file.stats.slice(0, 4).map((s, i) => ({
        icon: DEFAULT_ICONS[i] ?? HomeIcon,
        value: s.value,
        suffix: s.suffix ?? '',
        label: s.label,
      }));
      setStats(next);
    });
  }, []);

  if (stats.length === 0) return null;

  return (
    <motion.div
      className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6"
      variants={list}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          variants={item}
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className="group relative overflow-hidden rounded-3xl border border-navy-100/90 bg-gradient-to-b from-white to-cream/90 p-5 text-center shadow-lg shadow-black/[0.04] backdrop-blur-sm transition-colors hover:border-gold-500/35 dark:border-navy-600 dark:from-navy-800 dark:to-navy-900/95 dark:hover:border-gold-500/30 sm:p-6"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,255,63,0.1),transparent_58%)] opacity-0 transition duration-500 group-hover:opacity-100" />
          <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/12 ring-1 ring-gold-500/25 transition group-hover:bg-gold-500/18 group-hover:shadow-md group-hover:shadow-gold-500/20">
            <stat.icon className="h-7 w-7 text-gold-600 dark:text-gold-400" />
          </div>
          <div className="relative font-display text-3xl font-bold tabular-nums text-navy-900 dark:text-cream sm:text-4xl md:text-5xl">
            <AnimatedCounter end={stat.value} suffix={stat.suffix} />
          </div>
          <p className="relative mt-2 text-xs font-semibold uppercase tracking-wider text-navy-500 dark:text-cream/65 sm:text-sm">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
