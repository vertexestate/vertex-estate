import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig';

/**
 * Loads the Meta (Facebook) Pixel base code once, then tracks PageView on every
 * client-side route change (SPA navigations don't reload index.html).
 * No-ops when `VITE_META_PIXEL_ID` is unset.
 */
export function MetaPixel() {
  const { pathname, search } = useLocation();
  const pixelId = siteConfig.metaPixelId;
  const initialized = useRef(false);

  useEffect(() => {
    if (!pixelId || typeof window === 'undefined') return;

    if (!window.fbq) {
      /* Standard Meta Pixel bootstrap snippet (queues calls until fbevents.js loads). */
      const n: NonNullable<Window['fbq']> = function (...args: unknown[]) {
        if (n.callMethod) {
          n.callMethod(...args);
        } else {
          n.queue?.push(args);
        }
      } as NonNullable<Window['fbq']>;
      n.queue = [];
      n.loaded = true;
      n.version = '2.0';
      window.fbq = n;
      if (!window._fbq) window._fbq = n;

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);
    }

    if (!initialized.current) {
      window.fbq?.('init', pixelId);
      initialized.current = true;
    }
  }, [pixelId]);

  useEffect(() => {
    if (!pixelId || typeof window.fbq !== 'function' || !initialized.current) return;
    window.fbq('track', 'PageView');
  }, [pathname, search, pixelId]);

  return null;
}
