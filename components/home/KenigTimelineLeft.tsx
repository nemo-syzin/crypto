"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type TimelineEvent = {
  year: string;
  title: string;
  text: string;
};

interface KenigTimelineLeftProps {
  events: TimelineEvent[];
  title?: string;
}

export default function KenigTimelineLeft({
  events,
  title = "История развития KenigSwap"
}: KenigTimelineLeftProps) {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#001D8D] to-[#00AEEF] bg-clip-text text-transparent mb-16"
          >
            {title}
          </motion.h2>
        )}

        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 md:left-8 top-0 bottom-0 w-[2px]"
            style={{
              background: "linear-gradient(180deg, rgba(0, 29, 141, 0.3), #001D8D, #00AEEF, rgba(0, 174, 239, 0.3))",
            }}
          >
            <motion.div
              initial={{ scaleY: 0, transformOrigin: "top" }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              className="absolute inset-0 animate-gradientFlow"
              style={{
                background: "linear-gradient(180deg, transparent 0%, rgba(0, 174, 239, 0.6) 50%, transparent 100%)",
                boxShadow: "0 0 20px rgba(0, 174, 239, 0.5)",
              }}
            />
          </div>

          <ul role="list" className="relative space-y-12 md:space-y-16 pl-8 md:pl-24">
            {events.map((event, index) => (
              <TimelineItem key={index} event={event} index={index} />
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradientFlow {
          0% {
            transform: translateY(-100%) scaleY(1);
          }
          100% {
            transform: translateY(100%) scaleY(1);
          }
        }
        .animate-gradientFlow {
          animation: gradientFlow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
  const ref = useRef<HTMLLIElement | null>(null);
  const inView = useInView(ref, { margin: "-15% 0px -15% 0px", once: false });

  return (
    <li ref={ref} className="relative">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          delay: index * 0.1,
        }}
        className="absolute -left-8 md:-left-24 top-2 h-5 w-5 md:h-6 md:w-6 rounded-full bg-gradient-to-br from-[#001D8D] to-[#00AEEF] animate-pulse"
        style={{
          boxShadow: inView
            ? "0 0 15px rgba(0, 29, 141, 0.6), 0 0 30px rgba(0, 174, 239, 0.4)"
            : "0 0 8px rgba(0, 29, 141, 0.3)",
        }}
      >
        <motion.div
          animate={inView ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-[#001D8D] to-[#00AEEF] blur-sm"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
        transition={{
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1],
          delay: index * 0.1 + 0.2,
        }}
        whileHover={{ y: -4, scale: 1.02 }}
        className="group relative rounded-2xl p-6 md:p-8 transition-all duration-300"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 29, 141, 0.1)",
        }}
      >
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(0, 29, 141, 0.1), rgba(0, 174, 239, 0.1))",
            boxShadow: "0 0 40px rgba(0, 174, 239, 0.3), inset 0 0 20px rgba(0, 29, 141, 0.1)",
          }}
        />

        <div className="relative z-10">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="inline-block px-4 py-1.5 mb-4 rounded-full text-sm font-bold bg-gradient-to-r from-[#001D8D] to-[#00AEEF] text-white"
            style={{
              boxShadow: "0 4px 12px rgba(0, 29, 141, 0.3)",
            }}
          >
            {event.year}
          </motion.span>

          <motion.h3
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
            className="text-2xl md:text-3xl font-bold text-[#001D8D] mb-3 group-hover:text-[#00AEEF] transition-colors duration-300"
          >
            {event.title}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            className="text-base md:text-lg leading-relaxed text-[#001D8D]/70"
          >
            {event.text}
          </motion.p>
        </div>

        <div
          aria-hidden
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-12 w-3/4 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0, 174, 239, 0.4), transparent)",
          }}
        />
      </motion.div>
    </li>
  );
}
