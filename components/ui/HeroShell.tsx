"use client";

export default function HeroShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}