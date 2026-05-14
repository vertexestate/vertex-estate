import { motion } from 'framer-motion';

type SocialUrls = {
  facebook: string;
  instagram: string;
  tiktok: string;
};

type ComingSoonSocialLinksProps = {
  urls: SocialUrls;
};

const linkClass =
  'inline-flex h-12 w-12 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-gold-400 transition active:scale-[0.98] hover:border-gold-500/45 hover:bg-white/[0.1] hover:text-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 sm:h-11 sm:w-11 sm:min-h-0 sm:min-w-0';

function IconFacebook() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function IconTiktok() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export function ComingSoonSocialLinks({ urls }: ComingSoonSocialLinksProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.66, duration: 0.45 }}
      className="mt-8 flex w-full min-w-0 max-w-md flex-col items-center gap-2.5 px-1 sm:mt-10 sm:gap-3"
    >
      <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400/95 sm:text-[11px] sm:tracking-[0.22em]">
        Follow us
      </p>
      <div className="flex w-full max-w-[280px] items-center justify-center gap-2 sm:max-w-none sm:gap-4">
        <a
          href={urls.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          aria-label="Vertex Estate on Facebook"
        >
          <IconFacebook />
        </a>
        <a
          href={urls.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          aria-label="Vertex Estate on Instagram"
        >
          <IconInstagram />
        </a>
        <a
          href={urls.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          aria-label="Vertex Estate on TikTok"
        >
          <IconTiktok />
        </a>
      </div>
    </motion.div>
  );
}
