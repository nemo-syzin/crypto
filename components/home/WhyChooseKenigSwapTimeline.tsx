"use client";

import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';

type Item = { title: string; description: string };

export default function WhyChooseKenigSwapTimeline({ items }: { items: Item[] }) {
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
          </defs>
          <motion.path
            d="M 0,-2 Q 20,25 12,50 Q 4,75 0,102"
            stroke="url(#curveGradient)"
            strokeWidth="0.3"
            fill="none"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
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

              // Calculate position along the curve based on item index
              const progress = index / Math.max(items.length - 1, 1);

              // Quadratic bezier curve calculation: Q 20,25 12,50 Q 4,75 0,102
              // Split into two curves
              let xPos, yPos;
              if (progress <= 0.5) {
                // First curve: from (0,-2) to (12,50) with control point (20,25)
                const t = progress * 2;
                const x0 = 0, y0 = -2;
                const cx = 20, cy = 25;
                const x1 = 12, y1 = 50;
                xPos = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
                yPos = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1;
              } else {
                // Second curve: from (12,50) to (0,102) with control point (4,75)
                const t = (progress - 0.5) * 2;
                const x0 = 12, y0 = 50;
                const cx = 4, cy = 75;
                const x1 = 0, y1 = 102;
                xPos = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
                yPos = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1;
              }

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
                  {/* Glowing Sphere positioned on the curve */}
                  <motion.div
                    className="absolute top-0"
                    style={{
                      left: `calc(-50vw + 50% + ${xPos}vw)`,
                      top: `${yPos}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  >
                    <div className="relative">
                      {/* Outer glow ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          width: '48px',
                          height: '48px',
                          background: 'radial-gradient(circle, rgba(77, 163, 255, 0.4) 0%, rgba(77, 163, 255, 0) 70%)',
                        }}
                        animate={inView ? {
                          scale: [1, 1.3, 1],
                          opacity: [0.6, 0.3, 0.6]
                        } : {}}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />

                      {/* Main sphere */}
                      <motion.div
                        className="relative w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.5) 40%, rgba(77, 163, 255, 0.3))',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(77, 163, 255, 0.3)',
                          boxShadow: '0 0 20px rgba(77, 163, 255, 0.5), inset 0 -8px 16px rgba(0, 29, 141, 0.2)'
                        }}
                        animate={inView ? {
                          boxShadow: [
                            "0 0 20px rgba(77, 163, 255, 0.5), inset 0 -8px 16px rgba(0, 29, 141, 0.2)",
                            "0 0 35px rgba(77, 163, 255, 0.8), inset 0 -8px 16px rgba(0, 29, 141, 0.3)",
                            "0 0 20px rgba(77, 163, 255, 0.5), inset 0 -8px 16px rgba(0, 29, 141, 0.2)"
                          ]
                        } : {}}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {/* Inner core */}
                        <motion.div
                          className="w-5 h-5 rounded-full"
                          style={{
                            background: 'radial-gradient(circle at 35% 35%, #4DA3FF, #001D8D)',
                          }}
                          animate={inView ? {
                            scale: [1, 1.15, 1],
                            opacity: [1, 0.85, 1]
                          } : {}}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>

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
