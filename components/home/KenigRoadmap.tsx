"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type RoadmapMilestone = {
  year: string;
  goal: string | React.ReactNode;
  description: string;
  completed?: boolean;
};

const roadmapMilestones: RoadmapMilestone[] = [
  {
    year: "2025",
    goal: "Operational Launch & First Clients",
    description:
      "Start delivering custom automation solutions for scaling businesses in the US market while establishing core delivery infrastructure.",
    completed: true,
  },
  {
    year: "2026",
    goal: "Market Expansion & Strategic Partnerships",
    description: "Expand into Canada and the UK in H1. Form partnership with Bitrix24 in H2 to offer deeper CRM-integrated automation."
  },
  {
    year: "2027",
    goal: "Entry into EU & Service Scaling",
    description: "Begin market entry into EU countries, localize services, and prepare internal systems for scale."
  },
  {
    year: "2028",
    goal: "Team Growth & Inbound Engine",
    description: "Stabilize presence across regions, grow the delivery team, and establish a predictable inbound lead generation system."
  },
  {
    year: "2029",
    goal: "CRM Product Launch",
    description: "Launch our own proprietary CRM to compete with major platforms like HubSpot and Bitrix24 — deeply integrated with automation from the ground up."
  },
  {
    year: "2030+",
    goal: "Become a Known Leader in Automation",
    description: "Establish brand presence driven by our unique no-limits approach to automation and AI-powered business systems."
  }
];

export default function KenigRoadmap() {
  return (
    <section className="relative py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#001D8D] to-[#00AEEF] bg-clip-text text-transparent mb-4">
            Development Roadmap
          </h2>
          <p className="text-lg text-[#001D8D]/70">
            Where we're going: better website systems and faster delivery
          </p>
        </motion.div>

        <div className="relative pl-12 md:pl-16">
          <div
            aria-hidden
            className="pointer-events-none absolute left-4 md:left-6 top-0 bottom-0 w-[2px]"
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

          <ul role="list" className="relative space-y-12 md:space-y-16">
            {roadmapMilestones.map((milestone, index) => (
              <RoadmapItem key={index} milestone={milestone} index={index} />
            ))}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-14 text-center"
        >
          <Link
            href="https://kenigswap.com/contact/"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-[#001D8D] to-[#00AEEF] shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95 transition-all"
            aria-label="Co-create your automation roadmap with IOAuto"
          >
            Book a Call
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          <p className="mt-3 text-sm text-[#001D8D]/60">
            Tell us your priorities — we'll map the build phases.
          </p>
        </motion.div>
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

function RoadmapItem({ milestone, index }: { milestone: RoadmapMilestone; index: number }) {
  const ref = useRef<HTMLLIElement | null>(null);
  const inView = useInView(ref, { margin: "-15% 0px -15% 0px", once: false });

  return (
    <li ref={ref} className="relative pl-8 md:pl-12">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          delay: index * 0.1,
        }}
        className="absolute -left-8 md:-left-10 top-2 h-5 w-5 md:h-6 md:w-6 rounded-full bg-gradient-to-br from-[#001D8D] to-[#00AEEF]"
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
            {milestone.year}
          </motion.span>

          <motion.h3
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
            className="text-2xl md:text-3xl font-bold text-[#001D8D] mb-3 group-hover:text-[#00AEEF] transition-colors duration-300 flex items-center gap-2 flex-wrap"
          >
            {milestone.goal}
            {milestone.completed && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                Completed
              </span>
            )}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            className="text-base md:text-lg leading-relaxed text-[#001D8D]/70"
          >
            {milestone.description}
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
