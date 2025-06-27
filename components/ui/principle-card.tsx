"use client";

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PrincipleCardProps {
  icon: ReactNode;
  title: string;
  text: string;
  iconColor: string;
  className?: string;
}

export function PrincipleCard({ icon, title, text, iconColor, className = "" }: PrincipleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`group relative bg-white transition-all duration-300 hover:shadow-xl ${className}`}
      style={{
        borderRadius: '0px',
        border: '2px solid transparent',
        backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #94bfff, #d1e5ff)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'content-box, border-box',
        boxShadow: '0 4px 20px rgba(0, 29, 141, 0.08)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 29, 141, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 29, 141, 0.08)';
      }}
    >
      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Icon Section */}
        <div className="flex items-center justify-start">
          <div 
            className="w-16 h-16 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundColor: iconColor,
              clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)', // Geometric shape
            }}
          >
            <div className="text-white">
              {icon}
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-[#001D8D] leading-tight tracking-tight">
            {title}
          </h3>
          
          <div className="w-12 h-0.5 bg-gradient-to-r from-[#94bfff] to-[#d1e5ff]" />
          
          <p className="text-[#001D8D]/70 leading-relaxed text-sm font-medium">
            {text}
          </p>
        </div>
      </div>

      {/* Geometric accent */}
      <div 
        className="absolute top-0 right-0 w-8 h-8 opacity-20 transition-opacity duration-300 group-hover:opacity-40"
        style={{
          backgroundColor: iconColor,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
        }}
      />
    </motion.div>
  );
}