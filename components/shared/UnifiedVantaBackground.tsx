"use client";

import { useEffect, useRef } from "react";
import * as THREE from 'three';

interface UnifiedVantaBackgroundProps {
  type: 'topology' | 'dots' | 'globe';
  // Common props
  color?: number;
  color2?: number;           // 🎨 ВТОРОЙ ЦВЕТ для двухцветных эффектов
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
  
  // Globe-specific props (already supports dual colors)
  // color2 is used for globe secondary color
}

// Global flag to ensure p5.js is only loaded once
let p5LoadPromise: Promise<any> | null = null;
let p5Instance: any = null;

export function UnifiedVantaBackground({
  type,
  color = 0xFF6B35,          // 🔥 ОСНОВНОЙ ЦВЕТ - оранжевый
  color2 = 0x001D8D,         // 🔵 ДОПОЛНЯЮЩИЙ ЦВЕТ - синий
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

  useEffect(() => {
    let mounted = true;

    const initVanta = async () => {
      try {
        if (!mounted || !vantaRef.current || vantaEffect.current) return;

        // Only run on client side
        if (typeof window === 'undefined') return;

        // Cleanup any existing effect first
        if (vantaEffect.current) {
          vantaEffect.current.destroy();
          vantaEffect.current = null;
        }

        // Ensure THREE is available globally
        if (!(window as any).THREE) {
          (window as any).THREE = THREE;
        }

        let VantaEffect;

        // Import dependencies based on type
        if (type === 'topology') {
          // Ensure p5.js is properly loaded and initialized - only on client side
          if (!p5LoadPromise && typeof window !== 'undefined') {
            p5LoadPromise = import('p5').then(p5Module => {
              const P5Constructor = p5Module.default;
              
              // Store the p5 instance globally
              p5Instance = P5Constructor;
              (window as any).__P5__ = P5Constructor;
              (window as any).p5 = P5Constructor;
              
              console.log('✅ p5.js loaded and assigned to window.p5');
              
              // Increased delay to ensure p5.js is fully ready
              return new Promise(resolve => {
                setTimeout(() => {
                  resolve(P5Constructor);
                }, 1500);
              });
            });
          }
          
          // Wait for p5.js to be completely loaded and ready
          if (p5LoadPromise) {
            await p5LoadPromise;
          }
          
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
          
        } else if (type === 'dots') {
          const dotsModule = await import('vanta/dist/vanta.dots.min');
          VantaEffect = dotsModule.default;
        } else if (type === 'globe') {
          const globeModule = await import('vanta/dist/vanta.globe.min');
          VantaEffect = globeModule.default;
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
          scale,
          scaleMobile,
          color,
          backgroundColor
        };

        // Add type-specific configurations
        if (type === 'topology') {
          // Ensure p5 is available in config
          if (!(window as any).p5) {
            throw new Error('p5.js not available for topology initialization');
          }
          
          config = {
            ...config,
            p5: (window as any).p5,
            points,
            maxDistance,
            spacing,
            showDots,
            speed,
            forceAnimate
          };
          console.log(`🎨 Topology with primary color: #${color.toString(16)}`);
        } else if (type === 'dots') {
          config = {
            ...config,
            size,
            spacing,
            showLines
          };
          console.log(`🔵 Dots with primary color: #${color.toString(16)}`);
        } else if (type === 'globe') {
          config = {
            ...config,
            color2,
            size: size || 1.0
          };
          console.log(`🌍 Globe with dual colors: #${color.toString(16)} + #${color2.toString(16)}`);
        }

        console.log(`🎨 Initializing Unified Vanta ${type} with dual-color config:`, config);

        // Initialize the effect with additional error handling
        try {
          vantaEffect.current = VantaEffect(config);
          console.log(`✅ Unified Vanta ${type} initialized successfully with dual colors`);
        } catch (initError) {
          console.error(`❌ Vanta ${type} initialization failed:`, initError);
          // Clean up on initialization failure
          if (vantaEffect.current) {
            try {
              vantaEffect.current.destroy();
            } catch (destroyError) {
              console.warn('Error during cleanup:', destroyError);
            }
            vantaEffect.current = null;
          }
          throw initError;
        }

      } catch (error) {
        console.error(`❌ Failed to initialize Unified Vanta ${type}:`, error);
        
        // Fallback: if topology fails, we could potentially switch to a simpler effect
        if (type === 'topology' && mounted && vantaRef.current && typeof window !== 'undefined') {
          console.log('🔄 Attempting fallback to dots effect...');
          try {
            const dotsModule = await import('vanta/dist/vanta.dots.min');
            const DotsEffect = dotsModule.default;
            
            if (DotsEffect && vantaRef.current) {
              vantaEffect.current = DotsEffect({
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
                backgroundColor,
                size: 2.0,
                spacing: 20,
                showLines: true
              });
              console.log('✅ Fallback to dots effect successful');
            }
          } catch (fallbackError) {
            console.error('❌ Fallback effect also failed:', fallbackError);
          }
        }
      }
    };

    // Only initialize on client side with increased delay
    if (typeof window !== 'undefined') {
      const timer = setTimeout(initVanta, 200);
      
      return () => {
        mounted = false;
        clearTimeout(timer);
        
        if (vantaEffect.current) {
          try {
            vantaEffect.current.destroy();
          } catch (error) {
            console.warn(`⚠️ Unified Vanta ${type} cleanup warning:`, error);
          } finally {
            vantaEffect.current = null;
          }
        }
      };
    }

    return () => {
      mounted = false;
    };
  }, [type, color, color2, backgroundColor, mouseControls, touchControls, gyroControls, minHeight, minWidth, scale, scaleMobile, points, maxDistance, spacing, showDots, speed, forceAnimate, size, showLines]);

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