import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  EyeIcon,
  HomeIcon,
  PlusIcon } from
'lucide-react';
import { Button } from '../ui/Button';
import { useProperties } from '../../context/PropertiesContext';
interface MyListingsProps {
  onCreateNew: () => void;
}
export function MyListings({ onCreateNew }: MyListingsProps) {
  const navigate = useNavigate();
  const { myListings, deleteListing } = useProperties();
  if (myListings.length === 0) {
    return (
      <div className="text-center py-16">
        <HomeIcon className="w-16 h-16 text-navy-400 mx-auto mb-4" />
        <h3 className="text-xl font-display font-bold text-navy-900 dark:text-cream mb-2">
          No listings yet
        </h3>
        <p className="text-navy-600 dark:text-navy-400 mb-6">
          List a property — it stays in <strong>Pending Review</strong> until the
          Vertex Estate Owner publishes it. No listing goes public without that
          approval.
        </p>
        <Button variant="primary" onClick={onCreateNew}>
          <PlusIcon className="w-5 h-5 mr-2" />
          Upload Your First Property
        </Button>
      </div>);

  }
  const statusConfig = {
    pending: {
      icon: ClockIcon,
      color: 'text-gold-600 dark:text-gold-400 bg-gold-500/10',
      label: 'Pending Review'
    },
    approved: {
      icon: CheckCircleIcon,
      color: 'text-green-600 dark:text-green-400 bg-green-500/10',
      label: 'Live'
    },
    rejected: {
      icon: XCircleIcon,
      color: 'text-red-600 dark:text-red-400 bg-red-500/10',
      label: 'Rejected'
    }
  };
  return (
    <div className="space-y-4">
      {myListings.map((p) => {
        const status = statusConfig[p.approvalStatus || 'pending'];
        const StatusIcon = status.icon;
        return (
          <motion.div
            key={p.id}
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="flex flex-col sm:flex-row gap-4 p-4 bg-cream dark:bg-navy-900 rounded-xl">
            
            <img
              src={p.images[0]}
              alt={p.title}
              className="w-full sm:w-32 h-32 object-cover rounded-lg cursor-pointer"
              onClick={() => navigate(`/property/${p.id}`)} />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-display font-bold text-navy-900 dark:text-cream truncate">
                  {p.title}
                </h3>
                <span
                  className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full uppercase whitespace-nowrap ${status.color}`}>
                  
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </span>
              </div>
              <p className="text-sm text-navy-600 dark:text-navy-400 mb-2">
                {p.location.city}, {p.location.state} · {p.category}
              </p>
              <p className="text-gold-500 font-bold text-lg mb-3">
                ${p.price.toLocaleString()}
                {p.type === 'rent' ? '/mo' : ''}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/property/${p.id}`)}>
                  
                  <EyeIcon className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:bg-red-500/10"
                  onClick={() => {
                    if (confirm(`Delete listing "${p.title}"?`))
                    deleteListing(p.id);
                  }}>
                  
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>);

      })}
    </div>);

}