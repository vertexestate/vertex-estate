import { siteConfig } from '../config/siteConfig';

export function getWhatsAppPhoneDigits() {
  return siteConfig.whatsappPhone.replace(/\D/g, '');
}

export function buildWhatsAppUrl(message?: string) {
  const phone = getWhatsAppPhoneDigits();
  const text = encodeURIComponent(message ?? siteConfig.whatsappDefaultMessage);
  return `https://wa.me/${phone}?text=${text}`;
}

export function whatsAppMessageForPlot(plotSize?: string) {
  const size = plotSize?.trim();
  if (!size) return siteConfig.whatsappDefaultMessage;
  return `Hi ${siteConfig.siteName}! I am interested in a ${size} plot at DHA Margalla Orchards. Please share current availability and rates.`;
}

export function whatsAppMessageForProperty(title?: string) {
  if (!title?.trim()) return siteConfig.whatsappDefaultMessage;
  return `Hi ${siteConfig.siteName}! I saw "${title}" on your website and would like more details.`;
}
