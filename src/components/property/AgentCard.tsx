import React, { Component } from 'react';
import { motion } from 'framer-motion';
import {
  PhoneIcon,
  MailIcon,
  StarIcon,
  MessageCircleIcon,
  LockIcon } from
'lucide-react';
import { Agent } from '../../types';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
interface AgentCardProps {
  agent: Agent;
  onBookVisit: () => void;
  propertyTitle?: string;
}
export function AgentCard({
  agent,
  onBookVisit,
  propertyTitle
}: AgentCardProps) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const handleGated = (action: () => void) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    action();
  };
  const whatsappLink = (() => {
    const cleanPhone = agent.phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hi ${agent.name.split(' ')[0]}, I'm interested in ${propertyTitle ? `"${propertyTitle}"` : 'a property'} listed on Vertex Estate. Could we discuss?`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  })();
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
      className="sticky top-24 bg-white dark:bg-navy-800 rounded-2xl p-6 shadow-xl border border-navy-100 dark:border-navy-700">
      
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <img
            src={agent.photo}
            alt={agent.name}
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-2 ring-gold-500/30" />
          
          <span className="absolute bottom-4 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-navy-800" />
        </div>
        <h3 className="text-xl font-display font-bold text-navy-900 dark:text-cream mb-1">
          {agent.name}
        </h3>
        <p className="text-navy-600 dark:text-navy-400 text-sm mb-2">
          {agent.specialization}
        </p>
        <div className="flex items-center justify-center gap-1">
          <StarIcon className="w-4 h-4 fill-gold-500 text-gold-500" />
          <span className="text-navy-700 dark:text-navy-300 font-semibold">
            {agent.rating}
          </span>
        </div>
      </div>

      {/* Contact details - hidden until authenticated */}
      {isAuthenticated ?
      <div className="space-y-3 mb-6">
          <a
          href={`tel:${agent.phone}`}
          className="flex items-center gap-3 p-3 bg-navy-50 dark:bg-navy-700 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-600 transition-colors">
          
            <PhoneIcon className="w-5 h-5 text-gold-500" />
            <span className="text-navy-700 dark:text-cream text-sm">
              {agent.phone}
            </span>
          </a>
          <a
          href={`mailto:${agent.email}`}
          className="flex items-center gap-3 p-3 bg-navy-50 dark:bg-navy-700 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-600 transition-colors">
          
            <MailIcon className="w-5 h-5 text-gold-500" />
            <span className="text-navy-700 dark:text-cream text-sm truncate">
              {agent.email}
            </span>
          </a>
        </div> :

      <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 bg-navy-50 dark:bg-navy-700 rounded-lg">
            <LockIcon className="w-5 h-5 text-gold-500" />
            <span className="text-navy-700 dark:text-cream text-sm select-none blur-sm">
              +1 ••• ••• ••••
            </span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-navy-50 dark:bg-navy-700 rounded-lg">
            <LockIcon className="w-5 h-5 text-gold-500" />
            <span className="text-navy-700 dark:text-cream text-sm select-none blur-sm">
              hidden@vertex.com
            </span>
          </div>
          <p className="text-xs text-center text-navy-500 dark:text-navy-400">
            🔒 Sign in to view contact details
          </p>
        </div>
      }

      {/* Action buttons */}
      {isAuthenticated ?
      <>
          <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-3">
          
            <Button
            variant="primary"
            className="w-full bg-green-500 hover:bg-green-600 text-white">
            
              <MessageCircleIcon className="w-4 h-4 mr-2" />
              Chat on WhatsApp
            </Button>
          </a>
          <Button
          variant="secondary"
          className="w-full mb-3"
          onClick={onBookVisit}>
          
            Book a Visit
          </Button>
          <Button variant="ghost" className="w-full">
            Send a Message
          </Button>
        </> :

      <Button
        variant="primary"
        className="w-full"
        onClick={() => handleGated(() => {})}>
        
          <LockIcon className="w-4 h-4 mr-2" />
          Sign in to Contact Agent
        </Button>
      }
    </motion.div>);

}