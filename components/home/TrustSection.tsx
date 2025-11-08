"use client";
import React from "react";
import { motion } from "framer-motion";
import { Shield, Clock, Globe, CheckCircle } from "lucide-react";

const trustCards = [
  {
    title: "Надёжность",
    description:
      "Филиалы по всей России. Не передаём данные клиентов третьим лицам.",
    icon: Shield,
  },
  {
    title: "Скорость",
    description:
      "Работаем без выходных и проводим сделки от 2 часов.",
    icon: Clock,
  },
  {
    title: "Прозрачность",
    description:
      "Фиксированные условия сделки. Обновляем статус транзакции каждые 3 часа.",
    icon: Globe,
  },
  {
    title: "Гарантия",
    description:
      "Осуществим перевод или вернем деньги в течение 24 часов.",
    icon: CheckCircle,
  },
];

const TrustSection = () => {
  return (
    <section className="relative py-24 bg-transparent overflow-hidden">
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#001D8D]">
            Надёжные переводы: ваше финансовое спокойствие в любой точке мира
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustCards.map((card, index) => {
            const Icon = card.icon;
            return (
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
                  <h3 className="text-xl font-semibold text-[#001D8D] mb-2">{card.title}</h3>
                  <p className="text-[#001D8D]/70 leading-relaxed text-sm">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
