import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from 'lucide-react';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            className={`relative w-full ${sizes[size]} bg-white dark:bg-navy-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto`}>
            
              <div className="sticky top-0 bg-white dark:bg-navy-800 border-b border-navy-200 dark:border-navy-700 px-6 py-4 flex items-center justify-between z-10">
                {title &&
              <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-cream">
                    {title}
                  </h2>
              }
                <button
                onClick={onClose}
                className="ml-auto p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-700 transition-colors">
                
                  <XIcon className="w-6 h-6 text-navy-700 dark:text-cream" />
                </button>
              </div>
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}