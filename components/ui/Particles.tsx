"use client";

import { useEffect, useRef } from "react";

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
    c.width = w * DPR; c.height = h * DPR; ctx.scale(DPR, DPR);

    const N = Math.min(80, Math.round((w * h) / 20000));
    const P = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.6 + 0.6,
      a: Math.random() * 0.5 + 0.25
    }));

    let raf = 0, running = true;
    const onVis = () => { running = !document.hidden; if (running) loop(); };
    document.addEventListener("visibilitychange", onVis);

    const onResize = () => {
      w = c.offsetWidth; h = c.offsetHeight;
      c.width = w * DPR; c.height = h * DPR; ctx.setTransform(DPR,0,0,DPR,0,0);
    };
    const ro = new ResizeObserver(onResize); ro.observe(c);

    function loop() {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, w, h);
      for (const p of P) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
        ctx.globalAlpha = p.a;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    loop();

    return () => { running = false; cancelAnimationFrame(raf); ro.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none opacity-50" aria-hidden />;
}