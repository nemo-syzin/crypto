"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Banknote, FileText, Send, Wallet, Shield, Clock, CheckCircle, Globe } from 'lucide-react';

const services = [
  {
    icon: Banknote,
    title: "Трансфер наличных",
    description: "Получайте наличные в 100 городах мира от 2 часов",
    minAmount: "от 10 000$"
  },
  {
    icon: FileText,
    title: "Оплата инвойсов",
    description: "Выбирайте источник платежа от ОАЭ до СНГ. Широкий перечень назначений: от оплаты обучения до покупки оборудования",
    minAmount: "от 3 000$"
  },
  {
    icon: Send,
    title: "Переводы за рубеж",
    description: "Пополняйте зарубежные карты в офисах Platilka и онлайн",
    minAmount: "от 3 000$"
  },
  {
    icon: Wallet,
    title: "Пополнение платежных систем",
    description: "Пополняйте ключевые платежные системы: PayPal, Zelle, WISE, Revolut, UnionPay, AliPay, WeChat. Оплата в лимитах до 10 тыс. $ / до 100 тыс. ¥",
    minAmount: "от 3 000$"
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
    <section className="relative py-20 bg-transparent overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="space-y-24">

          {/* Hero Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#001D8D]">
              Принимаем платежи наличными и в криптовалюте
            </h2>
            <p className="text-xl text-[#001D8D]/80 leading-relaxed">
              Безопасные переводы из России в 30+ стран. От 2 часов с минимальной комиссией
            </p>
          </motion.div>

          {/* Services List */}
          <div className="max-w-4xl mx-auto space-y-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-6 pb-8 border-b border-[#001D8D]/10 last:border-b-0 group"
              >
                <div className="flex items-center justify-center h-12 w-12 bg-[#001D8D]/5 rounded-lg flex-shrink-0 group-hover:bg-[#001D8D]/10 transition-colors duration-300">
                  <service.icon className="h-6 w-6 text-[#001D8D]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-4 mb-2 flex-wrap">
                    <h3 className="text-xl md:text-2xl font-bold text-[#001D8D]">{service.title}</h3>
                    <span className="text-sm font-semibold text-[#001D8D]/60 whitespace-nowrap">
                      {service.minAmount}
                    </span>
                  </div>
                  <p className="text-[#001D8D]/70 leading-relaxed">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Workflow Section */}
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-6">
                Надежная и быстрая схема работы
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {workflowSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="glass-tile p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="manifesto-number text-5xl font-bold text-[#001D8D] mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-[#001D8D] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#001D8D]/70 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-6">
                Надежные переводы: ваше финансовое спокойствие в любой точке мира
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="calculator-container text-center hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 bg-[#001D8D]/10 rounded-full mb-4">
                      <benefit.icon className="h-8 w-8 text-[#001D8D]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#001D8D] mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-[#001D8D]/70 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cash Transfer CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="calculator-container max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
              Получите валюту в любой точке мира
            </h2>
            <p className="text-xl text-[#001D8D]/80 leading-relaxed">
              Выдаем наличные в 100 городах мира в течение 2 часов либо в заранее согласованное время. От $5000 до $1 млн
            </p>
          </motion.div>

          {/* Geography Section */}
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-6">
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
                  className="calculator-container hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-2xl font-bold text-[#001D8D] mb-4">
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
      </div>
    </section>
  );
};

export default ServicesSection;
