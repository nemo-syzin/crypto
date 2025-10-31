"use client";

import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef, useState } from 'react';

type Item = { title: string; description: string };

export default function WhyChooseKenigSwapTimeline({ items }: { items: Item[] }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    if (pathRef.current && items.length > 0) {
      const length = pathRef.current.getTotalLength();
      const points = items.map((_, i) => {
        const pct = i / Math.max(items.length - 1, 1);
        const point = pathRef.current!.getPointAtLength(length * pct);
        return { x: point.x, y: point.y };
      });
      setPositions(points);
    }
  }, [items]);

  return (
    <section className="py-24 bg-transparent relative overflow-visible">
      {/* Animated Curved SVG Path - Full viewport width, extends from left to right edge */}
      <div className="absolute inset-0 w-full h-full overflow-visible">
        <svg
          className="absolute top-0 h-full w-[140vw] -left-[20vw] md:w-[120vw] md:-left-[8vw] lg:w-[110vw] lg:-left-[5vw]"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#001D8D" stopOpacity="0" />
              <stop offset="8%" stopColor="#001D8D" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#4DA3FF" stopOpacity="0.9" />
              <stop offset="92%" stopColor="#001D8D" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#001D8D" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="sphereGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <radialGradient id="sphereGradient" cx="30%" cy="30%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
              <stop offset="40%" stopColor="rgba(255, 255, 255, 0.5)" />
              <stop offset="100%" stopColor="rgba(77, 163, 255, 0.3)" />
            </radialGradient>
            <radialGradient id="coreGradient" cx="35%" cy="35%">
              <stop offset="0%" stopColor="#4DA3FF" />
              <stop offset="100%" stopColor="#001D8D" />
            </radialGradient>
          </defs>

          {/* Main path */}
          <motion.path
            ref={pathRef}
            id="timelinePath"
            d="M 0,-2 Q 20,25 12,50 Q 4,75 0,102"
            stroke="url(#curveGradient)"
            strokeWidth="0.3"
            fill="none"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Spheres on the path */}
          {positions.map((pos, index) => (
            <g key={index}>
              {/* Outer glow ring */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="6"
                fill="rgba(77, 163, 255, 0.4)"
                filter="url(#sphereGlow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 0.3, 0.6]
                }}
                transition={{
                  scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                }}
                style={{ transformOrigin: `${pos.x}% ${pos.y}%` }}
              />

              {/* Main sphere */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="2.5"
                fill="url(#sphereGradient)"
                stroke="rgba(77, 163, 255, 0.3)"
                strokeWidth="0.1"
                filter="url(#sphereGlow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                style={{ transformOrigin: `${pos.x}% ${pos.y}%` }}
              />

              {/* Inner core */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="1.2"
                fill="url(#coreGradient)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [1, 0.85, 1]
                }}
                transition={{
                  scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                }}
                style={{ transformOrigin: `${pos.x}% ${pos.y}%` }}
              />
            </g>
          ))}
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-16 text-center">
          Почему выбирают <span className="text-[#4F7FFF]">KenigSwap</span>
        </h2>

        <div className="relative">
          {/* Features List */}
          <div className="relative space-y-16 md:space-y-20 pl-16 md:pl-32">
            {items.map((feature, index) => {
              const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

              return (
                <motion.div
                  key={index}
                  ref={ref}
                  initial={{ opacity: 0, x: 40 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
                  className="relative group"
                  style={{ minHeight: '120px' }}
                >
                  {/* Content */}
                  <div className="flex-1 transition-all duration-300 group-hover:translate-x-2">
                    <h3 className="text-lg md:text-xl font-semibold text-[#001D8D] mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base text-[#001D8D]/70 leading-relaxed max-w-2xl">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
