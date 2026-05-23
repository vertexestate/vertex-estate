import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-navy-700 dark:text-cream mb-2">
          {label}
        </label>
      }
      <input
        className={`w-full px-4 py-3 rounded-lg border-2 border-navy-200 bg-white text-navy-900 placeholder-navy-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all dark:border-navy-500 dark:bg-navy-900 dark:text-cream dark:placeholder:text-cream/40 dark:focus:border-gold-400 dark:focus:ring-gold-400/25 ${error ? 'border-red-500' : ''} ${className}`}
        {...props} />
      
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>);

}