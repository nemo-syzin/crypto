"use client";

import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target,
  Eye,
  Heart,
  Users,
  Shield,
  Zap,
  Award,
  TrendingUp,
  Globe,
  CheckCircle,
  Star,
  Lightbulb,
  Handshake,
  Clock,
  Building2,
  Rocket,
  Diamond
} from 'lucide-react';
import { UnifiedVantaBackground } from '@/components/shared/UnifiedVantaBackground';
import Image from 'next/image';

export function AboutPageClient() {
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

  const values = [
    {
      icon: Users,
      title: "Клиентоориентированность",
      description: "Мы зарабатываем тогда, когда зарабатывают наши клиенты. Стремимся глубоко понимать потребности каждого клиента, предлагая персонализированные решения.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: Shield,
      title: "Надежность и прозрачность",
      description: "Мы строго соблюдаем требования AML и KYC и руководствуемся высокими стандартами безопасности. С осторожностью относимся к сверхприбыльным предложениям, обеспечивая полную прозрачность операций.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: Zap,
      title: "Гибкость и адаптивность",
      description: "В условиях быстро меняющейся внешней среды и новых экономических вызовов мы оперативно адаптируемся и находим нестандартные решения для каждого клиента. Индивидуальный подход к сложным задачам является нашим конкурентным преимуществом.",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      icon: Award,
      title: "Профессионализм",
      description: "Наши специалисты четко понимают специфику своей работы и постоянно держат руку на пульсе событий, гарантируя высокое качество предоставляемых услуг.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      icon: Lightbulb,
      title: "Инновационность",
      description: "Мы внимательно следим за инновациями и интегрируем новейшие технологии, чтобы всегда оставаться впереди конкурентов и предоставлять клиентам передовые решения.",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      icon: Handshake,
      title: "Долгосрочность и взаимовыгодное партнерство",
      description: "Наш подход к сотрудничеству основан на честности и взаимном доверии. Мы рассматриваем клиентов как партнёров, вместе с которыми достигаем долгосрочного успеха и развития.",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    }
  ];

  const goals2026 = [
    {
      icon: Heart,
      title: "Доверительные отношения",
      description: "Создавать и поддерживать доверительные, долгосрочные отношения с нашими клиентами.",
      progress: 85
    },
    {
      icon: TrendingUp,
      title: "Повышение квалификации",
      description: "Непрерывно повышать уровень квалификации наших специалистов.",
      progress: 70
    },
    {
      icon: Globe,
      title: "Регистрация на BestChange",
      description: "Зарегистрироваться и активно работать на платформе BestChange.",
      progress: 45
    },
    {
      icon: Rocket,
      title: "Технологическое развитие",
      description: "Расширить технологические возможности и ассортимент предоставляемых услуг, приступив к разработке собственной инфраструктуры.",
      progress: 60
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
                  <Building2 className="h-5 w-5 mr-2" />
                  О компании KenigSwap
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#001D8D]">
                Профессиональный <span className="bg-gradient-to-r from-[#001D8D] to-blue-600 bg-clip-text text-transparent">криптосервис</span>
              </h1>
              <p className="text-xl md:text-2xl text-[#001D8D]/80 max-w-4xl mx-auto leading-relaxed">
                Мы предоставляем эффективные, безопасные и прозрачные решения для финансовых операций 
                с криптовалютами и фиатными средствами
              </p>
            </motion.div>

            {/* About Us Section с новым видео */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Текст слева */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-[#001D8D]/10 text-[#001D8D] px-4 py-2 rounded-full text-sm font-medium">
                  <Users className="h-4 w-4" />
                  О нас
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D]">
                  Профессиональный криптосервис
                </h2>
                
                <p className="text-lg text-[#001D8D]/80 leading-relaxed">
                  Мы – профессиональный криптосервис, предоставляющий эффективные, безопасные и прозрачные решения 
                  для финансовых операций с криптовалютами и фиатными средствами. Наша команда объединяет экспертов 
                  в области финансов, технологий и криптоиндустрии, чтобы помочь вашему бизнесу и личным финансам 
                  успешно преодолевать любые экономические барьеры и оперативно адаптироваться к новым вызовам.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#001D8D]">Безопасность и надежность</h4>
                      <p className="text-sm text-[#001D8D]/70">Соблюдение международных стандартов AML/KYC</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Zap className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#001D8D]">Инновационные технологии</h4>
                      <p className="text-sm text-[#001D8D]/70">Передовые решения для криптовалютных операций</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Award className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#001D8D]">Профессиональная команда</h4>
                      <p className="text-sm text-[#001D8D]/70">Эксперты в области финансов и технологий</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Новое видео справа с выравниванием по центру и низу */}
              <div className="order-1 lg:order-2">
                <div className="relative mx-auto" style={{ 
                  width: '480px', 
                  height: '560px',
                  maxWidth: '100%'
                }}>
                  <video
                    src="https://assets.revolut.com/published-assets-v3/a1cbc33c-6662-4f29-ab7b-2c4e1b4e781f/7989b735-2247-485a-b3c4-67680b1974f2.mp4"
                    className="w-full h-full object-cover rounded-lg shadow-2xl"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label="Professional crypto service demonstration"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center bottom', // 🎯 Выравнивание по центру и низу
                      border: 'none',
                      outline: 'none',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Mission Section - Two Equal Columns (ИСПРАВЛЕННЫЙ КОНТЕЙНЕР ИЗОБРАЖЕНИЯ) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Left Column - Image (ИСПРАВЛЕННЫЙ КОНТЕЙНЕР) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center justify-center"
              >
                {/* 🎯 ИСПРАВЛЕННЫЙ КОНТЕЙНЕР ИЗОБРАЖЕНИЯ */}
                <div className="relative w-full max-w-lg aspect-square">
                  <Image
                    src="https://assets.revolut.com/published-assets-v3/73aa49ec-f611-485f-9cc6-b57e3801240f/6a85f8bd-2664-4414-aeec-4d05e476f61b.png"
                    alt="Our Mission - Professional crypto service"
                    fill
                    className="object-contain rounded-2xl shadow-2xl"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </motion.div>

              {/* Right Column - Mission Text (Updated Format) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center"
              >
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 bg-[#001D8D]/10 text-[#001D8D] px-4 py-2 rounded-full text-sm font-medium">
                    <Target className="h-4 w-4" />
                    Наша миссия
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D]">
                    Наша миссия
                  </h2>
                  
                  <p className="text-lg text-[#001D8D]/80 leading-relaxed">
                    Мы помогаем бизнесу и частным клиентам безопасно и эффективно совершать финансовые операции 
                    любой сложности, снижая издержки и способствуя преодолению экономических и операционных барьеров. 
                    Мы стремимся участвовать в инновационной трансформации глобальной финансовой системы, предоставляя 
                    возможность каждому сосредоточиться на своих целях, оставив финансовую логистику профессионалам.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#001D8D]">Безопасные операции</h4>
                        <p className="text-sm text-[#001D8D]/70">Снижение рисков и обеспечение безопасности</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#001D8D]">Снижение издержек</h4>
                        <p className="text-sm text-[#001D8D]/70">Оптимизация финансовых процессов</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Globe className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#001D8D]">Глобальная трансформация</h4>
                        <p className="text-sm text-[#001D8D]/70">Участие в инновационном развитии финансовой системы</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Vision Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto"
            >
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-[#001D8D]/20 hover:border-[#001D8D]/40 transition-all duration-300 hover:shadow-2xl">
                <CardHeader className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <Eye className="h-7 w-7" />
                    Наше видение
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-[#001D8D]/80 leading-relaxed text-lg">
                    Мы видим будущее, в котором финансовая среда становится единым глобальным пространством без 
                    искусственных барьеров. Каждый предприниматель и частное лицо, независимо от географии, имеет 
                    доступ к передовым цифровым инструментам и может безопасно, выгодно и прозрачно вести деятельность. 
                    Наша цель — стать ключевым участником инновационной трансформации глобальной финансовой системы, 
                    совершенствуя технологии расчётов и криптоиндустрии, ускоряя экономическое развитие и раскрывая 
                    инновационный потенциал бизнеса во всём мире.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Goals 2026 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <Badge className="bg-gradient-to-r from-[#001D8D] to-blue-600 text-white px-6 py-2 text-lg mb-6">
                  <Clock className="h-5 w-5 mr-2" />
                  Цели до 2026 года
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
                  Наши стратегические цели
                </h2>
                <p className="text-xl text-[#001D8D]/70 max-w-3xl mx-auto">
                  К 2026 году мы планируем достичь амбициозных целей, которые укрепят наши позиции на рынке
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goals2026.map((goal, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-[#001D8D]/20 hover:border-[#001D8D]/40 transition-all duration-300 hover:shadow-2xl h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="bg-gradient-to-br from-[#001D8D] to-blue-600 p-3 rounded-lg">
                            <goal.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#001D8D] mb-2">{goal.title}</h3>
                            <p className="text-[#001D8D]/70 leading-relaxed">{goal.description}</p>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-[#001D8D]/70">Прогресс</span>
                            <span className="text-sm font-bold text-[#001D8D]">{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div 
                              className="bg-gradient-to-r from-[#001D8D] to-blue-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${goal.progress}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              viewport={{ once: true }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Values Section */}
            <motion.div
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate={controls}
              className="max-w-7xl mx-auto"
            >
              <div className="text-center mb-16">
                <Badge className="bg-gradient-to-r from-[#001D8D] to-blue-600 text-white px-6 py-2 text-lg mb-6">
                  <Diamond className="h-5 w-5 mr-2" />
                  Наши ценности
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
                  Принципы, которыми мы руководствуемся
                </h2>
                <p className="text-xl text-[#001D8D]/70 max-w-3xl mx-auto">
                  Наши ценности формируют культуру компании и определяют подход к работе с каждым клиентом
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group"
                  >
                    <Card className={`h-full ${value.bgColor} border-2 ${value.borderColor} hover:border-[#001D8D]/40 transition-all duration-300 hover:shadow-2xl hover:scale-105 transform`}>
                      <CardContent className="p-8">
                        <div className="text-center mb-6">
                          <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${value.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            <value.icon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-[#001D8D] mb-4">{value.title}</h3>
                        </div>
                        <p className="text-[#001D8D]/70 leading-relaxed text-center">
                          {value.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
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
              <Card className="bg-gradient-to-r from-[#001D8D] to-blue-700 text-white shadow-2xl border-none overflow-hidden">
                <CardContent className="p-12 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-50" />
                  <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                      <div className="bg-white/20 p-4 rounded-full">
                        <Star className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                      Готовы начать сотрудничество?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                      Присоединяйтесь к нашим клиентам, которые уже оценили профессиональный подход 
                      и высокое качество наших услуг в сфере криптовалютных операций.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button className="bg-white text-[#001D8D] hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        <CheckCircle className="h-5 w-5 mr-2 inline" />
                        Начать обмен
                      </button>
                      <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition-all duration-300">
                        <Users className="h-5 w-5 mr-2 inline" />
                        Связаться с нами
                      </button>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-sm text-white/80">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>Лицензированная деятельность</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-400" />
                        <span>Соответствие AML/KYC</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-400" />
                        <span>Профессиональная команда</span>
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