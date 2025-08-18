"use client";

import React from "react";
import { cn } from '@/lib/utils';

interface LightweightBackgroundProps {
  type?: 'topology' | 'dots' | 'globe';
  color?: string;
  color2?: string;
  backgroundColor?: string;
  className?: string;
}

export function LightweightBackground({
  className = "absolute inset-0 w-full h-full",
}: LightweightBackgroundProps) {
  // Simple white background - no animations or effects
  return (
    <div
      className={cn(className)}
      style={{ backgroundColor: '#ffffff' }}
    />
  );
}