/** Margalla Orchards / DHA project imagery for home page sections */

export const MARGALLA_HERO_IMAGE = '/brand/margalla-orchards-hero.png';

export const MARGALLA_HERO_FALLBACK =
  'https://dhamargallaorchard.com/assets/images/margalla-orchards-main-1200.webp';

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
    src: MARGALLA_HERO_IMAGE,
    fallback: MARGALLA_HERO_FALLBACK,
    title: 'Park Road frontage',
    caption: 'DHA Margalla Orchard main avenue',
  },
  {
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop&q=85',
    title: 'Modern villas',
    caption: 'Contemporary two-storey homes',
  },
  {
    src: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=800&fit=crop&q=85',
    title: 'Tree-lined streets',
    caption: 'Planned boulevards and landscaping',
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&q=85',
    title: 'Margalla views',
    caption: 'Hills backdrop from Park Road',
  },
  {
    src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=800&fit=crop&q=85',
    title: 'Plot ownership',
    caption: '10 Marla, 14 Marla, and 1 Kanal',
  },
] as const;

export const MARGALLA_AMENITIES = [
  {
    title: 'Gated community',
    description: '24/7 security, controlled entry, and DHA-standard planning.',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=85',
  },
  {
    title: 'Wide roads and utilities',
    description: 'Underground electrification, water, and sewerage as per DHA norms.',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&q=85',
  },
  {
    title: 'Parks and green belts',
    description: 'Landscaped central areas and neighbourhood parks for families.',
    image:
      'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=800&h=600&fit=crop&q=85',
  },
  {
    title: 'Near COMSATS',
    description: 'Park Road location opposite COMSATS University Islamabad.',
    image:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop&q=85',
  },
] as const;

export const MARGALLA_LOCATION_HIGHLIGHTS = [
  {
    label: 'COMSATS University',
    detail: 'Opposite Park Road',
    image:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&h=700&fit=crop&q=85',
  },
  {
    label: 'Margalla Hills',
    detail: 'Panoramic backdrop',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=700&fit=crop&q=85',
  },
  {
    label: 'Islamabad access',
    detail: 'F-7 and Blue Area are minutes away',
    image:
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&h=700&fit=crop&q=85',
  },
] as const;
