import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FilterIcon, GridIcon, MapIcon, PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FilterSidebar } from '../components/listings/FilterSidebar';
import { PropertyGrid } from '../components/listings/PropertyGrid';
import { SearchBar } from '../components/listings/SearchBar';
import { LoginGate } from '../components/auth/LoginGate';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { WhatsAppContactButton } from '../components/ui/WhatsAppContactButton';
import { siteConfig } from '../config/siteConfig';
import { useProperties } from '../context/PropertiesContext';
import { useAuth } from '../context/AuthContext';
import { FilterOptions } from '../types';
const PREVIEW_COUNT = 3;
export function Listings() {
  const navigate = useNavigate();
  const { publicProperties, searchProperties } = useProperties();
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 500000000],
    location: '',
    propertyType: [],
    bedrooms: null,
    bathrooms: null,
    amenities: []
  });
  const [sortBy, setSortBy] = useState('featured');
  // Live search + filter
  const searched = useMemo(
    () => searchProperties(searchQuery),
    [searchQuery, searchProperties]
  );
  const filteredProperties = useMemo(() => {
    return searched.filter((property) => {
      if (
      filters.propertyType.length > 0 &&
      !filters.propertyType.includes(property.type))

      return false;
      if (
      property.price < filters.priceRange[0] ||
      property.price > filters.priceRange[1])

      return false;
      if (
      filters.location &&
      !property.location.city.
      toLowerCase().
      includes(filters.location.toLowerCase()))

      return false;
      if (filters.bedrooms && property.bedrooms < filters.bedrooms) return false;
      if (filters.bathrooms && property.bathrooms < filters.bathrooms)
      return false;
      return true;
    });
  }, [searched, filters]);
  const sortedProperties = useMemo(() => {
    return [...filteredProperties].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return (b.createdAt || b.yearBuilt) - (a.createdAt || a.yearBuilt);
        default:
          return b.featured ? 1 : -1;
      }
    });
  }, [filteredProperties, sortBy]);
  // Apply members-only gate: show preview only for guests
  const visibleProperties = isAuthenticated ?
  sortedProperties :
  sortedProperties.slice(0, PREVIEW_COUNT);
  const hiddenCount = sortedProperties.length - visibleProperties.length;
  return (
    <div className="min-h-screen bg-cream pt-page pb-page dark:bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          
          <div>
            <h1 className="mb-3 font-display text-3xl font-bold leading-tight text-navy-900 dark:text-cream sm:text-4xl md:text-5xl">
              Verified listings in Pakistan
            </h1>
            <p className="text-base text-navy-600 dark:text-navy-400 sm:text-lg">
              DHA, CDA, and blue-chip corridors. Message us on WhatsApp for rates, or sign in to unlock full details.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {!siteConfig.showPublicPrices && (
              <WhatsAppContactButton label="Ask for rates on WhatsApp" size="md" />
            )}
            {isAuthenticated && (
              <Button variant="primary" onClick={() => navigate('/dashboard')}>
                <PlusIcon className="w-5 h-5 mr-2" />
                List Your Property
              </Button>
            )}
          </div>
        </motion.div>

        {/* Live search */}
        <motion.div
          initial={{
            opacity: 0,
            y: 10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.1
          }}
          className="mb-10">
          
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            resultCount={sortedProperties.length} />
          
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block lg:w-80">
            <FilterSidebar filters={filters} onFilterChange={setFilters} />
          </div>

          <div className="flex-1">
            <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden">
                  
                  <FilterIcon className="w-5 h-5 mr-2" />
                  Filters
                </Button>
                <span className="text-navy-700 dark:text-navy-300 text-sm">
                  <span className="font-bold text-navy-900 dark:text-cream">
                    {sortedProperties.length}
                  </span>{' '}
                  properties
                  {!isAuthenticated && hiddenCount > 0 &&
                  <span className="ml-2 text-gold-500">
                      , {hiddenCount} locked
                    </span>
                  }
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Select
                  options={[
                  {
                    value: 'featured',
                    label: 'Featured'
                  },
                  ...(siteConfig.showPublicPrices
                    ? [
                        { value: 'price-low', label: 'Price: low to high' },
                        { value: 'price-high', label: 'Price: high to low' },
                      ]
                    : []),
                  {
                    value: 'newest',
                    label: 'Newest'
                  }]
                  }
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 sm:flex-initial" />
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setView('grid')}
                    className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-gold-500 text-navy-900' : 'bg-navy-100 dark:bg-navy-700 text-navy-700 dark:text-cream'}`}
                    aria-label="Grid view">
                    
                    <GridIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setView('map')}
                    className={`p-2 rounded-lg transition-colors ${view === 'map' ? 'bg-gold-500 text-navy-900' : 'bg-navy-100 dark:bg-navy-700 text-navy-700 dark:text-cream'}`}
                    aria-label="Map view">
                    
                    <MapIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {view === 'grid' ?
            <div className="space-y-8">
                <PropertyGrid properties={visibleProperties} />

                {!isAuthenticated && hiddenCount > 0 &&
              <LoginGate
                title={`${hiddenCount} more exclusive ${hiddenCount === 1 ? 'listing' : 'listings'} waiting`}
                message="Vertex Estate is a members-only platform. Sign in to unlock all properties, view full details, and contact agents directly." />

              }
              </div> :

            <div className="bg-white dark:bg-navy-800 rounded-2xl p-8 text-center">
                <MapIcon className="w-16 h-16 text-gold-500 mx-auto mb-4" />
                <p className="text-xl text-navy-700 dark:text-navy-300">
                  Map view coming soon
                </p>
              </div>
            }
          </div>
        </div>
      </div>

      {showFilters &&
      <>
          <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setShowFilters(false)} />
        
          <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          onClose={() => setShowFilters(false)}
          isMobile />
        
        </>
      }
    </div>);

}