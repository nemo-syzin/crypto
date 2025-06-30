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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  BarChart3,
  Crown,
  Sparkles
} from 'lucide-react';
import { UnifiedVantaBackground } from '@/components/shared/UnifiedVantaBackground';

export function PricingPageClient() {
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

  // Тарифные планы
  const pricingPlans = [
    {
      name: "Базовый",
      description: "Для частных лиц и небольших операций",
      price: "0",
      period: "комиссия",
      commission: "1.5%",
      features: [
        "Обмен USDT ⟷ RUB",
        "Лимит до 100,000 RUB в месяц",
        "Стандартная верификация",
        "Поддержка в рабочие часы",
        "Базовая аналитика операций"
      ],
      popular: false,
      color: "blue"
    },
    {
      name: "Профессиональный",
      description: "Для активных трейдеров и бизнеса",
      price: "0",
      period: "комиссия",
      commission: "1.0%",
      features: [
        "Все возможности Базового плана",
        "Лимит до 1,000,000 RUB в месяц",
        "Приоритетная поддержка 24/7",
        "Расширенная аналитика",
        "Персональный менеджер",
        "API доступ для автоматизации"
      ],
      popular: true,
      color: "purple"
    },
    {
      name: "Корпоративный",
      description: "Для крупного бизнеса и институтов",
      price: "Индивидуально",
      period: "",
      commission: "от 0.5%",
      features: [
        "Все возможности Профессионального",
        "Безлимитные операции",
        "Индивидуальные условия",
        "Выделенная поддержка",
        "Интеграция с корпоративными системами",
        "Специальные курсы обмена",
        "Юридическое сопровождение"
      ],
      popular: false,
      color: "gold"
    }
  ];

  if (!isMounted) {
    return null;
  }

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
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Тарифы и цены
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#001D8D]">
                Прозрачные тарифы для <span className="bg-gradient-to-r from-[#001D8D] to-blue-600 bg-clip-text text-transparent">каждого</span>
              </h1>
              <p className="text-xl md:text-2xl text-[#001D8D]/80 max-w-4xl mx-auto leading-relaxed mb-8">
                Выберите подходящий план для ваших потребностей в обмене криптовалют. 
                Никаких скрытых комиссий — только честные и конкурентные условия.
              </p>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-[#001D8D]/70">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Без скрытых комиссий</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Полная прозрачность</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span>Лучшие курсы на рынке</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  <span>Мгновенные операции</span>
                </div>
              </div>
            </motion.div>

            {/* Pricing Plans */}
            <motion.div
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate={controls}
              className="max-w-7xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {pricingPlans.map((plan, index) => (
                  <motion.div
                    key={plan.name}
                    variants={itemVariants}
                    className={`relative ${plan.popular ? 'md:scale-105' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-1 text-sm">
                          <Crown className="h-4 w-4 mr-1" />
                          Популярный
                        </Badge>
                      </div>
                    )}
                    
                    <Card className={`calculator-container h-full ${
                      plan.popular 
                        ? 'ring-2 ring-purple-500 shadow-2xl' 
                        : 'hover:shadow-xl'
                    } transition-all duration-300`}>
                      <CardHeader className="text-center pb-8">
                        <div className="flex justify-center mb-4">
                          <div className={`p-3 rounded-lg ${
                            plan.color === 'blue' ? 'bg-blue-100' :
                            plan.color === 'purple' ? 'bg-purple-100' :
                            'bg-yellow-100'
                          }`}>
                            {plan.color === 'blue' && <Users className="h-6 w-6 text-blue-600" />}
                            {plan.color === 'purple' && <Star className="h-6 w-6 text-purple-600" />}
                            {plan.color === 'gold' && <Crown className="h-6 w-6 text-yellow-600" />}
                          </div>
                        </div>
                        
                        <CardTitle className="text-2xl font-bold text-[#001D8D] mb-2">
                          {plan.name}
                        </CardTitle>
                        <CardDescription className="text-[#001D8D]/70 mb-6">
                          {plan.description}
                        </CardDescription>
                        
                        <div className="text-center">
                          <div className="text-4xl font-bold text-[#001D8D] mb-2">
                            {plan.price}
                            {plan.period && <span className="text-lg text-[#001D8D]/70 ml-2">{plan.period}</span>}
                          </div>
                          <div className={`text-lg font-semibold ${
                            plan.color === 'blue' ? 'text-blue-600' :
                            plan.color === 'purple' ? 'text-purple-600' :
                            'text-yellow-600'
                          }`}>
                            Комиссия: {plan.commission}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <ul className="space-y-4 mb-8">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-[#001D8D]/80 text-sm leading-relaxed">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                        
                        <Button 
                          className={`w-full py-3 font-semibold transition-all duration-300 ${
                            plan.popular
                              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg hover:scale-[1.02]'
                              : 'bg-[#001D8D] text-white hover:bg-[#001D8D]/90 hover:shadow-lg hover:scale-[1.02]'
                          }`}
                        >
                          {plan.name === 'Корпоративный' ? 'Связаться с нами' : 'Начать сейчас'}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Преимущества */}
                <Card className="calculator-container">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-[#001D8D]">
                      <Sparkles className="h-6 w-6" />
                      Почему выбирают нас
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#001D8D]">Лучшие курсы</h4>
                        <p className="text-sm text-[#001D8D]/70">Конкурентные курсы обмена без скрытых наценок</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#001D8D]">Полная безопасность</h4>
                        <p className="text-sm text-[#001D8D]/70">Соответствие AML/KYC и банковский уровень защиты</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Zap className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#001D8D]">Быстрые операции</h4>
                        <p className="text-sm text-[#001D8D]/70">Обмен за 15 минут с автоматической обработкой</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* FAQ */}
                <Card className="calculator-container">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-[#001D8D]">
                      <Award className="h-6 w-6" />
                      Часто задаваемые вопросы
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-[#001D8D] mb-2">Есть ли скрытые комиссии?</h4>
                      <p className="text-sm text-[#001D8D]/70">Нет, все комиссии включены в курс обмена. Никаких дополнительных платежей.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-[#001D8D] mb-2">Можно ли изменить тариф?</h4>
                      <p className="text-sm text-[#001D8D]/70">Да, вы можете повысить лимиты в любое время, пройдя дополнительную верификацию.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-[#001D8D] mb-2">Как работает поддержка?</h4>
                      <p className="text-sm text-[#001D8D]/70">Базовый план — поддержка в рабочие часы, Профессиональный и выше — 24/7.</p>
                    </div>
                  </CardContent>
                </Card>
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
              <Card className="bg-gradient-to-r from-[#001D8D] to-blue-700 text-white shadow-2xl border-none overflow-hidden">
                <CardContent className="p-12 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-50" />
                  <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                      <div className="bg-white/20 p-4 rounded-full">
                        <Globe className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                      Готовы начать обмен?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                      Присоединяйтесь к тысячам довольных клиентов, которые уже оценили 
                      наши конкурентные тарифы и профессиональный сервис.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button className="bg-white text-[#001D8D] hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Начать обмен
                      </Button>
                      <Button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold transition-all duration-300">
                        <Users className="h-5 w-5 mr-2" />
                        Связаться с нами
                      </Button>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-sm text-white/80">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>Более 10,000 довольных клиентов</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-400" />
                        <span>Лицензированная деятельность</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-400" />
                        <span>Рейтинг 4.9/5</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-purple-400" />
                        <span>Международные стандарты</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}