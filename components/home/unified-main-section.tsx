"use client";
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { SolidTrustButton } from '@/components/ui/solid-trust-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowRight, 
  Wallet, 
  BarChart, 
  Shield, 
  Clock, 
  Building2, 
  Globe,
  CheckCircle,
  Star,
  TrendingUp,
  Zap
} from 'lucide-react';
import Marquee from 'react-fast-marquee';
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

// ✅ РАСШИРЕННЫЙ МАССИВ ПАРТНЕРОВ - дублируем для заполнения полноэкранного режима
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

// ✅ СОЗДАЕМ РАСШИРЕННЫЙ МАССИВ для заполнения широких экранов
const partners = [
  ...basePartners,
  ...basePartners, // Дублируем для заполнения
  ...basePartners  // Еще раз дублируем для очень широких экранов
];

const UnifiedMainSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Отдельные контроллеры для анимации шагов
  const officeStepsControls = useAnimation();
  const onlineStepsControls = useAnimation();
  const [officeStepsRef, officeStepsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [onlineStepsRef, onlineStepsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Анимация для шагов офиса
  useEffect(() => {
    if (officeStepsInView) {
      officeStepsControls.start('visible');
    }
  }, [officeStepsControls, officeStepsInView]);

  // Анимация для онлайн шагов
  useEffect(() => {
    if (onlineStepsInView) {
      onlineStepsControls.start('visible');
    }
  }, [onlineStepsControls, onlineStepsInView]);

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

  // Варианты анимации для шагов с более выраженным эффектом
  const stepsContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15, // Увеличенная задержка между шагами
      },
    },
  };

  const stepVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      },
    },
  };

  // Функция для форматирования номера шага в стиле манифеста
  const formatStepNumber = (index: number): string => {
    return (index + 1).toString().padStart(2, '0');
  };

  // ✅ УЛУЧШЕННЫЙ КОМПОНЕНТ ЛОГОТИПА ПАРТНЕРА - адаптивные размеры
  const PartnerLogo = ({ partner, index }: { partner: typeof basePartners[0]; index: number }) => {
    return (
      <div
        key={`${partner.name}-${index}`}
        className="flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-[#001D8D]/30 hover:shadow-lg transition-all duration-300 hover:scale-105 flex-shrink-0 mx-2"
        style={{
          // ✅ Адаптивные размеры для разных экранов
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
          onError={(e) => {
            // ✅ Graceful fallback - скрываем сломанные изображения
            const target = e.currentTarget as HTMLImageElement;
            const container = target.parentElement;
            if (container) {
              container.style.display = 'none';
            }
          }}
        />
      </div>
    );
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-white via-blue-50/10 to-blue-100/20 overflow-hidden">
      {/*  ДВУХЦВЕТНЫЙ ФОН - ОРАНЖЕВЫЙ + СИНИЙ */}
      <div className="absolute inset-0 opacity-15">
        <UnifiedVantaBackground 
          type="topology"
          color={0x94bdff}           //  ОСНОВНОЙ ЦВЕТ 
          color2={0xFF6B35}          //  ДОПОЛНЯЮЩИЙ ЦВЕТ -эффектов)
          backgroundColor={0xffffff}  //  Белый фон
          points={15}                 // Еще больше точек для богатства
          maxDistance={20}            //  Увеличено с 1 до 20 для правильной работы
          spacing={10}                //  Еще плотнее сетка
          showDots={true}             // Показать точки
          speed={1.4}                 // ⚡ Быстрее анимация
          mouseControls={true}        //  Реакция на мышь
          touchControls={true}        //  Реакция на касания
          forceAnimate={true}         //  Принудительная анимация
        />
      </div>

      {/* Градиентные переходы */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-5" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-blue-100/20 z-5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="space-y-24">
          
          {/* 1. Features Section - Без плашки */}
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

            <motion.div
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate={controls}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
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
                      />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[#001D8D]">{feature.title}</h3>
                    <p className="text-[#001D8D]/70 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* 2. Deal Process Section - Без плашки */}
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
              <Tabs defaultValue="office" className="w-full">
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

                <TabsContent value="office">
                  <motion.div
                    ref={officeStepsRef}
                    variants={stepsContainerVariants}
                    initial="hidden"
                    animate={officeStepsControls}
                    className="space-y-6"
                  >
                    {officeSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        variants={stepVariants}
                        className="glass-tile p-6 hover:shadow-lg transition-all duration-300 group"
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 20px 40px rgba(0, 29, 141, 0.15)"
                        }}
                      >
                        <div className="flex items-start gap-4">
                          {/* Номер в стиле манифеста с анимацией */}
                          <motion.div 
                            className="flex-shrink-0"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="manifesto-number text-3xl font-bold text-[#001D8D] tracking-wider group-hover:text-blue-600 transition-colors duration-300">
                              {formatStepNumber(index)}
                            </div>
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <motion.h3 
                                className="text-xl font-bold text-[#001D8D] mb-2 group-hover:text-blue-600 transition-colors duration-300"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                {step.title}
                              </motion.h3>
                              <motion.div 
                                className="flex items-center text-sm text-[#001D8D]/70"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                              >
                                <Clock className="w-4 h-4 mr-1" />
                                {step.time}
                              </motion.div>
                            </div>
                            <motion.p 
                              className="text-[#001D8D]/70 leading-relaxed"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 }}
                            >
                              {step.description}
                            </motion.p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>

                <TabsContent value="online">
                  <motion.div
                    ref={onlineStepsRef}
                    variants={stepsContainerVariants}
                    initial="hidden"
                    animate={onlineStepsControls}
                    className="space-y-6"
                  >
                    {onlineSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        variants={stepVariants}
                        className="glass-tile p-6 hover:shadow-lg transition-all duration-300 group"
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 20px 40px rgba(0, 29, 141, 0.15)"
                        }}
                      >
                        <div className="flex items-start gap-4">
                          {/* Номер в стиле манифеста с анимацией */}
                          <motion.div 
                            className="flex-shrink-0"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="manifesto-number text-3xl font-bold text-[#001D8D] tracking-wider group-hover:text-blue-600 transition-colors duration-300">
                              {formatStepNumber(index)}
                            </div>
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <motion.h3 
                                className="text-xl font-bold text-[#001D8D] mb-2 group-hover:text-blue-600 transition-colors duration-300"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                {step.title}
                              </motion.h3>
                              <motion.div 
                                className="flex items-center text-sm text-[#001D8D]/70"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                              >
                                <Clock className="w-4 h-4 mr-1" />
                                {step.time}
                              </motion.div>
                            </div>
                            <motion.p 
                              className="text-[#001D8D]/70 leading-relaxed"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 }}
                            >
                              {step.description}
                            </motion.p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* 3. Partners Section - ✅ ТОЛЬКО ДВЕ СТРОКИ БЕЗ ПРОПУСКОВ */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
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

            {/* ✅ ТОЛЬКО ДВЕ ЛЕНТЫ - БЕЗ ПРОПУСКОВ НА ЛЮБЫХ ЭКРАНАХ */}
            <div className="relative mb-12 overflow-hidden">
              {/* ✅ Первая лента - слева направо с увеличенной скоростью */}
              <div className="mb-6">
                <Marquee
                  gradient={false}
                  speed={60} // Увеличена скорость
                  pauseOnHover={true}
                  className="py-4"
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0px' // Убираем промежутки
                  }}
                >
                  {partners
                    .filter(partner => partner.logo && partner.name)
                    .map((partner, index) => (
                      <PartnerLogo 
                        key={`main-${partner.name}-${index}`}
                        partner={partner} 
                        index={index} 
                      />
                    ))}
                </Marquee>
              </div>

              {/* ✅ Вторая лента - справа налево с другой скоростью */}
              <div>
                <Marquee
                  gradient={false}
                  speed={45} // Другая скорость для визуального разнообразия
                  direction="right"
                  pauseOnHover={true}
                  className="py-4"
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0px' // Убираем промежутки
                  }}
                >
                  {partners
                    .filter(partner => partner.logo && partner.name)
                    .slice()
                    .reverse()
                    .map((partner, index) => (
                      <PartnerLogo 
                        key={`secondary-${partner.name}-${index}`}
                        partner={partner} 
                        index={index} 
                      />
                    ))}
                </Marquee>
              </div>
            </div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-[#001D8D]/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Проверенные партнеры</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Лицензированные биржи</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Высокие рейтинги безопасности</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 4. CTA Section - Calculator Style */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
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
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
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

        </div>
      </div>
    </section>
  );
};

export default UnifiedMainSection;