"use client";

import Particles from "@/components/ui/Particles";

export default function HeroShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-kswap-light bg-kswap-noise min-h-screen">
      <Particles />
      <div className="relative z-10">{children}</div>
    </section>
  );
}