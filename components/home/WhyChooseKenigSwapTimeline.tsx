"use client";

import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';

type Item = { title: string; description: string };

export default function WhyChooseKenigSwapTimeline({ items }: { items: Item[] }) {
  return (
    <section className="py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative">
        <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-16 text-center">
          Почему выбирают <span className="text-[#4F7FFF]">KenigSwap</span>
        </h2>

        <div className="relative">
          {/* Animated Curved SVG Path */}
          <svg
            className="absolute left-0 top-0 h-full w-full pointer-events-none"
            style={{ minHeight: '100%' }}
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#001D8D" stopOpacity="0" />
                <stop offset="10%" stopColor="#001D8D" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#4DA3FF" stopOpacity="0.9" />
                <stop offset="90%" stopColor="#001D8D" stopOpacity="0.7" />
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
              d="M -5,0 Q 15,25 10,50 Q 5,75 -5,100"
              stroke="url(#curveGradient)"
              strokeWidth="0.3"
              fill="none"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>

          {/* Features List */}
          <div className="relative space-y-16 md:space-y-20 pl-12 md:pl-24">
            {items.map((feature, index) => {
              const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
              const yPosition = (index / (items.length - 1)) * 100;

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
                  {/* Glowing Dot positioned on the curve */}
                  <motion.div
                    className="absolute -left-12 md:-left-24 top-0"
                    style={{
                      left: 'calc(0.5rem)',
                      transform: 'translateX(-50%)'
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  >
                    <div className="relative">
                      <motion.div
                        className="w-12 h-12 rounded-full backdrop-blur-sm bg-white/50 border border-[#4DA3FF]/30 flex items-center justify-center"
                        animate={inView ? {
                          boxShadow: [
                            "0 0 15px rgba(77, 163, 255, 0.3)",
                            "0 0 25px rgba(77, 163, 255, 0.6)",
                            "0 0 15px rgba(77, 163, 255, 0.3)"
                          ]
                        } : {}}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <motion.div
                          className="w-5 h-5 rounded-full bg-gradient-to-br from-[#001D8D] to-[#4DA3FF]"
                          animate={inView ? {
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.8, 1]
                          } : {}}
                          transition={{
                            duration: 2,
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
