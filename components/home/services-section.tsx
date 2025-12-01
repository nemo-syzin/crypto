"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Banknote, FileText, Send, Wallet, Shield, Clock, CheckCircle, Globe, ArrowRight, ChevronDown } from 'lucide-react';
import ServiceContactModal from './ServiceContactModal';

const services = [
  {
    icon: Banknote,
    title: "Консультации по вопросам финансовой логистики",
    description: "Получайте наличные в 100 городах мира за 2 часа. Безопасно и конфиденциально",
  },
  {
    icon: FileText,
    title: "Консультации по оплате инвойсов",
    description: "Оплата международных счетов от ОАЭ до СНГ. Поддержка любых назначений — от образования до оборудования",
  },
  {
    icon: Send,
    title: "Консультации по переводам за рубеж",
    description: "Пополнение зарубежных карт и счетов, включая Европу, Азию и СНГ. Офлайн и онлайн",
  },
  {
    icon: Wallet,
    title: "Консультации по пополнению платёжных систем",
    description: "PayPal, Zelle, WISE, Revolut, UnionPay, AliPay, WeChat — до 10 000 $ или 100 000 ¥",
  }
];

const workflowSteps = [
  {
    number: "01",
    title: "Связь с менеджером",
    description: "Вы оставляете заявку или пишете нам. Менеджер уточняет вашу задачу и базовые параметры сделки по покупке или продаже криптовалюты."
  },
  {
    number: "02",
    title: "Подбор решения и сценария сделки",
    description: "Мы консультируем по возможным вариантам проведения операции, обсуждаем курсы, комиссии, требования сервисов и банков и даём рекомендации по оптимальному сценарию."
  },
  {
    number: "03",
    title: "Сопровождение на этапе сделки",
    description: "Вы самостоятельно проводите расчёты через выбранные сервисы или банковские инструменты, а мы при необходимости остаёмся на связи, чтобы ответить на вопросы и помочь корректно оформить документы."
  }
];

const benefits = [
  {
    icon: Shield,
    title: "Надежность",
    description: "Консультируем в рамках действующего законодательства, не запрашиваем лишние данные и не передаём информацию третьим лицам."
  },
  {
    icon: Clock,
    title: "Скорость",
    description: "Отвечаем без выходных и оперативно подбираем решение: в большинстве случаев вы получаете рекомендации в день обращения."
  },
  {
    icon: Globe,
    title: "Прозрачность",
    description: "Сразу объясняем возможные схемы сделки, комиссии сторонних сервисов и связанные риски, чтобы вы принимали взвешенное решение."
  },
  {
    icon: CheckCircle,
    title: "Сопровождение",
    description: "Остаёмся на связи до завершения вашей сделки и при необходимости даём дополнительные разъяснения по шагам и документам."
  }
];

const regions = [
  {
    name: "Европа",
    countries: "Австрия, Болгария, Великобритания, Венгрия, Германия, Греция, Испания, Молдавия, Монако, Нидерланды, Норвегия, Польша, Румыния, Северный Кипр, Словакия, Словения, Финляндия, Франция, Хорватия, Чехия, Швейцария, Швеция"
  },
  {
    name: "СНГ и Ближний Восток",
    countries: "Армения, Беларусь, Грузия, Израиль, Казахстан, Кипр, Киргизия, Турция, Таджикистан, Туркмения, Узбекистан"
  },
  {
    name: "Америка",
    countries: "Аргентина, Канада, Мексика, США, Боливия, Бразилия, Гондурас, Доминикана, Колумбия, Коста-Рика, Чили, Эквадор"
  },
  {
    name: "Азия и Африка",
    countries: "Вьетнам, Индия, Индонезия, Камбоджа, Китай, Мальдивы, ОАЭ, Сингапур, Таиланд, Южная Корея"
  },
  {
    name: "Австралия и Новая Зеландия",
    countries: "Австралия, Новая Зеландия"
  }
];

