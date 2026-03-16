"use client";
import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { CircleCheck as CheckCircle, ChartBar as BarChart3, Shield, Award, Zap, TrendingUp } from 'lucide-react';
import { ManifestoStrip } from '@/components/ui/manifesto-strip';
import ExchangeStepForm from '@/components/ExchangeStepForm';
import Image from 'next/image';
import Link from 'next/link';

export default function ExchangePage() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
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

  const exchangeAdvantages = [
    {
      id: 'real-time-rates',
      number: '01',
      title: 'Рыночные курсы в реальном времени',
      description: 'Наши курсы обновляются каждые 30 секунд, обеспечивая вам самые актуальные и конкурентные предложения. Мы используем передовые алгоритмы для мониторинга множества источников и предоставления оптимальных курсов.',
      priority: 1,
      color: '#3b82f6'
    },
    {
      id: 'transparency',
      number: '02',
      title: 'Полная прозрачность операций',
      description: 'Все комиссии включены в курс. Никаких скрытых платежей или дополнительных сборов. Вы видите итоговую сумму до подтверждения сделки. Полная прозрачность на каждом этапе.',
      priority: 2,
      color: '#10b981'
    },
    {
      id: 'security',
      number: '03',
      title: 'Безопасный процесс',
      description: 'Многоуровневая система защиты, шифрование данных и соответствие международным стандартам безопасности.',
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
      description: 'Сравнивайте курсы с предложениями конкурентов. Все данные в удобном формате для быстрого анализа.',
      priority: 5,
      color: '#06b6d4'
    },
    {
      id: 'professional',
      number: '06',
      title: 'Профессиональный сервис',
      description: 'Многолетний опыт работы, тысячи довольных клиентов и высокие рейтинги. Мы предоставляем сервис с индивидуальным подходом к каждому клиенту.',
      priority: 6,
      color: '#6366f1'
    }
  ];

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      <section className="relative py-20 bg-transparent overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="space-y-12">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-0 mt-8"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#001D8D]">
                Обмен криптовалют в Калининграде
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl font-medium text-[#001D8D]/80">
                Прозрачно. Честно. Безопасно.
              </p>
            </motion.div>

            <div className="flex flex-col gap-8 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full"
              >
                <ExchangeStepForm />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div className="order-2 lg:order-1">
                <div
                  className="relative mx-auto"
                  style={{
                    width: '480px',
                    height: '560px',
                    maxWidth: '100%'
                  }}
                >
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
                      objectPosition: 'center bottom',
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
                  Ведущий в отрасли уровень безопасности
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D]">
                  Надежная защита данных
                </h2>

                <p className="text-lg text-[#001D8D]/70 leading-relaxed">
                  Мы используем защищённое соединение и современные протоколы шифрования.
                  Запрашиваем только минимально необходимые данные и не передаём их третьим лицам без необходимости.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#001D8D]">Защищённое соединение</h4>
                      <p className="text-sm text-[#001D8D]/70">Вся передаваемая информация шифруется.</p>
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
                      <h4 className="font-semibold text-[#001D8D]">Прозрачный формат работы</h4>
                      <p className="text-sm text-[#001D8D]/70">
                        Условия услуг и возможные риски проговариваем заранее, чтобы у вас было чёткое понимание, как проходит сделка.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

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
                  Опреативная работа сервиса
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D]">
                  Быстрая обработка заявок
                </h2>

                <p className="text-lg text-[#001D8D]/70 leading-relaxed">
                  Вы отправляете запрос на покупку или продажу криптовалюты — мы быстро даём расчёт и варианты проведения сделки.
                  В большинстве случаев первичный ответ занимает до 5 минут, а базовое согласование условий — до 15 минут после обращения.
                  Мы ценим вас и ваше время!
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-white/80 rounded-xl border border-[#001D8D]/10">
                    <div className="text-2xl font-bold text-[#001D8D] mb-1">{"< 5 мин"}</div>
                    <div className="text-sm text-[#001D8D]/70">Первичная обработка заявки</div>
                  </div>

                  <div className="text-center p-4 bg-white/80 rounded-xl border border-[#001D8D]/10">
                    <div className="text-2xl font-bold text-[#001D8D] mb-1">{"< 15 мин"}</div>
                    <div className="text-sm text-[#001D8D]/70">Полное согласование условий</div>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div
                  className="relative mx-auto"
                  style={{
                    width: '560px',
                    height: '560px',
                    maxWidth: '100%'
                  }}
                >
                  <Image
                    src="https://assets.revolut.com/published-assets-v3/245e191d-9293-4ae8-b3f0-460d94bf1801/88405c02-8743-48ef-94a8-ba5910176157.png"
                    alt="Fast crypto exchange dashboard"
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl w-full h-full object-cover"
                    priority
                    fetchPriority="high"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-7xl mx-auto"
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-[#001D8D]/10 text-[#001D8D] px-6 py-3 text-lg mb-8 font-medium">
                  <BarChart3 className="h-6 w-6" />
                  Преимущества нашего сервиса
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#001D8D] mb-6 tracking-tight">
                  Почему выбирают KenigSwap
                </h2>
                <p className="text-xl text-[#001D8D]/70 max-w-4xl mx-auto leading-relaxed">
                  Мы предоставляем комплексное решение для покупки и продажи криптовалют с фокусом на безопасность,
                  скорость и прозрачность. Каждое преимущество создано для вашего удобства и выгоды.
                </p>
              </div>

              <ManifestoStrip values={exchangeAdvantages} />
            </motion.div>

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
                  Готовы получить лучший курс?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Начните прямо сейчас и убедитесь в преимуществах нашего профессионального сервиса.
                  Получите конкурентные курсы и полную информацию по вашей задаче.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="bg-white text-[#001D8D] hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <TrendingUp className="h-5 w-5" />
                    Начать сейчас
                  </button>
                  <Link href="/about">
                    <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">
                      Узнать больше о сервисе
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
