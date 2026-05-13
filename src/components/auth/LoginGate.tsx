import React from 'react';
import { motion } from 'framer-motion';
import { LockIcon, SparklesIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
interface LoginGateProps {
  title?: string;
  message?: string;
  variant?: 'card' | 'overlay';
  className?: string;
}
export function LoginGate({
  title = 'Members Only',
  message = 'Sign in to unlock the full experience — exclusive listings, verified contacts, and personalized recommendations.',
  variant = 'card',
  className = ''
}: LoginGateProps) {
  const { openAuthModal } = useAuth();
  if (variant === 'overlay') {
    return (
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        className={`absolute inset-0 z-20 flex items-center justify-center p-6 bg-gradient-to-t from-cream via-cream/95 to-cream/40 dark:from-navy-900 dark:via-navy-900/95 dark:to-navy-900/40 backdrop-blur-sm ${className}`}>
        
        <div className="max-w-md w-full text-center bg-white dark:bg-navy-800 rounded-3xl p-8 shadow-2xl border border-gold-500/30">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gold-500/10 flex items-center justify-center">
            <LockIcon className="w-8 h-8 text-gold-500" />
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <SparklesIcon className="w-3.5 h-3.5 text-gold-500" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-gold-500 font-semibold">
              Members Only
            </span>
          </div>
          <h3 className="text-2xl font-display font-bold text-navy-900 dark:text-cream mb-2">
            {title}
          </h3>
          <p className="text-sm text-navy-600 dark:text-navy-400 mb-6">
            {message}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => openAuthModal('signup')}>
              
              Create Account
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => openAuthModal('login')}>
              
              Sign In
            </Button>
          </div>
        </div>
      </motion.div>);

  }
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className={`bg-white dark:bg-navy-800 rounded-2xl p-8 text-center border border-gold-500/20 ${className}`}>
      
      <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gold-500/10 flex items-center justify-center">
        <LockIcon className="w-7 h-7 text-gold-500" />
      </div>
      <h3 className="text-xl font-display font-bold text-navy-900 dark:text-cream mb-2">
        {title}
      </h3>
      <p className="text-sm text-navy-600 dark:text-navy-400 mb-5">{message}</p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button
          variant="primary"
          size="sm"
          onClick={() => openAuthModal('login')}>
          
          Sign In
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => openAuthModal('signup')}>
          
          Create Account
        </Button>
      </div>
    </motion.div>);

}