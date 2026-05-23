import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadIcon,
  CheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XIcon,
  ImageIcon } from
'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useProperties } from '../../context/PropertiesContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
interface FormState {
  title: string;
  type: 'buy' | 'rent' | 'luxury' | 'commercial';
  category: string;
  price: string;
  address: string;
  city: string;
  state: string;
  country: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  yearBuilt: string;
  parking: string;
  description: string;
  features: string;
  images: string[];
}
const initial: FormState = {
  title: '',
  type: 'buy',
  category: 'House',
  price: '',
  address: '',
  city: '',
  state: '',
  country: 'USA',
  bedrooms: '',
  bathrooms: '',
  sqft: '',
  yearBuilt: '',
  parking: '',
  description: '',
  features: '',
  images: []
};
interface UploadPropertyFormProps {
  onSuccess?: () => void;
  /** Fires after a listing is saved as Pending Review (e.g. show confirmation on Profile). */
  onListingCreated?: (listingId: string) => void;
}
export function UploadPropertyForm({
  onSuccess,
  onListingCreated,
}: UploadPropertyFormProps) {
  const { createListing } = useProperties();
  const { isEstateOwner } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormState>(initial);
  const [submitted, setSubmitted] = useState(false);
  const steps = ['Basic Info', 'Location', 'Details', 'Media', 'Review'];
  const update = <K extends keyof FormState,>(k: K, v: FormState[K]) =>
  setData((p) => ({
    ...p,
    [k]: v
  }));
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setData((p) => ({
            ...p,
            images: [...p.images, ev.target!.result as string]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };
  const removeImage = (idx: number) => {
    update(
      'images',
      data.images.filter((_, i) => i !== idx)
    );
  };
  const canProceed = () => {
    if (step === 0)
    return data.title && data.type && data.category && data.price;
    if (step === 1) return data.address && data.city && data.state;
    if (step === 2) return data.bedrooms && data.bathrooms && data.sqft;
    if (step === 3) return data.images.length > 0;
    return true;
  };
  const handleSubmit = () => {
    const featureList = data.features.
    split(',').
    map((f) => f.trim()).
    filter(Boolean);
    try {
      const listingId = createListing({
        title: data.title,
        type: data.type,
        category: data.category,
        price: Number(data.price),
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          lat: 0,
          lng: 0
        },
        bedrooms: Number(data.bedrooms) || 0,
        bathrooms: Number(data.bathrooms) || 0,
        sqft: Number(data.sqft) || 0,
        yearBuilt: Number(data.yearBuilt) || new Date().getFullYear(),
        parking: Number(data.parking) || 0,
        images: data.images,
        description: data.description,
        features: featureList,
        featured: false
      });
      onListingCreated?.(listingId);
      setSubmitted(true);
    } catch {
      alert('Could not submit listing. Please sign in and try again.');
    }
  };
  if (submitted) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        className="text-center py-12">
        
        <motion.div
          initial={{
            scale: 0
          }}
          animate={{
            scale: 1
          }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15
          }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-gold-glow-lg">
          
          <CheckIcon className="w-10 h-10 text-navy-900" />
        </motion.div>
        <h3 className="text-3xl font-display font-bold text-navy-900 dark:text-cream mb-3">
          Listing Submitted!
        </h3>
        <p className="text-navy-600 dark:text-navy-400 mb-6 max-w-md mx-auto">
          {isEstateOwner ?
          <>
                Your property is in <strong>Pending Review</strong>. It now
                appears in your <strong>Owner view</strong> queue. Open{' '}
                <strong>Pending Review</strong> there and tap <strong>Approve</strong>{' '}
                when you are ready to publish it publicly.
              </> :

          <>
                Your property is in <strong>Pending Review</strong>. The Vertex
                Estate Owner personally approves every listing. Nothing is
                published until then.
              </>
          }
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
          {isEstateOwner &&
          <Button
            variant="primary"
            onClick={() => {
              setSubmitted(false);
              setStep(0);
              setData(initial);
              navigate('/dashboard/owner');
            }}>
            
            Open review queue
          </Button>
          }
          <Button
            variant={isEstateOwner ? 'secondary' : 'primary'}
            onClick={() => {
              setSubmitted(false);
              setStep(0);
              setData(initial);
              onSuccess?.();
            }}>
            
            View My Listings
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setSubmitted(false);
              setStep(0);
              setData(initial);
            }}>
            
            List Another Property
          </Button>
        </div>
      </motion.div>);

  }
  const progress = (step + 1) / steps.length * 100;
  return (
    <div>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-gold-500">
            Step {step + 1} of {steps.length}
          </span>
          <span className="text-sm text-navy-600 dark:text-navy-400">
            {steps[step]}
          </span>
        </div>
        <div className="h-1.5 bg-navy-100 dark:bg-navy-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-gold-500 to-gold-600"
            animate={{
              width: `${progress}%`
            }}
            transition={{
              duration: 0.5
            }} />
          
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{
            opacity: 0,
            x: 20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          exit={{
            opacity: 0,
            x: -20
          }}
          transition={{
            duration: 0.25
          }}
          className="space-y-4 min-h-[320px]">
          
          {step === 0 &&
          <>
              <Input
              label="Property Title"
              placeholder="Stunning Modern Villa with Ocean View"
              value={data.title}
              onChange={(e) => update('title', e.target.value)} />
            
              <div className="grid grid-cols-2 gap-4">
                <Select
                label="Listing Type"
                value={data.type}
                onChange={(e) =>
                update('type', e.target.value as FormState['type'])
                }
                options={[
                {
                  value: 'buy',
                  label: 'For Sale'
                },
                {
                  value: 'rent',
                  label: 'For Rent'
                },
                {
                  value: 'luxury',
                  label: 'Luxury'
                },
                {
                  value: 'commercial',
                  label: 'Commercial'
                }]
                } />
              
                <Select
                label="Category"
                value={data.category}
                onChange={(e) => update('category', e.target.value)}
                options={[
                {
                  value: 'House',
                  label: 'House'
                },
                {
                  value: 'Villa',
                  label: 'Villa'
                },
                {
                  value: 'Apartment',
                  label: 'Apartment'
                },
                {
                  value: 'Condo',
                  label: 'Condo'
                },
                {
                  value: 'Penthouse',
                  label: 'Penthouse'
                },
                {
                  value: 'Loft',
                  label: 'Loft'
                },
                {
                  value: 'Estate',
                  label: 'Estate'
                },
                {
                  value: 'Office',
                  label: 'Office'
                }]
                } />
              
              </div>
              <Input
              label={data.type === 'rent' ? 'Monthly Rent ($)' : 'Price ($)'}
              type="number"
              placeholder="500000"
              value={data.price}
              onChange={(e) => update('price', e.target.value)} />
            
            </>
          }

          {step === 1 &&
          <>
              <Input
              label="Street Address"
              placeholder="1234 Ocean View Drive"
              value={data.address}
              onChange={(e) => update('address', e.target.value)} />
            
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="City"
                placeholder="Malibu"
                value={data.city}
                onChange={(e) => update('city', e.target.value)} />
              
                <Input
                label="State"
                placeholder="CA"
                value={data.state}
                onChange={(e) => update('state', e.target.value)} />
              
              </div>
              <Input
              label="Country"
              value={data.country}
              onChange={(e) => update('country', e.target.value)} />
            
            </>
          }

          {step === 2 &&
          <>
              <div className="grid grid-cols-3 gap-4">
                <Input
                label="Bedrooms"
                type="number"
                placeholder="4"
                value={data.bedrooms}
                onChange={(e) => update('bedrooms', e.target.value)} />
              
                <Input
                label="Bathrooms"
                type="number"
                placeholder="3"
                value={data.bathrooms}
                onChange={(e) => update('bathrooms', e.target.value)} />
              
                <Input
                label="Square Feet"
                type="number"
                placeholder="3500"
                value={data.sqft}
                onChange={(e) => update('sqft', e.target.value)} />
              
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Year Built"
                type="number"
                placeholder="2020"
                value={data.yearBuilt}
                onChange={(e) => update('yearBuilt', e.target.value)} />
              
                <Input
                label="Parking Spaces"
                type="number"
                placeholder="2"
                value={data.parking}
                onChange={(e) => update('parking', e.target.value)} />
              
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 dark:text-cream mb-2">
                  Description
                </label>
                <textarea
                rows={4}
                value={data.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Describe what makes this property special..."
                className="w-full px-4 py-3 rounded-lg border-2 border-navy-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-900 dark:text-cream focus:border-gold-500 outline-none" />
              
              </div>
              <Input
              label="Features (comma-separated)"
              placeholder="Pool, Gym, Smart Home, Ocean View"
              value={data.features}
              onChange={(e) => update('features', e.target.value)} />
            
            </>
          }

          {step === 3 &&
          <div className="space-y-4">
              <label className="block text-sm font-medium text-navy-700 dark:text-cream">
                Upload Property Images
              </label>
              <label className="block border-2 border-dashed border-navy-300 dark:border-navy-600 rounded-xl p-8 text-center hover:border-gold-500 transition-colors cursor-pointer">
                <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden" />
              
                <UploadIcon className="w-10 h-10 text-gold-500 mx-auto mb-3" />
                <p className="text-navy-700 dark:text-cream font-semibold">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-navy-500 dark:text-navy-400 mt-1">
                  PNG, JPG up to 10MB each
                </p>
              </label>

              {data.images.length > 0 &&
            <div>
                  <p className="text-xs text-navy-500 dark:text-navy-400 mb-2 uppercase tracking-wider font-semibold">
                    Selected ({data.images.length})
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {data.images.map((img, idx) =>
                <div
                  key={idx}
                  className="relative h-24 rounded-lg overflow-hidden group">
                  
                        <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover" />
                  
                        <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    
                          <XIcon className="w-3 h-3 text-white" />
                        </button>
                      </div>
                )}
                  </div>
                </div>
            }
            </div>
          }

          {step === 4 &&
          <div className="space-y-4">
              {data.images[0] &&
            <img
              src={data.images[0]}
              alt={data.title}
              className="w-full h-48 object-cover rounded-xl" />

            }
              {[
            {
              l: 'Title',
              v: data.title
            },
            {
              l: 'Type',
              v: `${data.type}, ${data.category}`
            },
            {
              l: 'Price',
              v: `$${Number(data.price).toLocaleString()}${data.type === 'rent' ? '/mo' : ''}`
            },
            {
              l: 'Location',
              v: `${data.address}, ${data.city}, ${data.state}`
            },
            {
              l: 'Specs',
              v: `${data.bedrooms} BR, ${data.bathrooms} BA, ${data.sqft} sqft`
            },
            {
              l: 'Images',
              v: `${data.images.length} uploaded`
            }].
            map((row) =>
            <div
              key={row.l}
              className="flex justify-between items-start p-3 bg-cream dark:bg-navy-900 rounded-lg">
              
                  <span className="text-sm font-medium text-navy-600 dark:text-navy-400">
                    {row.l}
                  </span>
                  <span className="text-sm font-semibold text-navy-900 dark:text-cream text-right max-w-[60%]">
                    {row.v}
                  </span>
                </div>
            )}
              <div className="p-4 bg-gold-500/10 border border-gold-500/30 rounded-lg text-sm text-navy-700 dark:text-cream">
                <strong>Important:</strong> Listings cannot go live without the
                Estate Owner&apos;s approval. Your submission enters{' '}
                <strong>Pending Review</strong> and is usually processed within 24
                hours.
              </div>
            </div>
          }
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-navy-100 dark:border-navy-700">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}>
          
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back
        </Button>

        {step < steps.length - 1 ?
        <Button
          variant="primary"
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          disabled={!canProceed()}>
          
            Continue
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button> :

        <Button variant="primary" onClick={handleSubmit}>
            Submit for Review
            <CheckIcon className="w-4 h-4 ml-2" />
          </Button>
        }
      </div>
    </div>);

}