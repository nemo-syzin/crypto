"use client";

import { useEffect, useRef } from "react";

export default function Blob() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const blob = ref.current;
    if (!blob) return;

    let x = 0, y = 0;
    const speed = 0.002;

    function animate() {
      x += speed;
      y += speed * 0.7;
      
      const translateX = Math.sin(x) * 100;
      const translateY = Math.cos(y) * 50;
      
      blob.style.transform = `translate(${translateX}px, ${translateY}px)`;
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <div
      ref={ref}
      className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
      style={{ willChange: 'transform' }}
      aria-hidden
    />
  );
}