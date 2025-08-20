import React from 'react';

export default function HeroShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative">
      {/* Контент Hero-секции */}
      <div className="relative z-10">{children}</div>
      
      {/* Мягкая светлая виньетка только для Hero-секции (опционально) */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_160px_60px_rgba(255,255,255,0.7)]" />
    </section>
  );
}