import React from 'react';
import { motion } from 'framer-motion';
import { ShieldIcon, LayoutDashboardIcon, LockIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { EstateOwnerPanel } from '../components/dashboard/EstateOwnerPanel';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertiesContext';

/**
 * Dedicated Estate Owner workspace — approvals, people, analytics, and site copy.
 * Members use `/dashboard`; this route is only for the platform owner role.
 */
export function EstateOwnerView() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isEstateOwner, openAuthModal } = useAuth();
  const { pendingProperties } = useProperties();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-cream dark:bg-navy-900 pt-24 pb-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-navy-800 rounded-3xl p-10 text-center shadow-2xl border border-gold-500/20"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gold-500/10 flex items-center justify-center">
            <LockIcon className="w-10 h-10 text-gold-500" />
          </div>
          <h2 className="text-3xl font-display font-bold text-navy-900 dark:text-cream mb-3">
            Owner workspace
          </h2>
          <p className="text-navy-600 dark:text-navy-400 mb-8">
            Sign in as the Vertex Estate Owner to access this area.
          </p>
          <Button variant="primary" className="w-full" onClick={() => openAuthModal('login')}>
            Sign In
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!isEstateOwner) {
    return (
      <div className="min-h-screen bg-cream dark:bg-navy-900 pt-24 pb-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-navy-800 rounded-3xl p-10 text-center shadow-2xl border border-navy-200 dark:border-navy-700"
        >
          <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-cream mb-3">
            Access restricted
          </h2>
          <p className="text-navy-600 dark:text-navy-400 mb-8">
            Only the Estate Owner can open this view. Use your member dashboard
            instead.
          </p>
          <Button variant="primary" className="w-full" onClick={() => navigate('/dashboard')}>
            Go to dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                <ShieldIcon className="w-6 h-6 text-navy-900" />
              </div>
              {pendingProperties.length > 0 && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gold-500/20 text-gold-800 dark:text-gold-400 border border-gold-500/30">
                  {pendingProperties.length} pending
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-navy-900 dark:text-cream">
              Owner view
            </h1>
            <p className="text-lg text-navy-600 dark:text-navy-400 mt-2 max-w-2xl">
              Curate the platform: approve listings, verify people, review analytics,
              and edit public hero copy. Nothing goes live here without your action.
            </p>
          </div>
          <Button
            variant="secondary"
            className="self-start lg:self-auto shrink-0"
            onClick={() => navigate('/dashboard')}
          >
            <LayoutDashboardIcon className="w-4 h-4 mr-2" />
            Member dashboard
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-navy-800 rounded-2xl p-6 md:p-8 shadow-xl border border-navy-100 dark:border-navy-700"
        >
          <EstateOwnerPanel />
        </motion.div>
      </div>
    </div>
  );
}
