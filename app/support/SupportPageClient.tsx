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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  MessageCircle,
  Mail,
  Send,
  Clock,
  Shield,
  Zap,
  Globe,
  Phone,
  FileText,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Headphones,
  BookOpen,
  MessageSquare,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  HelpCircle,
  Search,
  ArrowRight,
  Lightbulb,
  Heart,
  Award,
  TrendingUp
} from 'lucide-react';

// Динамический импорт 3D-фона с отключенным SSR для улучшения производительности
const UnifiedVantaBackground = dynamic(
  () => import('@/components/shared/UnifiedVantaBackground').then(mod => ({ default: mod.UnifiedVantaBackground })),
  { 
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100" />
  }
);

export function SupportPageClient() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<string>("item-0");
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
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

  // Обновленные методы связи в фирменном стиле
  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Онлайн-чат",
      description: "Самый быстрый способ получить ответ на ваш вопрос. Наши операторы доступны ежедневно с 9:00 до 22:00.",
      action: "Начать чат",
      available: true,
      responseTime: "< 5 минут",
      features: ["Мгновенные ответы", "Поддержка файлов", "История чата"]
    },
    {
      icon: Mail,
      title: "Электронная почта",
      description: "Отправьте нам сообщение на support@kenigswap.com и получите подробный ответ в течение 24 часов.",
      action: "Написать письмо",
      available: true,
      responseTime: "< 24 часа",
      features: ["Подробные ответы", "Прикрепление файлов", "Официальная переписка"]
    },
    {
      icon: Send,
      title: "Телеграм-бот",
      description: "Используйте нашего Telegram-бота для оперативной поддержки: @KenigSwapSupportBot",
      action: "Открыть Telegram",
      available: true,
      responseTime: "< 10 минут",
      features: ["Быстрые уведомления", "Статус заявок", "Мобильная поддержка"]
    }
  ];

  // Объединенные FAQ - из главной страницы + существующие
  const faqs = [
    // FAQ из главной страницы
    {
      question: "Сколько времени занимает обмен?",
      answer: "В офисе полный процесс обмена занимает 10-15 минут. Онлайн-обмен обычно завершается за 20-30 минут при условии быстрого прохождения верификации и своевременного перевода средств.",
      category: "Обмен"
    },
    {
      question: "Какая минимальная сумма обмена?",
      answer: "Минимальная сумма онлайн-обмена составляет 100 USDT. Такая сумма позволяет нам предоставить максимально удобные и выгодные условия для клиентов.\n\nМинимальная сумма для обмена с наличными в офисе составляет 100 000 рублей. Это необходимо для обеспечения выгодного курса и оперативности сделки.",
      category: "Обмен"
    },
    {
      question: "Какие комиссии взимаются за обмен?",
      answer: "Мы не взимаем никаких скрытых комиссий. Все уже вложено в актуальные курсы обмена которые вы видите на нашем сайте.",
      category: "Комиссии"
    },
    {
      question: "Какие документы нужны для верификации?",
      answer: "Для базовой верификации требуется паспорт и селфи с паспортом. Процесс обычно занимает не более 5 минут. Для повышенных лимитов может потребоваться подтверждение адреса проживания.",
      category: "Верификация"
    },
    // Существующие FAQ
    {
      question: "Как совершить обмен?",
      answer: "Перейдите в раздел Exchange, выберите валюты и сумму обмена. Далее следуйте простым инструкциям на странице. Весь процесс займет не более 15 минут.",
      category: "Обмен"
    },
    {
      question: "Какие меры безопасности вы применяете?",
      answer: "Мы строго соблюдаем процедуры AML и KYC, используем передовые методы шифрования и постоянно мониторим транзакции для обеспечения полной безопасности ваших средств. Все данные защищены по банковским стандартам.",
      category: "Безопасность"
    },
    {
      question: "Какие валюты доступны для обмена?",
      answer: "Мы поддерживаем широкий спектр популярных криптовалют (Bitcoin, Ethereum, USDT, USDC и другие) и фиатных валют (RUB, USD, EUR). Полный список представлен на странице Exchange.",
      category: "Валюты"
    },
    {
      question: "Как быстро обрабатываются транзакции?",
      answer: "Обмены происходят практически мгновенно, но время может зависеть от загруженности сети. Обычно процесс занимает не более 15 минут. Крупные суммы могут требовать дополнительной проверки.",
      category: "Транзакции"
    }
  ];

  const guides = [
    {
      title: "Как создать и подтвердить аккаунт",
      description: "Пошаговое руководство по регистрации и верификации",
      icon: Users,
      readTime: "5 мин"
    },
    {
      title: "Как повысить лимиты на операции",
      description: "Инструкция по увеличению лимитов для крупных операций",
      icon: TrendingUp,
      readTime: "3 мин"
    },
    {
      title: "Руководство по безопасности аккаунта",
      description: "Лучшие практики защиты вашего аккаунта",
      icon: Shield,
      readTime: "7 мин"
    }
  ];

  const socialLinks = [
    { icon: Send, name: "Telegram", url: "#", color: "text-blue-500" },
    { icon: Twitter, name: "Twitter", url: "#", color: "text-blue-400" },
    { icon: MessageSquare, name: "Discord", url: "#", color: "text-indigo-500" }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', contactForm);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background */}
      <section className="relative py-20 bg-gradient-to-b from-white via-blue-50/10 to-blue-100/20 overflow-hidden">
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
            
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <div className="flex justify-center mb-6">
                <Badge className="bg-[#001D8D]/10 text-[#001D8D] border-[#001D8D]/20 px-6 py-2 text-lg">
                  <Headphones className="h-5 w-5 mr-2" />
                  Служба поддержки
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#001D8D]">
                Мы всегда готовы <span className="bg-gradient-to-r from-[#001D8D] to-blue-600 bg-clip-text text-transparent">помочь</span>
              </h1>
              <p className="text-xl md:text-2xl text-[#001D8D]/80 max-w-4xl mx-auto leading-relaxed mb-8">
                Команда KenigSwap стремится обеспечить высокий уровень обслуживания клиентов. 
                Если у вас возникли вопросы, трудности или требуется помощь, наши специалисты 
                всегда готовы помочь оперативно и профессионально.
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-[#001D8D]/70">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span>Ответ в течение 5 минут</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Поддержка 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <span>Рейтинг 4.9/5</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-600" />
                  <span>Многоязычная поддержка</span>
                </div>
              </div>
            </motion.div>

            {/* Contact Methods - В фирменном стиле калькулятора */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-[#001D8D]/10 text-[#001D8D] px-6 py-3 rounded-full text-lg mb-8 font-medium">
                  <MessageCircle className="h-6 w-6" />
                  Связаться с нами
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
                  Связаться с нами
                </h2>
                <p className="text-xl text-[#001D8D]/70 max-w-3xl mx-auto">
                  Выберите удобный способ связи. Мы отвечаем быстро и профессионально
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    {/* Карточка в стиле калькулятора */}
                    <div className="calculator-container h-full group-hover:shadow-xl transition-all duration-300">
                      {/* Заголовок с иконкой */}
                      <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-br from-[#001D8D] to-blue-600 group-hover:scale-110 transition-transform duration-300">
                          <method.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-[#001D8D] group-hover:text-blue-600 transition-colors">
                              {method.title}
                            </h3>
                            {method.available && (
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-green-600 font-medium">Online</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Время ответа - крупно */}
                          <div className="mb-3">
                            <div className="text-2xl font-bold text-[#001D8D]">
                              {method.responseTime}
                            </div>
                            <div className="text-sm text-[#001D8D]/70">время ответа</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Описание */}
                      <p className="text-[#001D8D]/70 leading-relaxed mb-6 text-sm">
                        {method.description}
                      </p>
                      
                      {/* Особенности */}
                      <div className="mb-6">
                        <div className="text-sm font-medium text-[#001D8D]/70 mb-3">Особенности:</div>
                        <div className="space-y-2">
                          {method.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                              <span className="text-xs text-[#001D8D]/70">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Кнопка действия */}
                      <div className="mt-auto">
                        <button className="w-full bg-gradient-to-r from-[#001D8D] to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2">
                          {method.action}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced FAQ Section - Объединенные вопросы */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-12">
                <Badge className="bg-gradient-to-r from-[#001D8D] to-blue-600 text-white px-6 py-2 text-lg mb-6">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Ответы на популярные вопросы
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
                  Часто задаваемые вопросы
                </h2>
                <p className="text-xl text-[#001D8D]/70 max-w-3xl mx-auto">
                  Мы собрали ответы на наиболее популярные вопросы о нашем сервисе, процессе обмена и безопасности, 
                  чтобы помочь вам быстро найти решение
                </p>
              </div>

              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-[#001D8D]/20">
                <CardContent className="p-8">
                  <Accordion
                    type="single"
                    collapsible
                    value={selectedFaq}
                    onValueChange={setSelectedFaq}
                    className="space-y-4"
                  >
                    {faqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="border border-[#001D8D]/10 rounded-lg px-6 py-2 hover:border-[#001D8D]/30 transition-all duration-300 bg-white/90 backdrop-blur-sm"
                      >
                        <AccordionTrigger className="text-[#001D8D] hover:text-[#001D8D]/80 text-left font-medium">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              {faq.category}
                            </Badge>
                            <span>{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-[#001D8D]/70 leading-relaxed pt-4">
                          {faq.answer.split('\n').map((paragraph, pIndex) => (
                            <p key={pIndex} className={pIndex > 0 ? 'mt-4' : ''}>
                              {paragraph}
                            </p>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>


            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-[#001D8D]/20">
                <CardHeader className="bg-gradient-to-r from-[#001D8D] to-blue-700 text-white rounded-t-lg">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <Mail className="h-6 w-6" />
                    Обратная связь
                  </CardTitle>
                  <p className="text-white/90">
                    Ваше мнение важно для нас. Помогите нам улучшить качество сервиса
                  </p>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-[#001D8D] font-medium">Имя</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                          className="mt-2 border-[#001D8D]/20 focus:border-[#001D8D]"
                          placeholder="Ваше имя"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-[#001D8D] font-medium">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                          className="mt-2 border-[#001D8D]/20 focus:border-[#001D8D]"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="subject" className="text-[#001D8D] font-medium">Тема</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        className="mt-2 border-[#001D8D]/20 focus:border-[#001D8D]"
                        placeholder="Тема обращения"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message" className="text-[#001D8D] font-medium">Сообщение</Label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        className="mt-2 border-[#001D8D]/20 focus:border-[#001D8D] min-h-[120px]"
                        placeholder="Опишите ваш вопрос или предложение..."
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#001D8D] to-blue-600 text-white py-3 text-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Отправить сообщение
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Social Media & Community */}
            <motion.div
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate={controls}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
                  Социальные сети и сообщество
                </h2>
                <p className="text-xl text-[#001D8D]/70 max-w-3xl mx-auto">
                  Присоединяйтесь к нашему сообществу для обмена опытом и оперативного получения актуальной информации
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {socialLinks.map((social, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group"
                  >
                    <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10 hover:border-[#001D8D]/30 transition-all duration-300 hover:shadow-xl hover:scale-105 transform cursor-pointer">
                      <CardContent className="p-8 text-center">
                        <div className="mb-6">
                          <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-[#001D8D] group-hover:to-blue-600 transition-all duration-300 shadow-lg">
                            <social.icon className={`h-8 w-8 ${social.color} group-hover:text-white transition-colors duration-300`} />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-[#001D8D] mb-3">{social.name}</h3>
                        <p className="text-[#001D8D]/70 leading-relaxed mb-4">
                          Следите за новостями и общайтесь с сообществом
                        </p>
                        <Button variant="outline" className="w-full border-[#001D8D]/20 text-[#001D8D] hover:bg-[#001D8D] hover:text-white transition-all duration-300">
                          Подписаться
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>


            {/* Final CTA */}
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
                        <Award className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                      Остались вопросы?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                      Наша команда поддержки работает 24/7, чтобы обеспечить вам лучший опыт 
                      использования KenigSwap. Мы всегда готовы помочь!
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button className="bg-white text-[#001D8D] hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Начать чат
                      </Button>
                      <Button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold transition-all duration-300">
                        <Phone className="h-5 w-5 mr-2" />
                        Заказать звонок
                      </Button>
                    </div>

                    {/* Support stats */}
                    <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-sm text-white/80">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-400" />
                        <span>Более 10,000 решенных вопросов</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-400" />
                        <span>Средний ответ: 3 минуты</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span>Рейтинг удовлетворенности: 98%</span>
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