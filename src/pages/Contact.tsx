import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  MessageSquareIcon,
  CalendarIcon,
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { siteConfig } from '../config/siteConfig';
import { loadSiteContact } from '../lib/siteContactCache';
import { submitContactMessage } from '../lib/submissions';
import type { SiteContactOffice, SiteQuickAction } from '../types/siteFiles';

type QuickActionRow = {
  icon: typeof MessageSquareIcon;
  label: string;
  value: string;
  href: string;
  color: string;
};

const defaultOffices: SiteContactOffice[] = [
  {
    city: 'New York',
    address: '432 Park Avenue, Suite 1500',
    phone: '+1 (555) 123-4567',
    email: 'ny@vertexestate.com',
  },
  {
    city: 'Los Angeles',
    address: '9876 Wilshire Blvd, Suite 200',
    phone: '+1 (555) 234-5678',
    email: 'la@vertexestate.com',
  },
  {
    city: 'Miami',
    address: '1500 Biscayne Blvd, Floor 10',
    phone: '+1 (555) 345-6789',
    email: 'miami@vertexestate.com',
  },
];

const defaultQuickActions: QuickActionRow[] = [
  {
    icon: MessageSquareIcon,
    label: 'WhatsApp',
    value: '+1 (555) 999-0000',
    href: 'https://wa.me/15559990000',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: MailIcon,
    label: 'Email',
    value: 'contact@vertexestate.com',
    href: 'mailto:contact@vertexestate.com',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: PhoneIcon,
    label: 'Call Us',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: CalendarIcon,
    label: 'Schedule',
    value: 'Book a Call',
    href: '#',
    color: 'from-gold-500 to-gold-600',
  },
];

const iconByKey: Record<
  NonNullable<SiteQuickAction['icon']>,
  typeof MessageSquareIcon
> = {
  message: MessageSquareIcon,
  mail: MailIcon,
  phone: PhoneIcon,
  calendar: CalendarIcon,
};

function quickActionsFromFile(raw: SiteQuickAction[]): QuickActionRow[] {
  return raw.map((a) => ({
    icon: (a.icon && iconByKey[a.icon]) || MailIcon,
    label: a.label,
    value: a.value,
    href: a.href,
    color: a.color || 'from-gold-500 to-gold-600',
  }));
}

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [resolved, setResolved] = useState({
    offices: defaultOffices,
    quickActions: defaultQuickActions,
    mapSrc: siteConfig.mapEmbedUrl,
  });

  useEffect(() => {
    loadSiteContact().then((c) => {
      if (!c) return;
      setResolved({
        offices: c.offices?.length ? c.offices : defaultOffices,
        quickActions: c.quickActions?.length
          ? quickActionsFromFile(c.quickActions)
          : defaultQuickActions,
        mapSrc: (c.mapEmbedUrl && c.mapEmbedUrl.trim()) || siteConfig.mapEmbedUrl,
      });
    });
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.message) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSendError(null);
    setIsSending(true);
    const res = await submitContactMessage(formData);
    setIsSending(false);
    if (!res.ok) {
      setSendError(res.error);
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setIsSubmitted(false);
    }, 3000);
  };

  const { offices, quickActions, mapSrc } = resolved;

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-navy-900 dark:text-cream mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-navy-600 dark:text-navy-400 max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to us anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {quickActions.map((action, index) => (
            <motion.a
              key={`${action.label}-${action.href}`}
              href={action.href}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.1,
              }}
              whileHover={{
                y: -4,
              }}
              className="block"
            >
              <div
                className={`bg-gradient-to-br ${action.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all`}
              >
                <action.icon className="w-8 h-8 mb-4" />
                <h3 className="text-lg font-bold mb-1">{action.label}</h3>
                <p className="text-sm opacity-90">{action.value}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-cream mb-6">
              Send us a Message
            </h2>
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-navy-900 dark:text-cream mb-2">
                  Message Sent!
                </h3>
                <p className="text-navy-600 dark:text-navy-400">
                  We'll get back to you as soon as possible.
                </p>
                {!siteConfig.apiBaseUrl && (
                  <p className="mt-4 text-sm text-navy-500 dark:text-navy-400">
                    API URL is not configured yet — your message was queued in this
                    browser (see localStorage key <code className="text-gold-500">vertex-lead-queue</code>
                    ) until your backend is connected.
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {sendError && (
                  <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                    {sendError}
                  </p>
                )}
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  error={errors.name}
                />

                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  error={errors.email}
                />

                <Input
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                  error={errors.phone}
                />

                <Select
                  label="Subject"
                  options={[
                    {
                      value: '',
                      label: 'Select a subject',
                    },
                    {
                      value: 'buying',
                      label: 'Buying Property',
                    },
                    {
                      value: 'selling',
                      label: 'Selling Property',
                    },
                    {
                      value: 'renting',
                      label: 'Renting Property',
                    },
                    {
                      value: 'general',
                      label: 'General Inquiry',
                    },
                  ]}
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subject: e.target.value,
                    })
                  }
                  error={errors.subject}
                />

                <div>
                  <label className="block text-sm font-medium text-navy-700 dark:text-cream mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        message: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 rounded-lg border-2 border-navy-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-900 dark:text-cream placeholder-navy-400 dark:placeholder-navy-500 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all ${errors.message ? 'border-red-500' : ''}`}
                  />

                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  size="lg"
                  disabled={isSending}
                >
                  {isSending ? 'Sending…' : 'Send Message'}
                </Button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="space-y-8"
          >
            <div className="bg-white dark:bg-navy-800 rounded-2xl overflow-hidden shadow-xl h-96">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                }}
                allowFullScreen
                loading="lazy"
                title="Office Location"
              />
            </div>

            <div className="bg-white dark:bg-navy-800 rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-display font-bold text-navy-900 dark:text-cream mb-6">
                Office Locations
              </h3>
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <div
                    key={`${office.city}-${index}`}
                    className="pb-6 border-b border-navy-200 dark:border-navy-700 last:border-0 last:pb-0"
                  >
                    <h4 className="text-lg font-bold text-navy-900 dark:text-cream mb-3">
                      {office.city}
                    </h4>
                    <div className="space-y-2 text-navy-600 dark:text-navy-400">
                      <div className="flex items-start gap-2">
                        <MapPinIcon className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                        <span>{office.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-5 h-5 text-gold-500" />
                        <a
                          href={`tel:${office.phone.replace(/\s/g, '')}`}
                          className="hover:text-gold-500 transition-colors"
                        >
                          {office.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <MailIcon className="w-5 h-5 text-gold-500" />
                        <a
                          href={`mailto:${office.email}`}
                          className="hover:text-gold-500 transition-colors"
                        >
                          {office.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
