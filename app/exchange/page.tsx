"use client";
import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
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

export default function ExchangePage() {
  const [isMounted, setIsMounted] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Данные для полосы-манифеста преимуществ обмена
  const exchangeAdvantages = [
    {
      id: 'real-time-rates',
      number: '01',
      title: 'Рыночные курсы в реальном времени',
      description: 'Наши курсы обновляются каждые 30 секунд на основе данных ведущих криптобирж и обменников. Вы всегда получаете актуальную рыночную стоимость без переплат и скрытых комиссий. Система автоматического мониторинга обеспечивает максимально выгодные условия для каждой транзакции.',
      priority: 1, // Самый высокий приоритет
      color: '#3b82f6'
    },
    {
      id: 'full-transparency',
      number: '02',
      title: 'Полная прозрачность операций',
      description: 'Все комиссии включены в курс обмена — никаких скрытых платежей или дополнительных сборов. Вы видите итоговую сумму до подтверждения сделки. Каждая операция сопровождается детальным отчетом с указанием всех этапов обработки и временных меток.',
      priority: 2,
      color: '#10b981'
    },
    {
      id: 'secure-process',
      number: '03',
      title: 'Безопасный процесс обмена',
      description: 'Многоуровневая система защиты включает 256-битное шифрование, двухфакторную аутентификацию и соответствие международным стандартам AML/KYC. Все средства хранятся в защищенных кошельках с мультиподписью, а персональные данные обрабатываются согласно GDPR.',
      priority: 3,
      color: '#8b5cf6'
    },
    {
      id: 'regular-updates',
      number: '04',
      title: 'Регулярные обновления курсов',
      description: 'Автоматическая система мониторинга отслеживает изменения курсов на 15+ ведущих биржах 24/7. Алгоритмы машинного обучения анализируют рыночные тренды и корректируют курсы в режиме реального времени, обеспечивая конкурентные цены в любое время суток.',
      priority: 4,
      color: '#f97316'
    },
    {
      id: 'easy-comparison',
      number: '05',
      title: 'Легкое сравнение предложений',
      description: 'Интегрированная система сравнения показывает курсы всех доступных обменников в одном интерфейсе. Умные фильтры помогают выбрать оптимальное предложение по скорости, курсу или надежности. Исторические данные позволяют отслеживать динамику и выбирать лучшее время для обмена.',
      priority: 5,
      color: '#06b6d4'
    },
    {
      id: 'professional-service',
      number: '06',
      title: 'Профессиональный сервис',
      description: 'Команда экспертов с многолетним опытом в криптоиндустрии обеспечивает поддержку 24/7. Персональные менеджеры для VIP-клиентов, приоритетная обработка крупных сделок и консультации по оптимизации обменных операций. Средний рейтинг удовлетворенности клиентов — 4.9/5.',
      priority: 6,
      color: '#dc2626'
    }
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Main Content Section with unified background */}
      <section className="relative py-20 bg-gradient-to-b from-white via-blue-50/10 to-blue-100/20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 opacity-15">
          <UnifiedVantaBackground 
            type="topology"
            color={0x94bdff}
            color2={0xFF6B35}
            backgroundColor={0xffffff}
            points={15}
            maxDistance={20}
            spacing={10}
            showDots={true}
            speed={1.4}
            mouseControls={true}
            touchControls={true}
            forceAnimate={true}
          />
        </div>

        {/* Gradient transitions */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-5" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-blue-100/20 z-5" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="space-y-24">
            
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
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

            {/* Main Exchange Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Exchange Calculator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="col-span-1"
              >
                <ExchangeCalculator />
              </motion.div>

              {/* Right Column - Rates Comparison */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="col-span-1"
              >
                <RatesComparison />
              </motion.div>
            </div>

            {/* Exchange Advantages Manifesto Section */}
            <motion.div
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate={controls}
              className="max-w-7xl mx-auto"
            >
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-[#001D8D]/10 text-[#001D8D] px-6 py-3 text-lg mb-8 font-medium">
                  <BarChart3 className="h-6 w-6" />
                  Манифест преимуществ обмена
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#001D8D] mb-6 tracking-tight">
                  Почему выбирают наш сервис
                </h2>
                <p className="text-xl text-[#001D8D]/70 max-w-4xl mx-auto leading-relaxed">
                  Каждое преимущество нашего сервиса создано для обеспечения максимального удобства, 
                  безопасности и выгоды наших клиентов. Мы устанавливаем новые стандарты в индустрии обмена криптовалют.
                </p>
              </div>

              {/* Manifesto Strip Component */}
              <ManifestoStrip values={exchangeAdvantages} />
            </motion.div>

            {/* Компактное видео с обрезкой сверху */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Видео контейнер с обрезкой сверху */}
              <div className="order-2 lg:order-1">
                <div className="relative mx-auto" style={{ 
                  width: '480px', 
                  height: '560px',
                  maxWidth: '100%'
                }}>
                  {/* Компактное видео с обрезкой сверху */}
                  <video
                    src="https://assets.revolut.com/published-assets-v3/b1f70228-8ed2-4e1d-a51d-10751333535f/007cc12b-da09-4a4d-bd11-608e4e6d9c21.mp4"
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label="Secure crypto exchange interface demonstration"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center bottom', // Обрезка сверху - показываем нижнюю часть видео
                      border: 'none',
                      outline: 'none',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              </div>
              
              <div className="order-1 lg:order-2 space-y-6">
                <div className="inline-flex items-center gap-2 bg-[#001D8D]/10 text-[#001D8D] px-4 py-2 rounded-full text-sm font-medium">
                  <Shield className="h-4 w-4" />
                  Банковский уровень безопасности
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D]">
                  Максимальная защита ваших средств
                </h2>
                
                <p className="text-lg text-[#001D8D]/70 leading-relaxed">
                  Используем передовые технологии шифрования и многоуровневую систему защиты. 
                  Все транзакции проходят через защищенные каналы с соблюдением международных 
                  стандартов безопасности.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#001D8D]">256-битное шифрование</h4>
                      <p className="text-sm text-[#001D8D]/70">Тот же уровень защиты, что используют банки</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#001D8D]">Соответствие AML/KYC</h4>
                      <p className="text-sm text-[#001D8D]/70">Полное соблюдение международных требований</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Award className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#001D8D]">Лицензированная деятельность</h4>
                      <p className="text-sm text-[#001D8D]/70">Официальная регистрация и лицензии</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Second Image Section - Speed & Efficiency */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Zap className="h-4 w-4" />
                  Мгновенные операции
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D]">
                  Обмен за считанные минуты
                </h2>
                
                <p className="text-lg text-[#001D8D]/70 leading-relaxed">
                  Автоматизированная система обработки транзакций обеспечивает максимальную скорость. 
                  Большинство операций завершается менее чем за 15 минут с момента подтверждения.
                </p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-white/80 rounded-xl border border-[#001D8D]/10">
                    <div className="text-2xl font-bold text-[#001D8D] mb-1">{"< 5 мин"}</div>
                    <div className="text-sm text-[#001D8D]/70">Верификация</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white/80 rounded-xl border border-[#001D8D]/10">
                    <div className="text-2xl font-bold text-[#001D8D] mb-1">{"< 15 мин"}</div>
                    <div className="text-sm text-[#001D8D]/70">Полный обмен</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-[#001D8D]/70">
                    <Globe className="h-4 w-4" />
                    <span>Работаем 24/7</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#001D8D]/70">
                    <Users className="h-4 w-4" />
                    <span>10,000+ довольных клиентов</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                {/* 🎯 КОНТЕЙНЕР БЕЗ ОРАНЖЕВОЙ ЗАЛИВКИ */}
                <div className="relative" style={{ 
                  width: '560px',     
                  height: '560px',   
                  maxWidth: '100%'     
                }}>
                  <Image
                    src="https://assets.revolut.com/published-assets-v3/245e191d-9293-4ae8-b3f0-460d94bf1801/88405c02-8743-48ef-94a8-ba5910176157.png"
                    alt="Fast crypto exchange dashboard"
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl w-full h-full object-cover"
                    priority
                  />
                  {/* ❌ УБРАНА ОРАНЖЕВАЯ ЗАЛИВКА */}
                </div>
              </div>
            </motion.div>

            {/* Final CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
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

          </div>
        </div>
      </section>
    </div>
  );
}