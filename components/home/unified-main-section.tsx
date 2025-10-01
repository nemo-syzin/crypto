"use client";
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Wallet, ChartBar as BarChart, Shield, Clock, DollarSign, Zap, CircleCheck as CheckCircle, Building2, Globe, TrendingUp } from 'lucide-react';

// Dynamic import for Marquee to prevent SSR issues
const Marquee = dynamic(() => import('react-fast-marquee'), {
  ssr: false,
});

// Данные для секций
const features = [
  {
    iconComponent: DollarSign,
    title: "Выгодный курс",
    description: "Получите лучший курс обмена USDT на рубли на рынке, обновляемый в реальном времени для максимальной выгоды.",
  },
  {
    iconComponent: Shield,
    title: "Полная безопасность",
    description: "Сквозное шифрование и защищенная обработка платежей гарантируют безопасность ваших транзакций и личных данных.",
  },
  {
    iconComponent: Zap,
    title: "Быстрые транзакции",
    description: "Совершайте обмены быстро благодаря нашей оптимизированной системе - большинство транзакций завершается менее чем за 15 минут.",
  },
  {
    iconComponent: CheckCircle,
    title: "Простая верификация",
    description: "Наш оптимизированный процесс KYC позволяет быстро пройти верификацию и начать торговлю с минимальными усилиями.",
  }
];

const officeSteps = [
  {
    title: "Визит в офис",
    description: "Приходите в наш офис в удобное время по предварительной записи. При себе необходимо иметь паспорт для заполнения бланка обмена криптовалют."
  },
  {
    title: "Проверка и заполнение документов",
    description: "Заполняем бланк обмена криптовалюты, фиксируем сумму и курс. Сверяем паспортные данные и реквизиты криптовалютного кошелька."
  },
  {
    title: "Проверка наличных средств",
    description: "Тщательно пересчитываем наличные средства, подтверждая точную сумму обмена. Проверяем подлинность купюр."
  },
  {
    title: "Сверка данных криптокошелька",
    description: "Перед совершением транзакции тщательно сверяем все символы криптокошелька. Это критически важный этап для обеспечения безопасности перевода."
  },
  {
    title: "Совершение обмена",
    description: "Производим перевод криптовалюты или принимаем её от вас. После получения необходимых подтверждений в сети, передаём наличные или делаем перевод."
  },
  {
    title: "Завершение сделки",
    description: "Выдаём вам квитанцию или копию заполненного бланка. Сделка считается успешно завершённой после подписания всех документов."
  }
];

const onlineSteps = [
  {
    title: "Оформление заявки",
    description: "Заполните форму обмена на сайте, указав сумму и направление обмена (USDT ⟷ RUB). Курс фиксируется на 15 минут."
  },
  {
    title: "Верификация личности",
    description: "Загрузите фото паспорта и селфи с паспортом. Процедура проходит автоматически, в редких случаях может потребоваться ручная проверка."
  },
  {
    title: "Подтверждение реквизитов",
    description: "Укажите реквизиты для получения средств (номер карты или криптокошелька). Внимательно проверьте правильность введённых данных."
  },
  {
    title: "Перевод средств",
    description: "Отправьте USDT на указанный кошелёк или осуществите перевод рублей по предоставленным реквизитам. Сохраните подтверждение транзакции."
  },
  {
    title: "Подтверждение получения",
    description: "После получения средств с вашей стороны, мы осуществляем перевод в течение нескольких минут. Вы получаете уведомление о завершении сделки."
  },
  {
    title: "Завершение обмена",
    description: "Обмен завершён! Квитанция об операции отправляется на ваш email. История всех обменов доступна в личном кабинете."
  }
];

// Оптимизированный массив партнеров без дублирования
const partners = [
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

const UnifiedMainSection = () => {
  const [activeTab, setActiveTab] = useState('office');

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
  const PartnerLogo = ({ partner, index }: { partner: typeof partners[0]; index: number }) => {
    return (
      <div
        className="flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-[#001D8D]/30 hover:shadow-lg transition-all duration-300 hover:scale-105 flex-shrink-0 mx-4 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28"
      >
        <img
          src={partner.logo}
          alt={`${partner.name} - Криптовалютная биржа`}
          className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-12 xl:h-12 object-contain"
          loading={index < 6 ? "eager" : "lazy"}
          onError={(e) => {
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
    <section className="relative py-20 bg-transparent overflow-hidden">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="calculator-container group hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center h-10 w-10 bg-[#001D8D]/10 p-2 rounded-lg">
                        <feature.iconComponent className="h-5 w-5 text-[#001D8D]" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-[#001D8D]">{feature.title}</h3>
                    </div>
                    <p className="text-[#001D8D]/70 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 2. Deal Process Section - Без плашки */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-[#001D8D] mb-6">
                Как проходит обмен
              </h2>
              <p className="text-[#001D8D]/70 max-w-3xl mx-auto leading-relaxed">
                Выберите удобный способ обмена и следуйте простым шагам для безопасной и быстрой транзакции
              </p>
            </div>

            <div className="calculator-container mb-16">
              <Tabs defaultValue="office" onValueChange={setActiveTab} className="w-full">
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
                    variants={stepsContainerVariants}
                    initial="hidden"
                    animate={activeTab === 'office' ? 'visible' : 'hidden'}
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
                              <h3 className="text-xl font-bold text-[#001D8D] mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                {step.title}
                              </h3>
                            </div>
                            <p className="text-[#001D8D]/70 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>

                <TabsContent value="online">
                  <motion.div
                    variants={stepsContainerVariants}
                    initial="hidden"
                    animate={activeTab === 'online' ? 'visible' : 'hidden'}
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
                              <h3 className="text-xl font-bold text-[#001D8D] mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                {step.title}
                              </h3>
                            </div>
                            <p className="text-[#001D8D]/70 leading-relaxed">
                              {step.description}
                            </p>
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

            {/* Оптимизированные ленты партнеров */}
            <div className="relative mb-12 overflow-hidden">
              {/* Первая лента - слева направо */}
              <div className="mb-6">
                <Marquee
                  gradient={false}
                  speed={60}
                  pauseOnHover={true}
                  className="py-4"
                >
                  {partners
                    .filter(partner => partner.logo && partner.name)
                    .map((partner, index) => (
                      <PartnerLogo 
                        key={`${partner.name}-${index}`}
                        partner={partner} 
                        index={index} 
                      />
                    ))}
                </Marquee>
              </div>

              {/* Вторая лента - справа налево */}
              <div>
                <Marquee
                  gradient={false}
                  speed={45}
                  direction="right"
                  pauseOnHover={true}
                  className="py-4"
                >
                  {partners
                    .filter(partner => partner.logo && partner.name)
                    .map((partner, index) => (
                      <PartnerLogo 
                        key={`reverse-${partner.name}-${index}`}
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
                    <Button 
                      size="lg" 
                      className="w-full mb-4 bg-[#001D8D] hover:bg-[#001D8D]/90 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Создать аккаунт
                    </Button>
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