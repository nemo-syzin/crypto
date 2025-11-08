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
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-16 text-center">
          Почему выбирают <span className="text-[#001D8D]">KenigSwap</span>
        </h2>

        <div className="relative">
          {/* Features List */}
          <div className="relative space-y-16 md:space-y-20 pl-16 md:pl-32">
            {items.map((feature, index) => {
              const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

              return (
                <motion.div
                  key={index}
                  ref={ref}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.4,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className="relative group"
                  style={{ minHeight: '120px' }}
                >
                  {/* Content */}
                  <div className="flex-1 transition-all duration-200 group-hover:translate-x-2">
                    <h3 className="text-lg md:text-xl font-semibold text-[#001D8D] mb-3 group-hover:text-blue-600 transition-colors duration-200">
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
