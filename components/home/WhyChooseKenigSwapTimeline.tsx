"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useInView as useInViewObserver } from 'react-intersection-observer';

type Item = { title: string; description: string };

export default function WhyChooseKenigSwapTimeline({ items }: { items: Item[] }) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white mobile-scroll-stable">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-space-grotesk text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
            Почему выбирают <span className="text-[#001D8D]">KenigSwap</span>
          </h2>
          <p className="font-inter text-lg text-[#001D8D]/70">
            Быстрый и безопасный обмен криптовалюты с лучшими условиями
          </p>
        </div>

        <div className="relative">
          {/* Vertical Progress Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-[#001D8D] via-[#4DA3FF] to-[#001D8D]/20"></div>

          <div className="space-y-12">
            {items.map((item, index) => {
              const { ref, inView } = useInViewObserver({
                threshold: 0.3,
                triggerOnce: true,
              });

              return (
                <div
                  key={index}
                  ref={ref}
                  className={`flex items-start gap-8 transition-all duration-700 ease-out ${
                    inView
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-8'
                  }`}
                  style={{
                    transitionDelay: `${index * 200}ms`,
                  }}
                >
                  {/* Feature Circle */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#001D8D] to-[#4DA3FF] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                    <div
                      className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-[#001D8D] to-[#4DA3FF] rounded-full animate-ping opacity-20"
                      style={{ animationDelay: `${index * 500}ms` }}
                    ></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <h3 className="font-space-grotesk text-xl font-semibold text-[#001D8D] mb-2">
                      {item.title}
                    </h3>
                    <p className="font-inter text-[#001D8D]/70 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
