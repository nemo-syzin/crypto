"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PrincipleCard } from '@/components/ui/principle-card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Shield, 
  Zap, 
  Award, 
  Lightbulb,
  Diamond 
} from 'lucide-react';

const principles = [
  {
    icon: <Users className="h-6 w-6" />,
    title: "Клиентоориентированность",
    text: "Мы зарабатываем тогда, когда зарабатывают наши клиенты. Стремимся глубоко понимать потребности каждого клиента, предлагая персонализированные решения.",
    iconColor: "#3b82f6" // blue-500
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Надежность и прозрачность",
    text: "Мы строго соблюдаем требования AML и KYC и руководствуемся высокими стандартами безопасности. С осторожностью относимся к сверхприбыльным предложениям, обеспечивая полную прозрачность операций.",
    iconColor: "#22c55e" // green-500
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Гибкость и адаптивность",
    text: "В условиях быстро меняющейся внешней среды и новых экономических вызовов мы оперативно адаптируемся и находим нестандартные решения для каждого клиента. Индивидуальный подход к сложным задачам является нашим конкурентным преимуществом.",
    iconColor: "#f97316" // orange-500
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Профессионализм",
    text: "Наши специалисты четко понимают специфику своей работы и постоянно держат руку на пульсе событий, гарантируя высокое качество предоставляемых услуг.",
    iconColor: "#a855f7" // purple-500
  },
  {
    icon: <Lightbulb className="h-6 w-6" />,
    title: "Инновационность",
    text: "Мы внимательно следим за инновациями и интегрируем новейшие технологии, чтобы всегда оставаться впереди конкурентов и предоставлять клиентам передовые решения.",
    iconColor: "#6366f1" // indigo-500
  }
];

export function PrinciplesSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Radial gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 1) 0%, rgba(219, 234, 254, 0.3) 100%)'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto"
        >
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
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
          </motion.div>

          {/* Principles grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {principles.map((principle, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      delay: index * 0.1,
                    },
                  },
                }}
              >
                <PrincipleCard
                  icon={principle.icon}
                  title={principle.title}
                  text={principle.text}
                  iconColor={principle.iconColor}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}