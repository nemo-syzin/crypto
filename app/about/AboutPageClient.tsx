"use client";

import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ManifestoStrip } from "@/components/ui/manifesto-strip";
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
  Diamond,
  Info
} from 'lucide-react';
import { CrystalVisualization } from '@/components/3d/CrystalVisualization';
import Image from 'next/image';

// Динамический импорт 3D-фона с отключенным SSR для улучшения производительности
const UnifiedVantaBackground = dynamic(
  () => import('@/components/shared/UnifiedVantaBackground').then(mod => ({ default: mod.UnifiedVantaBackground })),
  { 
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100" />
  }
);

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

  // Данные для полосы-манифеста
  const manifestoValues = [
    {
      id: 'client-focus',
      number: '01',
      title: 'Клиентоориентированность',
      description: 'Мы зарабатываем тогда, когда зарабатывают наши клиенты. Стремимся глубоко понимать потребности каждого клиента, предлагая персонализированные решения. Наш успех измеряется успехом наших партнеров.',
      priority: 1, // Самый высокий приоритет
      color: '#3b82f6'
    },
    {
      id: 'reliability',
      number: '02',
      title: 'Надежность и прозрачность',
      description: 'Мы строго соблюдаем требования AML и KYC и руководствуемся высокими стандартами безопасности. С осторожностью относимся к сверхприбыльным предложениям, обеспечивая полную прозрачность операций и честность во всех взаимодействиях.',
      priority: 2,
      color: '#10b981'
    },
    {
      id: 'flexibility',
      number: '03',
      title: 'Гибкость и адаптивность',
      description: 'В условиях быстро меняющейся внешней среды и новых экономических вызовов мы оперативно адаптируемся и находим нестандартные решения для каждого клиента. Индивидуальный подход к сложным задачам является нашим конкурентным преимуществом.',
      priority: 3,
      color: '#f97316'
    },
    {
      id: 'professionalism',
      number: '04',
      title: 'Профессионализм',
      description: 'Наши специалисты четко понимают специфику своей работы и постоянно держат руку на пульсе событий, гарантируя высокое качество предоставляемых услуг. Мы инвестируем в развитие команды и поддержание экспертизы на высочайшем уровне.',
      priority: 4,
      color: '#8b5cf6'
    },
    {
      id: 'innovation',
      number: '05',
      title: 'Инновационность',
      description: 'Мы внимательно следим за инновациями и интегрируем новейшие технологии, чтобы всегда оставаться впереди конкурентов и предоставлять клиентам передовые решения. Технологическое лидерство — основа нашего конкурентного преимущества.',
      priority: 5,
      color: '#6366f1'
    },
    {
      id: 'partnership',
      number: '06',
      title: 'Долгосрочное партнерство',
      description: 'Наш подход к сотрудничеству основан на честности и взаимном доверии. Мы рассматриваем клиентов как партнёров, вместе с которыми достигаем долгосрочного успеха и развития. Строим отношения на годы, а не на разовые сделки.',
      priority: 6,
      color: '#dc2626'
    }
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background */}
      <section className="relative py-20 bg-gradient-to-b from-white via-blue-50/10 to-blue-100/20 overflow-hidden">
        {/* Оптимизированный фон */}
        {isMounted && (
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
        )}

        {/* Gradient transitions */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-5" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-blue-100/20 z-5" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="space-y-24">

            {/* 1. Профессиональный криптосервис (текст) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 bg-[#001D8D]/10 text-[#001D8D] px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Building2 className="h-4 w-4" />
                Профессиональный криптосервис
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-6">
                Профессиональный криптосервис
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="bg-blue-100 p-3 rounded-lg inline-flex mb-3">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-[#001D8D] mb-2">Безопасные операции</h4>
                  <p className="text-sm text-[#001D8D]/70">Снижение рисков и обеспечение безопасности</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 p-3 rounded-lg inline-flex mb-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-[#001D8D] mb-2">Снижение издержек</h4>
                  <p className="text-sm text-[#001D8D]/70">Оптимизация финансовых процессов</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 p-3 rounded-lg inline-flex mb-3">
                    <Globe className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-[#001D8D] mb-2">Глобальная трансформация</h4>
                  <p className="text-sm text-[#001D8D]/70">Участие в инновационном развитии финансовой системы</p>
                </div>
              </div>
            </motion.div>

            {/* 2. Видео */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Текст слева на больших экранах, сверху на мобильных */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="space-y-6 order-1 lg:order-1"
              >
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
              </motion.div>
              
              {/* Видео справа на больших экранах, снизу на мобильных */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center justify-center order-2 lg:order-2"
              >
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
                      objectPosition: 'center bottom',
                      border: 'none',
                      outline: 'none',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* 3. Наша миссия (текст) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Изображение слева на больших экранах, снизу на мобильных */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center justify-center order-2 lg:order-1"
              >
                <div className="relative w-full max-w-lg aspect-square">
                  <Image
                    src="https://assets.revolut.com/published-assets-v3/73aa49ec-f611-485f-9cc6-b57e3801240f/6a85f8bd-2664-4414-aeec-4d05e476f61b.png"
                    alt="Our Mission - Professional crypto service"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                      border: 'none',
                      outline: 'none',
                      boxShadow: 'none'
                    }}
                  />
                </div>
              </motion.div>

              {/* Текст справа на больших экранах, сверху на мобильных */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="space-y-6 order-1 lg:order-2"
              >
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
              </motion.div>
            </motion.div>

            {/* Vision Section - Наше видение */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Left Column - Vision Text */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center order-1 lg:order-1"
              >
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                    <Eye className="h-4 w-4" />
                    Наше видение
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D]">
                    Наше видение
                  </h2>
                  
                  <p className="text-lg text-[#001D8D]/80 leading-relaxed">
                    Мы видим будущее, в котором финансовая среда становится единым глобальным пространством без 
                    искусственных барьеров. Каждый предприниматель и частное лицо, независимо от географии, имеет 
                    доступ к передовым цифровым инструментам и может безопасно, выгодно и прозрачно вести деятельность. 
                    Наша цель — стать ключевым участником инновационной трансформации глобальной финансовой системы.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Globe className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#001D8D]">Глобальное пространство</h4>
                        <p className="text-sm text-[#001D8D]/70">Единая финансовая среда без барьеров</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Lightbulb className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#001D8D]">Цифровые инструменты</h4>
                        <p className="text-sm text-[#001D8D]/70">Передовые технологии для всех</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Rocket className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#001D8D]">Инновационная трансформация</h4>
                        <p className="text-sm text-[#001D8D]/70">Ключевая роль в развитии финансовой системы</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Vision Image */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center justify-center order-2 lg:order-2"
              >
                <div className="relative w-full max-w-lg aspect-square">
                  <Image
                    src="https://assets.revolut.com/published-assets-v3/42d87aec-29bc-40a5-8584-ff44105687b1/f205cf30-e3e8-4106-9167-2fc2c606d648.png"
                    alt="Our Vision - Global financial transformation"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                      border: 'none',
                      outline: 'none',
                      boxShadow: 'none'
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* 3D Crystal Visualization for Strategic Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <CrystalVisualization />
            </motion.div>

            {/* Values Section - Manifesto Strip */}
            <motion.div
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate={controls}
              className="max-w-7xl mx-auto"
            >
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-[#001D8D]/10 text-[#001D8D] px-6 py-3 text-lg mb-8 font-medium">
                  <Diamond className="h-6 w-6" />
                  Манифест наших ценностей
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#001D8D] mb-6 tracking-tight">
                  Принципы, которыми мы руководствуемся
                </h2>
                <p className="text-xl text-[#001D8D]/70 max-w-4xl mx-auto leading-relaxed">
                  Наши ценности формируют культуру компании и определяют профессиональный подход к работе с каждым клиентом. 
                  Каждый принцип отражает наше стремление к совершенству и долгосрочному партнерству.
                </p>
              </div>

              {/* Manifesto Strip Component */}
              <ManifestoStrip values={manifestoValues} />
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-[#001D8D]/10 text-[#001D8D] px-6 py-3 rounded-full text-lg mb-8 font-medium">
                  <Info className="h-6 w-6" />
                  Часто задаваемые вопросы
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
                  Ответы на популярные вопросы
                </h2>
                <p className="text-xl text-[#001D8D]/70 max-w-3xl mx-auto">
                  Мы собрали ответы на наиболее популярные вопросы о нашем сервисе и подходе к работе
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-[#001D8D]/10">
                    <h3 className="text-lg font-bold text-[#001D8D] mb-3">
                      Как долго работает KenigSwap?
                    </h3>
                    <p className="text-[#001D8D]/70 leading-relaxed">
                      Мы работаем на рынке криптовалютных услуг уже несколько лет, накопив значительный опыт 
                      и завоевав доверие тысяч клиентов. Наша команда постоянно развивается и совершенствует сервис.
                    </p>
                  </div>

                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-[#001D8D]/10">
                    <h3 className="text-lg font-bold text-[#001D8D] mb-3">
                      Какие гарантии безопасности вы предоставляете?
                    </h3>
                    <p className="text-[#001D8D]/70 leading-relaxed">
                      Мы строго соблюдаем все требования AML/KYC, используем многоуровневую систему защиты 
                      и современные технологии шифрования. Все операции проходят через защищенные каналы.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-[#001D8D]/10">
                    <h3 className="text-lg font-bold text-[#001D8D] mb-3">
                      Какие комиссии взимаются?
                    </h3>
                    <p className="text-[#001D8D]/70 leading-relaxed">
                      Мы предлагаем прозрачную структуру комиссий без скрытых платежей. 
                      Все комиссии указываются заранее и включены в итоговую стоимость операции.
                    </p>
                  </div>

                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-[#001D8D]/10">
                    <h3 className="text-lg font-bold text-[#001D8D] mb-3">
                      Как быстро обрабатываются транзакции?
                    </h3>
                    <p className="text-[#001D8D]/70 leading-relaxed">
                      Большинство операций обрабатывается в течение 15-30 минут. 
                      Время может варьироваться в зависимости от загруженности сети и суммы операции.
                    </p>
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