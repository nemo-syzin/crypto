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
  TrendingUp
} from 'lucide-react';
import { UnifiedVantaBackground } from '@/components/shared/UnifiedVantaBackground';
import ExchangeCalculator from '@/components/ExchangeCalculator';
import RatesComparison from '@/components/RatesComparison';

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

  if (!isMounted) {
    return null;
  }

  return (
    <section className="relative py-20 bg-gradient-to-b from-white via-blue-50/10 to-blue-100/20 overflow-hidden">
      {/* Optimized background */}
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[#001D8D]">
              Профессиональный обмен <span className="text-[#001D8D]"> </span>
            </h1>
            <p className="text-xl text-[#001D8D]/80 max-w-3xl mx-auto mb-8">
              Получите лучшие курсы обмена с полной прозрачностью и гарантией безопасности. 
              Мы предлагаем конкурентные цены и надежный сервис для всех ваших потребностей в обмене криптовалют.
            </p>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-[#001D8D]/70">
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

          {/* Value Proposition Cards */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div
              variants={itemVariants}
              className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-[#001D8D]/20 hover:border-[#001D8D]/40 transition-all duration-300 hover:shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-4 text-[#001D8D]">Рыночные курсы в реальном времени</h3>
              <p className="text-[#001D8D]/70 mb-4">
                Наши курсы обновляются каждые 30 секунд, обеспечивая вам самые актуальные и конкурентные цены на рынке обмена.
              </p>
              <div className="text-sm text-green-600 font-medium">
                Автоматическое обновление курсов
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-[#001D8D]/20 hover:border-[#001D8D]/40 transition-all duration-300 hover:shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-4 text-[#001D8D]">Полная прозрачность операций</h3>
              <p className="text-[#001D8D]/70 mb-4">
                Все комиссии включены в курс обмена. Никаких скрытых платежей или дополнительных сборов. Вы видите итоговую сумму до подтверждения сделки.
              </p>
              <div className="text-sm text-blue-600 font-medium">
                Без скрытых комиссий
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-[#001D8D]/20 hover:border-[#001D8D]/40 transition-all duration-300 hover:shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-4 text-[#001D8D]">Безопасный процесс обмена</h3>
              <p className="text-[#001D8D]/70 mb-4">
                Многоуровневая система защиты, шифрование данных и соответствие международным стандартам безопасности для защиты ваших средств.
              </p>
              <div className="text-sm text-purple-600 font-medium">
                Банковский уровень защиты
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-[#001D8D]/20 hover:border-[#001D8D]/40 transition-all duration-300 hover:shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-4 text-[#001D8D]">Регулярные обновления курсов</h3>
              <p className="text-[#001D8D]/70 mb-4">
                Мониторинг рынка 24/7 и автоматическое обновление курсов каждые 30 секунд гарантируют, что вы всегда получаете лучшую цену.
              </p>
              <div className="text-sm text-orange-600 font-medium">
                Мониторинг 24/7
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-[#001D8D]/20 hover:border-[#001D8D]/40 transition-all duration-300 hover:shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-4 text-[#001D8D]">Легкое сравнение предложений</h3>
              <p className="text-[#001D8D]/70 mb-4">
                Сравнивайте курсы разных обменников в одном месте. Мы показываем лучшие предложения рынка для принятия обоснованных решений.
              </p>
              <div className="text-sm text-teal-600 font-medium">
                Лучшие предложения рынка
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-[#001D8D]/20 hover:border-[#001D8D]/40 transition-all duration-300 hover:shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-4 text-[#001D8D]">Профессиональный сервис</h3>
              <p className="text-[#001D8D]/70 mb-4">
                Многолетний опыт работы, тысячи довольных клиентов и высокие рейтинги доверия. Мы предоставляем сервис мирового класса.
              </p>
              <div className="text-sm text-indigo-600 font-medium">
                Высокие рейтинги доверия
              </div>
            </motion.div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-r from-[#001D8D] to-blue-700 rounded-2xl p-8 md:p-12 text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Готовы получить лучший курс обмена?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Начните обмен прямо сейчас и убедитесь в преимуществах нашего профессионального сервиса. 
              Получите конкурентные курсы и полную безопасность ваших средств.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#001D8D] hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                Начать обмен сейчас
              </button>
              <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition-all duration-300">
                Узнать больше о сервисе
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}