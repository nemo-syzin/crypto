"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface PerformanceOptimizedBackgroundProps {
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  intensity?: number;
}

export function PerformanceOptimizedBackground({
  className = "absolute inset-0 w-full h-full",
  primaryColor = "#94bdff",
  secondaryColor = "#FF6B35",
  intensity = 0.15
}: PerformanceOptimizedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Performance detection
  const detectPerformance = useCallback(() => {
    // Check if mobile device
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                          window.innerWidth < 768;
    setIsMobile(isMobileDevice);

    // Check hardware capabilities
    const hardwareConcurrency = navigator.hardwareConcurrency || 1;
    const isLowEnd = hardwareConcurrency <= 2;
    
    // Check GPU capabilities
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    let isIntegratedGPU = false;
    
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        isIntegratedGPU = renderer.includes('Intel') || renderer.includes('Mali') || renderer.includes('Adreno');
      }
    }

    // Set low performance mode for mobile or low-end devices
    const shouldUseLowPerformance = isMobileDevice || isLowEnd || isIntegratedGPU || !gl;
    setIsLowPerformance(shouldUseLowPerformance);
  }, []);

  // Lightweight particle animation
  const initLightweightAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    // Create fewer particles for better performance
    const particleCount = isMobile ? 15 : 25;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1
      });
    }

    const animate = () => {
      if (!isVisible) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 189, 255, ${particle.opacity})`;
        ctx.fill();
      });

      // Draw connections (only on desktop for performance)
      if (!isMobile && !isLowPerformance) {
        particles.forEach((particle, i) => {
          particles.slice(i + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(148, 189, 255, ${0.1 * (1 - distance / 100)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          });
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, isMobile, isLowPerformance]);

  useEffect(() => {
    detectPerformance();
    
    // Setup intersection observer for performance
    if (typeof window !== 'undefined' && canvasRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );
      
      observerRef.current.observe(canvasRef.current);
    }

    // Initialize lightweight animation if not low performance
    let cleanup: (() => void) | undefined;
    if (!isLowPerformance) {
      cleanup = initLightweightAnimation();
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (cleanup) {
        cleanup();
      }
    };
  }, [detectPerformance, initLightweightAnimation, isLowPerformance]);

  // Always render static gradient for low performance devices
  if (isLowPerformance || isMobile) {
    return (
      <div 
        className={className}
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}08)`,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      />
    );
  }

  // Render lightweight canvas animation for better performance
  return (
    <div className={className} style={{ zIndex: 0, pointerEvents: 'none', userSelect: 'none' }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ opacity: intensity }}
      />
    </div>
  );
}