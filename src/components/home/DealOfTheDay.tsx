import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ClockIcon,
  TrendingUpIcon,
  MapPinIcon,
  BedIcon,
  BathIcon,
  SquareIcon,
  ArrowRightIcon,
} from 'lucide-react';
import { properties } from '../../data/properties';
import { Button } from '../ui/Button';
import { WhatsAppContactButton } from '../ui/WhatsAppContactButton';
import { whatsAppMessageForProperty } from '../../lib/whatsapp';
export function DealOfTheDay() {
  const navigate = useNavigate();
  const luxuryDeals = properties.filter(
    (p) => p.type === 'luxury' || p.price >= 20000000
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  // Rotate deal every 8s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % luxuryDeals.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [luxuryDeals.length]);
  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds -= 1;
        if (seconds < 0) {
          seconds = 59;
          minutes -= 1;
        }
        if (minutes < 0) {
          minutes = 59;
          hours -= 1;
        }
        if (hours < 0) {
          hours = 23;
        }
        return {
          hours,
          minutes,
          seconds
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const deal = luxuryDeals[currentIndex];
  if (!deal) return null;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-gold-500/25 bg-gradient-to-br from-navy-800 via-navy-700 to-navy-900 shadow-2xl shadow-black/30 ring-1 ring-white/5 sm:rounded-[2rem]">
      <motion.div
        className="absolute left-0 right-0 top-0 z-20 h-px overflow-hidden"
        aria-hidden
      >
        <motion.div
          className="h-full w-2/5 bg-gradient-to-r from-transparent via-gold-300/90 to-transparent"
          animate={{ x: ['-120%', '320%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
      {/* Animated gold accent */}
      <motion.div
        className="absolute -top-32 -right-32 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 6,
          repeat: Infinity
        }} />
      

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Image side */}
        <div className="relative h-56 overflow-hidden sm:h-72 lg:h-auto">
          <AnimatePresence mode="wait">
            <motion.img
              key={deal.id}
              initial={{
                opacity: 0,
                scale: 1.1
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              exit={{
                opacity: 0,
                scale: 1.05
              }}
              transition={{
                duration: 0.8
              }}
              src={deal.images[0]}
              alt={deal.title}
              className="absolute inset-0 w-full h-full object-cover" />
            
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy-900/40 lg:to-navy-800/60" />

          {/* Badge */}
          <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-gold-500 text-navy-900 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg">
            <TrendingUpIcon className="w-4 h-4" />
            Deal of the Day
          </div>
        </div>

        {/* Content side */}
        <div className="relative flex flex-col justify-center border-t border-white/10 bg-gradient-to-br from-white/[0.07] via-transparent to-navy-900/40 p-5 backdrop-blur-md sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={deal.id}
              initial={{
                opacity: 0,
                x: 30
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: -30
              }}
              transition={{
                duration: 0.5
              }}>
              
              <p className="text-gold-500 text-sm uppercase tracking-[0.2em] mb-3 font-semibold">
                Featured luxury, limited time
              </p>
              <h3 className="mb-3 font-display text-2xl font-bold leading-tight text-cream sm:text-3xl md:text-4xl">
                {deal.title}
              </h3>
              <div className="flex items-center text-navy-200 mb-6">
                <MapPinIcon className="w-4 h-4 mr-2 text-gold-500" />
                <span className="text-sm">
                  {deal.location.city}, {deal.location.state}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 mb-6 text-cream text-sm">
                <div className="flex items-center gap-1.5">
                  <BedIcon className="w-4 h-4 text-gold-500" />
                  {deal.bedrooms} BR
                </div>
                <div className="flex items-center gap-1.5">
                  <BathIcon className="w-4 h-4 text-gold-500" />
                  {deal.bathrooms} BA
                </div>
                <div className="flex items-center gap-1.5">
                  <SquareIcon className="w-4 h-4 text-gold-500" />
                  {deal.sqft.toLocaleString()} sqft
                </div>
              </div>

              <div className="mb-6">
                <p className="text-navy-300 text-xs uppercase tracking-wider mb-2">
                  Interested in this home?
                </p>
                <p className="text-cream/90 text-sm leading-relaxed mb-4">
                  Message our team on WhatsApp for photos, availability, and a friendly quote.
                </p>
                <WhatsAppContactButton
                  message={whatsAppMessageForProperty(deal.title)}
                  label="Chat on WhatsApp"
                  size="lg"
                  className="w-full sm:w-auto"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Countdown */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-navy-300 text-xs mb-2">
              <ClockIcon className="w-4 h-4 text-gold-500" />
              <span className="uppercase tracking-wider">Offer ends in</span>
            </div>
            <div className="flex gap-2">
              {[
              {
                label: 'Hours',
                value: pad(timeLeft.hours)
              },
              {
                label: 'Min',
                value: pad(timeLeft.minutes)
              },
              {
                label: 'Sec',
                value: pad(timeLeft.seconds)
              }].
              map((t) =>
              <div
                key={t.label}
                className="flex-1 bg-navy-900/60 backdrop-blur-sm border border-gold-500/20 rounded-xl px-3 py-2 text-center">
                
                  <div className="text-2xl font-display font-bold text-cream tabular-nums">
                    {t.value}
                  </div>
                  <div className="text-[10px] text-navy-300 uppercase tracking-wider">
                    {t.label}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(`/property/${deal.id}`)}>
            
            View Property
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Button>

          {/* Indicator dots */}
          <div className="flex gap-1.5 mt-6 justify-center lg:justify-start">
            {luxuryDeals.map((_, i) =>
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-gold-500' : 'w-4 bg-navy-600 hover:bg-navy-500'}`}
              aria-label={`Show deal ${i + 1}`} />

            )}
          </div>
        </div>
      </div>
    </div>);

}