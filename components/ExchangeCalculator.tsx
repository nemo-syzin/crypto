'use client';

import { useToast } from '@/hooks/use-toast';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { useBaseAssets, useQuoteAssets } from '@/hooks/useAssets';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, Mail, Phone, CreditCard, Wallet, CircleCheck as CheckCircle, ArrowLeft, ArrowRight, CircleAlert as AlertCircle, RefreshCw } from 'lucide-react';

// Типы для wizard состояния
interface ExchangeData {
  fromCurrency: string;
  toCurrency: string;
  giveAmount: string;
  receiveAmount: string;
  rate: number;
  activeInput: 'give' | 'receive';
}

interface ContactData {
  email: string;
  phone: string;
  walletAddress: string;
  bankDetails: string;
}

interface OrderData {
  id: string;
  status: string;
}

type WizardStep = 1 | 2 | 3;

const ExchangeCalculator: React.FC = () => {
  const { toast } = useToast();
  
  // Wizard состояние
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Данные обмена
  const [exchangeData, setExchangeData] = useState<ExchangeData>({
    fromCurrency: 'USDT',
    toCurrency: 'RUB',
    giveAmount: '100',
    receiveAmount: '',
    rate: 0,
    activeInput: 'give'
  });
  
  // Контактные данные
  const [contactData, setContactData] = useState<ContactData>({
    email: '',
    phone: '',
    walletAddress: '',
    bankDetails: ''
  });
  
  // Состояние заявки
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Хуки для данных
  const baseAssets = useBaseAssets();
  const quoteAssets = useQuoteAssets();
  const { data: rateData, isLoading: rateLoading, error: rateError } = useExchangeRate(
    exchangeData.fromCurrency,
    exchangeData.toCurrency
  );

  // Обновление курса
  useEffect(() => {
    if (rateData?.rate) {
      setExchangeData(prev => ({ ...prev, rate: rateData.rate }));
    }
  }, [rateData]);

  // Пересчёт сумм
  const updateReceiveAmount = useCallback(() => {
    if (exchangeData.activeInput === 'give' && exchangeData.giveAmount && exchangeData.rate > 0) {
      const give = parseFloat(exchangeData.giveAmount);
      if (!isNaN(give)) {
        const receive = give * exchangeData.rate;
        const formatted = receive > 1 ? receive.toFixed(2) : receive.toFixed(6);
        setExchangeData(prev => ({ ...prev, receiveAmount: formatted }));
      }
    }
  }, [exchangeData.activeInput, exchangeData.giveAmount, exchangeData.rate]);

  const updateGiveAmount = useCallback(() => {
    if (exchangeData.activeInput === 'receive' && exchangeData.receiveAmount && exchangeData.rate > 0) {
      const receive = parseFloat(exchangeData.receiveAmount);
      if (!isNaN(receive)) {
        const give = receive / exchangeData.rate;
        const formatted = give > 1 ? give.toFixed(2) : give.toFixed(6);
        setExchangeData(prev => ({ ...prev, giveAmount: formatted }));
      }
    }
  }, [exchangeData.activeInput, exchangeData.receiveAmount, exchangeData.rate]);

  useEffect(() => {
    updateReceiveAmount();
  }, [updateReceiveAmount]);

  useEffect(() => {
    updateGiveAmount();
  }, [updateGiveAmount]);

  // Обработчики событий
  const handleGiveAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target?.value || '';
    setExchangeData(prev => ({
      ...prev,
      giveAmount: value,
      activeInput: 'give'
    }));
  };

  const handleReceiveAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target?.value || '';
    setExchangeData(prev => ({
      ...prev,
      receiveAmount: value,
      activeInput: 'receive'
    }));
  };

  const handleSwapCurrencies = () => {
    setExchangeData(prev => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency,
      giveAmount: prev.receiveAmount,
      receiveAmount: prev.giveAmount
    }));
  };

  const handleContactChange = (field: keyof ContactData, value: string) => {
    setContactData(prev => ({ ...prev, [field]: value }));
  };

  // Навигация по шагам
  const goToStep = async (step: WizardStep) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    console.log(`Переход на шаг ${step}`);
    
    setTimeout(() => {
      setCurrentStep(step);
      setIsTransitioning(false);
    }, 150);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      goToStep((currentStep + 1) as WizardStep);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep((currentStep - 1) as WizardStep);
    }
  };

  // Валидация
  const isStep1Valid = () => {
    return exchangeData.giveAmount && 
           exchangeData.receiveAmount && 
           exchangeData.rate > 0 && 
           parseFloat(exchangeData.giveAmount) > 0;
  };

  const isStep2Valid = () => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email);
    const phoneValid = contactData.phone.length >= 10;
    const detailsValid = exchangeData.toCurrency === 'RUB' 
      ? contactData.bankDetails.length > 0 
      : contactData.walletAddress.length > 0;
    
    return emailValid && phoneValid && detailsValid;
  };

  // Отправка заявки
  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    
    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderId = `EX${Date.now()}`;
      setOrderData({ id: orderId, status: 'pending' });
      
      toast({
        title: "Заявка создана!",
        description: `Номер заявки: ${orderId}`,
      });
      
      goToStep(3);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать заявку. Попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Анимации
  const safeStepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  // Обработка ошибок
  if (rateError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Ошибка загрузки данных</h3>
          <p className="text-red-600 mb-4">Не удалось загрузить курсы валют</p>
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Индикатор прогресса */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                ${currentStep >= step 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-500'
                }
              `}>
                {step}
              </div>
              {step < 3 && (
                <div className={`
                  w-16 md:w-32 h-1 mx-2 transition-all duration-300
                  ${currentStep > step ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Шаг {currentStep} из 3: {
              currentStep === 1 ? 'Детали обмена' :
              currentStep === 2 ? 'Контактные данные' :
              'Подтверждение'
            }
          </p>
        </div>
      </div>

      {/* Контент шагов */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={safeStepVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Левая колонка - Форма */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Детали обмена</h2>
                  
                  {/* Отдаёте */}
                  <div className="space-y-4 mb-6">
                    <label className="block text-sm font-medium text-gray-700">Отдаёте</label>
                    <div className="flex gap-3">
                      <select
                        value={exchangeData.fromCurrency}
                        onChange={(e) => setExchangeData(prev => ({ ...prev, fromCurrency: e.target.value }))}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {baseAssets.map(asset => (
                          <option key={asset} value={asset}>{asset}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={exchangeData.giveAmount}
                        onChange={handleGiveAmountChange}
                        placeholder="Сумма"
                        className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                          exchangeData.activeInput === 'give' 
                            ? 'border-blue-500 ring-2 ring-blue-500/20' 
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Кнопка переключения */}
                  <div className="flex justify-center mb-6">
                    <button
                      onClick={handleSwapCurrencies}
                      className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <ArrowLeftRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Получаете */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Получаете</label>
                    <div className="flex gap-3">
                      <select
                        value={exchangeData.toCurrency}
                        onChange={(e) => setExchangeData(prev => ({ ...prev, toCurrency: e.target.value }))}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {quoteAssets.map(asset => (
                          <option key={asset} value={asset}>{asset}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={exchangeData.receiveAmount}
                        onChange={handleReceiveAmountChange}
                        placeholder="Сумма"
                        className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                          exchangeData.activeInput === 'receive' 
                            ? 'border-blue-500 ring-2 ring-blue-500/20' 
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Правая колонка - Сводка */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Сводка обмена</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Отдаёте:</span>
                        <span className="font-semibold text-lg">
                          {exchangeData.giveAmount || '0'} {exchangeData.fromCurrency}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Получаете:</span>
                        <span className="font-semibold text-lg text-green-600">
                          {exchangeData.receiveAmount || '0'} {exchangeData.toCurrency}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Курс:</span>
                        <span className="font-semibold">
                          {rateLoading ? 'Загрузка...' : `1 ${exchangeData.fromCurrency} = ${exchangeData.rate.toFixed(4)} ${exchangeData.toCurrency}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={nextStep}
                    disabled={!isStep1Valid() || rateLoading}
                    className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Продолжить
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Контактные данные</h2>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email адрес
                    </label>
                    <input
                      type="email"
                      value={contactData.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Телефон */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Номер телефона
                    </label>
                    <input
                      type="tel"
                      value={contactData.phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      placeholder="+7 (999) 123-45-67"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Реквизиты */}
                  {exchangeData.toCurrency === 'RUB' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CreditCard className="w-4 h-4 inline mr-2" />
                        Банковские реквизиты
                      </label>
                      <textarea
                        value={contactData.bankDetails}
                        onChange={(e) => handleContactChange('bankDetails', e.target.value)}
                        placeholder="Номер карты или банковские реквизиты"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Wallet className="w-4 h-4 inline mr-2" />
                        Адрес кошелька {exchangeData.toCurrency}
                      </label>
                      <input
                        type="text"
                        value={contactData.walletAddress}
                        onChange={(e) => handleContactChange('walletAddress', e.target.value)}
                        placeholder={`Введите адрес ${exchangeData.toCurrency} кошелька`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={prevStep}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2 inline" />
                    Назад
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!isStep2Valid()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Продолжить
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Подтверждение обмена</h2>
                
                {orderData ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Заявка создана!</h3>
                    <p className="text-gray-600 mb-4">Номер заявки: <span className="font-mono font-semibold">{orderData.id}</span></p>
                    <p className="text-sm text-gray-500">Мы свяжемся с вами в ближайшее время</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6 mb-8">
                      {/* Детали обмена */}
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Детали обмена</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Отдаёте:</span>
                            <span className="font-semibold">{exchangeData.giveAmount} {exchangeData.fromCurrency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Получаете:</span>
                            <span className="font-semibold text-green-600">{exchangeData.receiveAmount} {exchangeData.toCurrency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Курс:</span>
                            <span className="font-semibold">1 {exchangeData.fromCurrency} = {exchangeData.rate.toFixed(4)} {exchangeData.toCurrency}</span>
                          </div>
                        </div>
                      </div>

                      {/* Контактные данные */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Контактные данные</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-semibold">{contactData.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Телефон:</span>
                            <span className="font-semibold">{contactData.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              {exchangeData.toCurrency === 'RUB' ? 'Банковские реквизиты:' : 'Адрес кошелька:'}
                            </span>
                            <span className="font-semibold font-mono text-sm">
                              {exchangeData.toCurrency === 'RUB' ? contactData.bankDetails : contactData.walletAddress}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Уведомление о безопасности */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <p className="text-sm text-yellow-800">
                          🔒 Ваши данные защищены и используются только для проведения обмена
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => goToStep(2)}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isSubmitting ? 'Создание заявки...' : 'Подтвердить обмен'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ExchangeCalculator;