"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet,
  Shield,
  Building2,
  Globe,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import ServicesSection from '@/components/home/services-section';
import WhyChooseKenigSwapTimeline from '@/components/home/WhyChooseKenigSwapTimeline';

const Marquee = dynamic(() => import('react-fast-marquee'), {
  ssr: false,
});

const features = [
  {
    title: "Выгодный курс",
    description:
      "Получайте актуальные рыночные предложения, которые регулярно обновляются, чтобы вы могли выбрать оптимальный момент для обмена криптовалюты.",
  },
  {
    title: "Полная безопасность",
    description:
      "Все операции проходят через защищённое соединение, а для проведения сделки мы запрашиваем только действительно необходимые данные.",
  },
  {
    title: "Оперативное оформление сделок",
    description:
      "Заявки на покупку и продажу криптовалюты обрабатываются быстро: мы оперативно подтверждаем курс, детали сделки и дальнейшие шаги.",
  },
  {
    title: "Простая верификация",
    description:
      "Оптимизированный процесс проверки помогает быстрее пройти верификацию и воспользоваться услугами нашего сервиса без лишних сложностей.",
  }
];

const officeSteps = [
  {
    title: "Визит в офис",
    description:
      "Приходите в наш офис в удобное время по предварительной записи. При себе необходимо иметь паспорт для заполнения документов по обмену криптовалюты."
  },
  {
    title: "Проверка и заполнение документов",
    description:
      "Фиксируем сумму и курс, сверяем паспортные данные и реквизиты криптовалютного кошелька, чтобы подготовить сделку корректно и безопасно."
  },
  {
    title: "Проверка наличных средств",
    description:
      "Тщательно пересчитываем наличные средства, подтверждаем точную сумму обмена и проверяем подлинность купюр."
  },
  {
    title: "Сверка данных кошелька",
    description:
      "Перед переводом внимательно сверяем адрес криптокошелька. Это важный этап, который помогает исключить ошибки при отправке средств."
  },
  {
    title: "Проведение сделки",
    description:
      "Осуществляем перевод криптовалюты или принимаем её от вас. После получения подтверждений в сети передаём наличные или выполняем перевод рублей."
  },
  {
    title: "Завершение сделки",
    description:
      "Сделка завершается после проверки всех данных и подписания необходимых документов."
  }
];

const onlineSteps = [
  {
    title: "Оформление заявки",
    description:
      "Заполните форму на сайте, указав сумму и направление обмена. После этого мы подтверждаем условия и переходим к следующему этапу."
  },
  {
    title: "Верификация личности",
    description:
      "Для соблюдения требований безопасности и процедуры KYC может потребоваться подтверждение личности. Обычно этот этап занимает минимум времени."
  },
  {
    title: "Подтверждение реквизитов",
    description:
      "Укажите реквизиты для получения средств: номер карты, банковские данные или адрес криптовалютного кошелька. Перед отправкой важно ещё раз всё проверить."
  },
  {
    title: "Перевод средств",
    description:
      "Вы отправляете криптовалюту или рубли по согласованным реквизитам. После получения средств мы переходим к исполнению сделки."
  },
  {
    title: "Подтверждение получения",
    description:
      "После поступления средств перевод с нашей стороны выполняется в кратчайшие сроки. Вы получаете уведомление о завершении операции."
  },
  {
    title: "Завершение обмена",
    description:
      "После выполнения всех этапов сделка считается завершённой. При необходимости мы дополнительно подтверждаем детали операции."
  }
];

const partners = [
  {
    name: "Bitcoin",
    logo: "https://res.coinpaper.com/coinpaper/bitcoin_btc_logo_e68b8dbb0c.svg",
    link: null
  },
  {
    name: "USDC",
    logo: "https://res.coinpaper.com/coinpaper/usd_coin_usdc_logo_33584e28ac.svg",
    link: null
  },
  {
    name: "USDT",
    logo: "https://res.coinpaper.com/coinpaper/tether_usdt_logo_1c069eb107.svg",
    link: null
  },
  {
    name: "BNB",
    logo: "https://res.coinpaper.com/coinpaper/bnb_bnb_logo_c9840ff036.svg",
    link: null
  },
  {
    name: "XRP",
    logo: "https://res.coinpaper.com/coinpaper/xrp_xrp_logo_4693101055.svg",
    link: null
  },
  {
    name: "Cardano",
    logo: "https://res.coinpaper.com/coinpaper/cardano_ada_logo_12715cd3e9.svg",
    link: null
  },
  {
    name: "Polkadot",
    logo: "https://res.coinpaper.com/coinpaper/Polkadot_Token_Polkadot_Token_Pink_6531f20385.svg",
    link: null
  },
  {
    name: "Optimism",
    logo: "https://res.coinpaper.com/coinpaper/optimism_logo_d197e3b2f3.svg",
    link: null
  },
  {
    name: "Dogecoin",
    logo: "https://res.coinpaper.com/coinpaper/dogecoin_doge_logo_477144b3df.svg",
    link: null
  },
  {
    name: "Exnode",
    logo: "https://exnode.ru/exnode-logo.png",
    link: "https://exnode.ru/"
  }
];

const stepsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const stepVariants = {
  hidden: {
    opacity: 0,
    y: 15
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
    },
  },
};

const formatStepNumber = (index: number): string => {
  return (index + 1).toString().padStart(2, '0');
};

const PartnerLogo = ({ partner, index }: { partner: typeof partners[0]; index: number }) => {
  const logoElement = (
    <img
      src={partner.logo}
      alt={`Логотип ${partner.name}`}
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
  );

  return (
    <div className="flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-[#001D8D]/30 hover:shadow-lg transition-all duration-300 hover:scale-105 flex-shrink-0 mx-4 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28">
      {partner.link ? (
        <a
          href={partner.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full h-full"
        >
          {logoElement}
        </a>
      ) : (
        logoElement
      )}
    </div>
  );
};

const UnifiedMainSection = () => {
  const [activeTab, setActiveTab] = useState('office');

  return (
    <section className="relative py-20 bg-transparent overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="space-y-24">

          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
              Криптообменник KenigSwap
            </h2>
            <p className="text-base md:text-lg text-[#001D8D]/70 leading-relaxed">
              KenigSwap — сервис обмена криптовалют в Калининграде. Мы помогаем купить и
              продать USDT, BTC, ETH, SOL и другие цифровые активы, предлагаем
              актуальные курсы, сделки за наличные и сопровождение на каждом этапе.
            </p>
          </motion.div>

          <WhyChooseKenigSwapTimeline items={features} />

          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <ServicesSection />
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
                Как проходит обмен криптовалюты
              </h2>
              <p className="text-base md:text-lg text-[#001D8D]/70 max-w-3xl mx-auto leading-relaxed">
                Выберите удобный формат сделки и следуйте простым шагам для безопасной
                и понятной покупки или продажи криптовалюты.
              </p>
            </div>

            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,29,141,0.05)] mb-16">
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
                        className="relative group p-6 rounded-3xl bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,29,141,0.05)] transition-all duration-300 ease-out hover:shadow-[0_8px_40px_rgba(0,29,141,0.12)] hover:-translate-y-2"
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(0,29,141,0.08)_0%,transparent_70%)] rounded-3xl"></div>
                        <div className="flex items-start gap-4">
                          <motion.div
                            className="flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.15 }}
                          >
                            <div className="manifesto-number text-3xl font-bold text-[#001D8D] tracking-wider group-hover:text-blue-600 transition-colors duration-200">
                              {formatStepNumber(index)}
                            </div>
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="text-lg md:text-xl font-bold text-[#001D8D] mb-2 group-hover:text-blue-600 transition-colors duration-200">
                              {step.title}
                            </h3>
                            <p className="text-sm md:text-base text-[#001D8D]/70 leading-relaxed">
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
                        className="relative group p-6 rounded-3xl bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,29,141,0.05)] transition-all duration-300 ease-out hover:shadow-[0_8px_40px_rgba(0,29,141,0.12)] hover:-translate-y-2"
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(0,29,141,0.08)_0%,transparent_70%)] rounded-3xl"></div>
                        <div className="flex items-start gap-4">
                          <motion.div
                            className="flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.15 }}
                          >
                            <div className="manifesto-number text-3xl font-bold text-[#001D8D] tracking-wider group-hover:text-blue-600 transition-colors duration-200">
                              {formatStepNumber(index)}
                            </div>
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="text-lg md:text-xl font-bold text-[#001D8D] mb-2 group-hover:text-blue-600 transition-colors duration-200">
                              {step.title}
                            </h3>
                            <p className="text-sm md:text-base text-[#001D8D]/70 leading-relaxed">
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

          <div>
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
                Наши партнёры
              </h2>
              <p className="text-base md:text-lg text-[#001D8D]/70 max-w-2xl mx-auto leading-relaxed">
                Мы сотрудничаем с проверенными платформами и используем надёжную
                инфраструктуру для безопасного и эффективного обмена криптовалюты.
              </p>
            </motion.div>

            <div className="relative mb-12 overflow-hidden">
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

            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
              className="text-center"
            >
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-[#001D8D]/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Проверенные партнёры</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Надёжная инфраструктура</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Высокие стандарты безопасности</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
                className="relative group p-8 rounded-3xl bg-gradient-to-br from-white/50 to-white/10 md:backdrop-blur-lg shadow-[0_4px_24px_rgba(0,29,141,0.06)] transition-[box-shadow,background-color] duration-300"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[radial-gradient(circle_at_center,rgba(0,29,141,0.08)_0%,transparent_70%)] rounded-3xl"></div>

                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4 group-hover:text-blue-600 transition-colors duration-200">
                    Готовы обменять криптовалюту?
                  </h2>
                  <p className="text-base md:text-lg text-[#001D8D]/70 mb-8 leading-relaxed">
                    Оставьте заявку на покупку или продажу USDT и другой криптовалюты
                    и получите понятные условия, актуальный курс и сопровождение на
                    каждом этапе сделки.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-[#001D8D]/5 p-2 rounded-full">
                        <Wallet className="h-5 w-5 text-[#001D8D] group-hover:text-blue-600 transition-colors duration-200" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-[#001D8D] mb-1 group-hover:text-blue-600 transition-colors duration-200">
                          Быстрое оформление
                        </h4>
                        <p className="text-sm md:text-base text-[#001D8D]/70 leading-relaxed">
                          Понятный процесс обращения и оперативное согласование условий сделки.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-[#001D8D]/5 p-2 rounded-full">
                        <TrendingUp className="h-5 w-5 text-[#001D8D] group-hover:text-blue-600 transition-colors duration-200" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-[#001D8D] mb-1 group-hover:text-blue-600 transition-colors duration-200">
                          Актуальные курсы
                        </h4>
                        <p className="text-sm md:text-base text-[#001D8D]/70 leading-relaxed">
                          Вы получаете прозрачные условия и конкурентоспособные предложения.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-[#001D8D]/5 p-2 rounded-full">
                        <Shield className="h-5 w-5 text-[#001D8D] group-hover:text-blue-600 transition-colors duration-200" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-[#001D8D] mb-1 group-hover:text-blue-600 transition-colors duration-200">
                          Безопасный формат работы
                        </h4>
                        <p className="text-sm md:text-base text-[#001D8D]/70 leading-relaxed">
                          Мы уделяем особое внимание защите данных, проверке деталей сделки и безопасности перевода.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative group p-8 rounded-3xl bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,29,141,0.05)] transition-all duration-500"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[radial-gradient(circle_at_center,rgba(0,29,141,0.08)_0%,transparent_70%)] rounded-3xl"></div>

                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#001D8D] mb-4 text-center group-hover:text-blue-600 transition-colors duration-200">
                    Перейдите к обмену
                  </h3>
                  <p className="text-base md:text-lg text-[#001D8D]/70 mb-8 text-center leading-relaxed">
                    Откройте страницу обмена, выберите нужное направление и начните сделку
                    в удобном для вас формате.
                  </p>

                  <div className="space-y-4">
                    <Link href="https://kenigswap.ru/exchange/">
                      <Button
                        size="lg"
                        className="w-full mb-4 bg-[#001D8D] hover:bg-[#001D8D]/90 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Начать обмен
                      </Button>
                    </Link>

                    <Link href="https://kenigswap.ru/rates/" className="block">
                      <button className="w-full border-2 border-[#001D8D]/20 text-[#001D8D] hover:bg-[#001D8D]/5 px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                        Посмотреть курсы
                      </button>
                    </Link>
                  </div>

                  <div className="mt-8 text-center text-sm text-[#001D8D]/60">
                    Нужна помощь?{" "}
                    <Link href="https://kenigswap.ru/support/" className="text-[#001D8D] hover:underline">
                      Связаться с поддержкой
                    </Link>
                  </div>
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
