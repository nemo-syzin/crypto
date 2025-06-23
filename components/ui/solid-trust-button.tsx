"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SolidTrustButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

// Optimized variant configurations
const variantClasses = {
  primary: 'bg-[#001D8D] text-white hover:bg-[#001D8D]/90 shadow-lg',
  secondary: 'bg-gray-100 text-[#001D8D] hover:bg-gray-200 border border-gray-300',
  outline: 'border-2 border-[#001D8D] text-[#001D8D] hover:bg-[#001D8D] hover:text-white'
} as const;

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl'
} as const;

export function SolidTrustButton({
  size = 'md',
  variant = 'primary',
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: SolidTrustButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'relative inline-flex items-center justify-center gap-2 rounded-lg font-semibold',
        'transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#001D8D]/20',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        
        // Variant and size
        variantClasses[variant],
        sizeClasses[size],
        
        // Width
        fullWidth ? 'w-full' : 'w-auto',
        
        // Hover effects
        'hover:scale-105 active:scale-95',
        
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Загрузка...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}