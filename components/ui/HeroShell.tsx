"use client";

export default function HeroShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden min-h-screen">
      {/* Blob только для Hero-секции */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}