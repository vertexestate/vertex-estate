import React from 'react';
import { motion } from 'framer-motion';
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-navy-100 dark:bg-navy-700 rounded-2xl rounded-bl-sm w-fit">
      {[0, 1, 2].map((i) =>
      <motion.div
        key={i}
        animate={{
          y: [0, -4, 0]
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          delay: i * 0.15,
          ease: 'easeInOut'
        }}
        className="w-2 h-2 rounded-full bg-gold-500" />

      )}
    </div>);

}