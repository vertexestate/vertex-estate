import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { PropertyCard } from '../ui/PropertyCard';
import { properties } from '../../data/properties';
import { useNavigate } from 'react-router-dom';

export function FeaturedSlider() {
  const navigate = useNavigate();
  const featuredProperties = properties.filter((p) => p.featured);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (featuredProperties.length === 0) {
    return (
      <p className="rounded-2xl border border-navy-200 bg-white/80 py-12 text-center text-navy-600 dark:border-navy-700 dark:bg-navy-900/50 dark:text-navy-400">
        No featured properties to display.
      </p>
    );
  }

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProperties.length);
  };
  const prev = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + featuredProperties.length) % featuredProperties.length
    );
  };
  const visibleProperties = [
    featuredProperties[currentIndex],
    featuredProperties[(currentIndex + 1) % featuredProperties.length],
    featuredProperties[(currentIndex + 2) % featuredProperties.length],
  ];

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-8">
        <AnimatePresence mode="sync">
          {visibleProperties.map((property, index) => (
            <motion.div
              key={`${property.id}-${currentIndex}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{
                duration: 0.28,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.04,
              }}
              className="min-h-[200px]"
            >
              <PropertyCard
                property={property}
                onClick={() => navigate(`/property/${property.id}`)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            onClick={prev}
            aria-label="Previous properties"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="rounded-full border border-navy-200 bg-white/90 p-3.5 shadow-lg shadow-black/5 backdrop-blur-sm transition-colors hover:border-gold-500/45 hover:shadow-gold-glow dark:border-navy-600 dark:bg-navy-800/90 dark:hover:border-gold-500/35"
          >
            <ChevronLeftIcon className="h-6 w-6 text-navy-900 dark:text-cream" />
          </motion.button>
          <motion.button
            type="button"
            onClick={next}
            aria-label="Next properties"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="rounded-full border border-navy-200 bg-white/90 p-3.5 shadow-lg shadow-black/5 backdrop-blur-sm transition-colors hover:border-gold-500/45 hover:shadow-gold-glow dark:border-navy-600 dark:bg-navy-800/90 dark:hover:border-gold-500/35"
          >
            <ChevronRightIcon className="h-6 w-6 text-navy-900 dark:text-cream" />
          </motion.button>
        </div>
        <div className="flex gap-2">
          {featuredProperties.map((_, i) => (
            <motion.button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === currentIndex}
              onClick={() => setCurrentIndex(i)}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              className={`h-2 rounded-full transition-colors duration-300 ${
                i === currentIndex
                  ? 'w-9 bg-gradient-to-r from-gold-400 to-gold-600 shadow-md shadow-gold-500/30'
                  : 'w-2 bg-navy-200 hover:bg-navy-300 dark:bg-navy-600 dark:hover:bg-navy-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
