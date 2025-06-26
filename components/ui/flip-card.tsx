"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
  cardClassName?: string;
}

export function FlipCard({ 
  frontContent, 
  backContent, 
  className,
  cardClassName 
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={cn("flip-card-container", className)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className={cn(
          "flip-card relative w-full h-full cursor-pointer",
          cardClassName
        )}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.23, 1, 0.32, 1] // Custom easing for smooth flip
        }}
        style={{ 
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center'
        }}
        whileHover={{ 
          y: -8,
          boxShadow: '0 20px 40px rgba(0, 29, 141, 0.15)'
        }}
      >
        {/* Front Side */}
        <div
          className="flip-card-face flip-card-front absolute inset-0 w-full h-full"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)'
          }}
        >
          {frontContent}
        </div>

        {/* Back Side */}
        <div
          className="flip-card-face flip-card-back absolute inset-0 w-full h-full"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {backContent}
        </div>
      </motion.div>
    </div>
  );
}