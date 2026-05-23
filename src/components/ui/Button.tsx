import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'
  > {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'light';
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

  const baseStyles = [
    'relative overflow-hidden',
    'inline-flex items-center justify-center gap-2',
    'font-sans font-bold tracking-[0.06em]',
    'rounded-xl',
    'transition-all duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-cream dark:focus-visible:ring-offset-navy-900',
    'disabled:pointer-events-none disabled:opacity-45',
  ].join(' ');

  const variants = {
    primary: [
      'bg-gradient-to-b from-gold-300 via-gold-500 to-gold-600',
      'text-navy-900',
      'border border-gold-700/25',
      'shadow-btn-primary',
      'hover:from-gold-200 hover:via-gold-400 hover:to-gold-500',
      'hover:shadow-btn-primary-hover',
      'hover:border-gold-600/40',
      'active:from-gold-500 active:to-gold-700',
      'dark:from-gold-400 dark:via-gold-500 dark:to-gold-600',
      'dark:text-navy-950',
    ].join(' '),
    secondary: [
      'bg-navy-900 text-cream',
      'border border-navy-800',
      'shadow-btn-secondary',
      'hover:bg-navy-800 hover:border-gold-500/40 hover:shadow-btn-secondary-hover',
      'active:bg-navy-950',
      'dark:bg-navy-800 dark:border-navy-600 dark:text-cream',
      'dark:hover:bg-navy-700 dark:hover:border-gold-500/50 dark:hover:text-white',
    ].join(' '),
    outline: [
      'bg-transparent text-navy-900',
      'border-2 border-navy-900/20',
      'hover:border-gold-600 hover:bg-gold-500/10 hover:text-navy-900',
      'active:bg-gold-500/15',
      'dark:text-cream dark:border-cream/30',
      'dark:hover:border-gold-400 dark:hover:bg-gold-500/15 dark:hover:text-gold-300',
    ].join(' '),
    ghost: [
      'bg-transparent text-navy-800',
      'border border-transparent',
      'hover:bg-navy-900/5 hover:text-navy-900',
      'active:bg-navy-900/10',
      'dark:text-cream dark:hover:bg-white/10 dark:hover:text-gold-300',
    ].join(' '),
    light: [
      'bg-white/10 text-cream',
      'border border-cream/35 backdrop-blur-sm',
      'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]',
      'hover:border-gold-400/55 hover:bg-white/15 hover:text-gold-100',
      'active:bg-white/20',
    ].join(' '),
  };

  const sizes = {
    sm: 'min-h-[2.25rem] px-4 py-2 text-[0.8125rem] leading-tight',
    md: 'min-h-[2.75rem] px-6 py-2.5 text-sm leading-snug',
    lg: 'min-h-[3.25rem] px-8 py-3 text-[0.9375rem] leading-snug sm:text-base',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleSize = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - rippleSize / 2;
    const y = e.clientY - rect.top - rippleSize / 2;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y, size: rippleSize }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
    onClick?.(e);
  };

  const rippleColor =
    variant === 'primary'
      ? 'bg-white/35'
      : variant === 'secondary' || variant === 'light'
        ? 'bg-gold-400/25'
        : 'bg-navy-900/10 dark:bg-white/15';

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98, y: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ opacity: 0.45, scale: 0 }}
          animate={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className={`pointer-events-none absolute rounded-full ${rippleColor}`}
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
      <span className="relative z-10 inline-flex items-center justify-center gap-2 [&_svg]:shrink-0">
        {children}
      </span>
    </motion.button>
  );
}
