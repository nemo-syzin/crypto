"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseA: number;
  phase: number;
};

export default function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const c = ref.current!;
    const ctx = c.getContext("2d")!;

    let w = (c.width = c.offsetWidth);
    let h = (c.height = c.offsetHeight);
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    c.width = w * DPR;
    c.height = h * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    // ---------- настройки ----------
    const COLOR = "rgb(147,197,253)";            // светло-синий (tailwind blue-300)
    const SPEED = 0.18;                           // скорость движения
    const BREATH_SPEED = 0.015;                   // скорость «дыхания»
    const DENSITY_DIVISOR = 22000;                // плотность частиц: меньше число → больше частиц
    // --------------------------------

    const N = Math.min(90, Math.round((w * h) / DENSITY_DIVISOR));

    const P: Particle[] = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r: Math.random() * 1.6 + 0.6,
      baseA: Math.random() * 0.35 + 0.25, // 0.25–0.60
      phase: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    let running = true;

    const onVis = () => {
      running = !document.hidden;
      if (running) loop();
    };
    document.addEventListener("visibilitychange", onVis);

    const onResize = () => {
      w = c.offsetWidth;
      h = c.offsetHeight;
      c.width = w * DPR;
      c.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(c);

    function loop() {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, w, h);

      for (const p of P) {
        // движение
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // мягкое «дыхание» прозрачности
        p.phase += BREATH_SPEED;
        const a = p.baseA * (0.75 + 0.25 * Math.sin(p.phase)); // 75–100% от baseA

        ctx.globalAlpha = a;
        ctx.fillStyle = COLOR;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    loop();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Не перехватывает клики, лежит под контентом
  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden
    />
  );
}