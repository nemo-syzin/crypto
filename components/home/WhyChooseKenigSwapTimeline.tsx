"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Item = { title: string; description: string };

export default function WhyChooseKenigSwapTimeline({ items }: { items: Item[] }) {
  return (
    <section className="relative py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 md:left-1/2 bg-gradient-to-b from-[#001D8D]/10 via-[#001D8D]/40 to-[#001D8D]/10"
      >
        <div className="absolute inset-0 animate-lineGlow" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-[#001D8D] mb-10">
          Почему выбирают <span className="text-[#001D8D]">KenigSwap</span>
        </h2>

        <ul role="list" className="relative grid gap-10 md:gap-14">
          {items.map((item, i) => (
            <TimelineRow key={i} index={i} {...item} />
          ))}
        </ul>
      </div>

      <style jsx>{`
        @keyframes lineGlow {
          0% {
            box-shadow: 0 0 0px rgba(0, 82, 255, 0.0);
          }
          50% {
            box-shadow: 0 0 28px rgba(0, 82, 255, 0.10);
          }
          100% {
            box-shadow: 0 0 0px rgba(0, 82, 255, 0.0);
          }
        }
        .animate-lineGlow {
          animation: lineGlow 2.8s ease-in-out infinite;
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
  const ref = useRef<HTMLLIElement | null>(null);
  const inView = useInView(ref, { margin: "-20% 0px -20% 0px", once: false });

  const leftSide = index % 2 === 0;

  return (
    <li
      ref={ref}
      className={`
        relative grid items-start
        md:grid-cols-[1fr_0px_1fr]
        grid-cols-[1fr]
      `}
    >
      <div className={`md:pr-10 ${leftSide ? "" : "md:opacity-0 md:pointer-events-none"}`}>
        {leftSide && (
          <TimelineCard title={title} description={description} inView={inView} align="right" />
        )}
      </div>

      <div className="relative hidden md:block">
        <motion.span
          aria-hidden
          initial={{ scale: 0.75, opacity: 0.6 }}
          animate={inView ? { scale: 1.05, opacity: 1 } : { scale: 0.75, opacity: 0.6 }}
          transition={{ type: "spring", stiffness: 250, damping: 18 }}
          className="absolute left-1/2 top-2 -translate-x-1/2 inline-flex h-4 w-4 rounded-full bg-[#4DA3FF]"
          style={{
            boxShadow: inView
              ? "0 0 0 6px rgba(77,163,255,0.15), 0 0 30px rgba(0,82,255,0.25)"
              : "0 0 0 4px rgba(77,163,255,0.10)",
          }}
        />
      </div>

      <div className={`md:pl-10 ${leftSide ? "md:opacity-0 md:pointer-events-none" : ""}`}>
        {!leftSide && (
          <TimelineCard title={title} description={description} inView={inView} align="left" />
        )}
      </div>

      <div className="md:hidden pointer-events-none absolute left-4 top-2">
        <motion.span
          aria-hidden
          initial={{ scale: 0.7, opacity: 0.65 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0.65 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="inline-flex h-3.5 w-3.5 rounded-full bg-[#4DA3FF]"
          style={{
            boxShadow: inView
              ? "0 0 0 6px rgba(77,163,255,0.18)"
              : "0 0 0 4px rgba(77,163,255,0.10)",
          }}
        />
      </div>
    </li>
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
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0.6, y: 8 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`
        group relative
        rounded-2xl
        bg-white/0
        p-0 md:p-0
      `}
    >
      <div
        className={`
          relative rounded-2xl
          px-8 py-4 md:px-0 md:py-0
        `}
      >
        <motion.h3
          className={`text-2xl md:text-[26px] font-extrabold tracking-tight ${
            inView ? "text-[#001D8D]" : "text-[#001D8D]/80"
          } ${align === "left" ? "md:text-left text-left" : "md:text-right text-left"}
          `}
          whileHover={{ x: 0 }}
        >
          {title}
        </motion.h3>

        <p
          className={`
            mt-3 max-w-xl leading-7 text-[15px] md:text-[16px]
            ${align === "left" ? "md:text-left text-left" : "md:text-right text-left"}
            ${inView ? "text-[#001D8D]/75" : "text-[#001D8D]/55"}
          `}
        >
          {description}
        </p>

        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute -inset-x-4 -bottom-1 h-6 blur-lg rounded-full"
          style={{ background: "radial-gradient(60% 100% at 50% 100%, rgba(0,82,255,0.12) 0%, rgba(0,82,255,0.0) 70%)" }}
        />
      </div>

      <div
        aria-hidden
        className={`
          pointer-events-none absolute inset-0 rounded-2xl
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
        `}
        style={{
          background:
            "radial-gradient(600px 120px at var(--x,50%) var(--y,50%), rgba(77,163,255,0.10), transparent 60%)",
        }}
        onMouseMove={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          const r = el.getBoundingClientRect();
          el.style.setProperty("--x", `${((e.clientX - r.left) / r.width) * 100}%`);
          el.style.setProperty("--y", `${((e.clientY - r.top) / r.height) * 100}%`);
        }}
      />
    </motion.div>
  );
}
