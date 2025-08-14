"use client";

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  connectionType: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  isLowPerformance: boolean;
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    connectionType: 'unknown',
    deviceType: 'desktop',
    isLowPerformance: false
  });

  useEffect(() => {
    // Detect device type
    const detectDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    };

    // Detect connection type
    const detectConnectionType = (): string => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      return connection?.effectiveType || 'unknown';
    };

    // Detect low performance device
    const detectLowPerformance = (): boolean => {
      const hardwareConcurrency = navigator.hardwareConcurrency || 1;
      const deviceMemory = (navigator as any).deviceMemory || 1;
      const connectionType = detectConnectionType();
      
      return (
        hardwareConcurrency <= 2 ||
        deviceMemory <= 2 ||
        connectionType === 'slow-2g' ||
        connectionType === '2g' ||
        detectDeviceType() === 'mobile'
      );
    };

    // Monitor FPS
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };

    // Monitor memory usage
    const getMemoryUsage = (): number => {
      const memory = (performance as any).memory;
      if (memory) {
        return Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
      }
      return 0;
    };

    // Start monitoring
    measureFPS();
    
    const updateMetrics = () => {
      setMetrics({
        fps,
        memoryUsage: getMemoryUsage(),
        connectionType: detectConnectionType(),
        deviceType: detectDeviceType(),
        isLowPerformance: detectLowPerformance()
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  return metrics;
}

// Performance Monitor Component (for development)
export function PerformanceMonitor({ enabled = false }: { enabled?: boolean }) {
  const metrics = usePerformanceMonitor();

  if (!enabled || process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div>FPS: {metrics.fps}</div>
      <div>Memory: {metrics.memoryUsage}MB</div>
      <div>Connection: {metrics.connectionType}</div>
      <div>Device: {metrics.deviceType}</div>
      <div>Low Performance: {metrics.isLowPerformance ? 'Yes' : 'No'}</div>
    </div>
  );
}