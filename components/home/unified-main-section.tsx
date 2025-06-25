"use client";
import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { SolidTrustButton } from '@/components/ui/solid-trust-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  ArrowRight, 
  Wallet, 
  BarChart, 
  Shield, 
  Clock, 
  Building2, 
  Globe 
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

const faqs = [
  {
    question: "Сколько времени занимает обмен?",
    answer: "В офисе полный процесс обмена занимает 10-15 минут. Онлайн-обмен обычно завершается за 20-30 минут при условии быстрого прохождения верификации и своевременного перевода средств."
  },
  {
    question: "Какая минимальная сумма обмена?",
    answer: "Минимальная сумма онлайн-обмена составляет 100 USDT. Такая сумма позволяет нам предоставить максимально удобные и выгодные условия для клиентов.\n\nМинимальная сумма для обмена с наличными в офисе составляет 100 000 рублей. Это необходимо для обеспечения выгодного курса и оперативности сделки."
  },
  {
    question: "Какие комиссии взимаются за обмен?",
    answer: "Мы не взимаем никаких скрытых комиссий. Все уже вложено в актуальные курсы обмена которые вы видите на нашем сайте."
  },
  {
    question: "Какие документы нужны для верификации?",
    answer: "Для базовой верификации требуется паспорт и селфи с паспортом. Процесс обычно занимает не более 5 минут. Для повышенных лимитов может потребоваться подтверждение адреса проживания."
  }
];

const partners = [
  {
    name: "Binance",
    logo: "https://res.coinpaper.com/coinpaper/bitcoin_btc_logo_e68b8dbb0c.svg",
    width: 120,
    height: 40
  },
  {
    name: "BTC",
    logo: "https://res.coinpaper.com/coinpaper/usd_coin_usdc_logo_33584e28ac.svg",
    width: 120,
    height: 40
  },
  {
    name: "Ripple",
    logo: "https://res.coinpaper.com/coinpaper/tether_usdt_logo_1c069eb107.svg",
    width: 120,
    height: 40
  },
  {
    name: "eth",
    logo: "https://res.coinpaper.com/coinpaper/bnb_bnb_logo_c9840ff036.svg",
    width: 120,
    height: 40
  },
  {
    name: "coin",
    logo: "https://res.coinpaper.com/coinpaper/xrp_xrp_logo_4693101055.svg",
    width: 120,
    height: 40
  },
  {
    name: "coi",
    logo: "https://res.coinpaper.com/coinpaper/cardano_ada_logo_12715cd3e9.svg",
    width: 120,
    height: 40
  },
    {
    name: "co",
    logo: "https://res.coinpaper.com/coinpaper/Polkadot_Token_Polkadot_Token_Pink_6531f20385.svg",
    width: 120,
    height: 40
  },
     {
    name: "co",
    logo: "https://res.coinpaper.com/coinpaper/optimism_logo_d197e3b2f3.svg",
    width: 120,
    height: 40
  },
  {
    name: "okx",
    logo: "https://res.coinpaper.com/coinpaper/dogecoin_doge_logo_477144b3df.svg",
    width: 120,
    height: 40
  }
];

