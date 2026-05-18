import { useEffect } from 'react';
import type { PageSeoInput } from '../config/seoConfig';
import { applyPageSeo } from '../lib/pageSeo';

export function usePageSeo(meta: PageSeoInput | null | undefined) {
  useEffect(() => {
    if (!meta) return;
    applyPageSeo(meta);
  }, [
    meta?.title,
    meta?.description,
    meta?.keywords,
    meta?.path,
    meta?.image,
    meta?.type,
    meta?.noindex,
  ]);
}
