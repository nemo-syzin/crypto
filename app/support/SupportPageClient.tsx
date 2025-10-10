"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { RealChat, RealChatButton } from '@/components/ui/real-chat';
import { FeedbackSection } from '@/components/feedback/FeedbackSection';
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
import { MessageCircle, Mail, Send, Clock, Globe, Phone, Users, Star, CircleCheck as CheckCircle, Headphones, Award, ArrowRight, CircleHelp as HelpCircle, Lightbulb } from 'lucide-react';

export function SupportPageClient() {
  const { toast } = useToast();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<string>("item-0");

  // Обновленные методы связи в фирменном стиле
  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Онлайн-чат",
      description: "Общайтесь с нашими операторами в реальном времени через встроенный чат-виджет.",
      action: "Открыть чат",
      available: true,
      responseTime: "< 2 минуты",
      features: ["Мгновенные ответы", "Поддержка 24/7", "История переписки"],
      type: "live_chat"
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
      description: "Используйте нашего Telegram-бота для оперативной поддержки: @kenigswap_39",
      action: "Открыть Telegram",
      available: true,
      responseTime: "< 10 минут",
      features: ["Быстрые уведомления", "Статус заявок", "Мобильная поддержка"]
    }
  ];

  // Функция для открытия кастомного чата
  const handleLiveChatClick = () => {
    setChatOpen(true);
    setChatMinimized(false);
  };

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


  return (
    <div className="min-h-screen bg-transparent">
      {/* Main content section */}
      <section className="relative py-20 bg-transparent overflow-hidden">
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

            {/* Contact Methods - Минималистичный стиль */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
                  Связаться с нами
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Выберите удобный способ связи. Мы отвечаем быстро и профессионально
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#0052FF]/40 hover:translate-y-[-2px] transition-all duration-200"
                  >
                    {/* Заголовок с иконкой */}
                    <div className="flex items-center gap-3 mb-3">
                      <method.icon className="h-5 w-5 text-[#0052FF]" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {method.title}
                      </h3>
                    </div>

                    {/* Время ответа */}
                    <p className="text-sm text-gray-500 mb-4">
                      {method.responseTime}
                    </p>

                    {/* Кнопка действия */}
                    {method.type === 'live_chat' ? (
                      <button
                        onClick={handleLiveChatClick}
                        className="w-full bg-[#0052FF] text-white rounded-full h-10 text-sm font-semibold hover:bg-[#0052FF]/90 transition-colors duration-200"
                      >
                        {method.action}
                      </button>
                    ) : method.title === 'Электронная почта' ? (
                      <a
                        href="mailto:support@kenigswap.com"
                        className="block w-full bg-[#0052FF] text-white rounded-full h-10 text-sm font-semibold hover:bg-[#0052FF]/90 transition-colors duration-200 text-center leading-10"
                      >
                        {method.action}
                      </a>
                    ) : (
                      <a
                        href="https://t.me/kenigswap_39"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-[#0052FF] text-white rounded-full h-10 text-sm font-semibold hover:bg-[#0052FF]/90 transition-colors duration-200 text-center leading-10"
                      >
                        {method.action}
                      </a>
                    )}
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


            {/* Feedback Section */}
            <FeedbackSection />


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
                      <Button className="bg-white text-[#001D8D] hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                        <Mail className="h-5 w-5 mr-2" />
                        Написать письмо
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

      {/* Real Chat Component */}
      <RealChat
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        onMinimize={() => setChatMinimized(!chatMinimized)}
        isMinimized={chatMinimized}
      />
    </div>
  );
}