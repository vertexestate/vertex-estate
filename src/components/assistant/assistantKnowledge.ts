import { margallaFaq, MARGALLA_PROJECT_PATH } from '../../data/margallaOrchardsContent';
import { siteConfig } from '../../config/siteConfig';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

export const ASSISTANT_PLOT_SIZES = ['10 Marla', '14 Marla', '1 Kanal'] as const;

export const assistantSiteFacts = {
  brand: siteConfig.siteName,
  focus:
    'DHA Margalla Orchards (Margalla Orchards Islamabad) on Park Road, opposite COMSATS University, Chak Shehzad, CDA Zone 4.',
  plotSizes:
    'Residential plots: 10 Marla (250 sq yds), 14 Marla (356 sq yds), and 1 Kanal (500 sq yds). Commercial at Margalla Orchards Walk.',
  developers: 'DHA Islamabad-Rawalpindi with SCBAP and FGEHA.',
  noc: 'CDA NOC approved, DHA supervised, CDA Zone 4.',
  payment:
    'Residential plots are typically full cash. Commercial may have limited installments. Current rates are shared on WhatsApp.',
  office: `${siteConfig.vertexOfficeAddress} (F-7 Markaz, Islamabad).`,
  whatsappNote:
    'We do not list PKR prices on the website. Message our team on WhatsApp for today’s block-wise rates and availability.',
} as const;

export function getWhatsAppAction(label = 'Chat on WhatsApp', message?: string) {
  return {
    type: 'whatsapp' as const,
    label,
    href: buildWhatsAppUrl(message),
  };
}

export function getProjectGuideAction(label = 'Open project guide') {
  return {
    type: 'link' as const,
    label,
    href: MARGALLA_PROJECT_PATH,
  };
}

export function getProjectSectionAction(
  section: string,
  label: string
) {
  return {
    type: 'link' as const,
    label,
    href: `${MARGALLA_PROJECT_PATH}#${section}`,
  };
}

/** Short answers keyed by topic for the assistant. */
export const assistantTopicAnswers: Record<string, string> = {
  overview: `${assistantSiteFacts.brand} helps buyers at ${assistantSiteFacts.focus} ${assistantSiteFacts.plotSizes} ${assistantSiteFacts.developers}`,
  location: `Margalla Orchards is on Main Park Road, Chak Shehzad, opposite COMSATS University. Nearby: Taramri Chowk (~1 min), Park Enclave (~3 min), Bahria Enclave (~12 min), Faisal Mosque (~22 min), Islamabad Airport (~30 min).`,
  noc: `${assistantSiteFacts.noc} Allotment letters are accepted by major banks. ${assistantSiteFacts.whatsappNote}`,
  plots: `Choose ${ASSISTANT_PLOT_SIZES.join(', ')}. ${assistantSiteFacts.payment}`,
  amenities:
    'Gated 24/7 security, sports courts, parks, underground utilities, mosques, and planned schools/clinics. COMSATS is right on Park Road.',
  commercial:
    'Margalla Orchards Walk is the commercial belt (from 5 Marla / 8 Marla plots, LG+G+5 height, Spanish-style architecture). Ask on WhatsApp for commercial booking.',
  investment:
    'Buyers choose Margalla Orchards for the DHA name, Park Road growth, government partners, CDA approval, limited plot supply, and visible infrastructure on site.',
  visit:
    'Site visits can be arranged. Share your preferred date on WhatsApp and we will suggest blocks and routes.',
  contact: `Office: ${assistantSiteFacts.office} You can also use the Contact page or WhatsApp for the fastest reply.`,
  pricing: assistantSiteFacts.whatsappNote,
};

export function findFaqAnswer(userText: string): string | undefined {
  const t = userText.toLowerCase();
  const entry = margallaFaq.find((item) => {
    const q = item.q.toLowerCase();
    const words = q.split(/\W+/).filter((w) => w.length > 3);
    return words.some((w) => t.includes(w));
  });
  return entry?.a;
}
