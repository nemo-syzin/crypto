"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, Send, User } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface ServiceContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
}

const contactTypes = [
  { value: 'phone', label: 'Телефон', icon: Phone, placeholder: '+7 (999) 123-45-67' },
  { value: 'email', label: 'Email', icon: Mail, placeholder: 'example@mail.com' },
  { value: 'telegram', label: 'Telegram', icon: Send, placeholder: '@username' },
  { value: 'other', label: 'Другое', icon: User, placeholder: 'Укажите способ связи' },
];

const ServiceContactModal: React.FC<ServiceContactModalProps> = ({
  isOpen,
  onClose,
  serviceTitle,
}) => {
  const [formData, setFormData] = useState({
    contactName: '',
    contactInfo: '',
    contactType: 'telegram',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('service_contact_requests')
        .insert({
          service_title: serviceTitle,
          contact_name: formData.contactName,
          contact_info: formData.contactInfo,
          contact_type: formData.contactType,
          message: formData.message || null,
          status: 'new',
        });

      if (insertError) throw insertError;

      setSubmitSuccess(true);

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error('Error submitting contact request:', err);
      setError('Произошла ошибка при отправке. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      contactName: '',
      contactInfo: '',
      contactType: 'telegram',
      message: '',
    });
    setSubmitSuccess(false);
    setError(null);
    onClose();
  };

  const selectedContactType = contactTypes.find(t => t.value === formData.contactType);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-[#001D8D] to-[#0029B8] p-6 text-white">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-bold mb-2">Оставить заявку</h3>
                <p className="text-sm text-white/90">{serviceTitle}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-[#001D8D] mb-2">
                      Заявка отправлена!
                    </h4>
                    <p className="text-sm text-gray-600">
                      Наш менеджер свяжется с вами в ближайшее время
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Как к вам обращаться?
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        placeholder="Ваше имя"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001D8D] focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    {/* Contact Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Способ связи
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {contactTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, contactType: type.value })}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                formData.contactType === type.value
                                  ? 'border-[#001D8D] bg-[#001D8D]/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Icon className={`w-5 h-5 mx-auto ${
                                formData.contactType === type.value ? 'text-[#001D8D]' : 'text-gray-400'
                              }`} />
                              <span className="text-xs mt-1 block">{type.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Contact Info Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Контактная информация
                      </label>
                      <div className="relative">
                        {selectedContactType && (
                          <selectedContactType.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        )}
                        <input
                          type="text"
                          required
                          value={formData.contactInfo}
                          onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                          placeholder={selectedContactType?.placeholder}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001D8D] focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Optional Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Сообщение (необязательно)
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Дополнительная информация..."
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001D8D] focus:border-transparent outline-none transition-all resize-none"
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-[#001D8D] text-white font-semibold rounded-lg hover:bg-[#001D8D]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ServiceContactModal;
