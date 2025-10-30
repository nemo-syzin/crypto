"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Banknote, FileText, Send, Wallet, Shield, Clock, CheckCircle, Globe, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Banknote,
    title: "Трансфер наличных",
    description: "Получайте наличные в 100 городах мира за 2 часа. Безопасно и конфиденциально",
    minAmount: "от 10 000 $"
  },
  {
    icon: FileText,
    title: "Оплата инвойсов",
    description: "Оплата международных счетов от ОАЭ до СНГ. Поддержка любых назначений — от образования до оборудования",
    minAmount: "от 3 000 $"
  },
  {
    icon: Send,
    title: "Переводы за рубеж",
    description: "Пополнение зарубежных карт и счетов, включая Европу, Азию и СНГ. Офлайн и онлайн",
    minAmount: "от 3 000 $"
  },
  {
    icon: Wallet,
    title: "Пополнение платёжных систем",
    description: "PayPal, Zelle, WISE, Revolut, UnionPay, AliPay, WeChat — до 10 000 $ или 100 000 ¥",
    minAmount: "от 3 000 $"
  }
];

const workflowSteps = [
  {
    number: "01",
    title: "Связь с менеджером",
    description: "Менеджер рассчитывает комиссию и запрашивает необходимые документы. Вы оплачиваете услугу"
  },
  {
    number: "02",
    title: "Осуществление транзакций",
    description: "Мы совершаем денежный перевод или оплату зарубежного счета в установленные сроки"
  },
  {
    number: "03",
    title: "Завершение сделки",
    description: "Вы получаете документы, подтверждающие завершение сделки"
  }
];

const benefits = [
  {
    icon: Shield,
    title: "Надежность",
    description: "Филиалы по всей России. Не передаем данные клиентов третьим лицам"
  },
  {
    icon: Clock,
    title: "Скорость",
    description: "Работаем без выходных и проводим сделки от 2 часов"
  },
  {
    icon: Globe,
    title: "Прозрачность",
    description: "Фиксированные условия сделки. Обновляем статус транзакции каждые 3 часа"
  },
  {
    icon: CheckCircle,
    title: "Гарантия",
    description: "Осуществим перевод или вернем деньги в течение 24 часов"
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
  return (
    <div className="relative overflow-hidden py-16 text-[#1A1A1A]">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Hero Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-[#1A1A1A]">
            Финансовые решения <span className="text-[#001D8D]">KenigSwap</span>
          </h2>
          <p className="text-[#1A1A1A]/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Международные переводы, оплата инвойсов, доступ к глобальным платёжным системам
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#001D8D]/10 flex items-center justify-center">
                  <service.icon className="h-6 w-6 text-[#001D8D]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1A1A1A]">{service.title}</h3>
              </div>

              <p className="text-[#1A1A1A]/60 leading-relaxed mb-6">{service.description}</p>

              <div className="flex items-center justify-between text-[#1A1A1A]/50">
                <span className="font-medium text-sm">{service.minAmount}</span>
                <button className="text-[#001D8D] font-medium hover:text-[#001D8D]/70 transition flex items-center gap-2 group-hover:gap-3 transition-all text-sm">
                  Подробнее <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <button className="px-10 py-4 bg-[#001D8D] hover:bg-[#001D8D]/90 text-white text-lg font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105">
            Получить консультацию
          </button>
        </motion.div>

        {/* Workflow Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1A1A1A] tracking-tight">
            Надежная и быстрая схема работы
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {workflowSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <div className="text-5xl font-bold text-[#001D8D] mb-4 font-mono opacity-30">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#1A1A1A]">
                {step.title}
              </h3>
              <p className="text-[#1A1A1A]/60 leading-relaxed text-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1A1A1A] tracking-tight">
            Надежные переводы: ваше финансовое спокойствие в любой точке мира
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white border border-gray-100 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center h-14 w-14 bg-[#001D8D]/10 rounded-full">
                  <benefit.icon className="h-7 w-7 text-[#001D8D]" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#1A1A1A]">
                {benefit.title}
              </h3>
              <p className="text-[#1A1A1A]/60 leading-relaxed text-sm">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Cash Transfer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 p-12 rounded-3xl bg-gray-50 border border-gray-100"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1A1A1A] tracking-tight">
            Получите валюту в любой точке мира
          </h2>
          <p className="text-lg text-[#1A1A1A]/60 leading-relaxed">
            Выдаем наличные в 100 городах мира в течение 2 часов либо в заранее согласованное время. От $5000 до $1 млн
          </p>
        </motion.div>

        {/* Geography Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1A1A1A] tracking-tight">
            География работ
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          {regions.map((region, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <h3 className="text-xl font-semibold mb-4 text-[#1A1A1A]">
                {region.name}
              </h3>
              <p className="text-[#1A1A1A]/60 leading-relaxed text-sm">
                {region.countries}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