const ServicesSection = () => {
  const [expandedRegion, setExpandedRegion] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const toggleRegion = (index: number) => {
    setExpandedRegion(expandedRegion === index ? null : index);
  };

  const openContactModal = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
  };

  const closeContactModal = () => {
    setSelectedService(null);
  };

  return (
    <div className="relative overflow-hidden py-16 text-[#001D8D] bg-transparent">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Hero Introduction */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
            Финансовые решения <span className="text-[#001D8D]">KenigSwap</span>
          </h2>
          <p className="text-base md:text-lg text-[#001D8D]/70 max-w-2xl mx-auto leading-relaxed">
            Консультации по международным переводам, оплате инвойсов, доступу к глобальным платёжным системам — всё в одном окне
          </p>
        </motion.div>

        {/* Services List - Minimalist Catalog */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex flex-col space-y-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.28, ease: 'easeOut', delay: index * 0.06 }}
                className="group pb-8 border-b border-[#001D8D]/10 last:border-b-0 transition-colors duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <service.icon className="w-6 h-6 text-[#001D8D]/70 group-hover:text-blue-600 transition-colors duration-300" strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-semibold text-[#001D8D] mb-2 group-hover:translate-x-1 group-hover:text-blue-600 transition-all duration-300">
                      {service.title}
                    </h3>
                    <p className="text-sm md:text-base text-[#001D8D]/70 leading-relaxed mb-4">
                      {service.description}
                    </p>

                    {/* Footer with min amount and details link */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#001D8D]/60">{service.minAmount}</span>
                      <button
                        onClick={() => openContactModal(service.title)}
                        className="text-[#001D8D]/60 hover:text-[#001D8D] transition-colors duration-300 flex items-center gap-1"
                      >
                        Подробнее <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center mb-24"
        >
          <button
            onClick={() => openContactModal('Консультация по финансовым услугам')}
            className="px-6 py-3 bg-transparent border-2 border-[#001D8D] text-[#001D8D] text-base font-semibold rounded-full transition-all duration-300 hover:bg-[#001D8D]/5 hover:shadow-[0_0_20px_rgba(0,29,141,0.3)]"
          >
            Получить консультацию
          </button>
        </motion.div>

        {/* Workflow Section */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
            Надежная и быстрая схема работы
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {workflowSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, ease: 'easeOut', delay: index * 0.08 }}
              className="group p-6 rounded-2xl bg-white/80 md:backdrop-blur-sm border border-[#001D8D]/10 hover:shadow-lg transition-[box-shadow,background-color] duration-300"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              <div className="text-5xl font-bold text-[#001D8D] mb-4 font-mono group-hover:text-blue-600 transition-colors duration-200">
                {step.number}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[#001D8D] mb-2 group-hover:text-blue-600 transition-colors duration-200">
                {step.title}
              </h3>
              <p className="text-sm md:text-base text-[#001D8D]/70 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
            Ваше финансовое спокойствие в любой точке мира
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, ease: 'easeOut', delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="relative group p-8 rounded-3xl bg-gradient-to-br from-white/50 to-white/10 md:backdrop-blur-lg shadow-[0_4px_24px_rgba(0,29,141,0.06)] transition-[box-shadow,background-color] duration-300 ease-out hover:shadow-[0_10px_42px_rgba(0,29,141,0.14)]"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[radial-gradient(circle_at_center,rgba(0,29,141,0.08)_0%,transparent_70%)] rounded-3xl"></div>

              <div className="relative z-10">
                <h3 className="text-base md:text-lg font-semibold text-[#001D8D] mb-2 group-hover:text-blue-600 transition-colors duration-200">{benefit.title}</h3>
                <p className="text-sm md:text-base text-[#001D8D]/70 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Geography Section */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
            География работ
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          {regions.map((region, index) => (
            <motion.div
              key={index}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: index * 0.06 }}
              className="rounded-2xl bg-white/80 md:backdrop-blur-sm border border-[#001D8D]/10 hover:shadow-lg transition-[box-shadow,background-color] duration-300 overflow-hidden"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              <button
                onClick={() => toggleRegion(index)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-[#001D8D]/5 transition-colors duration-200"
              >
                <h3 className="text-xl md:text-2xl font-bold text-[#001D8D]">
                  {region.name}
                </h3>
                <motion.div
                  animate={{ rotate: expandedRegion === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="h-6 w-6 text-[#001D8D]" />
                </motion.div>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: expandedRegion === index ? "auto" : 0,
                  opacity: expandedRegion === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 space-y-4">
                  <p className="text-sm md:text-base text-[#001D8D]/70 leading-relaxed">
                    {region.countries}
                  </p>
                  <button
                    onClick={() => openContactModal(region.name)}
                    className="inline-flex items-center gap-1.5 text-[#001D8D] hover:gap-2.5 transition-all duration-200 text-sm font-medium group"
                  >
                    Получить консультацию
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Modal */}
      <ServiceContactModal
        isOpen={selectedService !== null}
        onClose={closeContactModal}
        serviceTitle={selectedService || ''}
      />
    </div>
  );
};

export default ServicesSection;
