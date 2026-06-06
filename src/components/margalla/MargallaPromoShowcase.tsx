import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MARGALLA_AERIAL_PROMO,
  MARGALLA_GATE_PROMO,
  margallaPromoHighlights,
} from '../../config/margallaPromos';
import { MARGALLA_PROJECT_PATH } from '../../data/margallaOrchardsContent';
import { Button } from '../ui/Button';
import { WhatsAppContactButton } from '../ui/WhatsAppContactButton';
import { MapPinIcon, ShieldIcon, RouteIcon, TrendingUpIcon } from 'lucide-react';

const icons = [MapPinIcon, ShieldIcon, RouteIcon, TrendingUpIcon];

type Props = {
  className?: string;
};

export function MargallaPromoShowcase({ className = '' }: Props) {
  return (
    <div className={`space-y-8 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="overflow-hidden rounded-2xl border border-navy-100 shadow-xl dark:border-navy-700 sm:rounded-[1.5rem]"
      >
        <img
          src={MARGALLA_GATE_PROMO}
          alt="Margalla Orchards Walk by DHAI — main entrance gate, Invest in prestige, Live in excellence"
          className="w-full object-cover"
          loading="lazy"
        />
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {margallaPromoHighlights.map((item, i) => {
          const Icon = icons[i] ?? MapPinIcon;
          return (
            <div
              key={item.label}
              className="flex gap-3 rounded-xl border border-navy-100 bg-white p-4 dark:border-navy-600 dark:bg-navy-800"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-500/15 text-gold-700 dark:text-gold-400">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold text-navy-900 dark:text-cream">{item.label}</p>
                <p className="text-xs text-navy-600 dark:text-cream/70">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="overflow-hidden rounded-2xl border border-navy-100 shadow-xl dark:border-navy-700 sm:rounded-[1.5rem]"
      >
        <img
          src={MARGALLA_AERIAL_PROMO}
          alt="Aerial view of Margalla Orchards development and surrounding Islamabad neighbourhoods"
          className="w-full object-cover"
          loading="lazy"
        />
      </motion.div>

      <p className="text-center text-sm text-navy-600 dark:text-cream/70">
        Margalla Orchards is one of Islamabad&apos;s fastest-growing addresses on Park Road.{' '}
        <Link
          to={MARGALLA_PROJECT_PATH}
          className="font-semibold text-gold-700 underline-offset-2 hover:underline dark:text-gold-400"
        >
          Read the full project guide
        </Link>
      </p>

      <div className="flex w-full flex-col items-stretch justify-center gap-3 px-1 sm:flex-row sm:items-center sm:px-0">
        <WhatsAppContactButton size="lg" label="Ask on WhatsApp" className="w-full sm:w-auto" />
        <Link to={`${MARGALLA_PROJECT_PATH}#overview`} className="w-full sm:w-auto">
          <Button variant="outline" className="w-full">
            Explore project guide
          </Button>
        </Link>
      </div>
    </div>
  );
}
