import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
}
export function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete
}: OTPInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);
  const handleChange = (index: number, char: string) => {
    const digit = char.replace(/\D/g, '').slice(-1);
    const next = value.split('');
    next[index] = digit;
    const joined = next.join('').slice(0, length);
    onChange(joined);
    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    if (joined.length === length && !joined.includes('') && onComplete) {
      onComplete(joined);
    }
  };
  const handleKeyDown = (
  index: number,
  e: React.KeyboardEvent<HTMLInputElement>) =>
  {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.
    getData('text').
    replace(/\D/g, '').
    slice(0, length);
    if (!pasted) return;
    onChange(pasted);
    if (pasted.length === length && onComplete) onComplete(pasted);
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
  };
  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {Array.from({
        length
      }).map((_, i) =>
      <motion.input
        key={i}
        ref={(el) => {
          inputsRef.current[i] = el;
        }}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={value[i] || ''}
        onChange={(e) => handleChange(i, e.target.value)}
        onKeyDown={(e) => handleKeyDown(i, e)}
        onPaste={handlePaste}
        whileFocus={{
          scale: 1.05
        }}
        className="w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-display font-bold text-navy-900 dark:text-cream bg-cream dark:bg-navy-900 border-2 border-navy-200 dark:border-navy-700 rounded-xl focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all" />

      )}
    </div>);

}