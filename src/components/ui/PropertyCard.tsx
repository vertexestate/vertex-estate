import React, { memo, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
  BedIcon,
  BathIcon,
  SquareIcon,
  MapPinIcon,
  HeartIcon,
  BookmarkIcon,
  ArrowRightIcon,
} from 'lucide-react';
import { Property } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { siteConfig } from '../../config/siteConfig';
import { formatPropertyPrice } from '../../lib/formatPropertyPrice';
import { WhatsAppContactButton } from './WhatsAppContactButton';
import { whatsAppMessageForProperty } from '../../lib/whatsapp';
interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}
function PropertyCardInner({ property, onClick }: PropertyCardProps) {
  const { user, toggleFavoriteProperty, toggleSavedProperty } = useAuth();
  const reduceMotion = usePrefersReducedMotion();
  const isFavorite = user?.favoriteProperties.includes(property.id) ?? false;
  const isSaved = user?.savedProperties.includes(property.id) ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(x, [-0.5, 0.5], ['-5deg', '5deg']);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={reduceMotion ? undefined : handleMouseMove}
      onMouseLeave={reduceMotion ? undefined : handleMouseLeave}
      onClick={onClick}
      style={
        reduceMotion
          ? undefined
          : {
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d' as const,
            }
      }
      whileHover={reduceMotion ? undefined : { y: -8 }}
      className="group cursor-pointer"
    >
      <div
        style={reduceMotion ? undefined : { transform: 'translateZ(20px)' }}
        className="relative overflow-hidden rounded-[1.35rem] border border-navy-100/80 bg-white ring-1 ring-transparent transition-shadow duration-300 group-hover:border-gold-500/25 group-hover:shadow-gold-glow-lg group-hover:ring-gold-500/15 dark:border-navy-600 dark:bg-navy-800"
      >
        <div className="relative h-52 overflow-hidden sm:h-64">
          <img
            src={property.images[0]}
            alt={property.title}
            loading="lazy"
            decoding="async"
            className={`h-full w-full bg-navy-950 object-contain transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              reduceMotion ? '' : 'group-hover:scale-[1.03]'
            }`}
          />
          
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/70 via-navy-900/10 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
          <motion.div className="absolute inset-0 bg-gradient-to-t from-gold-500/15 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex translate-y-full items-center justify-between gap-2 bg-gradient-to-t from-navy-950/95 to-transparent px-5 pb-4 pt-12 transition-transform duration-300 group-hover:translate-y-0">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-200">
              View details
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 text-navy-900 shadow-lg">
              <ArrowRightIcon className="h-4 w-4" aria-hidden />
            </span>
          </div>
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 bg-gold-500 text-navy-900 text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
              {property.type}
            </span>
          </div>
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <motion.button
              whileTap={{
                scale: 0.85
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleSavedProperty(property.id);
              }}
              className="p-2 bg-white/90 dark:bg-navy-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-navy-700 transition-colors"
              aria-label={isSaved ? 'Unsave' : 'Save'}
              title={isSaved ? 'Saved' : 'Save for later'}>
              
              <BookmarkIcon
                className={`w-4 h-4 transition-colors ${isSaved ? 'fill-gold-500 text-gold-500' : 'text-navy-700 dark:text-cream'}`} />
              
            </motion.button>
            <motion.button
              whileTap={{
                scale: 0.85
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavoriteProperty(property.id);
              }}
              className="p-2 bg-white/90 dark:bg-navy-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-navy-700 transition-colors"
              aria-label={isFavorite ? 'Unfavorite' : 'Favorite'}>
              
              <HeartIcon
                className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-navy-700 dark:text-cream'}`} />
              
            </motion.button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-display font-bold text-navy-900 dark:text-cream group-hover:text-gold-500 transition-colors line-clamp-2">
              {property.title}
            </h3>
          </div>

          <div className="flex items-center text-navy-600 dark:text-navy-400 mb-4">
            <MapPinIcon className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {property.location.city}, {property.location.state}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4 text-sm text-navy-600 dark:text-navy-400">
            {property.bedrooms > 0 &&
            <div className="flex items-center gap-1">
                <BedIcon className="w-4 h-4" />
                <span>{property.bedrooms}</span>
              </div>
            }
            <div className="flex items-center gap-1">
              <BathIcon className="w-4 h-4" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <SquareIcon className="w-4 h-4" />
              <span>{property.sqft.toLocaleString()} sqft</span>
            </div>
          </div>

          <div className="pt-4 border-t border-navy-200 dark:border-navy-700">
            {siteConfig.showPublicPrices ? (
              <p className="text-2xl font-display font-bold text-gold-500">
                {formatPropertyPrice(property)}
              </p>
            ) : (
              <WhatsAppContactButton
                message={whatsAppMessageForProperty(property.title)}
                label="Ask on WhatsApp"
                size="sm"
                variant="soft"
                className="w-full"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export const PropertyCard = memo(PropertyCardInner);