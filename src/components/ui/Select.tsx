import React from 'react';
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: {
    value: string;
    label: string;
  }[];
}
export function Select({
  label,
  error,
  options,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-navy-700 dark:text-cream mb-2">
          {label}
        </label>
      }
      <select
        className={`w-full px-4 py-3 rounded-lg border-2 border-navy-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-900 dark:text-cream focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all ${error ? 'border-red-500' : ''} ${className}`}
        {...props}>
        
        {options.map((option) =>
        <option key={option.value} value={option.value}>
            {option.label}
          </option>
        )}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>);

}