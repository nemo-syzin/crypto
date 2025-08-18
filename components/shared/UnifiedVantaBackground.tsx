"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from 'three';

interface UnifiedVantaBackgroundProps {
  type: 'topology' | 'dots' | 'globe';
  // Common props
  color?: number;
  color2?: number;           
  backgroundColor?: number;
  mouseControls?: boolean;
  touchControls?: boolean;
  gyroControls?: boolean;
  minHeight?: number;
  minWidth?: number;
  scale?: number;
  scaleMobile?: number;
  className?: string;
  
  // Topology-specific props
  points?: number;
  maxDistance?: number;
  spacing?: number;
  showDots?: boolean;
  speed?: number;
  forceAnimate?: boolean;
  
  // Dots-specific props
  size?: number;
  showLines?: boolean;
}

// Global flag to ensure p5.js is only loaded once
let p5LoadPromise: Promise<any> | null = null;
let p5Instance: any = null;
let hasP5LoadFailed = false;

// Device performance detection
const getDevicePerformance = (): 'low' | 'medium' | 'high' => {
  if (typeof window === 'undefined') return 'medium';
  
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as any).deviceMemory || 4;
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Low performance: mobile with few cores or low memory
  if (isMobile && (cores <= 2 || memory <= 2)) return 'low';
  
  // High performance: desktop with many cores and high memory
  if (!isMobile && cores >= 8 && memory >= 8) return 'high';
  
  // Medium performance: everything else
  return 'medium';
};

