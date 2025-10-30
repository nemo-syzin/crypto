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
    <div className="relative overflow-hidden py-16 text-[#001D8D]">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Hero Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-[#001D8D]">
            Финансовые решения <span className="text-[#001D8D]">KenigSwap</span>
          </h2>
          <p className="text-[#001D8D]/70 text-lg max-w-2xl mx-auto">
            Международные переводы, оплата инвойсов, доступ к глобальным платёжным системам — всё в одном окне
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
              className="relative group p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#001D8D]/10 hover:border-[#001D8D]/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#001D8D] flex items-center justify-center shadow-lg">
                  <service.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-[#001D8D]">{service.title}</h3>
              </div>

              <p className="text-[#001D8D]/70 leading-relaxed mb-6">{service.description}</p>

              <div className="flex items-center justify-between text-[#001D8D]/70">
                <span className="font-medium">{service.minAmount}</span>
                <button className="text-[#001D8D] font-medium hover:text-[#001D8D]/70 transition flex items-center gap-2 group-hover:gap-3 transition-all">
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
          <button className="px-8 py-4 bg-[#001D8D] hover:bg-[#001D8D]/90 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Получить консультацию
          </button>
        </motion.div>

        {/* Workflow Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#001D8D]">
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
              className="p-6 rounded-2xl bg-white/90 backdrop-blur-sm border border-[#001D8D]/10 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-5xl font-bold text-[#001D8D] mb-4 font-mono">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#001D8D]">
                {step.title}
              </h3>
              <p className="text-[#001D8D]/70 leading-relaxed">
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
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#001D8D]">
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
              className="p-6 rounded-2xl bg-white/90 backdrop-blur-sm border border-[#001D8D]/10 text-center hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center h-16 w-16 bg-[#001D8D]/10 rounded-full">
                  <benefit.icon className="h-8 w-8 text-[#001D8D]" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#001D8D]">
                {benefit.title}
              </h3>
              <p className="text-[#001D8D]/70 leading-relaxed">
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
          className="text-center mb-16 p-8 rounded-3xl bg-white/90 backdrop-blur-sm border border-[#001D8D]/10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#001D8D]">
            Получите валюту в любой точке мира
          </h2>
          <p className="text-xl text-[#001D8D]/70 leading-relaxed">
            Выдаем наличные в 100 городах мира в течение 2 часов либо в заранее согласованное время. От $5000 до $1 млн
          </p>
        </motion.div>

        {/* Geography Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#001D8D]">
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
              className="p-6 rounded-2xl bg-white/90 backdrop-blur-sm border border-[#001D8D]/10 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-2xl font-bold mb-4 text-[#001D8D]">
                {region.name}
              </h3>
              <p className="text-[#001D8D]/70 leading-relaxed">
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
