"use client";

import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';

type Item = { title: string; description: string };

export default function WhyChooseKenigSwapTimeline({ items }: { items: Item[] }) {
  return (
    <section className="py-24 bg-transparent relative">
      <div className="max-w-5xl mx-auto px-6 relative">
        <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-12 text-center">
          Почему выбирают <span className="text-[#4F7FFF]">KenigSwap</span>
        </h2>

        <div className="relative flex flex-col items-start md:pl-20">
          {/* Animated Vertical Line - centered on mobile, left on desktop */}
          <div className="absolute left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#001D8D]/70 via-[#4F7FFF]/60 to-[#7FC3FF]/70 shadow-[0_0_20px_rgba(0,29,141,0.25)] animate-gradient-flow"></div>

          <div className="space-y-16 md:space-y-24 w-full">
            {items.map((feature, index) => {
              const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
              return (
                <motion.div
                  key={index}
                  ref={ref}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative flex flex-col md:flex-row md:items-start gap-6 md:gap-8 group"
                >
                  {/* Glass Dot */}
                  <div className="relative flex-shrink-0 mx-auto md:mx-0">
                    <div className="w-10 h-10 rounded-full backdrop-blur-sm bg-white/40 border border-[#4F7FFF]/20 shadow-[0_0_15px_rgba(79,127,255,0.2)] group-hover:shadow-[0_0_25px_rgba(79,127,255,0.4)] transition-all duration-500 flex items-center justify-center">
                      <div className="w-4 h-4 bg-gradient-to-r from-[#4F7FFF] to-[#7FC3FF] rounded-full blur-[1px] animate-pulse"></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center md:text-left transition-all duration-500 group-hover:translate-x-1 mt-4 md:mt-0">
                    <h3 className="text-lg md:text-xl font-semibold text-[#001D8D] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base text-[#001D8D]/70 leading-relaxed">
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
