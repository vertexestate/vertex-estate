/** Vertex Estate × DHA Margalla Orchards — official promo imagery */

/** Primary brand promo used across the site (no stock house photos). */
export const VERTEX_BRAND_PROMO = '/brand/vertex-dha-margalla-promo.png';

export const MARGALLA_HERO_IMAGE = VERTEX_BRAND_PROMO;
export const MARGALLA_HERO_FALLBACK = VERTEX_BRAND_PROMO;

/** Official-style master plan layout (blocks, roads, plot sizes) */
export const MARGALLA_MASTER_PLAN_IMAGE = '/brand/margalla-orchards-master-plan.png';

export const margallaMasterPlanMap = {
  title: 'DHA Margalla Orchards map and master plan',
  subtitle:
    'Download the full map to see all blocks, plot sizes, roads, parks, and commercial zones.',
  ctaDownload: 'Download map',
  ctaView: 'View blocks and plot sizes',
  alt: 'DHA Margalla Orchards master plan with blocks, roads, parks, and nearby landmarks',
};

export const MARGALLA_GALLERY = [
  {
    src: VERTEX_BRAND_PROMO,
    title: 'DHA Margalla Orchard',
    caption: 'Park Road, Islamabad — Vertex Estate',
  },
] as const;

export const MARGALLA_AMENITIES = [
  {
    title: 'Gated community',
    description: '24/7 security, controlled entry, and DHA-standard planning.',
  },
  {
    title: 'Wide roads and utilities',
    description: 'Underground electrification, water, and sewerage as per DHA norms.',
  },
  {
    title: 'Parks and green belts',
    description: 'Landscaped central areas and neighbourhood parks for families.',
  },
  {
    title: 'Near COMSATS',
    description: 'Park Road location opposite COMSATS University Islamabad.',
  },
] as const;

export const MARGALLA_LOCATION_HIGHLIGHTS = [
  {
    label: 'COMSATS University',
    detail: 'Opposite Park Road',
  },
  {
    label: 'Margalla Hills',
    detail: 'Panoramic backdrop',
  },
  {
    label: 'Islamabad access',
    detail: 'F-7 and Blue Area are minutes away',
  },
] as const;
