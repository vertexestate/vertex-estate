import React from 'react';
import { motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { siteConfig } from '../../config/siteConfig';
import { FilterOptions } from '../../types';
interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClose?: () => void;
  isMobile?: boolean;
}
export function FilterSidebar({
  filters,
  onFilterChange,
  onClose,
  isMobile
}: FilterSidebarProps) {
  const amenitiesList = [
  'Pool',
  'Gym',
  'Parking',
  'Garden',
  'Security',
  'Elevator',
  'Balcony',
  'Pet Friendly'];

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity) ?
    filters.amenities.filter((a) => a !== amenity) :
    [...filters.amenities, amenity];
    onFilterChange({
      ...filters,
      amenities: newAmenities
    });
  };
  return (
    <motion.div
      initial={
      isMobile ?
      {
        x: -300
      } :
      {}
      }
      animate={
      isMobile ?
      {
        x: 0
      } :
      {}
      }
      className={`${isMobile ? 'fixed inset-y-0 left-0 z-50 w-80' : 'sticky top-24'} bg-white dark:bg-navy-800 rounded-2xl p-6 shadow-xl h-fit`}>
      
      {isMobile &&
      <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-cream">
            Filters
          </h2>
          <button
          onClick={onClose}
          className="p-2 hover:bg-navy-100 dark:hover:bg-navy-700 rounded-lg">
          
            <XIcon className="w-6 h-6 text-navy-900 dark:text-cream" />
          </button>
        </div>
      }

      <div className="space-y-6">
        {siteConfig.showPublicPrices && (
          <div>
            <label className="block text-sm font-semibold text-navy-900 dark:text-cream mb-3">
              Price range
            </label>
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Min (PKR)"
                value={filters.priceRange[0]}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    priceRange: [Number(e.target.value), filters.priceRange[1]],
                  })
                }
              />
              <Input
                type="number"
                placeholder="Max (PKR)"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    priceRange: [filters.priceRange[0], Number(e.target.value)],
                  })
                }
              />
            </div>
          </div>
        )}

        <div>
          <Input
            label="Location"
            placeholder="City, State, or ZIP"
            value={filters.location}
            onChange={(e) =>
            onFilterChange({
              ...filters,
              location: e.target.value
            })
            } />
          
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy-900 dark:text-cream mb-3">
            Property Type
          </label>
          <div className="space-y-2">
            {['buy', 'rent', 'luxury', 'commercial'].map((type) =>
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer">
              
                <input
                type="checkbox"
                checked={filters.propertyType.includes(type)}
                onChange={(e) => {
                  const newTypes = e.target.checked ?
                  [...filters.propertyType, type] :
                  filters.propertyType.filter((t) => t !== type);
                  onFilterChange({
                    ...filters,
                    propertyType: newTypes
                  });
                }}
                className="w-4 h-4 text-gold-500 rounded focus:ring-gold-500" />
              
                <span className="text-navy-700 dark:text-navy-300 capitalize">
                  {type}
                </span>
              </label>
            )}
          </div>
        </div>

        <div>
          <Select
            label="Bedrooms"
            options={[
            {
              value: '',
              label: 'Any'
            },
            {
              value: '1',
              label: '1+'
            },
            {
              value: '2',
              label: '2+'
            },
            {
              value: '3',
              label: '3+'
            },
            {
              value: '4',
              label: '4+'
            },
            {
              value: '5',
              label: '5+'
            }]
            }
            value={filters.bedrooms?.toString() || ''}
            onChange={(e) =>
            onFilterChange({
              ...filters,
              bedrooms: e.target.value ? Number(e.target.value) : null
            })
            } />
          
        </div>

        <div>
          <Select
            label="Bathrooms"
            options={[
            {
              value: '',
              label: 'Any'
            },
            {
              value: '1',
              label: '1+'
            },
            {
              value: '2',
              label: '2+'
            },
            {
              value: '3',
              label: '3+'
            },
            {
              value: '4',
              label: '4+'
            }]
            }
            value={filters.bathrooms?.toString() || ''}
            onChange={(e) =>
            onFilterChange({
              ...filters,
              bathrooms: e.target.value ? Number(e.target.value) : null
            })
            } />
          
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy-900 dark:text-cream mb-3">
            Amenities
          </label>
          <div className="space-y-2">
            {amenitiesList.map((amenity) =>
            <label
              key={amenity}
              className="flex items-center gap-2 cursor-pointer">
              
                <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="w-4 h-4 text-gold-500 rounded focus:ring-gold-500" />
              
                <span className="text-navy-700 dark:text-navy-300">
                  {amenity}
                </span>
              </label>
            )}
          </div>
        </div>

        <Button
          variant="primary"
          className="w-full"
          onClick={() => {
            onFilterChange({
              priceRange: [0, 500000000],
              location: '',
              propertyType: [],
              bedrooms: null,
              bathrooms: null,
              amenities: []
            });
          }}>
          
          Reset Filters
        </Button>
      </div>
    </motion.div>);

}