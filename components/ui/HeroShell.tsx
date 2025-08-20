"use client";

export default function HeroShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden min-h-screen">
      <div className="relative z-10">{children}</div>
      {/* Мягкая светлая виньетка (опционально) */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_160px_60px_rgba(255,255,255,0.7)]" />
    </section>
  );
}