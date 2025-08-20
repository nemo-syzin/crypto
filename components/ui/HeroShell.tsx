"use client";

export default function HeroShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative min-h-screen z-10">
      {children}
    </section>
  );
}