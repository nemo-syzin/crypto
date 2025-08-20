"use client";

import Particles from "@/components/ui/Particles";
import Blob from "@/components/ui/Blob";

export default function HeroShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-kswap-light bg-kswap-noise min-h-screen">
      <Blob />
      <Particles />
      <div className="relative z-10">{children}</div>
    </section>
  );
}