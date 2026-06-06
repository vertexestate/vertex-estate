/** DHA Margalla Orchards — structured project information for the info hub */

export const MARGALLA_PROJECT_PATH = '/dha-margalla-orchards';

export type MargallaSectionId =
  | 'overview'
  | 'developers'
  | 'location'
  | 'noc'
  | 'master-plan'
  | 'amenities'
  | 'commercial'
  | 'pricing'
  | 'investment'
  | 'plots'
  | 'faq';

export type MargallaNavItem = {
  id: MargallaSectionId;
  label: string;
  shortLabel?: string;
};

export const margallaNavItems: MargallaNavItem[] = [
  { id: 'overview', label: 'About', shortLabel: 'About' },
  { id: 'developers', label: 'Developers' },
  { id: 'location', label: 'Location' },
  { id: 'noc', label: 'NOC and legal' },
  { id: 'master-plan', label: 'Master Plan' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'pricing', label: 'WhatsApp' },
  { id: 'investment', label: 'Why Invest' },
  { id: 'plots', label: 'Plots' },
  { id: 'faq', label: 'FAQ' },
];

export const margallaHero = {
  title: 'Margalla Orchards Islamabad',
  subtitle: 'DHA Housing Society',
  summary:
    'Margalla Orchards is a DHA-supervised housing society on Park Road, Islamabad, opposite COMSATS University. Choose from 10 Marla, 14 Marla, and 1 Kanal plots, developed by DHA Islamabad with SCBAP and FGEHA.',
  imageAlt: 'DHA Margalla Orchards on Park Road, Islamabad',
};

export const margallaOverview = {
  eyebrow: 'What is Margalla Orchards?',
  title: 'A DHA-backed housing society in Islamabad',
  paragraphs: [
    'Margalla Orchards (also called DHA Margalla Orchard) sits in Chak Shehzad on Park Road. DHA Islamabad-Rawalpindi works with SCBAP and FGEHA to deliver the project.',
    'You can buy residential plots in three sizes: 10 Marla (250 sq yds), 14 Marla (356 sq yds), and 1 Kanal (500 sq yds). Commercial plots are also available at Margalla Orchards Walk. The society covers roughly 2,200 acres with thousands of residential plots.',
    'To reserve a plot, contact Vertex Estate with your CNIC, passport photos, and booking amount. Overseas buyers can use NICOP.',
  ],
  plotSizes: ['10 Marla', '14 Marla', '1 Kanal', 'Commercial plots'],
};

export const margallaDevelopers = {
  title: 'Who is developing the project?',
  body: 'Three government-linked bodies are behind Margalla Orchards. DHA Islamabad-Rawalpindi leads supervision and infrastructure. SCBAP and FGEHA contribute land as joint venture partners.',
  partners: [
    {
      name: 'DHA Islamabad-Rawalpindi',
      role: 'Supervision and infrastructure',
    },
    {
      name: 'SCBAP',
      role: 'Supreme Court Bar Association of Pakistan (land partner)',
    },
    {
      name: 'FGEHA',
      role: 'Federal Government Employees Housing Authority (land partner)',
    },
  ],
};

export const margallaLocation = {
  title: 'Location on Park Road',
  subtitle: 'Opposite COMSATS University',
  description:
    'The society is on Main Park Road in Chak Shehzad, directly across from COMSATS University. You can reach it via Islamabad Expressway, Kashmir Highway, Kuri Road, or Murree Road. It falls in CDA Zone 4.',
  advantages: [
    { icon: '📍', text: 'Main Park Road, CDA Zone 4, Chak Shehzad' },
    { icon: '🎓', text: 'COMSATS University at the main gate' },
    { icon: '🌿', text: 'Park Enclave, about 3 minutes' },
    { icon: '🕌', text: 'Faisal Mosque, about 22 minutes' },
    { icon: '✈️', text: 'Islamabad Airport, about 30 minutes' },
  ],
  landmarks: [
    { place: 'COMSATS University Islamabad', time: 'Opposite', notes: 'Park Road frontage' },
    { place: 'Park Enclave', time: '~3 min', notes: 'Residential enclave' },
    { place: 'Bahria Enclave', time: '~12 min', notes: 'Via Kuri Road' },
    { place: 'Blue Area', time: '~10 min', notes: 'Business district' },
    { place: 'Faisal Mosque', time: '~22 min', notes: 'Kashmir Highway route' },
    { place: 'Islamabad International Airport', time: '~30 min', notes: 'Via Expressway' },
  ],
};

export const margallaNoc = {
  title: 'NOC and legal status',
  subtitle: 'CDA approved and DHA supervised',
  items: [
    {
      title: 'CDA NOC approved',
      body: 'The project holds a Capital Development Authority (CDA) NOC and is registered in CDA Zone 4. Approval was confirmed in 2022 under Islamabad Capital Territory rules.',
    },
    {
      title: 'DHA supervised',
      body: 'DHA Islamabad-Rawalpindi oversees development. Allotment letters are accepted by major banks and government offices nationwide.',
    },
    {
      title: 'Government partners',
      body: 'DHA, SCBAP, and FGEHA back the scheme together. The project was earlier known as Park Road Housing Scheme.',
    },
  ],
};

