"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Item = { title: string; description: string };

export default function WhyChooseKenigSwapTimeline({ items }: { items: Item[] }) {
  return (
    <section className="relative py-16 sm:py-20 bg-transparent overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 md:left-1/2 bg-gradient-to-b from-[#001D8D]/0 via-[#4DA3FF]/30 to-[#001D8D]/0"
      >
        <div className="absolute inset-0 animate-lineGlow" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-3xl md:text-4xl lg:text-5xl font-bold text-[#001D8D] mb-16"
        >
          Почему выбирают <span className="text-[#4DA3FF]">KenigSwap</span>
        </motion.h2>

        <div className="relative">
          {items.map((item, i) => (
            <TimelineRow key={i} index={i} {...item} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes lineGlow {
          0% {
            box-shadow: 0 0 0px rgba(77, 163, 255, 0.0);
          }
          50% {
            box-shadow: 0 0 28px rgba(77, 163, 255, 0.15);
          }
          100% {
            box-shadow: 0 0 0px rgba(77, 163, 255, 0.0);
          }
        }
        .animate-lineGlow {
          animation: lineGlow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

function TimelineRow({
  title,
  description,
  index,
}: Item & { index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });

  const leftSide = index % 2 === 0;

  return (
    <div
      ref={ref}
      className="relative mb-12 md:mb-14 last:mb-0"
    >
      <div className="hidden md:flex items-start">
        <div className={`w-1/2 ${leftSide ? 'pr-12 text-right' : 'order-2 pl-12 text-left'}`}>
          <TimelineCard title={title} description={description} inView={inView} align={leftSide ? "right" : "left"} />
        </div>

        <div className="relative flex-shrink-0">
          <motion.div
            aria-hidden
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.5 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1
            }}
            className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4DA3FF] to-[#001D8D]"
            style={{
              boxShadow: inView
                ? "0 0 0 4px rgba(255,255,255,0.9), 0 0 0 6px rgba(77,163,255,0.3), 0 0 20px rgba(77,163,255,0.4)"
                : "0 0 0 4px rgba(255,255,255,0.9), 0 0 0 6px rgba(77,163,255,0.15)",
            }}
          />
        </div>

        <div className={`w-1/2 ${leftSide ? 'order-2' : ''}`} />
      </div>

      <div className="md:hidden flex items-start gap-6 pl-4">
        <motion.div
          aria-hidden
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.5 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-gradient-to-br from-[#4DA3FF] to-[#001D8D]"
          style={{
            boxShadow: inView
              ? "0 0 0 4px rgba(255,255,255,0.9), 0 0 0 6px rgba(77,163,255,0.3)"
              : "0 0 0 4px rgba(255,255,255,0.9), 0 0 0 6px rgba(77,163,255,0.15)",
          }}
        />
        <div className="flex-1">
          <TimelineCard title={title} description={description} inView={inView} align="left" />
        </div>
      </div>
    </div>
  );
}

function TimelineCard({
  title,
  description,
  inView,
  align,
}: {
  title: string;
  description: string;
  inView: boolean;
  align: "left" | "right";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === "right" ? -60 : 60 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: align === "right" ? -30 : 30 }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.1
      }}
      whileHover={{ scale: 1.02 }}
      className="group relative"
    >
      <div className="relative">
        <motion.h3
          className={`text-xl md:text-2xl font-bold mb-3 ${
            inView ? "text-[#001D8D]" : "text-[#001D8D]/70"
          } ${align === "left" ? "text-left" : "text-right"}
          transition-colors duration-300
          `}
        >
          {title}
        </motion.h3>

        <p
          className={`
            leading-relaxed text-[15px] md:text-base
            ${align === "left" ? "text-left" : "text-right"}
            ${inView ? "text-[#001D8D]/70" : "text-[#001D8D]/50"}
            transition-colors duration-300
          `}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}
