import React from 'react';
import { motion } from 'framer-motion';
import { PropertyCard } from '../ui/PropertyCard';
import { Property } from '../../types';
import { useNavigate } from 'react-router-dom';
interface PropertyGridProps {
  properties: Property[];
  isLoading?: boolean;
}
export function PropertyGrid({ properties, isLoading }: PropertyGridProps) {
  const navigate = useNavigate();
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) =>
        <div key={i} className="animate-pulse">
            <div className="bg-navy-200 dark:bg-navy-700 h-64 rounded-t-2xl" />
            <div className="bg-white dark:bg-navy-800 p-6 rounded-b-2xl space-y-3">
              <div className="h-6 bg-navy-200 dark:bg-navy-700 rounded w-3/4" />
              <div className="h-4 bg-navy-200 dark:bg-navy-700 rounded w-1/2" />
              <div className="h-4 bg-navy-200 dark:bg-navy-700 rounded w-full" />
            </div>
          </div>
        )}
      </div>);

  }
  if (properties.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl font-display text-navy-600 dark:text-navy-400">
          No properties found matching your criteria
        </p>
      </div>);

  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map((property, index) =>
      <motion.div
        key={property.id}
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.5,
          delay: index * 0.1
        }}>
        
          <PropertyCard
          property={property}
          onClick={() => navigate(`/property/${property.id}`)} />
        
        </motion.div>
      )}
    </div>);

}