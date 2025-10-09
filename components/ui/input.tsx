import * as React from 'react';

import { cn } from '@/lib/utils';

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const isInCalc = className?.includes('input-field');
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          isInCalc
            ? 'border-[#E5E5E5] bg-white text-[#001D8D] placeholder:text-[#A0AEC0] focus-visible:ring-[#0066CC]'
            : 'border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring',
          className
        )}
        ref={ref}
        style={isInCalc ? { colorScheme: 'light' } : undefined}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
