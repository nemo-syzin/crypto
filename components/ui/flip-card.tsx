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
          duration: 0.8, 
          ease: [0.25, 0.46, 0.45, 0.94], // Более плавная кривая
          type: "tween" // Принудительно используем tween для плавности
        }}
        style={{ 
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center'
        }}
        whileHover={{ 
          y: -6,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
      >
        {/* Front Side */}
        <motion.div
          className="flip-card-face flip-card-front absolute inset-0 w-full h-full"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
            willChange: 'transform' // Оптимизация для GPU
          }}
          initial={false}
          animate={{ 
            boxShadow: isFlipped 
              ? '0 4px 20px rgba(0, 29, 141, 0.1)' 
              : '0 8px 30px rgba(0, 29, 141, 0.15)'
          }}
          transition={{ duration: 0.3 }}
        >
          {frontContent}
        </motion.div>

        {/* Back Side */}
        <motion.div
          className="flip-card-face flip-card-back absolute inset-0 w-full h-full"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            willChange: 'transform' // Оптимизация для GPU
          }}
          initial={false}
          animate={{ 
            boxShadow: isFlipped 
              ? '0 12px 40px rgba(0, 29, 141, 0.2)' 
              : '0 4px 20px rgba(0, 29, 141, 0.1)'
          }}
          transition={{ duration: 0.3 }}
        >
          {backContent}
        </motion.div>
      </motion.div>
    </div>
  );
}