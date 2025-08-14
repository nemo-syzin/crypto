"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  points = 8,
  maxDistance = 15,
  spacing = 25,
  showDots = true,
  speed = 0.5,
  forceAnimate = true,
  
  // Dots props
  size = 2.0,
  showLines = true
}: UnifiedVantaBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [vantaInitialized, setVantaInitialized] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const performanceCheckRef = useRef<boolean>(false);

  // Performance detection
  const detectPerformance = useCallback(() => {
    if (performanceCheckRef.current) return;
    performanceCheckRef.current = true;

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
    
    if (shouldUseLowPerformance) {
      console.log('🔧 Low performance mode enabled:', { isMobileDevice, isLowEnd, isIntegratedGPU, hasWebGL: !!gl });
      setFallbackMode(true);
    }
  }, []);

  useEffect(() => {
    detectPerformance();
    
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
        { threshold: 0.05 }
      );
      
      observerRef.current.observe(vantaRef.current);
    }

    let mounted = true;

    const initVanta = async () => {
      try {
        if (!mounted || !vantaRef.current || vantaEffect.current || fallbackMode || isLowPerformance) return;

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
            
            // Reduced delay for faster initialization
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

        // Build configuration based on type
        let config: any = {
          el: vantaRef.current,
          THREE: (window as any).THREE,
          mouseControls,
          touchControls,
          gyroControls,
          minHeight,
          minWidth,
          scale: isMobile ? scaleMobile * 0.8 : scale,
          scaleMobile: scaleMobile * 0.8,
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
            points: isMobile ? Math.max(points - 4, 4) : points,
            maxDistance: isMobile ? Math.max(maxDistance - 7, 8) : maxDistance,
            spacing: isMobile ? spacing + 10 : spacing,
            showDots,
            speed: isVisible ? (isMobile ? speed * 0.5 : speed) : 0.1,
            forceAnimate
          };
          console.log(`🎨 Topology with primary color: #${color.toString(16)}`);
        } else if (type === 'dots' || hasP5LoadFailed) {
          config = {
            ...config,
            size: isMobile ? size * 0.8 : size,
            spacing: isMobile ? spacing + 5 : spacing,
            showLines
          };
          console.log(`🔵 Dots with primary color: #${color.toString(16)}`);
        } else if (type === 'globe') {
          config = {
            ...config,
            color2,
            size: isMobile ? (size || 1.0) * 0.7 : (size || 1.0)
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
  }, [type, color, color2, backgroundColor, mouseControls, touchControls, gyroControls, minHeight, minWidth, scale, scaleMobile, points, maxDistance, spacing, showDots, speed, forceAnimate, size, showLines, detectPerformance]);

  // Always render fallback for mobile or low performance devices
  if (fallbackMode || isLowPerformance || isMobile) {
    return (
      <div 
        className={className}
        style={{ 
          background: `linear-gradient(135deg, ${color ? `#${color.toString(16).padStart(6, '0')}15` : '#94bdff15'}, ${color2 ? `#${color2.toString(16).padStart(6, '0')}08` : '#001D8D08'})`,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      />
    );
  }

  // Only render Vanta container if initialized or initializing
  if (vantaInitialized || (!fallbackMode && !isLowPerformance && !isMobile)) {
    return (
      <div 
        ref={vantaRef} 
        className={className}
        style={{ 
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      />
    );
  }

  // Fallback gradient
  return (
    <div 
      className={className}
      style={{ 
        background: `linear-gradient(135deg, ${color ? `#${color.toString(16).padStart(6, '0')}15` : '#94bdff15'}, ${color2 ? `#${color2.toString(16).padStart(6, '0')}08` : '#001D8D08'})`,
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    />
  );
}