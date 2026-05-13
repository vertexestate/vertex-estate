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

export function Footer() {
  const [email, setEmail] = useState('');
  const [social, setSocial] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
  });
  const [newsletterStatus, setNewsletterStatus] = useState<
    'idle' | 'sending' | 'ok' | 'err'
  >('idle');
  const [newsletterMsg, setNewsletterMsg] = useState<string | null>(null);

  useEffect(() => {
    loadSiteContact().then((c) => {
      if (c?.social) {
        setSocial({
          facebook: c.social.facebook || '',
          twitter: c.social.twitter || '',
          instagram: c.social.instagram || '',
          linkedin: c.social.linkedin || '',
        });
      }
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
      siteConfig.apiBaseUrl
        ? 'Thanks — you are subscribed.'
        : 'Saved — connect VITE_API_BASE_URL to send this to your server (also stored in this browser until then).'
    );
    setEmail('');
  };

  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 dark:bg-navy-950 text-cream pt-16 pb-8">
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
                { href: social.facebook, Icon: FacebookIcon, label: 'Facebook' },
                { href: social.twitter, Icon: TwitterIcon, label: 'Twitter' },
                { href: social.instagram, Icon: InstagramIcon, label: 'Instagram' },
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
