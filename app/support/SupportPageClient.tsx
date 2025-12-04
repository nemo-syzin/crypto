"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { RealChat, RealChatButton } from '@/components/ui/real-chat';
import { FeedbackSection } from '@/components/feedback/FeedbackSection';
import { ContactSection } from '@/components/support/ContactSection';
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

  // Функция для открытия кастомного чата
  const handleLiveChatClick = () => {
    setChatOpen(true);
    setChatMinimized(false);
  };

  // Объединенные FAQ - из главной страницы + существующие
  const faqs = [
    // FAQ из главной страницы
    {
      question: "Сколько времени занимает весь процесс?",
      answer: "В офисе полный процесс занимает 10-15 минут.",
      category: "Встреча"
    },
    {
      question: "Какая минимальная сумма сделки?",
      answer: "Минимальная сумма сделки в офисе с наличными в офисе составляет 100 000 рублей. Это необходимо для обеспечения выгодного курса и оперативности сделки.",
      category: "Сделка"
    },
    {
      question: "Какие комиссии взимаются?",
      answer: "Мы не взимаем никаких скрытых комиссий. Все уже вложено в актуальные курсы которые вы видите на нашем сайте.",
      category: "Комиссии"
    },
    {
      question: "Какие документы нужны для верификации?",
      answer: "Для базовой верификации требуется паспорт. Процесс обычно занимает не более 5-10 минут. Для повышенных лимитов может потребоваться дополнительная информация.",
      category: "Верификация"
    },
    // Существующие FAQ
    {
      question: "Как провести сделку?",
      answer: "Перейдите в раздел Exchange, выберите валюты и сумму. Далее следуйте простым инструкциям на странице. Весь процесс займет не более 5 минут.",
      category: "Оставить заявку"
    },
    {
      question: "Какие меры безопасности вы применяете?",
      answer: "Мы строго соблюдаем процедуры AML и KYC, используем передовые методы шифрования и постоянно мониторим транзакции для обеспечения полной безопасности.",
      category: "Безопасность"
    },
    {
      question: "Как быстро обрабатываются транзакции?",
      answer: "Обмены происходят практически мгновенно, но время может зависеть от загруженности сети. Обычно процесс занимает не более 5 минут. Крупные суммы могут требовать дополнительной проверки.",
      category: "Транзакции"
    }
  ];


  return (
    <div className="min-h-screen bg-transparent">
      {/* Main content section */}
      <section className="relative py-16 bg-transparent overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="space-y-16">

            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center pt-16"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#001D8D] leading-tight tracking-tight">
                Мы всегда готовы <span className="bg-gradient-to-r from-[#001D8D] to-blue-600 bg-clip-text text-transparent">помочь</span>
              </h1>
            </motion.div>

            {/* Contact Section */}
            <ContactSection onLiveChatClick={handleLiveChatClick} />

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
                  Мы собрали ответы на наиболее популярные вопросы о нашем сервисе, процессе и безопасности, 
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
