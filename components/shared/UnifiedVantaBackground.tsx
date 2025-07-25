"use client";

import { useEffect, useState } from "react";

interface UnifiedVantaBackgroundProps {
  type: 'topology' | 'dots' | 'globe';
  // Common props
  color?: number;
  color2?: number;           
  backgroundColor?: number;
  mouseControls?: boolean;
  touchControls?: boolean;
  gyroControls?: boolean;
  minHeight?: number;
  minWidth?: number;
  scale?: number;
  scaleMobile?: number;
  className?: string;
  
  // Topology-specific props
  points?: number;
  maxDistance?: number;
  spacing?: number;
  showDots?: boolean;
  speed?: number;
  forceAnimate?: boolean;
  
  // Dots-specific props
  size?: number;
  showLines?: boolean;
}

export function UnifiedVantaBackground({
  type,
  color = 0xFF6B35,          
  color2 = 0x001D8D,         
  backgroundColor = 0xffffff,
  mouseControls = true,
  touchControls = true,
  gyroControls = false,
  minHeight = 200,
  minWidth = 200,
  scale = 1.0,
  scaleMobile = 1.0,
  className = "absolute inset-0 w-full h-full",
  
  // Topology props
  points = 12,
  maxDistance = 22,
  spacing = 20,
  showDots = true,
  speed = 1.0,
  forceAnimate = true,
  
  // Dots props
  size = 2.0,
  showLines = true
}: UnifiedVantaBackgroundProps) {
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => {
    // Always use fallback mode to avoid heavy dependencies
    setFallbackMode(true);
  }, [type, color, color2, backgroundColor, mouseControls, touchControls, gyroControls, minHeight, minWidth, scale, scaleMobile, points, maxDistance, spacing, showDots, speed, forceAnimate, size, showLines]);

  // Always use lightweight CSS gradient fallback
  return (
    <div 
      className={className}
      style={{ 
        background: `linear-gradient(135deg, ${color ? `#${color.toString(16).padStart(6, '0')}20` : '#94bdff20'}, ${color2 ? `#${color2.toString(16).padStart(6, '0')}10` : '#001D8D10'})`,
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    />
  );
}