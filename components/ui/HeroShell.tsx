"use client";

import Particles from "@/components/ui/Particles";

export default function HeroShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-kswap-light bg-noise-light min-h-screen">
      <Particles />
      <div className="relative z-10">{children}</div>
      {/* мягкая белая виньетка */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_180px_80px_rgba(255,255,255,0.7)]" />
    </section>
  );
}