const UnifiedMainSection = () => {
  const [openFaq, setOpenFaq] = useState<string>("item-0");
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

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
          
          {/* 1. Features Section */}
          <div>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#001D8D]">
                Почему выбирают <span className="text-[#001D8D]">Kenigswap</span>
              </h2>
              <p className="text-[#001D8D]/80">
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
                  className="relative overflow-hidden bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-[#001D8D]/10 hover:border-[#001D8D]/30 transition-all duration-300"
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
                    <p className="text-[#001D8D]/70">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* 2. Deal Process Section */}
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold text-center text-[#001D8D] mb-10">
              Как проходит обмен
            </h2>

            <Tabs defaultValue="office" className="w-full mb-16">
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
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-[#001D8D]/10 hover:border-[#001D8D]/30 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#001D8D]/10 flex items-center justify-center">
                        <span className="text-[#001D8D] font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-[#001D8D] mb-2">
                            {step.title}
                          </h3>
                          <div className="flex items-center text-sm text-[#001D8D]/70">
                            <Clock className="w-4 h-4 mr-1" />
                            {step.time}
                          </div>
                        </div>
                        <p className="text-[#001D8D]/70">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="online" className="space-y-6">
                {onlineSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-[#001D8D]/10 hover:border-[#001D8D]/30 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#001D8D]/10 flex items-center justify-center">
                        <span className="text-[#001D8D] font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-[#001D8D] mb-2">
                            {step.title}
                          </h3>
                          <div className="flex items-center text-sm text-[#001D8D]/70">
                            <Clock className="w-4 h-4 mr-1" />
                            {step.time}
                          </div>
                        </div>
                        <p className="text-[#001D8D]/70">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </TabsContent>
            </Tabs>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-center text-[#001D8D] mb-10">
                Частые вопросы
              </h2>
              <Accordion
                type="single"
                collapsible
                value={openFaq}
                onValueChange={setOpenFaq}
                className="space-y-4"
              >
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border border-[#001D8D]/10 rounded-lg px-6 py-2 hover:border-[#001D8D]/30 transition-all duration-300 bg-white/90 backdrop-blur-sm"
                  >
                    <AccordionTrigger className="text-[#001D8D] hover:text-[#001D8D]/80 text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-[#001D8D]/70 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>

          {/* 3. Partners Section */}
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

            <div className="relative mb-12">
              {/* Gradient overlays for smooth edges */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

              {/* Main marquee - left to right */}
              <div className="mb-8">
                <Marquee
                  gradient={false}
                  speed={50}
                  pauseOnHover={true}
                  className="py-6"
                >
                  {partners.map((partner, index) => (
                    <motion.div
                      key={`main-${index}`}
                      whileHover={{ scale: 1.1, y: -2 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-center mx-12 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-[#001D8D]/10 hover:border-[#001D8D]/30 hover:shadow-xl transition-all duration-300 group"
                    >
                      <Image
                        src={partner.logo}
                        alt={`${partner.name} - Криптовалютная биржа`}
                        width={partner.width}
                        height={partner.height}
                        className="object-contain tint-blue group-hover:filter-none transition-all duration-300"
                        priority={index < 3}
                        unoptimized
                      />
                    </motion.div>
                  ))}
                </Marquee>
              </div>

              {/* Secondary marquee - right to left for visual variety */}
              <div>
                <Marquee
                  gradient={false}
                  speed={40}
                  direction="right"
                  pauseOnHover={true}
                  className="py-6"
                >
                  {partners.slice().reverse().map((partner, index) => (
                    <motion.div
                      key={`secondary-${index}`}
                      whileHover={{ scale: 1.1, y: -2 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-center mx-12 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-[#001D8D]/10 hover:border-[#001D8D]/30 hover:shadow-xl transition-all duration-300 group"
                    >
                      <Image
                        src={partner.logo}
                        alt={`${partner.name} - Криптовалютная биржа`}
                        width={partner.width}
                        height={partner.height}
                        className="object-contain tint-blue group-hover:filter-none transition-all duration-300"
                        unoptimized
                      />
                    </motion.div>
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

          {/* 4. CTA Section */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#001D8D]">
                  Готовы начать <span className="text-[#001D8D]">обмен?</span>
                </h2>
                <p className="text-[#001D8D]/70 mb-8">
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
                      <BarChart className="h-5 w-5 text-[#001D8D]" />
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
                className="bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-[#001D8D]/10 hover:border-[#001D8D]/30 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold mb-6 text-center text-[#001D8D]">
                  Начните сегодня
                </h3>
                <p className="text-[#001D8D]/70 mb-8 text-center">
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