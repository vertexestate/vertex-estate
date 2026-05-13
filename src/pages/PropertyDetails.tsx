import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BedIcon,
  BathIcon,
  SquareIcon,
  MapPinIcon,
  CarIcon,
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon } from
'lucide-react';
import { Gallery } from '../components/property/Gallery';
import { AgentCard } from '../components/property/AgentCard';
import { BookVisitModal } from '../components/property/BookVisitModal';
import { PropertyCard } from '../components/ui/PropertyCard';
import { Button } from '../components/ui/Button';
import { LoginGate } from '../components/auth/LoginGate';
import { useProperties } from '../context/PropertiesContext';
import { useAuth } from '../context/AuthContext';
import { formatPropertyPrice } from '../lib/formatPropertyPrice';
export function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBookVisitOpen, setIsBookVisitOpen] = useState(false);
  const { getProperty, publicProperties } = useProperties();
  const { isAuthenticated, user, isEstateOwner } = useAuth();
  const property = id ? getProperty(id) : undefined;
  if (!property) {
    return (
      <div className="min-h-screen bg-cream dark:bg-navy-900 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-navy-900 dark:text-cream mb-4">
            Property Not Found
          </h1>
          <Button onClick={() => navigate('/listings')}>
            Back to Listings
          </Button>
        </div>
      </div>);

  }
  const isOwner = user && property.ownerId === user.id;
  const similarProperties = publicProperties.
  filter((p) => p.id !== property.id && p.type === property.type).
  slice(0, 3);
  return (
    <div className="min-h-screen bg-cream dark:bg-navy-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.button
          initial={{
            opacity: 0,
            x: -20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          onClick={() => navigate('/listings')}
          className="flex items-center gap-2 text-navy-700 dark:text-cream hover:text-gold-500 mb-6">
          
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Listings
        </motion.button>

        {/* Owner / Estate Owner status banner */}
        {property.approvalStatus &&
        property.approvalStatus !== 'approved' &&
        (isOwner || isEstateOwner) && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className={`mb-6 p-4 rounded-xl border ${property.approvalStatus === 'pending' ? 'bg-gold-500/10 border-gold-500/30 text-gold-800 dark:text-gold-400' : 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400'} flex items-center gap-3`}>
          
              {property.approvalStatus === 'pending' ?
          <ClockIcon className="w-5 h-5 flex-shrink-0" /> :

          <XCircleIcon className="w-5 h-5 flex-shrink-0" />
          }
              <p className="text-sm font-semibold">
                {property.approvalStatus === 'pending' ?
            'This listing is pending Estate Owner review. Only you and the Estate Owner can view it until it is approved and published.' :
            'This listing was rejected by the Estate Owner and will not appear publicly.'}
              </p>
            </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Gallery images={property.images} title={property.title} />

            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="relative bg-white dark:bg-navy-800 rounded-2xl p-8">
              
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-navy-900 dark:text-cream mb-3">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-navy-600 dark:text-navy-400">
                    <MapPinIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>
                      {isAuthenticated ?
                      `${property.location.address}, ${property.location.city}, ${property.location.state}` :
                      `${property.location.city}, ${property.location.state}`}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-gold-500">
                    {formatPropertyPrice(property)}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 bg-gold-500/10 text-gold-500 text-sm font-semibold rounded-full uppercase">
                    {property.type}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-navy-200 dark:border-navy-700">
                {property.bedrooms > 0 &&
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center">
                      <BedIcon className="w-6 h-6 text-gold-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-navy-900 dark:text-cream">
                        {property.bedrooms}
                      </p>
                      <p className="text-sm text-navy-600 dark:text-navy-400">
                        Bedrooms
                      </p>
                    </div>
                  </div>
                }
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center">
                    <BathIcon className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-navy-900 dark:text-cream">
                      {property.bathrooms}
                    </p>
                    <p className="text-sm text-navy-600 dark:text-navy-400">
                      Bathrooms
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center">
                    <SquareIcon className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-navy-900 dark:text-cream">
                      {property.sqft.toLocaleString()}
                    </p>
                    <p className="text-sm text-navy-600 dark:text-navy-400">
                      Sq Ft
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center">
                    <CarIcon className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-navy-900 dark:text-cream">
                      {property.parking}
                    </p>
                    <p className="text-sm text-navy-600 dark:text-navy-400">
                      Parking
                    </p>
                  </div>
                </div>
              </div>

              {/* Description teaser or full */}
              <div className="mt-8 relative">
                <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-cream mb-4">
                  Description
                </h2>
                {isAuthenticated ?
                <p className="text-navy-700 dark:text-navy-300 leading-relaxed">
                    {property.description}
                  </p> :

                <div className="relative">
                    <p className="text-navy-700 dark:text-navy-300 leading-relaxed line-clamp-3">
                      {property.description}
                    </p>
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white dark:from-navy-800 to-transparent pointer-events-none" />
                  </div>
                }
              </div>

              {/* Features - hide some when not signed in */}
              <div className="mt-8">
                <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-cream mb-4">
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(isAuthenticated ?
                  property.features :
                  property.features.slice(0, 4)).
                  map((feature, index) =>
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-navy-50 dark:bg-navy-700 rounded-lg">
                    
                      <CheckCircleIcon className="w-4 h-4 text-gold-500 flex-shrink-0" />
                      <span className="text-navy-700 dark:text-cream text-sm">
                        {feature}
                      </span>
                    </div>
                  )}
                  {!isAuthenticated && property.features.length > 4 &&
                  <div className="flex items-center justify-center p-3 bg-gold-500/10 rounded-lg text-gold-500 text-sm font-semibold">
                      +{property.features.length - 4} more (sign in)
                    </div>
                  }
                </div>
              </div>

              {isAuthenticated &&
              <div className="mt-8">
                  <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-cream mb-4">
                    Property Details
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between p-3 bg-navy-50 dark:bg-navy-700 rounded-lg">
                      <span className="text-navy-600 dark:text-navy-400">
                        Year Built
                      </span>
                      <span className="font-semibold text-navy-900 dark:text-cream">
                        {property.yearBuilt}
                      </span>
                    </div>
                    {property.lotSize &&
                  <div className="flex justify-between p-3 bg-navy-50 dark:bg-navy-700 rounded-lg">
                        <span className="text-navy-600 dark:text-navy-400">
                          Lot Size
                        </span>
                        <span className="font-semibold text-navy-900 dark:text-cream">
                          {property.lotSize.toLocaleString()} sq ft
                        </span>
                      </div>
                  }
                    <div className="flex justify-between p-3 bg-navy-50 dark:bg-navy-700 rounded-lg">
                      <span className="text-navy-600 dark:text-navy-400">
                        Property Type
                      </span>
                      <span className="font-semibold text-navy-900 dark:text-cream capitalize">
                        {property.category}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-navy-50 dark:bg-navy-700 rounded-lg">
                      <span className="text-navy-600 dark:text-navy-400">
                        Status
                      </span>
                      <span className="font-semibold text-navy-900 dark:text-cream capitalize">
                        {property.status}
                      </span>
                    </div>
                  </div>
                </div>
              }

              {/* Inline gate for non-auth users */}
              {!isAuthenticated &&
              <div className="mt-8">
                  <LoginGate
                  title="Unlock Full Details"
                  message="View the complete description, all amenities, exact address, agent contact information, and book a private viewing." />
                
                </div>
              }
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <AgentCard
              agent={property.agent}
              onBookVisit={() => setIsBookVisitOpen(true)}
              propertyTitle={property.title} />
            
          </div>
        </div>

        {similarProperties.length > 0 &&
        <div className="mt-20">
            <h2 className="text-3xl font-display font-bold text-navy-900 dark:text-cream mb-8">
              Similar Properties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarProperties.map((prop) =>
            <PropertyCard
              key={prop.id}
              property={prop}
              onClick={() => navigate(`/property/${prop.id}`)} />

            )}
            </div>
          </div>
        }
      </div>

      <BookVisitModal
        isOpen={isBookVisitOpen}
        onClose={() => setIsBookVisitOpen(false)}
        propertyTitle={property.title} />
      
    </div>);

}