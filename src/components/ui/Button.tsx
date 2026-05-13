import React, { useState } from 'react';
import { motion } from 'framer-motion';
interface ButtonProps extends
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'>
{
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  onClick,
  ...props
}: ButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const baseStyles =
  'relative overflow-hidden font-semibold rounded-lg transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center';
  const variants = {
    primary:
    'bg-gold-500 text-navy-900 hover:bg-gold-600 hover:shadow-gold-glow',
    secondary:
    'border-2 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-navy-900 dark:text-gold-400 dark:border-gold-400 dark:hover:bg-gold-400',
    ghost:
    'text-navy-700 dark:text-cream hover:bg-navy-100 dark:hover:bg-navy-700'
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now();
    setRipples((prev) => [
    ...prev,
    {
      id,
      x,
      y,
      size
    }]
    );
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
    onClick?.(e);
  };
  return (
    <motion.button
      whileHover={{
        scale: 1.02
      }}
      whileTap={{
        scale: 0.97
      }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={handleClick}
      {...props}>
      
      {ripples.map((ripple) =>
      <motion.span
        key={ripple.id}
        initial={{
          opacity: 0.4,
          scale: 0
        }}
        animate={{
          opacity: 0,
          scale: 1
        }}
        transition={{
          duration: 0.6,
          ease: 'easeOut'
        }}
        className="absolute rounded-full bg-white pointer-events-none"
        style={{
          left: ripple.x,
          top: ripple.y,
          width: ripple.size,
          height: ripple.size
        }} />

      )}
      <span className="relative z-10 inline-flex items-center">{children}</span>
    </motion.button>);

}