// Get optimized parameters based on device performance
const getOptimizedParams = (type: string, performance: 'low' | 'medium' | 'high', originalParams: any) => {
  const multipliers = {
    low: { points: 0.4, maxDistance: 0.6, spacing: 1.5, speed: 0.3, size: 0.7 },
    medium: { points: 0.7, maxDistance: 0.8, spacing: 1.2, speed: 0.6, size: 0.85 },
    high: { points: 1.0, maxDistance: 1.0, spacing: 1.0, speed: 1.0, size: 1.0 }
  };
  
  const mult = multipliers[performance];
  
  if (type === 'topology') {
    return {
      points: Math.max(3, Math.floor((originalParams.points || 15) * mult.points)),
      maxDistance: Math.max(8, Math.floor((originalParams.maxDistance || 20) * mult.maxDistance)),
      spacing: Math.max(8, Math.floor((originalParams.spacing || 16) * mult.spacing)),
      speed: (originalParams.speed || 1.4) * mult.speed
    };
  } else if (type === 'dots') {
    return {
      size: (originalParams.size || 2.0) * mult.size,
      spacing: Math.max(8, Math.floor((originalParams.spacing || 20) * mult.spacing))
    };
  }
  
  return {};
};
export function UnifiedVantaBackground({
  type,
  color = 0xFF6B35,          
  color2 = 0x001D8D,         
  backgroundColor = 0xffffff,
  mouseControls = true,
  touchControls = true,
  gyroControls = false,
  minHeight = 200,
  minWidth = 200,
  scale = 1.0,
  scaleMobile = 1.0,
  className = "absolute inset-0 w-full h-full",
  
  // Topology props
  points = 12,
  maxDistance = 22,
  spacing = 20,
  showDots = true,
  speed = 1.0,
  forceAnimate = true,
  
  // Dots props
  size = 2.0,
  showLines = true
}: UnifiedVantaBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [vantaInitialized, setVantaInitialized] = useState(false);
  const [devicePerformance, setDevicePerformance] = useState<'low' | 'medium' | 'high'>('medium');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const performanceCheckRef = useRef<boolean>(false);

  useEffect(() => {
    // Detect device performance once
    if (!performanceCheckRef.current && typeof window !== 'undefined') {
      const performance = getDevicePerformance();
      setDevicePerformance(performance);
      performanceCheckRef.current = true;
      
      // For very low performance devices, skip Vanta entirely
      if (performance === 'low') {
        console.warn('⚠️ Low performance device detected, using fallback mode');
        setFallbackMode(true);
        return;
      }
    }

    // Performance optimization: pause effect when not visible
    if (typeof window !== 'undefined' && vantaRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
          
          // Pause/resume effect based on visibility
          if (vantaEffect.current) {
            if (entry.isIntersecting) {
              // Resume animation
              if (vantaEffect.current.resume) {
                vantaEffect.current.resume();
              }
            } else {
              // Pause animation to save resources
              if (vantaEffect.current.pause) {
                vantaEffect.current.pause();
              }
            }
          }
        },
        { threshold: 0.05, rootMargin: '50px' }
      );
      
      observerRef.current.observe(vantaRef.current);
    }

    let mounted = true;

    const initVanta = async () => {
      try {
        if (!mounted || !vantaRef.current || vantaEffect.current || fallbackMode) return;

        // Only run on client side
        if (typeof window === 'undefined') return;

        // If p5 loading has failed before, skip topology
        if (hasP5LoadFailed && type === 'topology') {
          console.warn('⚠️ p5.js previously failed to load, skipping topology effect');
          setFallbackMode(true);
          return;
        }

        // Cleanup any existing effect first
        if (vantaEffect.current) {
          try {
            vantaEffect.current.destroy();
          } catch (error) {
            console.warn('Warning during effect cleanup:', error);
          }
          vantaEffect.current = null;
          setVantaInitialized(false);
        }

        // Ensure THREE is available globally
        if (!(window as any).THREE) {
          (window as any).THREE = THREE;
        }

        let VantaEffect;

        // Import dependencies based on type with enhanced error handling
        if (type === 'topology') {
          try {
            // Ensure p5.js is properly loaded and initialized - only on client side
            if (!p5LoadPromise && typeof window !== 'undefined') {
              p5LoadPromise = import('p5').then(p5Module => {
                const P5Constructor = p5Module.default;
                
                // Store the p5 instance globally
                p5Instance = P5Constructor;
                (window as any).__P5__ = P5Constructor;
                (window as any).p5 = P5Constructor;
                
                console.log('✅ p5.js loaded and assigned to window.p5');
                
                return P5Constructor;
              }).catch(error => {
                console.warn('⚠️ Failed to load p5.js:', error);
                hasP5LoadFailed = true;
                throw error;
              });
            }
            
            // Wait for p5.js to be completely loaded and ready
            if (p5LoadPromise) {
              await p5LoadPromise;
            }
            
            // Shorter delay for better responsiveness
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Double-check that p5 is available and properly initialized
            if (!(window as any).p5 || !p5Instance) {
              throw new Error('p5.js failed to initialize properly');
            }

            // Only import Vanta topology after p5.js is confirmed ready
            const topologyModule = await import('vanta/dist/vanta.topology.min');
            VantaEffect = topologyModule.default;
            
            // Additional safety check
            if (!VantaEffect) {
              throw new Error('Vanta topology module failed to load');
            }
            
          } catch (p5Error) {
            console.warn('⚠️ p5.js or topology loading failed, falling back to dots effect:', p5Error);
            hasP5LoadFailed = true;
            
            // Fallback to dots effect
            try {
              const dotsModule = await import('vanta/dist/vanta.dots.min');
              VantaEffect = dotsModule.default;
              console.log('✅ Fallback to dots effect successful');
            } catch (fallbackError) {
              console.warn('⚠️ Fallback to dots also failed:', fallbackError);
              setFallbackMode(true);
              return;
            }
          }
          
        } else if (type === 'dots') {
          try {
            const dotsModule = await import('vanta/dist/vanta.dots.min');
            VantaEffect = dotsModule.default;
          } catch (error) {
            console.warn('⚠️ Failed to load dots effect:', error);
            setFallbackMode(true);
            return;
          }
        } else if (type === 'globe') {
          try {
            const globeModule = await import('vanta/dist/vanta.globe.min');
            VantaEffect = globeModule.default;
          } catch (error) {
            console.warn('⚠️ Failed to load globe effect:', error);
            setFallbackMode(true);
            return;
          }
        }

        if (!mounted || !vantaRef.current || !VantaEffect) return;

        // Get optimized parameters based on device performance
        const optimizedParams = getOptimizedParams(type, devicePerformance, {
          points, maxDistance, spacing, speed, size
        });
        // Build configuration based on type
        let config: any = {
          el: vantaRef.current,
          THREE: (window as any).THREE,
          mouseControls,
          touchControls,
          gyroControls,
          minHeight,
          minWidth,
          scale,
          scaleMobile,
          color,
          backgroundColor
        };

        // Add type-specific configurations
        if (type === 'topology' && !hasP5LoadFailed) {
          // Ensure p5 is available in config
          if (!(window as any).p5) {
            throw new Error('p5.js not available for topology initialization');
          }
          
          config = {
            ...config,
            p5: (window as any).p5,
            points: optimizedParams.points || points,
            maxDistance: optimizedParams.maxDistance || maxDistance,
            spacing: optimizedParams.spacing || spacing,
            showDots,
            speed: isVisible ? (optimizedParams.speed || speed) : 0.1,
            forceAnimate
          };
          console.log(`🎨 Topology with primary color: #${color.toString(16)}`);
        } else if (type === 'dots' || hasP5LoadFailed) {
          config = {
            ...config,
            size: optimizedParams.size || size,
            spacing: optimizedParams.spacing || spacing,
            showLines
          };
          console.log(`🔵 Dots with primary color: #${color.toString(16)}`);
        } else if (type === 'globe') {
          config = {
            ...config,
            color2,
            size: optimizedParams.size || size || 1.0
          };
          console.log(`🌍 Globe with dual colors: #${color.toString(16)} + #${color2.toString(16)}`);
        }

        console.log(`🎨 Initializing Unified Vanta ${type} with dual-color config:`, config);

        // Initialize the effect with additional error handling
        try {
          vantaEffect.current = VantaEffect(config);
          setVantaInitialized(true);
          console.log(`✅ Unified Vanta ${type} initialized successfully with dual colors`);
        } catch (initError) {
          console.warn(`⚠️ Vanta ${type} initialization failed:`, initError);
          // Clean up on initialization failure
          if (vantaEffect.current) {
            try {
              vantaEffect.current.destroy();
            } catch (destroyError) {
              console.warn('Error during cleanup:', destroyError);
            }
            vantaEffect.current = null;
          }
          setVantaInitialized(false);
          setFallbackMode(true);
        }

      } catch (error) {
        console.warn(`⚠️ Failed to initialize Unified Vanta ${type}:`, error);
        setVantaInitialized(false);
        setFallbackMode(true);
      }
    };

    // Only initialize on client side with increased delay
    if (typeof window !== 'undefined') {
      const timer = setTimeout(initVanta, 500);
      
      return () => {
        mounted = false;
        clearTimeout(timer);
        
        // Cleanup intersection observer
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
        
        if (vantaEffect.current) {
          try {
            vantaEffect.current.destroy();
          } catch (error) {
            console.warn(`⚠️ Unified Vanta ${type} cleanup warning:`, error);
          } finally {
            vantaEffect.current = null;
            setVantaInitialized(false);
          }
        }
      };
    }

    return () => {
      mounted = false;
    };
  }, [type, color, color2, backgroundColor, mouseControls, touchControls, gyroControls, minHeight, minWidth, scale, scaleMobile, points, maxDistance, spacing, showDots, speed, forceAnimate, size, showLines, devicePerformance]);

  // Add page visibility API support for better performance
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleVisibilityChange = () => {
      if (vantaEffect.current) {
        if (document.hidden) {
          // Page is hidden, pause animation
          if (vantaEffect.current.pause) {
            vantaEffect.current.pause();
          }
        } else {
          // Page is visible, resume animation
          if (vantaEffect.current.resume) {
            vantaEffect.current.resume();
          }
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  // Render fallback if needed
  if (fallbackMode || !vantaInitialized) {
    return (
      <div 
        className={className}
        style={{ 
          background: `linear-gradient(135deg, ${color ? `#${color.toString(16).padStart(6, '0')}20` : '#94bdff20'}, ${color2 ? `#${color2.toString(16).padStart(6, '0')}10` : '#001D8D10'})`,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      />
    );
  }

  return vantaInitialized ? (
    <div 
      ref={vantaRef} 
      className={className}
      style={{ 
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    />
  ) : (
    <div 
      className={className}
      style={{ 
        background: `linear-gradient(135deg, ${color ? `#${color.toString(16).padStart(6, '0')}20` : '#94bdff20'}, ${color2 ? `#${color2.toString(16).padStart(6, '0')}10` : '#001D8D10'})`,
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    />
  );
}