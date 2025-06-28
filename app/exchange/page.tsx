"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  CheckCircle, 
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Star,
  Users,
  Award,
  BarChart3
} from 'lucide-react';
import { UnifiedVantaBackground } from '@/components/shared/UnifiedVantaBackground';
import { ManifestoStrip } from '@/components/ui/manifesto-strip';
import ExchangeCalculator from '@/components/ExchangeCalculator';
import RatesComparison from '@/components/RatesComparison';
import Image from 'next/image';

// Оптимизированные варианты анимации с tween вместо spring
const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// Компонент для ленивой загрузки видео
const LazyVideo = ({ src, className = "", style = {} }: { 
  src: string, 
  className?: string,
  style?: React.CSSProperties
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Загружаем и воспроизводим видео только когда оно в поле зрения
  useEffect(() => {
    if (inView && videoRef.current) {
      // Устанавливаем src только когда элемент в поле зрения
      videoRef.current.src = src;
      
      // Обработчик события загрузки
      const handleLoaded = () => {
        setIsLoaded(true);
        videoRef.current?.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.warn('Autoplay failed:', err);
        });
      };
      
      videoRef.current.addEventListener('loadeddata', handleLoaded);
      
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadeddata', handleLoaded);
          videoRef.current.pause();
          videoRef.current.src = '';
        }
      };
    }
  }, [inView, src]);

  // Определяем, нужно ли использовать мобильную версию (изображение вместо видео)
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div ref={ref} className={`lazy-video-container ${className}`} style={style}>
      {/* Плейсхолдер, который показывается до загрузки видео */}
      {!isLoaded && (
        <div className="lazy-video-placeholder">
          <div className="w-12 h-12 rounded-full border-4 border-[#001D8D]/20 border-t-[#001D8D] animate-spin"></div>
        </div>
      )}
      
      {/* На мобильных устройствах показываем изображение вместо видео */}
      {isMobile ? (
        <img 
          src="/images/video-placeholder.jpg" 
          alt="Video preview" 
          className={`lazy-video ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            objectFit: 'cover',
            objectPosition: 'center bottom',
            ...style
          }}
        />
      ) : (
        <video
          ref={videoRef}
          className={`lazy-video ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          muted
          loop
          playsInline
          preload="none"
          poster="/images/video-placeholder.jpg"
          style={{
            objectFit: 'cover',
            objectPosition: 'center bottom',
            ...style
          }}
        />
      )}
    </div>
  );
};

// Данные для манифест ленты преимуществ обмена
const exchangeAdvantages = [
  {
    id: 'real-time-rates',
    number: '01',
    title: 'Рыночные курсы в реальном времени',
    description: 'Наши курсы обновляются каждые 30 секунд, обеспечивая вам самые актуальные и конкурентные цены на рынке обмена. Мы используем передовые алгоритмы для мониторинга множества источников и предоставления оптимальных курсов.',
    priority: 1,
    color: '#3b82f6'
  },
  {
    id: 'transparency',
    number: '02',
    title: 'Полная прозрачность операций',
    description: 'Все комиссии включены в курс обмена. Никаких скрытых платежей или дополнительных сборов. Вы видите итоговую сумму до подтверждения сделки. Полная прозрачность на каждом этапе процесса обмена.',
    priority: 2,
    color: '#10b981'
  },
  {
    id: 'security',
    number: '03',
    title: 'Безопасный процесс обмена',
    description: 'Многоуровневая система защиты, шифрование данных и соответствие международным стандартам безопасности для защиты ваших средств. Банковский уровень защиты для всех транзакций.',
    priority: 3,
    color: '#8b5cf6'
  },
  {
    id: 'updates',
    number: '04',
    title: 'Регулярные обновления курсов',
    description: 'Мониторинг рынка 24/7 и автоматическое обновление курсов каждые 30 секунд гарантируют, что вы всегда получаете лучшую цену. Наша система работает круглосуточно для вашей выгоды.',
    priority: 4,
    color: '#f97316'
  },
  {
    id: 'comparison',
    number: '05',
    title: 'Легкое сравнение предложений',
    description: 'Сравнивайте курсы разных обменников в одном месте. Мы показываем лучшие предложения рынка для принятия обоснованных решений. Все данные в удобном формате для быстрого анализа.',
    priority: 5,
    color: '#06b6d4'
  },
  {
    id: 'professional',
    number: '06',
    title: 'Профессиональный сервис',
    description: 'Многолетний опыт работы, тысячи довольных клиентов и высокие рейтинги доверия. Мы предоставляем сервис мирового класса с индивидуальным подходом к каждому клиенту.',
    priority: 6,
    color: '#6366f1'
  }
];

