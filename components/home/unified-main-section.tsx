"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { SolidTrustButton } from '@/components/ui/solid-trust-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowRight, 
  Wallet, 
  Shield, 
  Clock, 
  Building2, 
  Globe,
  CheckCircle,
  TrendingUp,
  Zap
} from 'lucide-react';
import { UnifiedVantaBackground } from '@/components/shared/UnifiedVantaBackground';

// Данные для секций
const features = [
  {
    icon: "https://coex.global/_ipx/w_400&f_avif/img/eth-light.png?v=1",
    title: "Выгодный курс",
    description: "Получите лучший курс обмена USDT на рубли на рынке, обновляемый в реальном времени для максимальной выгоды.",
  },
  {
    icon: "https://coex.global/_ipx/w_100&f_avif/img/shield-dark.png?v=1",
    title: "Полная безопасность",
    description: "Сквозное шифрование и защищенная обработка платежей гарантируют безопасность ваших транзакций и личных данных.",
  },
  {
    icon: "https://coex.global/_ipx/w_100&f_avif/img/timer-dark.png?v=1",
    title: "Быстрые транзакции",
    description: "Совершайте обмены быстро благодаря нашей оптимизированной системе - большинство транзакций завершается менее чем за 15 минут.",
  },
  {
    icon: "https://coex.global/_ipx/w_100&f_avif/img/planet-light.png?v=1",
    title: "Простая верификация",
    description: "Наш оптимизированный процесс KYC позволяет быстро пройти верификацию и начать торговлю с минимальными усилиями.",
  }
];

const officeSteps = [
  {
    title: "Визит в офис",
    description: "Приходите в наш офис в удобное время по предварительной записи. При себе необходимо иметь паспорт для заполнения бланка обмена криптовалют.",
    time: "2-3 минуты"
  },
  {
    title: "Проверка и заполнение документов",
    description: "Заполняем бланк обмена криптовалюты, фиксируем сумму и курс. Сверяем паспортные данные и реквизиты криптовалютного кошелька.",
    time: "2-3 минуты"
  },
  {
    title: "Проверка наличных средств",
    description: "Тщательно пересчитываем наличные средства, подтверждая точную сумму обмена. Проверяем подлинность купюр.",
    time: "2-3 минуты"
  },
  {
    title: "Сверка данных криптокошелька",
    description: "Перед совершением транзакции тщательно сверяем все символы криптокошелька. Это критически важный этап для обеспечения безопасности перевода.",
    time: "1-2 минуты"
  },
  {
    title: "Совершение обмена",
    description: "Производим перевод криптовалюты или принимаем её от вас. После получения необходимых подтверждений в сети, передаём наличные или делаем перевод.",
    time: "2-3 минуты"
  },
  {
    title: "Завершение сделки",
    description: "Выдаём вам квитанцию или копию заполненного бланка. Сделка считается успешно завершённой после подписания всех документов.",
    time: "1-2 минуты"
  }
];

const onlineSteps = [
  {
    title: "Оформление заявки",
    description: "Заполните форму обмена на сайте, указав сумму и направление обмена (USDT ⟷ RUB). Курс фиксируется на 15 минут.",
    time: "2-3 минуты"
  },
  {
    title: "Верификация личности",
    description: "Загрузите фото паспорта и селфи с паспортом. Процедура проходит автоматически, в редких случаях может потребоваться ручная проверка.",
    time: "5-15 минут"
  },
  {
    title: "Подтверждение реквизитов",
    description: "Укажите реквизиты для получения средств (номер карты или криптокошелька). Внимательно проверьте правильность введённых данных.",
    time: "2-3 минуты"
  },
  {
    title: "Перевод средств",
    description: "Отправьте USDT на указанный кошелёк или осуществите перевод рублей по предоставленным реквизитам. Сохраните подтверждение транзакции.",
    time: "5-10 минут"
  },
  {
    title: "Подтверждение получения",
    description: "После получения средств с вашей стороны, мы осуществляем перевод в течение нескольких минут. Вы получаете уведомление о завершении сделки.",
    time: "5-15 минут"
  },
  {
    title: "Завершение обмена",
    description: "Обмен завершён! Квитанция об операции отправляется на ваш email. История всех обменов доступна в личном кабинете.",
    time: "1-2 минуты"
  }
];

