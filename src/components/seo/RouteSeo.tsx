import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { applyPageSeo } from '../../lib/pageSeo';
import { getSeoForPath } from '../../config/seoConfig';

/** Updates document meta tags on every route change. */
export function RouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    applyPageSeo(getSeoForPath(pathname));
  }, [pathname]);

  return null;
}
