import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DownloadIcon, ExpandIcon, XIcon, MapIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import {
  MARGALLA_MASTER_PLAN_IMAGE,
  margallaMasterPlanMap,
} from '../../config/margallaAssets';
import { MARGALLA_PROJECT_PATH } from '../../data/margallaOrchardsContent';

type Props = {
  /** Link “view blocks” to project page section when on home */
  showProjectLink?: boolean;
  className?: string;
};

export function MargallaMasterPlanMap({ showProjectLink = true, className = '' }: Props) {
  const [lightbox, setLightbox] = useState(false);

  const downloadMap = () => {
    const a = document.createElement('a');
    a.href = MARGALLA_MASTER_PLAN_IMAGE;
    a.download = 'DHA-Margalla-Orchards-Master-Plan.png';
    a.click();
  };

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-[1.5rem] border border-navy-100 bg-white shadow-xl shadow-navy-900/10 dark:border-navy-700 dark:bg-navy-900 sm:rounded-[1.75rem]">
        <div className="border-b border-navy-100 px-5 py-4 dark:border-navy-700 sm:px-6 sm:py-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-600 dark:text-gold-400">
            Master plan
          </p>
          <h3 className="mt-1 font-display text-xl font-bold text-navy-900 dark:text-cream sm:text-2xl">
            {margallaMasterPlanMap.title}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-navy-600 dark:text-cream/75 sm:text-base">
            {margallaMasterPlanMap.subtitle}
          </p>
        </div>

        <div className="relative bg-navy-50/80 p-3 dark:bg-navy-950/80 sm:p-4">
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="group relative block w-full overflow-hidden rounded-xl border border-navy-200/80 dark:border-navy-600"
            aria-label="Open master plan map full size"
          >
            <img
              src={MARGALLA_MASTER_PLAN_IMAGE}
              alt={margallaMasterPlanMap.alt}
              loading="lazy"
              className="w-full object-contain transition duration-500 group-hover:scale-[1.02]"
            />
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-navy-900/85 px-3 py-1.5 text-xs font-bold text-cream backdrop-blur-sm transition group-hover:bg-gold-500 group-hover:text-navy-900">
              <ExpandIcon className="h-3.5 w-3.5" aria-hidden />
              Enlarge
            </span>
          </button>
        </div>

        <div className="flex flex-col gap-3 border-t border-navy-100 px-5 py-4 dark:border-navy-700 sm:flex-row sm:flex-wrap sm:items-center sm:px-6 sm:py-5">
          <Button variant="primary" size="md" onClick={downloadMap} className="sm:min-w-[200px]">
            <DownloadIcon className="h-4 w-4" aria-hidden />
            {margallaMasterPlanMap.ctaDownload}
          </Button>
          {showProjectLink ? (
            <Link to={`${MARGALLA_PROJECT_PATH}#master-plan`} className="sm:flex-1">
              <Button variant="outline" size="md" className="w-full">
                <MapIcon className="h-4 w-4" aria-hidden />
                {margallaMasterPlanMap.ctaView}
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="md" onClick={() => setLightbox(true)} className="sm:flex-1">
              <MapIcon className="h-4 w-4" aria-hidden />
              {margallaMasterPlanMap.ctaView}
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-950/95 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Master plan full size"
            onClick={() => setLightbox(false)}
          >
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-cream hover:bg-white/20"
              aria-label="Close"
            >
              <XIcon className="h-6 w-6" />
            </button>
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              src={MARGALLA_MASTER_PLAN_IMAGE}
              alt={margallaMasterPlanMap.alt}
              className="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div
              className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <Button variant="primary" size="sm" onClick={downloadMap}>
                <DownloadIcon className="h-4 w-4" />
                Download
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