// Мемоизированный компонент для секции с манифестом
const ManifestoSection = React.memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    viewport={{ once: true }}
    className="max-w-7xl mx-auto"
  >
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-[#001D8D]/10 text-[#001D8D] px-6 py-3 text-lg mb-8 font-medium">
        <BarChart3 className="h-6 w-6" />
        Преимущества нашего обмена
      </div>
      <h2 className="text-4xl md:text-5xl font-bold text-[#001D8D] mb-6 tracking-tight">
        Почему выбирают KenigSwap
      </h2>
      <p className="text-xl text-[#001D8D]/70 max-w-4xl mx-auto leading-relaxed">
        Мы предоставляем комплексное решение для обмена криптовалют с фокусом на безопасность, 
        скорость и прозрачность. Каждое преимущество создано для вашего удобства и выгоды.
      </p>
    </div>

    {/* Manifesto Strip Component */}
    <ManifestoStrip values={exchangeAdvantages} />
  </motion.div>
));

ManifestoSection.displayName = 'ManifestoSection';

// Мемоизированный компонент для CTA секции
const CtaSection = React.memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    viewport={{ once: true }}
    className="text-center bg-gradient-to-r from-[#001D8D] to-blue-700 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-50" />
    <div className="relative z-10">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        Готовы получить лучший курс обмена?
      </h2>
      <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
        Начните обмен прямо сейчас и убедитесь в преимуществах нашего профессионального сервиса. 
        Получите конкурентные курсы и полную безопасность ваших средств.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-white text-[#001D8D] hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Начать обмен сейчас
        </button>
        <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2">
          <ArrowRight className="h-5 w-5" />
          Узнать больше о сервисе
        </button>
      </div>
    </div>
  </motion.div>
));

CtaSection.displayName = 'CtaSection';

