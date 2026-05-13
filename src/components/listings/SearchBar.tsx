import React from 'react';
import { motion } from 'framer-motion';
import { SearchIcon, XIcon } from 'lucide-react';
interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  resultCount?: number;
}
export function SearchBar({
  value,
  onChange,
  placeholder,
  resultCount
}: SearchBarProps) {
  return (
    <div className="relative">
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Search by city, type, or keyword...'}
          className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white dark:bg-navy-800 text-navy-900 dark:text-cream border-2 border-navy-200 dark:border-navy-700 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all placeholder-navy-400 text-base" />
        
        {value &&
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-navy-100 dark:hover:bg-navy-700"
          aria-label="Clear search">
          
            <XIcon className="w-4 h-4 text-navy-500" />
          </button>
        }
      </div>
      {value &&
      <motion.p
        initial={{
          opacity: 0,
          y: -5
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="absolute left-4 -bottom-6 text-xs text-navy-500 dark:text-navy-400">
        
          {resultCount} result{resultCount === 1 ? '' : 's'} for "{value}"
        </motion.p>
      }
    </div>);

}