"use client";

export default function HeroShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative min-h-screen">
      <div className="relative z-10">{children}</div>
    </section>
  );
}