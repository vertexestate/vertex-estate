import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig';

/**
 * Sends page_view on client-side route changes (gtag in index.html only fires on first load).
 */
export function GoogleAnalytics() {
  const { pathname, search } = useLocation();
  const measurementId = siteConfig.googleAnalyticsId;

  useEffect(() => {
    if (!measurementId || typeof window.gtag !== 'function') return;
    window.gtag('config', measurementId, {
      page_path: pathname + search,
    });
  }, [pathname, search, measurementId]);

  return null;
}
