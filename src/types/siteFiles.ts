import type { Testimonial } from './index';

export interface SiteContactOffice {
  city: string;
  address: string;
  phone: string;
  email: string;
}

export interface SiteQuickAction {
  label: string;
  value: string;
  href: string;
  /** Maps to Lucide icon on the contact page */
  icon?: 'message' | 'mail' | 'phone' | 'calendar';
  /** Tailwind gradient classes e.g. from-green-500 to-green-600 */
  color?: string;
}

export interface SiteContactFile {
  /** Google Maps iframe src — overrides VITE_MAP_EMBED_URL when set */
  mapEmbedUrl?: string;
  offices?: SiteContactOffice[];
  quickActions?: SiteQuickAction[];
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    tiktok?: string;
    linkedin?: string;
  };
}

export interface SiteStatsFile {
  stats?: Array<{
    label: string;
    value: number;
    suffix?: string;
  }>;
}

export interface SiteTestimonialsFile {
  testimonials?: Testimonial[];
}
