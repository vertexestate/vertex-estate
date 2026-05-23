import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  SparklesIcon } from
'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { submitConciergeLead } from '../../lib/submissions';
interface FormData {
  name: string;
  email: string;
  phone: string;
  budgetMin: string;
  budgetMax: string;
  intent: string;
  propertyType: string;
  bedrooms: string;
  city: string;
  notes: string;
}
const STORAGE_KEY = 'vertex-search-form';
const initialData: FormData = {
  name: '',
  email: '',
  phone: '',
  budgetMin: '',
  budgetMax: '',
  intent: '',
  propertyType: '',
  bedrooms: '',
  city: '',
  notes: ''
};
export function MultiStepForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Auto-save
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch {

        /* noop */}
    }
  }, []);
  useEffect(() => {
    if (!isSubmitted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isSubmitted]);
  const steps = [
  {
    title: 'About You',
    subtitle: 'Tell us who you are'
  },
  {
    title: 'Your Budget',
    subtitle: "What's your investment range?"
  },
  {
    title: 'Preferences',
    subtitle: 'What are you looking for?'
  },
  {
    title: 'Review',
    subtitle: 'Confirm your details'
  }];

  const update = (field: keyof FormData, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const canProceed = () => {
    if (step === 0) return data.name && data.email && data.phone;
    if (step === 1) return data.budgetMin && data.budgetMax && data.intent;
    if (step === 2) return data.propertyType && data.bedrooms;
    return true;
  };
  const handleSubmit = async () => {
    setSubmitError(null);
    setIsSubmitting(true);
    const res = await submitConciergeLead(data as unknown as Record<string, unknown>);
    setIsSubmitting(false);
    if (!res.ok) {
      setSubmitError(res.error);
      return;
    }
    setIsSubmitted(true);
    localStorage.removeItem(STORAGE_KEY);
  };
  const reset = () => {
    setIsSubmitted(false);
    setSubmitError(null);
    setStep(0);
    setData(initialData);
  };
  if (isSubmitted) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        className="rounded-[1.75rem] border border-gold-500/25 bg-gradient-to-b from-white to-cream/90 p-10 text-center shadow-2xl dark:from-navy-800 dark:to-navy-900 dark:border-gold-500/20 md:p-12">
        
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
            damping: 15,
            delay: 0.2
          }}
          className="w-20 h-20 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-gold-glow-lg">
          
          <CheckIcon className="w-10 h-10 text-navy-900" />
        </motion.div>
        <h3 className="text-3xl font-display font-bold text-navy-900 dark:text-cream mb-3">
          Thank you, {data.name.split(' ')[0]}!
        </h3>
        <p className="text-navy-600 dark:text-navy-400 mb-8 max-w-md mx-auto">
          We've received your preferences. A senior consultant will reach out
          within 24 hours with handpicked properties matching your criteria.
        </p>
        <Button variant="secondary" onClick={reset}>
          Submit Another Inquiry
        </Button>
      </motion.div>);

  }
  const progress = (step + 1) / steps.length * 100;
  return (
    <div className="rounded-[1.75rem] border border-navy-100 bg-gradient-to-b from-white to-cream/50 p-6 shadow-2xl ring-1 ring-gold-500/10 dark:border-navy-600 dark:from-navy-800 dark:to-navy-900/80 md:p-10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <SparklesIcon className="w-5 h-5 text-gold-500" />
        <p className="text-xs uppercase tracking-[0.2em] text-gold-500 font-semibold">
          Step {step + 1} of {steps.length}
        </p>
      </div>
      <h3 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-cream mb-1">
        {steps[step].title}
      </h3>
      <p className="text-navy-600 dark:text-navy-400 mb-6">
        {steps[step].subtitle}
      </p>

      {/* Progress + stepper */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between gap-1 sm:gap-2">
          {steps.map((s, i) => (
            <div key={s.title} className="flex min-w-0 flex-1 items-center">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all sm:h-10 sm:w-10 sm:text-xs ${
                  i < step
                    ? 'bg-gold-500 text-navy-900 shadow-md shadow-gold-500/25'
                    : i === step
                      ? 'bg-gold-500/15 text-gold-700 ring-2 ring-gold-500/60 dark:text-gold-300'
                      : 'bg-navy-100 text-navy-500 dark:bg-navy-700 dark:text-navy-400'
                }`}
              >
                {i < step ? (
                  <CheckIcon className="h-4 w-4" aria-hidden />
                ) : (
                  i + 1
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-0.5 h-0.5 min-w-[8px] flex-1 rounded-full sm:mx-1 ${i < step ? 'bg-gold-500' : 'bg-navy-200 dark:bg-navy-600'}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-navy-100 dark:bg-navy-700">
          <motion.div
            className="h-full bg-gradient-to-r from-gold-500 to-gold-600"
            animate={{
              width: `${progress}%`
            }}
            transition={{
              duration: 0.45,
              ease: 'easeOut'
            }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[280px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
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
              duration: 0.3
            }}
            className="space-y-4">
            
            {step === 0 &&
            <>
                <Input
                label="Full Name"
                placeholder="John Doe"
                value={data.name}
                onChange={(e) => update('name', e.target.value)} />
              
                <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={data.email}
                onChange={(e) => update('email', e.target.value)} />
              
                <Input
                label="Phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={data.phone}
                onChange={(e) => update('phone', e.target.value)} />
              
              </>
            }

            {step === 1 &&
            <>
                <Select
                label="I'm interested in"
                options={[
                {
                  value: '',
                  label: 'Select intent'
                },
                {
                  value: 'buy',
                  label: 'Buying a property'
                },
                {
                  value: 'rent',
                  label: 'Renting'
                },
                {
                  value: 'invest',
                  label: 'Investment'
                }]
                }
                value={data.intent}
                onChange={(e) => update('intent', e.target.value)} />
              
                <div className="grid grid-cols-2 gap-4">
                  <Input
                  label="Minimum Budget"
                  type="number"
                  placeholder="500000"
                  value={data.budgetMin}
                  onChange={(e) => update('budgetMin', e.target.value)} />
                
                  <Input
                  label="Maximum Budget"
                  type="number"
                  placeholder="2000000"
                  value={data.budgetMax}
                  onChange={(e) => update('budgetMax', e.target.value)} />
                
                </div>
              </>
            }

            {step === 2 &&
            <>
                <Select
                label="Property Type"
                options={[
                {
                  value: '',
                  label: 'Select type'
                },
                {
                  value: 'villa',
                  label: 'Villa'
                },
                {
                  value: 'penthouse',
                  label: 'Penthouse'
                },
                {
                  value: 'condo',
                  label: 'Condo'
                },
                {
                  value: 'house',
                  label: 'House'
                },
                {
                  value: 'estate',
                  label: 'Estate'
                },
                {
                  value: 'commercial',
                  label: 'Commercial'
                }]
                }
                value={data.propertyType}
                onChange={(e) => update('propertyType', e.target.value)} />
              
                <Select
                label="Bedrooms"
                options={[
                {
                  value: '',
                  label: 'Select bedrooms'
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
                value={data.bedrooms}
                onChange={(e) => update('bedrooms', e.target.value)} />
              
                <Input
                label="Preferred City (optional)"
                placeholder="Beverly Hills, Miami, NYC..."
                value={data.city}
                onChange={(e) => update('city', e.target.value)} />
              
              </>
            }

            {step === 3 &&
            <div className="space-y-3">
                {[
              {
                label: 'Name',
                value: data.name
              },
              {
                label: 'Email',
                value: data.email
              },
              {
                label: 'Phone',
                value: data.phone
              },
              {
                label: 'Intent',
                value: data.intent
              },
              {
                label: 'Budget',
                value: `$${Number(data.budgetMin).toLocaleString()} - $${Number(data.budgetMax).toLocaleString()}`
              },
              {
                label: 'Type',
                value: data.propertyType
              },
              {
                label: 'Bedrooms',
                value: `${data.bedrooms}+`
              },
              {
                label: 'City',
                value: data.city || 'Any'
              }].
              map((row) =>
              <div
                key={row.label}
                className="flex justify-between items-center p-3 bg-cream dark:bg-navy-900 rounded-lg">
                
                    <span className="text-navy-600 dark:text-navy-400 text-sm font-medium capitalize">
                      {row.label}
                    </span>
                    <span className="text-navy-900 dark:text-cream font-semibold text-sm capitalize">
                      {row.value || 'Not set'}
                    </span>
                  </div>
              )}
                <div>
                  <label className="block text-sm font-medium text-navy-700 dark:text-cream mb-2">
                    Anything else? (optional)
                  </label>
                  <textarea
                  rows={3}
                  value={data.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  placeholder="Special requirements, timeline, etc."
                  className="w-full px-4 py-3 rounded-lg border-2 border-navy-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-900 dark:text-cream" />
                
                </div>
              </div>
            }
          </motion.div>
        </AnimatePresence>
      </div>

      {step === steps.length - 1 && submitError && (
        <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">{submitError}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-navy-100 dark:border-navy-700">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || isSubmitting}>
          
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back
        </Button>

        {step < steps.length - 1 ?
        <Button
          variant="primary"
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          disabled={!canProceed() || isSubmitting}>
          
            Continue
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button> :

        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Submit Inquiry'}
            <CheckIcon className="w-4 h-4 ml-2" />
          </Button>
        }
      </div>
    </div>);

}