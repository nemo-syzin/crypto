"use client";

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

interface PrincipleCardProps {
  icon: ReactNode;
  title: string;
  text: string;
  iconColor: string;
  className?: string;
}

export function PrincipleCard({ 
  icon, 
  title, 
  text, 
  iconColor, 
  className 
}: PrincipleCardProps) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className={cn(
        "group relative bg-white rounded-[20px] p-6 transition-all duration-300",
        "border-2 border-transparent bg-gradient-to-br from-white to-gray-50/50",
        "hover:shadow-xl hover:-translate-y-1",
        "before:absolute before:inset-0 before:rounded-[20px] before:p-[2px]",
        "before:bg-gradient-to-br before:from-[#94bfff] before:to-[#d1e5ff]",
        "before:-z-10 before:transition-opacity before:duration-300",
        "hover:before:opacity-100 before:opacity-60",
        className
      )}
      style={{
        boxShadow: '0 4px 20px rgba(0, 29, 141, 0.08)',
      }}
      whileHover={{
        boxShadow: '0 12px 40px rgba(0, 29, 141, 0.15)',
        transition: { duration: 0.3 }
      }}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-[#94bfff] to-[#d1e5ff] p-[2px] -z-10">
        <div className="w-full h-full bg-white rounded-[18px]" />
      </div>

      {/* Icon circle */}
      <div className="mb-6">
        <div 
          className="inline-flex items-center justify-center w-12 h-12 rounded-full transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: iconColor }}
        >
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-[#001D8D] mb-4 leading-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[#001D8D]/70 leading-relaxed text-sm">
        {text}
      </p>
    </motion.div>
  );
}