// Оптимизированный массив партнеров - уменьшаем количество для лучшей производительности
const basePartners = [
  {
    name: "Bitcoin",
    logo: "https://res.coinpaper.com/coinpaper/bitcoin_btc_logo_e68b8dbb0c.svg"
  },
  {
    name: "USDC", 
    logo: "https://res.coinpaper.com/coinpaper/usd_coin_usdc_logo_33584e28ac.svg"
  },
  {
    name: "USDT",
    logo: "https://res.coinpaper.com/coinpaper/tether_usdt_logo_1c069eb107.svg"
  },
  {
    name: "BNB",
    logo: "https://res.coinpaper.com/coinpaper/bnb_bnb_logo_c9840ff036.svg"
  },
  {
    name: "XRP",
    logo: "https://res.coinpaper.com/coinpaper/xrp_xrp_logo_4693101055.svg"
  },
  {
    name: "Cardano",
    logo: "https://res.coinpaper.com/coinpaper/cardano_ada_logo_12715cd3e9.svg"
  },
  {
    name: "Polkadot",
    logo: "https://res.coinpaper.com/coinpaper/Polkadot_Token_Polkadot_Token_Pink_6531f20385.svg"
  },
  {
    name: "Optimism",
    logo: "https://res.coinpaper.com/coinpaper/optimism_logo_d197e3b2f3.svg"
  },
  {
    name: "Dogecoin",
    logo: "https://res.coinpaper.com/coinpaper/dogecoin_doge_logo_477144b3df.svg"
  }
];

