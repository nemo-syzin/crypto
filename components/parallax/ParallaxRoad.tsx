"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Scrollama, Step } from 'react-scrollama';
import { 
  Target, 
  TrendingUp, 
  Globe, 
  Rocket, 
  CheckCircle, 
  Clock,
  Award,
  Users,
  Heart,
  Mountain,
  Flag,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StrategicGoal {
  id: string;
  title: string;
  description: string;
  kpi: string;
  progress: number;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  borderColor: string;
  achievement: 'completed' | 'in-progress' | 'planned';
}

const strategicGoals: StrategicGoal[] = [
  {
    id: 'trust',
    title: "Доверительные отношения",
    description: "Создавать и поддерживать доверительные, долгосрочные отношения с нашими клиентами через персонализированный подход и высокое качество сервиса.",
    kpi: "85% клиентов",
    progress: 85,
    icon: Heart,
    color: "from-red-500 to-pink-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    achievement: 'in-progress'
  },
  {
    id: 'qualification',
    title: "Повышение квалификации",
    description: "Непрерывно повышать уровень квалификации наших специалистов через обучение и сертификацию в области криптовалют и финансовых технологий.",
    kpi: "70% команды",
    progress: 70,
    icon: TrendingUp,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    achievement: 'in-progress'
  },
  {
    id: 'bestchange',
    title: "Регистрация на BestChange",
    description: "Зарегистрироваться и активно работать на платформе BestChange для расширения клиентской базы и повышения узнаваемости бренда.",
    kpi: "45% готовности",
    progress: 45,
    icon: Globe,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    achievement: 'planned'
  },
  {
    id: 'technology',
    title: "Технологическое развитие",
    description: "Расширить технологические возможности и ассортимент предоставляемых услуг, приступив к разработке собственной инфраструктуры и API.",
    kpi: "60% реализации",
    progress: 60,
    icon: Rocket,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    achievement: 'in-progress'
  }
];

export function ParallaxRoad() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth spring animations for parallax layers
  const roadProgress = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const mountainY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const cloudY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const roadY = useTransform(scrollYProgress, [0, 1], [0, 20]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const onStepEnter = ({ data }: { data: number }) => {
    setCurrentStep(data);
  };

  const getAchievementIcon = (achievement: string) => {
    switch (achievement) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'planned':
        return <Target className="h-4 w-4 text-orange-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAchievementColor = (achievement: string) => {
    switch (achievement) {
      case 'completed':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'planned':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  if (isMobile) {
    // Mobile: Vertical Stepper Layout
    return (
      <section className="py-20 bg-gradient-to-b from-blue-50/30 to-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          {/* Mobile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-gradient-to-r from-[#001D8D] to-blue-600 text-white px-6 py-2 text-lg mb-6">
              <Flag className="h-5 w-5 mr-2" />
              Стратегические цели 2026
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
              Наш путь к успеху
            </h2>
            <p className="text-lg text-[#001D8D]/70 max-w-2xl mx-auto">
              Четкие цели и измеримые результаты на пути к лидерству в криптоиндустрии
            </p>
          </motion.div>

          {/* Mobile Vertical Stepper */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#001D8D] to-blue-300"></div>
            
            {strategicGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative mb-12 last:mb-0"
              >
                {/* Checkpoint Circle */}
                <div className="absolute left-6 w-4 h-4 bg-white border-4 border-[#001D8D] rounded-full z-10"></div>
                
                {/* Goal Card */}
                <div className="ml-16">
                  <Card className={`${goal.bgColor} border-2 ${goal.borderColor} hover:border-[#001D8D]/40 transition-all duration-300 hover:shadow-xl`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`bg-gradient-to-br ${goal.color} p-3 rounded-lg shadow-lg`}>
                          <goal.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-[#001D8D]">{goal.title}</h3>
                            <Badge className={`${getAchievementColor(goal.achievement)} text-xs`}>
                              {getAchievementIcon(goal.achievement)}
                              <span className="ml-1 capitalize">{goal.achievement === 'in-progress' ? 'В процессе' : goal.achievement === 'completed' ? 'Завершено' : 'Запланировано'}</span>
                            </Badge>
                          </div>
                          <p className="text-[#001D8D]/70 text-sm leading-relaxed mb-4">
                            {goal.description}
                          </p>
                          
                          {/* KPI and Progress */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-[#001D8D]/70">Прогресс</span>
                              <span className="text-lg font-bold text-[#001D8D]">{goal.kpi}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div 
                                className={`bg-gradient-to-r ${goal.color} h-2 rounded-full`}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${goal.progress}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                viewport={{ once: true }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop: Horizontal Parallax Road Layout
  return (
    <section ref={containerRef} className="relative h-[400vh] bg-gradient-to-b from-blue-50/30 to-white overflow-hidden">
      {/* Background Mountains (Slowest parallax) */}
      <motion.div 
        style={{ y: mountainY }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-blue-100/40 to-transparent">
          <svg viewBox="0 0 1200 300" className="w-full h-full">
            <path
              d="M0,300 L0,200 Q150,150 300,180 T600,160 T900,140 T1200,120 L1200,300 Z"
              fill="url(#mountainGradient)"
              opacity="0.6"
            />
            <path
              d="M0,300 L0,240 Q200,200 400,220 T800,200 T1200,180 L1200,300 Z"
              fill="url(#mountainGradient2)"
              opacity="0.4"
            />
            <defs>
              <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#001D8D" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#94bdff" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="mountainGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#94bdff" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </motion.div>

      {/* Floating Clouds (Medium parallax) */}
      <motion.div 
        style={{ y: cloudY }}
        className="absolute inset-0 z-10 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-16 h-8 bg-white/30 rounded-full blur-sm"></div>
        <div className="absolute top-32 right-20 w-20 h-10 bg-white/25 rounded-full blur-sm"></div>
        <div className="absolute top-16 left-1/3 w-12 h-6 bg-white/35 rounded-full blur-sm"></div>
        <div className="absolute top-40 right-1/3 w-18 h-9 bg-white/20 rounded-full blur-sm"></div>
      </motion.div>

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#001D8D]/10 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Badge className="bg-gradient-to-r from-[#001D8D] to-blue-600 text-white px-6 py-2 text-lg mb-4">
              <Flag className="h-5 w-5 mr-2" />
              Стратегические цели 2026
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-2">
              Наш путь к успеху
            </h2>
            <p className="text-lg text-[#001D8D]/70 max-w-2xl mx-auto">
              Четкие цели и измеримые результаты на пути к лидерству в криптоиндустрии
            </p>
          </div>
        </div>
      </div>

      {/* Main Road Container */}
      <motion.div 
        style={{ y: roadY }}
        className="sticky top-32 z-20 h-screen flex items-center"
      >
        <div className="container mx-auto px-4">
          {/* Road SVG */}
          <div className="relative mb-16">
            <svg viewBox="0 0 1200 200" className="w-full h-32">
              {/* Road Base */}
              <path
                d="M0,150 Q300,120 600,130 T1200,140"
                stroke="#374151"
                strokeWidth="40"
                fill="none"
                opacity="0.8"
              />
              {/* Road Center Line */}
              <path
                d="M0,150 Q300,120 600,130 T1200,140"
                stroke="#FFF"
                strokeWidth="2"
                fill="none"
                strokeDasharray="20,15"
                opacity="0.9"
              />
              
              {/* Checkpoints */}
              {strategicGoals.map((goal, index) => {
                const x = 150 + (index * 250);
                const y = 130 + Math.sin(index * 0.5) * 10;
                const isActive = currentStep >= index;
                
                return (
                  <g key={goal.id}>
                    {/* Checkpoint Circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r="20"
                      fill={isActive ? "#001D8D" : "#94bdff"}
                      stroke="#FFF"
                      strokeWidth="4"
                      className="transition-all duration-500"
                    />
                    {/* Checkpoint Icon */}
                    <foreignObject x={x-8} y={y-8} width="16" height="16">
                      <div className="flex items-center justify-center w-4 h-4">
                        {isActive ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <Flag className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </foreignObject>
                    
                    {/* Checkpoint Number */}
                    <text
                      x={x}
                      y={y + 45}
                      textAnchor="middle"
                      className="text-sm font-bold fill-[#001D8D]"
                    >
                      {index + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Progress Bar */}
          <div className="relative mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-[#001D8D] to-blue-600 h-2 rounded-full"
                style={{ width: roadProgress.get() + "%" }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-[#001D8D]/70">
              <span>Начало пути</span>
              <span>Цель 2026</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scrollama Steps for Goal Cards */}
      <Scrollama onStepEnter={onStepEnter} offset={0.5}>
        {strategicGoals.map((goal, index) => (
          <Step data={index} key={goal.id}>
            <div className="h-screen flex items-center justify-center relative z-30">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ 
                  opacity: currentStep === index ? 1 : 0.3,
                  scale: currentStep === index ? 1 : 0.8,
                  y: currentStep === index ? 0 : 50
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-2xl mx-auto px-4"
              >
                <Card className={`${goal.bgColor} border-2 ${goal.borderColor} shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105`}>
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6 mb-6">
                      <div className={`bg-gradient-to-br ${goal.color} p-4 rounded-xl shadow-lg`}>
                        <goal.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-2xl font-bold text-[#001D8D]">{goal.title}</h3>
                          <Badge className={`${getAchievementColor(goal.achievement)}`}>
                            {getAchievementIcon(goal.achievement)}
                            <span className="ml-2 capitalize">
                              {goal.achievement === 'in-progress' ? 'В процессе' : 
                               goal.achievement === 'completed' ? 'Завершено' : 'Запланировано'}
                            </span>
                          </Badge>
                        </div>
                        <p className="text-[#001D8D]/70 leading-relaxed mb-6">
                          {goal.description}
                        </p>
                        
                        {/* KPI Display */}
                        <div className="bg-white/80 rounded-lg p-4 mb-6">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-[#001D8D]/70">Ключевой показатель</span>
                            <span className="text-2xl font-bold text-[#001D8D]">{goal.kpi}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <motion.div 
                              className={`bg-gradient-to-r ${goal.color} h-3 rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: currentStep === index ? `${goal.progress}%` : 0 }}
                              transition={{ duration: 1, delay: 0.3 }}
                            />
                          </div>
                          <div className="flex justify-between mt-2 text-xs text-[#001D8D]/60">
                            <span>0%</span>
                            <span>{goal.progress}%</span>
                            <span>100%</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`bg-gradient-to-r ${goal.color} text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2`}
                        >
                          Подробнее
                          <ArrowRight className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </Step>
        ))}
      </Scrollama>

      {/* Final Achievement Section */}
      <div className="relative z-30 bg-gradient-to-r from-[#001D8D] to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Award className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Вместе к успеху в 2026 году
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Наши стратегические цели — это не просто планы, а конкретные шаги к лидерству 
              в криптоиндустрии и созданию максимальной ценности для наших клиентов.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {strategicGoals.map((goal, index) => (
                <div key={goal.id} className="text-center">
                  <div className="text-3xl font-bold mb-2">{goal.progress}%</div>
                  <div className="text-white/80 text-sm">{goal.title}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}