export const margallaMasterPlan = {
  title: 'DHA Margalla Orchards map and master plan',
  subtitle:
    'Download the full map to see every block, plot size, road, park, and commercial zone across 8,402+ kanals.',
  stats: [
    { value: '8,402+', label: 'Total kanals' },
    { value: '4,013+', label: 'Residential plots' },
    { value: 'A–H', label: 'Blocks' },
    { value: '~2,200', label: 'Acres (approx.)' },
  ],
  features: [
    'Block-wise layout',
    '10 Marla, 14 Marla, and 1 Kanal marked',
    'Road network and access routes',
    'Parks and amenity areas',
    'Mosques and community facilities',
    'Main entrance and boundaries',
  ],
  plotDistribution: [
    { size: '1 Kanal', count: '3,104', pct: '65%' },
    { size: '14 Marla', count: '900', pct: '19%' },
    { size: '10 Marla', count: '777', pct: '16%' },
  ],
};

export const margallaAmenities = [
  {
    title: '24/7 gated security',
    body: 'Manned entry points, CCTV on main roads, and round-the-clock DHA security. The main gate is about 180 feet wide.',
  },
  {
    title: 'Sports and recreation',
    body: 'Tennis and basketball courts, cricket grounds, jogging tracks, walking trails, and play areas in green belts.',
  },
  {
    title: 'Parks and green belts',
    body: 'Tree-lined streets and open parks in every block, with Margalla Hills close by.',
  },
  {
    title: 'Health and education',
    body: 'Clinics and schools are planned inside the society. COMSATS University is right on Park Road.',
  },
  {
    title: 'Underground utilities',
    body: 'Power, gas, water, and sewerage run underground. Roads are carpeted with street lighting.',
  },
  {
    title: 'Mosques and community spaces',
    body: 'Mosques in several blocks plus community areas for neighbourhood events.',
  },
];

export const margallaCommercial = {
  title: 'Margalla Orchards Walk (commercial)',
  body: 'A DHA-supervised commercial belt with Spanish-style architecture. Sizes start from 5 Marla (133 sq yds) and 8 Marla (200 sq yds). LG+G+5 construction is allowed. Commercial may have installment options; residential plots are full cash only.',
  highlights: [
    'Spanish architecture',
    'DHA supervised',
    'LG+G+5 height',
    'Ask our team for current booking',
  ],
};

export const margallaPlotInquiry = {
  title: 'Plot sizes and booking',
  note: 'Residential plots are full cash. Rates depend on block and position. Message us on WhatsApp for today’s quote and availability.',
  rows: [
    { size: '10 Marla', dimensions: '32×70 ft', payment: 'Full cash' },
    { size: '14 Marla', dimensions: '40×80 ft', payment: 'Full cash' },
    { size: '1 Kanal', dimensions: '50×90 ft', payment: 'Full cash' },
  ],
};

export const margallaInvestmentReasons = [
  {
    title: 'Trusted DHA name',
    body: 'DHA developments across Pakistan hold value well and attract serious buyers at resale.',
  },
  {
    title: 'Park Road growth',
    body: 'COMSATS, embassies, and new commercial activity keep this corridor in demand.',
  },
  {
    title: 'Strong institutional backing',
    body: 'DHA, SCBAP, and FGEHA reduce the risk you see with small private schemes.',
  },
  {
    title: 'Clear CDA approval',
    body: 'You can build and resell with confidence. Banks accept DHA allotment letters for financing.',
  },
  {
    title: 'Limited plot supply',
    body: 'A fixed number of residential plots means steady demand from members and nearby workers.',
  },
  {
    title: 'Work already on the ground',
    body: 'Roads, utilities, and boundary walls are in place so you can plan construction sooner.',
  },
];

export const margallaSamplePlots = [
  {
    title: '10 Marla in Block E',
    detail: '250 sq yds, 32×70 ft, full cash',
    block: 'Block E',
    plotSize: '10 Marla',
  },
  {
    title: '14 Marla in Block A',
    detail: '356 sq yds, 40×80 ft, full cash',
    block: 'Block A',
    plotSize: '14 Marla',
  },
  {
    title: '1 Kanal in Block A',
    detail: '500 sq yds, 50×90 ft, full cash',
    block: 'Block A',
    plotSize: '1 Kanal',
  },
];

export const margallaFaq = [
  {
    q: 'What is DHA Margalla Orchards?',
    a: 'It is a DHA-supervised society in Chak Shehzad on Park Road, opposite COMSATS University, with 10 Marla, 14 Marla, and 1 Kanal plots.',
  },
  {
    q: 'What plot sizes are available?',
    a: 'Residential plots are 10 Marla, 14 Marla, and 1 Kanal. Commercial plots are sold at Margalla Orchards Walk.',
  },
  {
    q: 'How do I get current rates?',
    a: 'Message Vertex Estate on WhatsApp with your preferred plot size. We share today’s block-wise rates and what is available.',
  },
  {
    q: 'What payment options are available?',
    a: 'Residential plots are full cash. Commercial may have limited installments. Our team will confirm current terms.',
  },
  {
    q: 'Where is it located?',
    a: 'Main Park Road, Chak Shehzad, CDA Zone 4, opposite COMSATS University.',
  },
  {
    q: 'What amenities are available?',
    a: 'Gated security, sports facilities, parks, underground utilities, mosques, planned schools and clinics, plus the commercial walk.',
  },
  {
    q: 'Is it approved and legal?',
    a: 'Yes. It has CDA NOC approval and DHA supervision with government joint venture partners.',
  },
  {
    q: 'Can I visit before buying?',
    a: 'Yes. Book a site visit with Vertex Estate and we will show you available blocks.',
  },
  {
    q: 'Which blocks have which plot sizes?',
    a: 'Blocks A to H mix sizes. For example, 10 Marla in Block E and larger plots in Block A. Availability changes weekly.',
  },
  {
    q: 'Why do people invest here?',
    a: 'DHA branding, Park Road growth, legal clarity, limited supply, and infrastructure that is already visible on site.',
  },
];