// Оптимизированный компонент для партнерской ленты
const PartnersMarquee = React.memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      setIsVisible(true);
    }
  }, [inView]);

  // Создаем два набора партнеров для бесконечной анимации
  const partners = [...basePartners, ...basePartners];

  return (
    <div ref={ref} className="relative mb-12 overflow-hidden">
      {isVisible && (
        <>
          {/* Первая лента - CSS анимация вместо React-Fast-Marquee */}
          <div className="partners-marquee-container mb-6">
            <div className="partners-marquee" style={{ animationDuration: '40s' }}>
              {partners.map((partner, index) => (
                <div
                  key={`main-${partner.name}-${index}`}
                  className="flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-[#001D8D]/30 hover:shadow-lg transition-all duration-300 hover:scale-105 flex-shrink-0 mx-2"
                  style={{
                    width: '72px',
                    height: '72px',
                    minWidth: '72px',
                    maxWidth: '72px'
                  }}
                >
                  <img
                    src={partner.logo}
                    alt={`${partner.name} - Криптовалютная биржа`}
                    className="w-9 h-9 object-contain"
                    loading={index < 6 ? "eager" : "lazy"}
                  />
                </div>
              ))}
              {/* Дублируем для бесконечной анимации */}
              {partners.map((partner, index) => (
                <div
                  key={`main-dup-${partner.name}-${index}`}
                  className="flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-[#001D8D]/30 hover:shadow-lg transition-all duration-300 hover:scale-105 flex-shrink-0 mx-2"
                  style={{
                    width: '72px',
                    height: '72px',
                    minWidth: '72px',
                    maxWidth: '72px'
                  }}
                >
                  <img
                    src={partner.logo}
                    alt={`${partner.name} - Криптовалютная биржа`}
                    className="w-9 h-9 object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Вторая лента - обратное направление */}
          <div className="partners-marquee-container">
            <div className="partners-marquee partners-marquee-reverse" style={{ animationDuration: '50s' }}>
              {partners.slice().reverse().map((partner, index) => (
                <div
                  key={`secondary-${partner.name}-${index}`}
                  className="flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-[#001D8D]/30 hover:shadow-lg transition-all duration-300 hover:scale-105 flex-shrink-0 mx-2"
                  style={{
                    width: '72px',
                    height: '72px',
                    minWidth: '72px',
                    maxWidth: '72px'
                  }}
                >
                  <img
                    src={partner.logo}
                    alt={`${partner.name} - Криптовалютная биржа`}
                    className="w-9 h-9 object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
              {/* Дублируем для бесконечной анимации */}
              {partners.slice().reverse().map((partner, index) => (
                <div
                  key={`secondary-dup-${partner.name}-${index}`}
                  className="flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-[#001D8D]/30 hover:shadow-lg transition-all duration-300 hover:scale-105 flex-shrink-0 mx-2"
                  style={{
                    width: '72px',
                    height: '72px',
                    minWidth: '72px',
                    maxWidth: '72px'
                  }}
                >
                  <img
                    src={partner.logo}
                    alt={`${partner.name} - Криптовалютная биржа`}
                    className="w-9 h-9 object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

PartnersMarquee.displayName = 'PartnersMarquee';

// Оптимизированный компонент для шагов
const StepItem = React.memo(({ step, index }: { step: any, index: number }) => {
  // Функция для форматирования номера шага в стиле манифеста
  const formatStepNumber = (index: number): string => {
    return (index + 1).toString().padStart(2, '0');
  };

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: "easeOut",
        delay: index * 0.1
      }}
      viewport={{ once: true, margin: "-50px" }}
      className="glass-tile p-6 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="manifesto-number text-3xl font-bold text-[#001D8D] tracking-wider group-hover:text-blue-600 transition-colors duration-300">
            {formatStepNumber(index)}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-[#001D8D] mb-2 group-hover:text-blue-600 transition-colors duration-300">
              {step.title}
            </h3>
            <div className="flex items-center text-sm text-[#001D8D]/70">
              <Clock className="w-4 h-4 mr-1" />
              {step.time}
            </div>
          </div>
          <p className="text-[#001D8D]/70 leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

StepItem.displayName = 'StepItem';

// Оптимизированный компонент для видео с ленивой загрузкой
const LazyVideo = React.memo(({ 
  src, 
  poster = "/images/video-placeholder.jpg",
  className = "",
  style = {}
}: { 
  src: string, 
  poster?: string,
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
          src={poster} 
          alt="Video preview" 
          className={`lazy-video ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            objectFit: 'cover',
            objectPosition: 'center bottom',
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
          poster={poster}
          style={{
            objectFit: 'cover',
            objectPosition: 'center bottom',
          }}
        />
      )}
    </div>
  );
});

LazyVideo.displayName = 'LazyVideo';

// Оптимизированный компонент для секции с видео
const VideoSection = React.memo(({ 
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      viewport={{ once: true }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}
    >
      {/* Видео контейнер с ленивой загрузкой */}
      <div className={`order-2 ${reversed ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="relative mx-auto" style={{ 
          width: '480px', 
          height: '560px',
          maxWidth: '100%'
        }}>
          <LazyVideo
            src={videoSrc}
            poster="/images/video-placeholder.jpg"
            className="w-full h-full rounded-lg shadow-lg"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '8px'
            }}
          />
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

VideoSection.displayName = 'VideoSection';

// Основной компонент, обернутый в React.memo для предотвращения ненужных ререндеров
const UnifiedMainSection = React.memo(() => {
  const [activeTab, setActiveTab] = useState<string>('office');
  
  // Оптимизированные анимации с tween вместо spring
  const fadeInAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      },
    },
  };

  // Мемоизированные секции для предотвращения ненужных ререндеров
  const featuresSection = useMemo(() => (
    <div>
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#001D8D]">
          Почему выбирают <span className="text-[#001D8D]">Kenigswap</span>
        </h2>
        <p className="text-[#001D8D]/80 leading-relaxed">
          Мы предоставляем безопасную, быструю и удобную платформу для всех ваших потребностей в обмене криптовалюты.
          Наш фокус на конвертации USDT в рубли гарантирует вам лучший сервис.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={fadeInAnimation}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="calculator-container group hover:shadow-xl transition-all duration-300"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-center h-12 w-12 mb-8">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                  unoptimized
                  loading={index < 2 ? "eager" : "lazy"}
                />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[#001D8D]">{feature.title}</h3>
              <p className="text-[#001D8D]/70 leading-relaxed">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  ), [fadeInAnimation]);

  // Мемоизированная секция шагов
  const stepsSection = useMemo(() => (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-[#001D8D] mb-4">
          Как проходит обмен
        </h2>
        <p className="text-[#001D8D]/70 max-w-3xl mx-auto leading-relaxed">
          Выберите удобный способ обмена и следуйте простым шагам для безопасной и быстрой транзакции
        </p>
      </div>

      <div className="calculator-container mb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/90 backdrop-blur-sm border border-[#001D8D]/10">
            <TabsTrigger value="office" className="text-[#001D8D]">
              <Building2 className="w-4 h-4 mr-2" />
              В офисе
            </TabsTrigger>
            <TabsTrigger value="online" className="text-[#001D8D]">
              <Globe className="w-4 h-4 mr-2" />
              Онлайн
            </TabsTrigger>
          </TabsList>

          <TabsContent value="office" className="space-y-6">
            {officeSteps.map((step, index) => (
              <StepItem key={index} step={step} index={index} />
            ))}
          </TabsContent>

          <TabsContent value="online" className="space-y-6">
            {onlineSteps.map((step, index) => (
              <StepItem key={index} step={step} index={index} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  ), [activeTab]);

  // Мемоизированная CTA секция
  const ctaSection = useMemo(() => (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="calculator-container"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#001D8D]">
            Готовы начать <span className="text-[#001D8D]">обмен?</span>
          </h2>
          <p className="text-[#001D8D]/70 mb-8 leading-relaxed">
            Создайте аккаунт уже сегодня и получите самый быстрый и безопасный способ конвертации USDT в рубли.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-[#001D8D]/5 p-2 rounded-full">
                <Wallet className="h-5 w-5 text-[#001D8D]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#001D8D]">Быстрая настройка</h4>
                <p className="text-sm text-[#001D8D]/70">Начните работу за считанные минуты с нашим упрощенным процессом регистрации</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-[#001D8D]/5 p-2 rounded-full">
                <TrendingUp className="h-5 w-5 text-[#001D8D]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#001D8D]">Лучшие курсы</h4>
                <p className="text-sm text-[#001D8D]/70">Всегда получайте самые конкурентоспособные курсы обмена USDT на рубли</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-[#001D8D]/5 p-2 rounded-full">
                <Shield className="h-5 w-5 text-[#001D8D]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#001D8D]">100% безопасность</h4>
                <p className="text-sm text-[#001D8D]/70">Ведущие в отрасли меры безопасности для защиты ваших активов</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
          className="calculator-container"
        >
          <h3 className="text-2xl font-bold mb-6 text-center text-[#001D8D]">
            Начните сегодня
          </h3>
          <p className="text-[#001D8D]/70 mb-8 text-center leading-relaxed">
            Зарегистрируйтесь всего за несколько минут и начните обменивать криптовалюту по лучшим курсам.
          </p>
          
          <div className="space-y-4">
            <Link href="/register">
              <SolidTrustButton 
                size="lg" 
                fullWidth
                className="mb-4"
              >
                Создать аккаунт
              </SolidTrustButton>
            </Link>
            
            <Link href="/login" className="block">
              <button className="w-full border-2 border-[#001D8D]/20 text-[#001D8D] hover:bg-[#001D8D]/5 px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                Войти
              </button>
            </Link>
          </div>
          
          <div className="mt-8 text-center text-sm text-[#001D8D]/60">
            Уже есть аккаунт? <Link href="/login" className="text-[#001D8D] hover:underline">Войти</Link>
          </div>
        </motion.div>
      </div>
    </div>
  ), []);

  // Оптимизированные видео-секции
  const videoSections = useMemo(() => (
    <>
      <VideoSection
        videoSrc="https://assets.revolut.com/published-assets-v3/b1f70228-8ed2-4e1d-a51d-10751333535f/007cc12b-da09-4a4d-bd11-608e4e6d9c21.mp4"
        title="Максимальная защита ваших средств"
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
            icon: Zap,
            title: "Лицензированная деятельность",
            description: "Официальная регистрация и лицензии"
          }
        ]}
      />
    </>
  ), []);

  return (
    <section className="relative py-20 bg-gradient-to-b from-white via-blue-50/10 to-blue-100/20 overflow-hidden scroll-optimized">
      {/* Упрощенный фон */}
      <div className="absolute inset-0 opacity-15">
        <UnifiedVantaBackground 
          type="dots" // Используем dots вместо topology
          color={0x94bdff}
          color2={0xFF6B35}
          backgroundColor={0xffffff}
          points={10}
          maxDistance={15}
          spacing={20}
          showDots={true}
          speed={1.0}
          mouseControls={false} // Отключаем для экономии ресурсов
          touchControls={false} // Отключаем для экономии ресурсов
          forceAnimate={false} // Отключаем принудительную анимацию
        />
      </div>

      {/* Градиентные переходы */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-5" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-blue-100/20 z-5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="space-y-24">
          {/* 1. Features Section */}
          {featuresSection}

          {/* 2. Deal Process Section */}
          {stepsSection}

          {/* 3. Partners Section - оптимизированная версия */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#001D8D]">
                Наши партнёры
              </h2>
              <p className="text-[#001D8D]/70 max-w-2xl mx-auto">
                Мы сотрудничаем с ведущими криптовалютными биржами и платформами для обеспечения 
                безопасных и эффективных обменов
              </p>
            </motion.div>

            {/* Оптимизированная партнерская лента */}
            <PartnersMarquee />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-[#001D8D]/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Проверенные партнеры</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Лицензированные биржи</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Высокие рейтинги безопасности</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Видео секции */}
          {videoSections}

          {/* 4. CTA Section */}
          {ctaSection}
        </div>
      </div>
    </section>
  );
});

UnifiedMainSection.displayName = 'UnifiedMainSection';

export default UnifiedMainSection;