import { ClockIcon, MapPinIcon, SparklesIcon } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { buildWhatsAppUrl, whatsAppMessageForPlot } from '../../lib/whatsapp';
import { WhatsAppContactButton } from '../ui/WhatsAppContactButton';

const PLOT_SIZES = ['10 Marla', '14 Marla', '1 Kanal'] as const;

type Props = {
  className?: string;
  title?: string;
  subtitle?: string;
};

export function WhatsAppInquiryCard({
  className = '',
  title = 'Ask us on WhatsApp',
  subtitle = 'We reply quickly with today’s plot availability, block options, and a clear quote. No pressure, just friendly help.',
}: Props) {
  return (
    <div
      className={`overflow-hidden rounded-[1.75rem] border border-[#25D366]/30 bg-gradient-to-br from-white via-[#f6fff9] to-[#e8f9ee] shadow-xl shadow-[#25D366]/10 dark:border-[#25D366]/25 dark:from-navy-800 dark:via-navy-800 dark:to-navy-900 ${className}`}
    >
      <div className="grid gap-6 p-4 sm:gap-8 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#25D366]/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#128C7E] dark:text-[#5dde8a]">
            <SparklesIcon className="h-3.5 w-3.5" aria-hidden />
            Friendly team on WhatsApp
          </span>
          <h3 className="mt-4 font-display text-xl font-bold text-balance text-navy-900 dark:text-cream sm:text-3xl">
            {title}
          </h3>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-navy-600 dark:text-cream/80">
            {subtitle}
          </p>
          <ul className="mt-5 space-y-2 text-sm text-navy-600 dark:text-cream/75">
            <li className="flex items-start gap-2">
              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#25D366]" aria-hidden />
              Usually reply within a few hours (office hours in Islamabad)
            </li>
            <li className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#25D366]" aria-hidden />
              Site visits and block maps shared on request
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4 lg:min-w-[280px]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-navy-500 dark:text-cream/55">
            Pick a plot size
          </p>
          <div className="flex flex-col gap-2">
            {PLOT_SIZES.map((size) => (
              <a
                key={size}
                href={buildWhatsAppUrl(whatsAppMessageForPlot(size))}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-navy-100 bg-white px-4 py-3 text-left text-sm font-semibold text-navy-800 transition hover:border-[#25D366]/50 hover:bg-[#25D366]/5 dark:border-navy-600 dark:bg-navy-900 dark:text-cream dark:hover:border-[#25D366]/40"
              >
                {size}
                <span className="mt-0.5 block text-xs font-normal text-navy-500 dark:text-cream/60">
                  Tap to message {siteConfig.siteName}
                </span>
              </a>
            ))}
          </div>
          <WhatsAppContactButton size="lg" className="w-full" variant="solid" />
        </div>
      </div>
    </div>
  );
}
