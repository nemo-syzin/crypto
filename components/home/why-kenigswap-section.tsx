"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Zap, CheckCircle } from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    emoji: "💹",
    title: "Выгодный курс",
    text: "Получите лучший курс обмена USDT на рубли, обновляемый в реальном времени для максимальной выгоды."
  },
  {
    icon: Shield,
    emoji: "🛡️",
    title: "Полная безопасность",
    text: "Шифрование банковского уровня и защита транзакций по стандартам ISO 27001 и PCI DSS."
  },
  {
    icon: Zap,
    emoji: "⚡",
    title: "Быстрые транзакции",
    text: "90% обменов завершаются менее чем за 15 минут — мы ценим ваше время."
  },
  {
    icon: CheckCircle,
    emoji: "✅",
    title: "Простая верификация",
    text: "KYC-процесс занимает всего пару минут, после чего вы можете начать обмены."
  }
];

const WhyKenigSwapSection = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#f8faff] to-[#eef3ff]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#0052FF]/10 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center relative mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#001D8D] tracking-tight mb-4">
            Почему выбирают <span className="text-[#0052FF]">KenigSwap</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Безопасная, быстрая и удобная платформа для конвертации USDT и работы с валютой.
            Доверьте обмен профессионалам.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {benefits.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative p-8 rounded-3xl bg-white/90 shadow-lg border border-[#E4E9FF] hover:shadow-[0_0_30px_rgba(0,82,255,0.1)] transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-[#0052FF] to-[#00C6FF] text-white text-2xl rounded-2xl shadow-md">
                  {item.emoji}
                </div>
                <h3 className="text-xl font-semibold text-[#001D8D]">{item.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 flex items-center justify-center gap-4 bg-[#F0F4FF] border border-[#E4E9FF] rounded-2xl py-6 px-8 shadow-inner"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#0052FF] to-[#00C6FF] text-white text-xl">
            🛡️
          </div>
          <p className="text-[#001D8D] text-lg font-medium">
            KenigSwap — ваш надёжный партнёр в цифровых финансах.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyKenigSwapSection;
