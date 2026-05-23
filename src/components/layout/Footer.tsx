import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { BrandMark } from './BrandMark';
import { siteConfig } from '../../config/siteConfig';
import { loadSiteContact } from '../../lib/siteContactCache';
import { submitNewsletterEmail } from '../../lib/submissions';

function TikTokGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const defaultSocial = {
  facebook: '',
  twitter: '',
  instagram: 'https://www.instagram.com/vertexestate0/',
  tiktok: 'https://www.tiktok.com/@vertexestate0?is_from_webapp=1&sender_device=pc',
  linkedin: '',
};

export function Footer() {
  const [email, setEmail] = useState('');
  const [social, setSocial] = useState(defaultSocial);
  const [newsletterStatus, setNewsletterStatus] = useState<
    'idle' | 'sending' | 'ok' | 'err'
  >('idle');
  const [newsletterMsg, setNewsletterMsg] = useState<string | null>(null);

  useEffect(() => {
    loadSiteContact().then((c) => {
      if (!c?.social) return;
      setSocial((prev) => ({
        ...prev,
        facebook: c.social!.facebook || prev.facebook,
        twitter: c.social!.twitter || prev.twitter,
        instagram: c.social!.instagram || prev.instagram,
        tiktok: c.social!.tiktok || prev.tiktok,
        linkedin: c.social!.linkedin || prev.linkedin,
      }));
    });
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterMsg(null);
    setNewsletterStatus('sending');
    const res = await submitNewsletterEmail(email);
    if (!res.ok) {
      setNewsletterStatus('err');
      setNewsletterMsg(res.error);
      return;
    }
    setNewsletterStatus('ok');
    setNewsletterMsg(
      res.mode === 'offline'
        ? 'Queued on this device. Run the API with MONGODB_URI so signups sync to MongoDB.'
        : 'Thanks, you are subscribed.'
    );
    setEmail('');
  };

  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] pt-12 text-cream dark:bg-navy-950 sm:pt-16 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="mb-6">
              <BrandMark size="lg" tone="dark" />
            </div>
            <p className="text-navy-300 mb-6">
              Your trusted partner in finding the perfect property. Luxury, trust, and modern
              technology combined.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { href: social.instagram, Icon: InstagramIcon, label: 'Instagram' },
                { href: social.tiktok, Icon: TikTokGlyph, label: 'TikTok' },
                { href: social.facebook, Icon: FacebookIcon, label: 'Facebook' },
                { href: social.twitter, Icon: TwitterIcon, label: 'Twitter' },
                { href: social.linkedin, Icon: LinkedinIcon, label: 'LinkedIn' },
              ].map(({ href, Icon, label }) =>
                href ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="p-2 bg-navy-800 rounded-lg hover:bg-gold-500 hover:text-navy-900 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ) : (
                  <span
                    key={label}
                    className="p-2 bg-navy-800 rounded-lg opacity-35"
                    aria-hidden
                    title={`Add ${label} URL in /site/contact.json`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                )
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-display font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-navy-300 hover:text-gold-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/listings"
                  className="text-navy-300 hover:text-gold-500 transition-colors"
                >
                  Listings
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-navy-300 hover:text-gold-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-navy-300 hover:text-gold-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-navy-300 hover:text-gold-500 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-display font-bold mb-6">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/listings" className="text-navy-300 hover:text-gold-500 transition-colors">
                  Buy Property
                </Link>
              </li>
              <li>
                <Link to="/listings" className="text-navy-300 hover:text-gold-500 transition-colors">
                  Rent Property
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-navy-300 hover:text-gold-500 transition-colors">
                  Sell Property
                </Link>
              </li>
              <li>
                <a href="#" className="text-navy-300 hover:text-gold-500 transition-colors">
                  Property Management
                </a>
              </li>
              <li>
                <a href="#" className="text-navy-300 hover:text-gold-500 transition-colors">
                  Investment Advisory
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-display font-bold mb-6">Newsletter</h3>
            <p className="text-navy-300 mb-4">
              Subscribe to get the latest property listings and market insights.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {newsletterMsg && (
                <p
                  className={`text-sm ${newsletterStatus === 'err' ? 'text-red-400' : 'text-gold-300'}`}
                >
                  {newsletterMsg}
                </p>
              )}
              <Button type="submit" variant="primary" className="w-full" disabled={newsletterStatus === 'sending'}>
                {newsletterStatus === 'sending' ? 'Sending…' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-navy-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-navy-400 text-sm">
              © {year} {siteConfig.siteName}. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-navy-400 hover:text-gold-500 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-navy-400 hover:text-gold-500 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-navy-400 hover:text-gold-500 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
