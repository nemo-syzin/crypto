"use client";

import { Send, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export function FeedbackSection() {
  const feedbackOptions = [
    {
      id: 'telegram',
      icon: Send,
      title: 'Telegram',
      description: 'Напишите нам о вашем опыте использования сервиса',
      buttonText: 'Написать в Telegram',
      buttonColor: 'bg-[#3B6DFF] hover:bg-[#2659FF]',
      iconBg: 'from-[#3B6DFF]/20 to-[#2659FF]/10',
      link: 'https://t.me/kenigswap_39',
      handle: '@kenigswap_39',
    },
    {
      id: 'yandex',
      icon: MapPin,
      title: 'Яндекс.Карты',
      description: 'Оставьте публичный отзыв в нашем профиле',
      buttonText: 'Оставить отзыв',
      buttonColor: 'bg-[#FF7043] hover:bg-[#FF5722]',
      iconBg: 'from-[#FF7043]/20 to-[#FF5722]/10',
      link: 'https://yandex.ru/maps/org/kripto_obmennik_kenigswap/152011458491/?ll=20.502591%2C54.709320&z=16',
      handle: 'Яндекс.Карты',
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-3">
            Оставьте отзыв о нашей работе
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Поделитесь опытом использования KenigSwap
          </p>
        </motion.div>

        {/* Feedback Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {feedbackOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-gradient-to-br from-white to-[#f8faff] rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${option.iconBg} mb-6`}>
                <option.icon className="w-8 h-8 text-[#001D8D]" strokeWidth={2} />
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {option.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {option.description}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {option.handle}
                </p>
              </div>

              {/* Button */}
              <button
                onClick={() => window.open(option.link, '_blank')}
                className={`w-full ${option.buttonColor} text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2`}
              >
                {option.buttonText}
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Footer Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm text-gray-500">
            Ваш отзыв помогает нам становиться лучше
          </p>
        </motion.div>
      </div>
    </section>
  );
}