// Мемоизированный компонент для заголовка
const PageHeader = React.memo(() => (
  <motion.div
    variants={fadeInVariants}
    initial="hidden"
    animate="visible"
    className="text-center mb-16"
  >
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#001D8D]">
      Профессиональный обмен криптовалют
    </h1>
    <p className="text-xl md:text-2xl text-[#001D8D]/80 max-w-4xl mx-auto leading-relaxed mb-8">
      Получите лучшие курсы обмена с полной прозрачностью и гарантией безопасности. 
      Мы предлагаем конкурентные цены и надежный сервис для всех ваших потребностей в обмене криптовалют.
    </p>
    
    {/* Trust indicators */}
    <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-[#001D8D]/70 mb-8">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <span>Лицензированный обменник</span>
      </div>
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-blue-600" />
        <span>Полная безопасность</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-purple-600" />
        <span>Обмен за 15 минут</span>
      </div>
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-orange-600" />
        <span>Лучшие курсы на рынке</span>
      </div>
    </div>

    {/* CTA Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button className="bg-[#001D8D] text-white hover:bg-[#001D8D]/90 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
        <TrendingUp className="h-5 w-5 mr-2 inline" />
        Начать обмен сейчас
      </button>
      <button className="border-2 border-[#001D8D]/30 text-[#001D8D] hover:bg-[#001D8D]/10 px-8 py-4 rounded-lg font-semibold transition-all duration-300">
        <ArrowRight className="h-5 w-5 mr-2 inline" />
        Узнать больше о сервисе
      </button>
    </div>
  </motion.div>
));

PageHeader.displayName = 'PageHeader';

// Оптимизированный компонент для видео-секции
const VideoFeatureSection = React.memo(({ 
  videoSrc, 
  title, 
  description, 
  features,
  reversed = false
}: { 
  videoSrc: string, 
  title: string, 
  description: string, 
  features: Array<{icon: any, title: string, description: string}>,
  reversed?: boolean
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Определяем, нужно ли использовать мобильную версию (изображение вместо видео)
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      viewport={{ once: true }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
    >
      {/* Видео контейнер с ленивой загрузкой */}
      <div className={`order-2 ${reversed ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="relative mx-auto" style={{ 
          width: '480px', 
          height: '560px',
          maxWidth: '100%'
        }}>
          {inView ? (
            isMobile ? (
              <Image
                src="/images/video-placeholder.jpg"
                alt={title}
                width={480}
                height={560}
                className="w-full h-full object-cover rounded-lg shadow-lg"
                style={{
                  objectPosition: 'center bottom',
                  borderRadius: '8px'
                }}
              />
            ) : (
              <video
                src={videoSrc}
                className="w-full h-full object-cover rounded-lg shadow-lg"
                autoPlay={inView}
                muted
                loop
                playsInline
                preload="none"
                poster="/images/video-placeholder.jpg"
                style={{
                  objectPosition: 'center bottom',
                  borderRadius: '8px'
                }}
              />
            )
          ) : (
            <div 
              className="w-full h-full bg-gray-200 rounded-lg animate-pulse"
              style={{
                borderRadius: '8px'
              }}
            />
          )}
        </div>
      </div>
      
      {/* Текстовый контент */}
      <div className={`order-1 ${reversed ? 'lg:order-2' : 'lg:order-1'} space-y-6`}>
        <div className="inline-flex items-center gap-2 bg-[#001D8D]/10 text-[#001D8D] px-4 py-2 rounded-full text-sm font-medium">
          <Shield className="h-4 w-4" />
          {title}
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D]">
          {title}
        </h2>
        
        <p className="text-lg text-[#001D8D]/70 leading-relaxed">
          {description}
        </p>
        
        <div className="space-y-4">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <feature.icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-[#001D8D]">{feature.title}</h4>
                <p className="text-sm text-[#001D8D]/70">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

VideoFeatureSection.displayName = 'VideoFeatureSection';

export default function ExchangePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
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

  // Мемоизированные компоненты для основных секций
  const exchangeSection = useMemo(() => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Exchange Calculator */}
      <motion.div
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
        className="col-span-1"
      >
        <ExchangeCalculator />
      </motion.div>

      {/* Right Column - Rates Comparison */}
      <motion.div
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
        className="col-span-1"
      >
        <RatesComparison />
      </motion.div>
    </div>
  ), [fadeInVariants]);

  // Мемоизированные видео-секции
  const videoFeatures = useMemo(() => (
    <>
      <VideoFeatureSection
        videoSrc="https://assets.revolut.com/published-assets-v3/b1f70228-8ed2-4e1d-a51d-10751333535f/007cc12b-da09-4a4d-bd11-608e4e6d9c21.mp4"
        title="Банковский уровень безопасности"
        description="Используем передовые технологии шифрования и многоуровневую систему защиты. Все транзакции проходят через защищенные каналы с соблюдением международных стандартов безопасности."
        features={[
          {
            icon: CheckCircle,
            title: "256-битное шифрование",
            description: "Тот же уровень защиты, что используют банки"
          },
          {
            icon: Shield,
            title: "Соответствие AML/KYC",
            description: "Полное соблюдение международных требований"
          },
          {
            icon: Award,
            title: "Лицензированная деятельность",
            description: "Официальная регистрация и лицензии"
          }
        ]}
      />

      <VideoFeatureSection
        videoSrc="https://assets.revolut.com/published-assets-v3/245e191d-9293-4ae8-b3f0-460d94bf1801/88405c02-8743-48ef-94a8-ba5910176157.mp4"
        title="Мгновенные операции"
        description="Автоматизированная система обработки транзакций обеспечивает максимальную скорость. Большинство операций завершается менее чем за 15 минут с момента подтверждения."
        features={[
          {
            icon: Clock,
            title: "Быстрая обработка",
            description: "Минимальное время ожидания"
          },
          {
            icon: Zap,
            title: "Автоматизированные процессы",
            description: "Мгновенная обработка транзакций"
          },
          {
            icon: Globe,
            title: "Работа 24/7",
            description: "Круглосуточная поддержка и обработка"
          }
        ]}
        reversed={true}
      />
    </>
  ), []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden scroll-optimized">
      {/* Main Content Section with unified background */}
      <section className="relative py-20 bg-gradient-to-b from-white via-blue-50/10 to-blue-100/20 overflow-hidden">
        {/* Background - упрощенный для лучшей производительности */}
        <div className="absolute inset-0 opacity-15">
          <UnifiedVantaBackground 
            type="dots" // Используем dots вместо topology для лучшей производительности
            color={0x94bdff}
            color2={0xFF6B35}
            backgroundColor={0xffffff}
            points={10}
            maxDistance={15}
            spacing={20}
            showDots={true}
            speed={0.8}
            mouseControls={false} // Отключаем для экономии ресурсов
            touchControls={false} // Отключаем для экономии ресурсов
            forceAnimate={false} // Отключаем принудительную анимацию
          />
        </div>

        {/* Gradient transitions */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-5" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-blue-100/20 z-5" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="space-y-24">
            
            {/* Hero Section */}
            <PageHeader />

            {/* Main Exchange Section */}
            {exchangeSection}

            {/* Video Features */}
            {videoFeatures}

            {/* Manifesto Strip - Преимущества обмена */}
            <ManifestoSection />

            {/* Final CTA */}
            <CtaSection />

          </div>
        </div>
      </section>
    </div>
  );
}