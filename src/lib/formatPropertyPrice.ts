import type { Property } from '../types';

function trimTrailingZeros(s: string) {
  return s.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
}

/** Formats sale/rent for PKR (default) or legacy USD. */
export function formatPropertyPrice(
  property: Pick<Property, 'price' | 'type' | 'priceCurrency'>
): string {
  const cur = property.priceCurrency ?? 'PKR';

  if (cur === 'USD') {
    if (property.type === 'rent') {
      return `$${property.price.toLocaleString('en-US')}/mo`;
    }
    return `$${(property.price / 1_000_000).toFixed(2)}M`;
  }

  if (property.type === 'rent') {
    return `Rs. ${property.price.toLocaleString('en-PK')}/mo`;
  }

  const p = property.price;
  if (p >= 10_000_000) {
    const cr = p / 10_000_000;
    const s = trimTrailingZeros(
      cr >= 100 ? cr.toFixed(0) : Number.isInteger(cr) ? String(cr) : cr.toFixed(2)
    );
    return `Rs. ${s} Crore`;
  }
  if (p >= 100_000) {
    const lk = p / 100_000;
    const s = trimTrailingZeros(
      lk >= 100 ? lk.toFixed(0) : Number.isInteger(lk) ? String(lk) : lk.toFixed(2)
    );
    return `Rs. ${s} Lakh`;
  }
  return `Rs. ${p.toLocaleString('en-PK')}`;
}
