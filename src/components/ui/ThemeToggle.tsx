import React from 'react';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <motion.button
      whileHover={{
        scale: 1.05
      }}
      whileTap={{
        scale: 0.95
      }}
      onClick={toggleTheme}
      className="relative w-14 h-7 bg-navy-200 dark:bg-navy-700 rounded-full p-1 transition-colors"
      aria-label="Toggle theme">
      
      <motion.div
        animate={{
          x: isDark ? 28 : 0
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }}
        className="w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center">
        
        {isDark ?
        <MoonIcon className="w-3 h-3 text-navy-900" /> :

        <SunIcon className="w-3 h-3 text-navy-900" />
        }
      </motion.div>
    </motion.button>);

}