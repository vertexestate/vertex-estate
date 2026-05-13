import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig';

type BrandMarkProps = {
  className?: string;
  /** Larger logo in footer */
  size?: 'default' | 'lg' | 'nav';
  /** Use on dark backgrounds (footer) for readable text */
  tone?: 'light' | 'dark';
};

export function BrandMark({
  className = '',
  size = 'default',
  tone = 'light',
}: BrandMarkProps) {
  const box =
    size === 'lg' ? 'h-12 w-12 text-2xl' : 'h-10 w-10 text-xl';
  const textSize =
    size === 'lg' || size === 'nav' ? 'text-2xl' : 'text-xl';
  const nameColor =
    tone === 'dark'
      ? 'text-cream'
      : 'text-navy-900 dark:text-cream';

  return (
    <Link to="/" className={`flex items-center space-x-2 ${className}`}>
      {siteConfig.logoUrl ? (
        <img
          src={siteConfig.logoUrl}
          alt={siteConfig.siteName}
          width={size === 'lg' ? 48 : 40}
          height={size === 'lg' ? 48 : 40}
          className={`${size === 'lg' ? 'h-12 w-12' : 'h-10 w-10'} object-contain`}
          decoding="async"
        />
      ) : (
        <div
          className={`flex ${box} flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500 to-gold-600`}
        >
          <span className="font-display font-bold text-navy-900">
            {siteConfig.siteName.trim().charAt(0).toUpperCase() || 'V'}
          </span>
        </div>
      )}
      <span className={`font-display font-bold ${nameColor} ${textSize}`}>
        {siteConfig.siteName}
      </span>
    </Link>
  );
}
