"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Unified crown trust button with optimized props
interface CrownTrustButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  language?: 'en' | 'ru';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

// Optimized text constants
export const CROWN_BUTTON_TEXTS = {
  en: {
    start: 'Start Exchange',
    getStarted: 'Get Started',
    begin: 'Begin Trading'
  },
  ru: {
    start: 'Начать обмен',
    getStarted: 'Начать',
    begin: 'Начать торговлю'
  }
} as const;

// Optimized size configurations
const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl'
} as const;

export function CrownTrustButton({
  size = 'md',
  language = 'en',
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: CrownTrustButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'relative inline-flex items-center justify-center gap-2 rounded-lg font-semibold',
        'bg-[#001D8D] text-white shadow-lg transition-all duration-300',
        'hover:bg-[#001D8D]/90 hover:shadow-xl hover:scale-105',
        'active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#001D8D]/20',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        
        // Size classes
        sizeClasses[size],
        
        // Width
        fullWidth ? 'w-full' : 'w-auto',
        
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Crown icon - optimized SVG */}
      <svg
        className="w-5 h-5 fill-current"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm2.7-2h8.6l.9-5.4-2.1 1.8L12 8l-3.1 2.4-2.1-1.8L7.7 14z"/>
      </svg>
      
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{language === 'ru' ? 'Загрузка...' : 'Loading...'}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}