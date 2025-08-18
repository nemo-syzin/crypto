"use client";

import Particles from "@/components/ui/Particles";

export default function HeroShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-kswap bg-noise" />
      <Particles />
      <div className="relative z-10">{children}</div>
      {/* лёгкая виньетка по краям */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_160px_60px_rgba(0,0,0,0.35)]" />
    </section>
  );
}