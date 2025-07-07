"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Star,
  Zap,
  Shield,
  Users,
  Crown,
  Rocket,
  TrendingUp
} from 'lucide-react';
import { UnifiedVantaBackground } from '@/components/shared/UnifiedVantaBackground';

export function PricingPageClient() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const plans = [
    {
      name: "Базовый",
      price: "0",
      period: "Бесплатно",
      description: "Для начинающих пользователей",
      features: [
        "До 1,000 USDT в месяц",
        "Стандартные курсы",
        "Базовая поддержка",
        "Стандартная верификация"
      ],
      icon: Users,
      color: "from-gray-500 to-gray-600",
      popular: false
    },
    {
      name: "Профессиональный",
      price: "99",
      period: "в месяц",
      description: "Для активных трейдеров",
      features: [
        "До 50,000 USDT в месяц",
        "Улучшенные курсы (-0.2%)",
        "Приоритетная поддержка",
        "Быстрая верификация",
        "Персональный менеджер"
      ],
      icon: Star,
      color: "from-blue-500 to-blue-600",
      popular: true
    },
    {
      name: "Корпоративный",
      price: "499",
      period: "в месяц",
      description: "Для бизнеса и крупных объемов",
      features: [
        "Неограниченные объемы",
        "Лучшие курсы (-0.5%)",
        "24/7 VIP поддержка",
        "Мгновенная верификация",
        "Выделенный менеджер",
        "API доступ",
        "Индивидуальные условия"
      ],
      icon: Crown,
      color: "from-purple-500 to-purple-600",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background */}
      <section className="relative py-20 bg-gradient-to-b from-white via-blue-50/10 to-blue-100/20 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <UnifiedVantaBackground 
            type="topology"
            color={0x94bdff}
            color2={0xFF6B35}
            backgroundColor={0xffffff}
            points={15}
            maxDistance={20}
            spacing={16}
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
              <div className="flex justify-center mb-6">
                <Badge className="bg-[#001D8D]/10 text-[#001D8D] border-[#001D8D]/20 px-6 py-2 text-lg">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Тарифные планы
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#001D8D]">
                Выберите подходящий <span className="bg-gradient-to-r from-[#001D8D] to-blue-600 bg-clip-text text-transparent">тариф</span>
              </h1>
              <p className="text-xl md:text-2xl text-[#001D8D]/80 max-w-4xl mx-auto leading-relaxed">
                Прозрачные тарифы на обмен криптовалют с выгодными условиями для каждого уровня использования
              </p>
            </motion.div>

            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, index) => {
                  const IconComponent = plan.icon;
                  return (
                    <motion.div
                      key={plan.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`relative ${plan.popular ? 'scale-105' : ''}`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-[#001D8D] to-blue-600 text-white px-4 py-1">
                            Популярный
                          </Badge>
                        </div>
                      )}
                      
                      <div className={`calculator-container h-full ${plan.popular ? 'ring-2 ring-[#001D8D] ring-opacity-50' : ''}`}>
                        {/* Header */}
                        <div className="text-center mb-8">
                          <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${plan.color} mb-4`}>
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-[#001D8D] mb-2">{plan.name}</h3>
                          <p className="text-[#001D8D]/70">{plan.description}</p>
                        </div>

                        {/* Price */}
                        <div className="text-center mb-8">
                          <div className="flex items-baseline justify-center">
                            <span className="text-5xl font-bold text-[#001D8D]">
                              {plan.price === "0" ? "Бесплатно" : `₽${plan.price}`}
                            </span>
                            {plan.price !== "0" && (
                              <span className="text-[#001D8D]/70 ml-2">{plan.period}</span>
                            )}
                          </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-4 mb-8">
                          {plan.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-[#001D8D]/80">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* CTA Button */}
                        <div className="mt-auto">
                          <Button 
                            className={`w-full py-3 font-semibold transition-all duration-300 ${
                              plan.popular 
                                ? 'bg-gradient-to-r from-[#001D8D] to-blue-600 text-white hover:shadow-lg hover:scale-[1.02]'
                                : 'border-2 border-[#001D8D]/20 text-[#001D8D] hover:bg-[#001D8D]/5'
                            }`}
                            variant={plan.popular ? "default" : "outline"}
                          >
                            {plan.price === "0" ? "Начать бесплатно" : "Выбрать план"}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Features Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
                  Сравнение возможностей
                </h2>
                <p className="text-xl text-[#001D8D]/70">
                  Подробное сравнение всех тарифных планов
                </p>
              </div>

              <div className="calculator-container">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#001D8D]/10">
                        <th className="text-left py-4 px-4 text-[#001D8D] font-semibold">Возможности</th>
                        <th className="text-center py-4 px-4 text-[#001D8D] font-semibold">Базовый</th>
                        <th className="text-center py-4 px-4 text-[#001D8D] font-semibold">Профессиональный</th>
                        <th className="text-center py-4 px-4 text-[#001D8D] font-semibold">Корпоративный</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-4 px-4 text-[#001D8D]/80">Месячный лимит</td>
                        <td className="py-4 px-4 text-center">1,000 USDT</td>
                        <td className="py-4 px-4 text-center">50,000 USDT</td>
                        <td className="py-4 px-4 text-center">Без ограничений</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-4 px-4 text-[#001D8D]/80">Комиссия</td>
                        <td className="py-4 px-4 text-center">Стандартная</td>
                        <td className="py-4 px-4 text-center">-0.2%</td>
                        <td className="py-4 px-4 text-center">-0.5%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-4 px-4 text-[#001D8D]/80">Поддержка</td>
                        <td className="py-4 px-4 text-center">Базовая</td>
                        <td className="py-4 px-4 text-center">Приоритетная</td>
                        <td className="py-4 px-4 text-center">24/7 VIP</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-4 px-4 text-[#001D8D]/80">API доступ</td>
                        <td className="py-4 px-4 text-center">—</td>
                        <td className="py-4 px-4 text-center">—</td>
                        <td className="py-4 px-4 text-center">✓</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
                  Часто задаваемые вопросы
                </h2>
              </div>

              <div className="space-y-6">
                {[
                  {
                    question: "Можно ли изменить тариф?",
                    answer: "Да, вы можете изменить тариф в любое время. При повышении тарифа изменения вступают в силу немедленно, при понижении — с начала следующего месяца."
                  },
                  {
                    question: "Есть ли скрытые комиссии?",
                    answer: "Нет, все комиссии указаны в тарифах. Мы придерживаемся принципа полной прозрачности ценообразования."
                  },
                  {
                    question: "Что происходит при превышении лимитов?",
                    answer: "При превышении месячного лимита операции временно приостанавливаются до начала следующего месяца или до повышения тарифа."
                  }
                ].map((faq, index) => (
                  <div key={index} className="calculator-container">
                    <h3 className="text-lg font-semibold text-[#001D8D] mb-3">{faq.question}</h3>
                    <p className="text-[#001D8D]/70 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto"
            >
              <div className="bg-gradient-to-r from-[#001D8D] to-blue-700 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-50" />
                <div className="relative z-10">
                  <div className="flex justify-center mb-6">
                    <div className="bg-white/20 p-4 rounded-full">
                      <Rocket className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Готовы начать?
                  </h2>
                  <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                    Выберите подходящий тариф и начните пользоваться всеми преимуществами KenigSwap уже сегодня
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-white text-[#001D8D] hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      <Star className="h-5 w-5 mr-2" />
                      Начать бесплатно
                    </Button>
                    <Button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold transition-all duration-300">
                      Связаться с нами
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}