// Performance utilities for optimizing the application

export interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLowEnd: boolean;
  hasGoodConnection: boolean;
  supportsWebP: boolean;
  supportsAVIF: boolean;
  hardwareConcurrency: number;
  deviceMemory: number;
}

export function detectDeviceCapabilities(): DeviceCapabilities {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
  
  // Device type detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  
  // Hardware capabilities
  const hardwareConcurrency = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 1 : 4;
  const deviceMemory = typeof navigator !== 'undefined' ? (navigator as any).deviceMemory || 1 : 4;
  
  // Connection quality
  const connection = typeof navigator !== 'undefined' ? (navigator as any).connection : null;
  const hasGoodConnection = !connection || 
    !connection.effectiveType || 
    ['4g', '3g'].includes(connection.effectiveType);
  
  // Low-end device detection
  const isLowEnd = isMobile || hardwareConcurrency <= 2 || deviceMemory <= 2 || !hasGoodConnection;
  
  // Image format support detection
  const supportsWebP = typeof window !== 'undefined' ? 
    document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0 : true;
  
  const supportsAVIF = typeof window !== 'undefined' ? 
    document.createElement('canvas').toDataURL('image/avif').indexOf('data:image/avif') === 0 : false;

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLowEnd,
    hasGoodConnection,
    supportsWebP,
    supportsAVIF,
    hardwareConcurrency,
    deviceMemory
  };
}

export function getOptimalImageFormat(capabilities: DeviceCapabilities): 'avif' | 'webp' | 'jpeg' {
  if (capabilities.supportsAVIF && capabilities.hasGoodConnection) return 'avif';
  if (capabilities.supportsWebP) return 'webp';
  return 'jpeg';
}

export function getOptimalImageQuality(capabilities: DeviceCapabilities): number {
  if (capabilities.isLowEnd || !capabilities.hasGoodConnection) return 60;
  if (capabilities.isMobile) return 75;
  return 85;
}

export function shouldUseAnimations(capabilities: DeviceCapabilities): boolean {
  // Check user preference first
  if (typeof window !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return false;
  }
  
  return !capabilities.isLowEnd;
}

export function getOptimalRefreshInterval(capabilities: DeviceCapabilities, baseInterval: number): number {
  if (capabilities.isLowEnd || !capabilities.hasGoodConnection) {
    return baseInterval * 2; // Double the interval for low-end devices
  }
  return baseInterval;
}

// Performance monitoring utilities
export class PerformanceTracker {
  private static instance: PerformanceTracker;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  startTiming(label: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(`${label}-start`);
    }
  }

  endTiming(label: string): number {
    if (typeof performance === 'undefined') return 0;
    
    try {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);
      
      const measure = performance.getEntriesByName(label, 'measure')[0];
      const duration = measure.duration;
      
      // Store metric
      if (!this.metrics.has(label)) {
        this.metrics.set(label, []);
      }
      this.metrics.get(label)!.push(duration);
      
      // Clean up
      performance.clearMarks(`${label}-start`);
      performance.clearMarks(`${label}-end`);
      performance.clearMeasures(label);
      
      return duration;
    } catch (error) {
      console.warn('Performance measurement failed:', error);
      return 0;
    }
  }

  getAverageTime(label: string): number {
    const times = this.metrics.get(label);
    if (!times || times.length === 0) return 0;
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  logMetrics(): void {
    if (process.env.NODE_ENV === 'development') {
      console.group('Performance Metrics');
      this.metrics.forEach((times, label) => {
        const avg = this.getAverageTime(label);
        console.log(`${label}: ${avg.toFixed(2)}ms (${times.length} samples)`);
      });
      console.groupEnd();
    }
  }
}

// HOC for performance tracking
export function withPerformanceTracking<T extends object>(
  Component: React.ComponentType<T>,
  componentName: string
) {
  return function PerformanceTrackedComponent(props: T) {
    const tracker = PerformanceTracker.getInstance();
    
    useEffect(() => {
      tracker.startTiming(`${componentName}-render`);
      
      return () => {
        tracker.endTiming(`${componentName}-render`);
      };
    }, [tracker]);

    return <Component {...props} />;
  };
}