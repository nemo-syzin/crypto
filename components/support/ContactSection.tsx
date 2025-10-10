"use client";

import { MessageCircle, Mail, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContactSectionProps {
  onLiveChatClick?: () => void;
}

export function ContactSection({ onLiveChatClick }: ContactSectionProps) {
  const contactOptions = [
    {
      id: 'chat',
      icon: MessageCircle,
      title: 'Онлайн-чат',
      description: 'Получите мгновенный ответ от наших операторов',
      buttonText: 'Открыть чат',
      responseTime: '< 2 мин',
      onClick: onLiveChatClick,
    },
    {
      id: 'email',
      icon: Mail,
      title: 'Электронная почта',
      description: 'Напишите нам для детальной консультации',
      buttonText: 'Написать письмо',
      responseTime: '< 24 часа',
      link: 'mailto:support@kenigswap.com',
    },
    {
      id: 'telegram',
      icon: Send,
      title: 'Telegram',
      description: 'Свяжитесь с нами через мессенджер',
      buttonText: 'Открыть Telegram',
      responseTime: '< 10 мин',
      link: 'https://t.me/kenigswap_39',
      handle: '@kenigswap_39',
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
            Связаться с нами
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Выберите удобный способ связи для быстрого решения вашего вопроса
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {contactOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-gradient-to-br from-white to-[#f8faff] rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#001D8D]/10 to-[#0033CC]/5 mb-6">
                <option.icon className="w-8 h-8 text-[#001D8D]" strokeWidth={2} />
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {option.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-2">
                  {option.description}
                </p>
                {option.handle && (
                  <p className="text-xs text-gray-500">
                    {option.handle}
                  </p>
                )}
                <p className="text-xs text-[#001D8D] font-semibold mt-2">
                  Ответ: {option.responseTime}
                </p>
              </div>

              {/* Button */}
              <button
                onClick={() => {
                  if (option.onClick) {
                    option.onClick();
                  } else if (option.link) {
                    window.open(option.link, '_blank');
                  }
                }}
                className="w-full bg-[#001D8D] hover:bg-[#0033CC] text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
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

        {/* Enhanced Footer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 bg-gradient-to-br from-white/80 to-[#f8faff]/50 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-[#001D8D]/10 shadow-sm"
        >
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-[#001D8D] mb-4">
              Готовы помочь 24/7
            </h3>
            <p className="text-base md:text-lg text-[#001D8D]/70 leading-relaxed max-w-3xl mx-auto">
              Команда KenigSwap стремится обеспечить высокий уровень обслуживания клиентов.
              Если у вас возникли вопросы, трудности или требуется помощь, наши специалисты
              всегда готовы помочь оперативно и профессионально.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
