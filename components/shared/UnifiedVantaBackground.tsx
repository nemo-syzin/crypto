"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';

// Динамический импорт THREE для уменьшения размера бандла
const THREE = dynamic(() => import('three').then(mod => mod), { 
  ssr: false,
  loading: () => null
});

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

// Статичный фоллбэк компонент для случаев, когда Vanta не может быть загружен
const StaticBackground = ({ 
  color = 0xFF6B35, 
  color2 = 0x001D8D, 
  className = "absolute inset-0 w-full h-full" 
}) => (
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

export function UnifiedVantaBackground({
  type,
  color = 0xFF6B35,          
  color2 = 0x001D8D,         
  backgroundColor = 0xffffff,
  mouseControls = false, // Отключаем по умолчанию для экономии ресурсов
  touchControls = false, // Отключаем по умолчанию для экономии ресурсов
  gyroControls = false,
  minHeight = 200,
  minWidth = 200,
  scale = 1.0,
  scaleMobile = 1.0,
  className = "absolute inset-0 w-full h-full",
  
  // Topology props - уменьшаем значения для лучшей производительности
  points = 8, // Уменьшено с 12
  maxDistance = 15, // Уменьшено с 22
  spacing = 25, // Увеличено с 20 для меньшего количества точек
  showDots = true,
  speed = 0.8, // Уменьшено с 1.0
  forceAnimate = false, // Отключаем принудительную анимацию
  
  // Dots props
  size = 1.5, // Уменьшено с 2.0
  showLines = false // Отключаем линии для лучшей производительности
}: UnifiedVantaBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Используем IntersectionObserver для загрузки эффекта только когда он в поле зрения
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Объединяем refs
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      // Ref для Vanta
      vantaRef.current = node;
      // Ref для IntersectionObserver
      inViewRef(node);
    },
    [inViewRef]
  );

  // Проверка предпочтений пользователя и возможностей устройства
  useEffect(() => {
    setIsClient(true);
    
    // Проверка prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Проверка возможностей GPU
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Проверка на мобильное устройство
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Проверка на низкопроизводительное устройство
      const isLowEnd = 
        navigator.hardwareConcurrency <= 4 || 
        /Intel/i.test(navigator.userAgent) || 
        isMobile;
      
      setIsLowPowerMode(isLowEnd);
    }
  }, []);

  // Основной эффект для инициализации Vanta
  useEffect(() => {
    // Если компонент не в клиенте, предпочитает уменьшенное движение или устройство слабое - используем фоллбэк
    if (!isClient || prefersReducedMotion || isLowPowerMode) {
      setFallbackMode(true);
      return;
    }

    // Если компонент не в поле зрения, не инициализируем Vanta
    if (!inView) {
      return;
    }

    // Очистка предыдущего эффекта
    if (vantaEffect.current) {
      try {
        vantaEffect.current.destroy();
      } catch (error) {
        console.warn('Warning during effect cleanup:', error);
      }
      vantaEffect.current = null;
    }

    // Используем requestIdleCallback или setTimeout для отложенной инициализации
    const initVantaEffect = () => {
      if (!vantaRef.current || vantaEffect.current) return;

      // Динамический импорт нужного эффекта
      const loadEffect = async () => {
        try {
          // Глобальный THREE для Vanta
          if (!(window as any).THREE && THREE) {
            (window as any).THREE = THREE;
          }

          let VantaEffect;
          
          if (type === 'dots') {
            const dotsModule = await import('vanta/dist/vanta.dots.min');
            VantaEffect = dotsModule.default;
          } else if (type === 'globe') {
            const globeModule = await import('vanta/dist/vanta.globe.min');
            VantaEffect = globeModule.default;
          } else {
            // Для topology используем dots как фоллбэк
            const dotsModule = await import('vanta/dist/vanta.dots.min');
            VantaEffect = dotsModule.default;
            type = 'dots'; // Переключаемся на dots
          }

          if (!vantaRef.current || !VantaEffect) return;

          // Базовая конфигурация
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

          // Добавляем специфичные настройки
          if (type === 'dots') {
            config = {
              ...config,
              size,
              spacing,
              showLines
            };
          } else if (type === 'globe') {
            config = {
              ...config,
              color2,
              size: size || 1.0
            };
          }

          // Инициализируем эффект
          vantaEffect.current = VantaEffect(config);
          
        } catch (error) {
          console.warn('Failed to initialize Vanta effect:', error);
          setFallbackMode(true);
        }
      };

      // Используем requestIdleCallback или setTimeout для отложенной инициализации
      if (typeof window !== 'undefined') {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(loadEffect);
        } else {
          setTimeout(loadEffect, 200);
        }
      }
    };

    initVantaEffect();

    // Очистка при размонтировании
    return () => {
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy();
        } catch (error) {
          console.warn('Warning during effect cleanup:', error);
        }
        vantaEffect.current = null;
      }
    };
  }, [
    isClient, 
    inView, 
    prefersReducedMotion, 
    isLowPowerMode, 
    type, 
    color, 
    color2, 
    backgroundColor, 
    mouseControls, 
    touchControls, 
    gyroControls, 
    minHeight, 
    minWidth, 
    scale, 
    scaleMobile, 
    points, 
    maxDistance, 
    spacing, 
    showDots, 
    speed, 
    forceAnimate, 
    size, 
    showLines
  ]);

  // Рендерим фоллбэк, если нужно
  if (fallbackMode || prefersReducedMotion || isLowPowerMode || !isClient) {
    return <StaticBackground color={color} color2={color2} className={className} />;
  }

  // Рендерим контейнер для Vanta
  return (
    <div 
      ref={setRefs}
      className={className}
      style={{ 
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    />
  );
}