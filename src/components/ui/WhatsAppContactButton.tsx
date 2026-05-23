import type { MouseEvent } from 'react';
import { MessageCircleIcon } from 'lucide-react';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

type Props = {
  message?: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'soft';
  onClick?: (e: MouseEvent) => void;
};

const sizeClasses = {
  sm: 'min-h-9 px-3 py-2 text-xs gap-1.5',
  md: 'min-h-11 px-4 py-2.5 text-sm gap-2',
  lg: 'min-h-[3.25rem] px-6 py-3 text-base gap-2.5',
};

const variantClasses = {
  solid:
    'bg-[#25D366] text-white shadow-lg shadow-[#25D366]/25 hover:bg-[#1ebe5d] focus-visible:ring-[#25D366]/50',
  outline:
    'border-2 border-[#25D366] bg-transparent text-[#128C7E] hover:bg-[#25D366]/10 dark:text-[#25D366] dark:hover:bg-[#25D366]/15',
  soft:
    'bg-[#25D366]/12 text-[#128C7E] hover:bg-[#25D366]/20 dark:text-[#5dde8a] dark:hover:bg-[#25D366]/20',
};

export function WhatsAppContactButton({
  message,
  label = 'Chat on WhatsApp',
  className = '',
  size = 'md',
  variant = 'solid',
  onClick,
}: Props) {
  return (
    <a
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-xl font-bold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-navy-900 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      <MessageCircleIcon className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} aria-hidden />
      {label}
    </a>
  );
}
