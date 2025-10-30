"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface TimelineItem {
  title: string;
  description: string;
}

interface WhyChooseKenigSwapTimelineProps {
  items: TimelineItem[];
}

const WhyChooseKenigSwapTimeline: React.FC<WhyChooseKenigSwapTimelineProps> = ({ items }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="relative py-16 bg-[#F8F9FF] rounded-3xl">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[#001D8D]"
          >
            Почему выбирают <span className="text-[#001D8D]">KenigSwap</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-[#001D8D]/70 leading-relaxed text-lg"
          >
            Мы предоставляем безопасную, быструю и удобную платформу для всех ваших потребностей в обмене криптовалюты
          </motion.p>
        </div>

        <div ref={ref} className="max-w-4xl mx-auto">
          {/* Desktop Timeline */}
          <div className="hidden md:block relative">
            {/* Вертикальная линия */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#001D8D]/20 -translate-x-1/2" />

            <div className="space-y-12">
              {items.map((item, index) => {
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.15,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative"
                  >
                    <div className={`flex items-center ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                      {/* Контент слева/справа */}
                      <div className={`w-1/2 ${isEven ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <h3 className="text-xl md:text-2xl font-bold text-[#001D8D] mb-3">
                            {item.title}
                          </h3>
                          <p className="text-[#001D8D]/60 leading-relaxed">
                            {item.description}
                          </p>
                        </motion.div>
                      </div>

                      {/* Точка-светофор в центре */}
                      <motion.div
                        className="absolute left-1/2 -translate-x-1/2 z-10"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : {}}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.15 + 0.2,
                          type: "spring",
                          stiffness: 200,
                        }}
                        whileHover={{
                          scale: 1.3,
                          boxShadow: "0 0 24px rgba(77, 163, 255, 0.6)",
                        }}
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4DA3FF] to-[#001D8D] shadow-lg" />
                      </motion.div>

                      {/* Пустое пространство справа/слева */}
                      <div className="w-1/2" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden space-y-10">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative flex items-start gap-6"
              >
                {/* Точка */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.15 + 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{
                    scale: 1.3,
                    boxShadow: "0 0 24px rgba(77, 163, 255, 0.6)",
                  }}
                  className="flex-shrink-0 mt-1"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#4DA3FF] to-[#001D8D] shadow-lg" />
                </motion.div>

                {/* Контент */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1"
                >
                  <h3 className="text-xl font-bold text-[#001D8D] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[#001D8D]/60 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseKenigSwapTimeline;
