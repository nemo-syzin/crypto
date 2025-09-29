"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { useBaseAssets, useQuoteAssets } from '@/hooks/useAssets';
import { useToast } from '@/hooks/use-toast';
import { Calculator, RefreshCw, ArrowUpDown, TriangleAlert as AlertTriangle, Settings, Info, Send, CircleCheck as CheckCircle, User, Mail, Phone, Wallet, CreditCard, ArrowRight, ArrowLeft, CreditCard as Edit3, Shield, Clock, TrendingUp, Check } from 'lucide-react';

interface ClientData {
  email: string;
  phone: string;
  walletAddress: string;
  bankDetails: string;
}

interface OrderResponse {
  success: boolean;
  message: string;
  orderId?: string;
  order?: any;
  error?: string;
  details?: string[];
}

type WizardStep = 'exchange' | 'contact' | 'confirmation' | 'success';

export default function ExchangeCalculator() {
  const { toast } = useToast();
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState<WizardStep>('exchange');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Exchange data
  const [giveAmount, setGiveAmount] = useState<string>('');
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [activeInput, setActiveInput] = useState<'give' | 'receive'>('give');
  const [fromCurrency, setFromCurrency] = useState<string>('USDT');
  const [toCurrency, setToCurrency] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Order state
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  
  // Client data
  const [clientData, setClientData] = useState<ClientData>({
    email: '',
    phone: '',
    walletAddress: '',
    bankDetails: ''
  });
  
  const [clientErrors, setClientErrors] = useState<Partial<ClientData>>({});
  
  // Get available currencies
  const { bases, loading: basesLoading, error: basesError } = useBaseAssets();
  const { quotes, loading: quotesLoading, error: quotesError } = useQuoteAssets(fromCurrency);
  
  // Get exchange rate
  const { rate, source, direction, loading, refreshing, error, lastUpdated, refetch } =
    useExchangeRate(fromCurrency, toCurrency);

  // Set initial toCurrency when quotes are loaded
  useEffect(() => {
    if (quotes.length > 0 && !toCurrency) {
      setToCurrency(quotes[0]);
    }
  }, [quotes, toCurrency]);
  
  // Set valid fromCurrency when bases are loaded
  useEffect(() => {
    if (bases.length > 0 && !bases.includes(fromCurrency)) {
      setFromCurrency(bases[0]);
      setToCurrency('');
    }
  }, [bases, fromCurrency]);

  // Calculate amounts based on active input and rate
  useEffect(() => {
    if (!rate || rate <= 0) {
      if (activeInput === 'give' && receiveAmount) {
        setReceiveAmount('');
      } else if (activeInput === 'receive' && giveAmount) {
        setGiveAmount('');
      }
      return;
    }

    if (activeInput === 'give' && giveAmount) {
      const giveNum = parseFloat(giveAmount);
      if (!isNaN(giveNum) && giveNum > 0) {
        const receiveNum = giveNum * rate;
        const formattedReceive = receiveNum < 1 ? receiveNum.toFixed(6) : receiveNum.toFixed(2);
        setReceiveAmount(formattedReceive);
      } else if (giveAmount === '') {
        setReceiveAmount('');
      }
    } else if (activeInput === 'receive' && receiveAmount) {
      const receiveNum = parseFloat(receiveAmount);
      if (!isNaN(receiveNum) && receiveNum > 0) {
        const giveNum = receiveNum / rate;
        const formattedGive = giveNum < 1 ? giveNum.toFixed(6) : giveNum.toFixed(2);
        setGiveAmount(formattedGive);
      } else if (receiveAmount === '') {
        setGiveAmount('');
      }
    }
  }, [rate, giveAmount, receiveAmount, activeInput]);

  // Utility functions
  const parseAmount = useCallback((value: string): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }, []);

  const giveAmountNum = useMemo(() => parseAmount(giveAmount), [giveAmount, parseAmount]);
  const receiveAmountNum = useMemo(() => parseAmount(receiveAmount), [receiveAmount, parseAmount]);

  const formatCurrency = useMemo(() => (value: number, currency: string): string => {
    if (value === 0) return '';
    
    if (currency === 'RUB') {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } else {
      const decimals = value < 1 ? 6 : value < 100 ? 4 : 2;
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: decimals,
      }).format(value) + ` ${currency}`;
    }
  }, []);

  const formatRate = useMemo(() => (rateValue: number | null, currency: string = 'RUB'): string => {
    if (!rateValue || isNaN(rateValue)) return '—';
    
    if (currency === 'RUB') {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(rateValue);
    } else {
      const decimals = rateValue < 1 ? 6 : rateValue < 100 ? 4 : 2;
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: decimals,
      }).format(rateValue) + ` ${currency}`;
    }
  }, []);

  // Step navigation
  const goToStep = useCallback(async (step: WizardStep) => {
    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 150));
    setCurrentStep(step);
    setIsTransitioning(false);
  }, []);

  const nextStep = useCallback(() => {
    const steps: WizardStep[] = ['exchange', 'contact', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      goToStep(steps[currentIndex + 1]);
    }
  }, [currentStep, goToStep]);

  const prevStep = useCallback(() => {
    const steps: WizardStep[] = ['exchange', 'contact', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      goToStep(steps[currentIndex - 1]);
    }
  }, [currentStep, goToStep]);

  // Handle amount changes
  const handleGiveAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setGiveAmount(value);
      setActiveInput('give');
    }
  };

  const handleReceiveAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setReceiveAmount(value);
      setActiveInput('receive');
    }
  };

  const handleFromCurrencyChange = (value: string) => {
    setFromCurrency(value);
    setToCurrency('');
  };

  const toggleDirection = () => {
    if (fromCurrency && toCurrency && !error) {
      const tempFrom = fromCurrency;
      setFromCurrency(toCurrency);
      setToCurrency(tempFrom);
      
      const tempGiveAmount = giveAmount;
      setGiveAmount(receiveAmount);
      setReceiveAmount(tempGiveAmount);
      
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 150);
    }
  };

  // Validation
  const validateExchangeStep = useCallback((): boolean => {
    return !!(rate && rate > 0 && toCurrency && (giveAmountNum > 0 || receiveAmountNum > 0));
  }, [rate, toCurrency, giveAmountNum, receiveAmountNum]);

  const validateClientData = useCallback((): boolean => {
    const errors: Partial<ClientData> = {};
    
    if (!clientData.email) {
      errors.email = 'Введите email адрес';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)) {
      errors.email = 'Введите корректный email адрес';
    }
    
    if (!clientData.phone) {
      errors.phone = 'Введите номер телефона';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(clientData.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = 'Введите корректный номер телефона';
    }
    
    const cryptoCurrencies = ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'ADA', 'DOT', 'SOL', 'XRP', 'DOGE', 'SHIB', 'LTC', 'LINK', 'UNI', 'ATOM', 'XLM', 'TRX', 'FIL', 'NEAR'];
    if (cryptoCurrencies.includes(toCurrency.toUpperCase())) {
      if (!clientData.walletAddress) {
        errors.walletAddress = `Введите адрес кошелька для получения ${toCurrency}`;
      } else if (clientData.walletAddress.length < 10) {
        errors.walletAddress = 'Адрес кошелька слишком короткий';
      }
    }
    
    if (toCurrency.toUpperCase() === 'RUB') {
      if (!clientData.bankDetails) {
        errors.bankDetails = 'Введите банковские реквизиты для получения рублей';
      } else if (clientData.bankDetails.length < 10) {
        errors.bankDetails = 'Банковские реквизиты слишком короткие';
      }
    }
    
    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  }, [clientData, toCurrency]);

  const handleClientDataChange = useCallback((field: keyof ClientData, value: string) => {
    setClientData(prev => ({ ...prev, [field]: value }));
    if (clientErrors[field]) {
      setClientErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [clientErrors]);

  // Submit order
  const handleSubmitOrder = useCallback(async () => {
    if (!validateClientData()) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, исправьте ошибки в форме",
        variant: "destructive",
      });
      return;
    }
    
    setSubmittingOrder(true);
    
    try {
      const orderPayload = {
        fromCurrency,
        toCurrency,
        amountFrom: giveAmountNum,
        amountTo: receiveAmountNum,
        exchangeRate: rate,
        clientEmail: clientData.email,
        clientPhone: clientData.phone || undefined,
        clientWalletAddress: clientData.walletAddress || undefined,
        clientBankDetails: clientData.bankDetails || undefined
      };
      
      const response = await fetch('/api/exchange-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });
      
      const responseData: OrderResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'Ошибка отправки заявки');
      }
      
      if (responseData.success) {
        setOrderData(responseData.order);
        goToStep('success');
        
        toast({
          title: "Заявка создана!",
          description: `Заявка №${responseData.orderId?.substring(0, 8)} успешно отправлена.`,
        });
      } else {
        throw new Error(responseData.message || 'Неизвестная ошибка');
      }
      
    } catch (error) {
      console.error('❌ Ошибка при отправке заявки:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при отправке заявки';
      
      toast({
        title: "Ошибка отправки заявки",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmittingOrder(false);
    }
  }, [validateClientData, fromCurrency, toCurrency, giveAmountNum, receiveAmountNum, rate, clientData, toast, goToStep]);

  const resetWizard = useCallback(() => {
    setCurrentStep('exchange');
    setGiveAmount('');
    setReceiveAmount('');
    setClientData({
      email: '',
      phone: '',
      walletAddress: '',
      bankDetails: ''
    });
    setClientErrors({});
    setOrderData(null);
  }, []);

  // Step progress
  const getStepNumber = (step: WizardStep): number => {
    const stepMap = { exchange: 1, contact: 2, confirmation: 3, success: 4 };
    return stepMap[step];
  };

  const getCurrentStepNumber = () => getStepNumber(currentStep);
  const getTotalSteps = () => 3;

  // Animation variants
  const stepVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { 
        duration: 0.3, 
        ease: "easeOut" 
      }
    },
    exit: { 
      opacity: 0, 
      x: -50, 
      scale: 0.95,
      transition: { 
        duration: 0.2, 
        ease: "easeIn" 
      }
    }
  };

  // Progress indicator component
  const ProgressIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center gap-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300
              ${getCurrentStepNumber() >= step 
                ? 'bg-gradient-to-r from-[#001D8D] to-blue-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-500'
              }
            `}>
              {getCurrentStepNumber() > step ? (
                <Check className="h-5 w-5" />
              ) : (
                step
              )}
            </div>
            {step < 3 && (
              <div className={`
                w-12 h-1 mx-2 rounded-full transition-all duration-300
                ${getCurrentStepNumber() > step ? 'bg-gradient-to-r from-[#001D8D] to-blue-600' : 'bg-gray-200'}
              `} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Step 1: Exchange Details
  const ExchangeStep = () => (
    <motion.div
      key="exchange"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#001D8D] mb-3">
          Детали обмена
        </h2>
        <p className="text-[#001D8D]/70 text-lg">
          Выберите валюты и укажите сумму для обмена
        </p>
      </div>

      {/* Configuration Error Alert */}
      {error && error.includes('not configured') && (
        <Alert className="bg-orange-50 border-orange-200">
          <Settings className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Требуется настройка:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Currency Selection */}
        <div className="space-y-6">
          {/* From Currency */}
          <div className="space-y-3">
            <Label htmlFor="fromCurrency" className="text-[#001D8D] font-semibold text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Отдаёте
            </Label>
            <Select 
              value={bases.includes(fromCurrency) ? fromCurrency : undefined}
              onValueChange={handleFromCurrencyChange}
              disabled={basesLoading}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Выберите валюту" />
              </SelectTrigger>
              <SelectContent>
                {bases.map((base) => (
                  <SelectItem key={base} value={base}>
                    {base}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Give Amount */}
          <div className="space-y-3">
            <Label htmlFor="giveAmount" className="text-[#001D8D] font-semibold text-base">
              Сумма {fromCurrency}
            </Label>
            <Input
              id="giveAmount"
              type="text"
              value={giveAmount}
              onChange={handleGiveAmountChange}
              placeholder={`Введите сумму ${fromCurrency}`}
              className={`h-12 text-base ${
                activeInput === 'give' ? 'ring-2 ring-blue-500/20 border-blue-500' : ''
              }`}
            />
          </div>

          {/* Direction Toggle */}
          <div className="flex justify-center py-4">
            <button
              onClick={toggleDirection}
              disabled={!fromCurrency || !toCurrency || !!error}
              className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUpDown className="h-6 w-6 text-blue-600" />
            </button>
          </div>

          {/* To Currency */}
          <div className="space-y-3">
            <Label htmlFor="toCurrency" className="text-[#001D8D] font-semibold text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Получаете
            </Label>
            <Select 
              value={quotes.includes(toCurrency) ? toCurrency : undefined}
              onValueChange={setToCurrency}
              disabled={quotesLoading || !fromCurrency}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Выберите валюту" />
              </SelectTrigger>
              <SelectContent>
                {quotes.map((quote) => (
                  <SelectItem key={quote} value={quote}>
                    {quote}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Receive Amount */}
          <div className="space-y-3">
            <Label htmlFor="receiveAmount" className="text-[#001D8D] font-semibold text-base">
              Сумма {toCurrency || ''}
            </Label>
            <Input
              id="receiveAmount"
              type="text"
              value={receiveAmount}
              onChange={handleReceiveAmountChange}
              placeholder={`Введите сумму ${toCurrency}`}
              className={`h-12 text-base ${
                activeInput === 'receive' ? 'ring-2 ring-blue-500/20 border-blue-500' : ''
              }`}
            />
          </div>
        </div>

        {/* Right Column - Exchange Summary */}
        <div className="space-y-6">
          {loading && !rate ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#001D8D]/10">
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-3 text-[#001D8D]">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                  <span className="font-medium">Загрузка курсов...</span>
                </div>
              </div>
            </div>
          ) : rate > 0 ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-200">
              <h3 className="text-xl font-bold text-[#001D8D] mb-6 flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Сводка обмена
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/80 rounded-xl">
                  <span className="text-[#001D8D]/70 font-medium">Отдаёте:</span>
                  <span className="font-bold text-[#001D8D] text-lg">
                    {giveAmountNum > 0 ? formatCurrency(giveAmountNum, fromCurrency) : '—'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-white/80 rounded-xl">
                  <span className="text-[#001D8D]/70 font-medium">Получаете:</span>
                  <span className="font-bold text-[#001D8D] text-lg">
                    {receiveAmountNum > 0 ? formatCurrency(receiveAmountNum, toCurrency) : '—'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-white/80 rounded-xl">
                  <span className="text-[#001D8D]/70 font-medium">Курс:</span>
                  <span className="font-bold text-[#001D8D]">
                    1 {fromCurrency} = {formatRate(rate, toCurrency)}
                  </span>
                </div>
                
                {lastUpdated && (
                  <div className="text-center text-sm text-[#001D8D]/60 flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4" />
                    Обновлено: {lastUpdated.toLocaleTimeString('ru-RU')} • {source}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="text-center text-gray-500">
                <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Выберите валюты и введите сумму для расчёта</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={nextStep}
          disabled={!validateExchangeStep()}
          size="lg"
          className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-[#001D8D] to-blue-600 text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Продолжить
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  // Step 2: Contact Information
  const ContactStep = () => (
    <motion.div
      key="contact"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <div className="text-sm font-medium text-[#001D8D]/60 mb-2">
          Шаг {getCurrentStepNumber()} из {getTotalSteps()}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#001D8D] mb-3">
          Контактные данные
        </h2>
        <p className="text-[#001D8D]/70 text-lg">
          Укажите ваши контактные данные для завершения обмена
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Email */}
        <div className="space-y-3">
          <Label htmlFor="clientEmail" className="text-[#001D8D] font-semibold text-base flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email адрес *
          </Label>
          <Input
            id="clientEmail"
            type="email"
            value={clientData.email}
            onChange={(e) => handleClientDataChange('email', e.target.value)}
            placeholder="your@email.com"
            className={`h-12 text-base ${clientErrors.email ? 'border-red-300' : ''}`}
          />
          {clientErrors.email && (
            <p className="text-sm text-red-600">{clientErrors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-3">
          <Label htmlFor="clientPhone" className="text-[#001D8D] font-semibold text-base flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Номер телефона *
          </Label>
          <Input
            id="clientPhone"
            type="tel"
            value={clientData.phone}
            onChange={(e) => handleClientDataChange('phone', e.target.value)}
            placeholder="+7 (999) 123-45-67"
            className={`h-12 text-base ${clientErrors.phone ? 'border-red-300' : ''}`}
          />
          {clientErrors.phone && (
            <p className="text-sm text-red-600">{clientErrors.phone}</p>
          )}
        </div>

        {/* Wallet Address (for crypto) */}
        {['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'ADA', 'DOT', 'SOL', 'XRP', 'DOGE', 'SHIB', 'LTC', 'LINK', 'UNI', 'ATOM', 'XLM', 'TRX', 'FIL', 'NEAR'].includes(toCurrency.toUpperCase()) && (
          <div className="space-y-3">
            <Label htmlFor="clientWalletAddress" className="text-[#001D8D] font-semibold text-base flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Адрес кошелька {toCurrency} *
            </Label>
            <Input
              id="clientWalletAddress"
              type="text"
              value={clientData.walletAddress}
              onChange={(e) => handleClientDataChange('walletAddress', e.target.value)}
              placeholder={`Введите адрес ${toCurrency} кошелька`}
              className={`h-12 text-base ${clientErrors.walletAddress ? 'border-red-300' : ''}`}
            />
            {clientErrors.walletAddress && (
              <p className="text-sm text-red-600">{clientErrors.walletAddress}</p>
            )}
            <p className="text-xs text-[#001D8D]/60 flex items-center gap-2">
              <Shield className="h-3 w-3" />
              Убедитесь, что адрес корректный. Неверный адрес может привести к потере средств.
            </p>
          </div>
        )}

        {/* Bank Details (for RUB) */}
        {toCurrency.toUpperCase() === 'RUB' && (
          <div className="space-y-3">
            <Label htmlFor="clientBankDetails" className="text-[#001D8D] font-semibold text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Банковские реквизиты *
            </Label>
            <Textarea
              id="clientBankDetails"
              value={clientData.bankDetails}
              onChange={(e) => handleClientDataChange('bankDetails', e.target.value)}
              placeholder="Номер карты или банковские реквизиты для получения рублей"
              className={`min-h-[100px] text-base ${clientErrors.bankDetails ? 'border-red-300' : ''}`}
            />
            {clientErrors.bankDetails && (
              <p className="text-sm text-red-600">{clientErrors.bankDetails}</p>
            )}
            <p className="text-xs text-[#001D8D]/60 flex items-center gap-2">
              <Shield className="h-3 w-3" />
              Укажите номер карты или полные банковские реквизиты для перевода рублей.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          onClick={prevStep}
          variant="outline"
          size="lg"
          className="px-6 py-3 text-[#001D8D] border-[#001D8D]/20"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Назад
        </Button>
        
        <Button
          onClick={nextStep}
          disabled={!validateClientData()}
          size="lg"
          className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-[#001D8D] to-blue-600 text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          Продолжить
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  // Step 3: Confirmation
  const ConfirmationStep = () => (
    <motion.div
      key="confirmation"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <div className="text-sm font-medium text-[#001D8D]/60 mb-2">
          Шаг {getCurrentStepNumber()} из {getTotalSteps()}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#001D8D] mb-3">
          Подтверждение обмена
        </h2>
        <p className="text-[#001D8D]/70 text-lg">
          Проверьте все данные перед отправкой заявки
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Exchange Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-200">
          <h3 className="text-lg font-bold text-[#001D8D] mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Детали обмена
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/80 rounded-xl">
              <div className="text-sm text-[#001D8D]/70 mb-1">Отдаёте</div>
              <div className="font-bold text-[#001D8D] text-lg">
                {formatCurrency(giveAmountNum, fromCurrency)}
              </div>
            </div>
            
            <div className="text-center p-4 bg-white/80 rounded-xl">
              <div className="text-sm text-[#001D8D]/70 mb-1">Получаете</div>
              <div className="font-bold text-[#001D8D] text-lg">
                {formatCurrency(receiveAmountNum, toCurrency)}
              </div>
            </div>
            
            <div className="text-center p-4 bg-white/80 rounded-xl">
              <div className="text-sm text-[#001D8D]/70 mb-1">Курс</div>
              <div className="font-bold text-[#001D8D]">
                {formatRate(rate, toCurrency)}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Summary */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#001D8D]/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#001D8D] flex items-center gap-2">
              <User className="h-5 w-5" />
              Контактные данные
            </h3>
            <Button
              onClick={() => goToStep('contact')}
              variant="ghost"
              size="sm"
              className="text-[#001D8D]/60 hover:text-[#001D8D]"
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Изменить
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-4 w-4 text-[#001D8D]/60" />
              <span className="text-[#001D8D]/70">{clientData.email}</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="h-4 w-4 text-[#001D8D]/60" />
              <span className="text-[#001D8D]/70">{clientData.phone}</span>
            </div>
            
            {clientData.walletAddress && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Wallet className="h-4 w-4 text-[#001D8D]/60" />
                <span className="text-[#001D8D]/70 font-mono text-sm break-all">
                  {clientData.walletAddress}
                </span>
              </div>
            )}
            
            {clientData.bankDetails && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CreditCard className="h-4 w-4 text-[#001D8D]/60" />
                <span className="text-[#001D8D]/70">{clientData.bankDetails}</span>
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Безопасность ваших данных</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Все данные передаются по защищенному соединению</li>
                <li>• Мы не храним банковские данные после завершения обмена</li>
                <li>• Ваши персональные данные защищены согласно политике конфиденциальности</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          onClick={prevStep}
          variant="outline"
          size="lg"
          className="px-6 py-3 text-[#001D8D] border-[#001D8D]/20"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Назад
        </Button>
        
        <Button
          onClick={handleSubmitOrder}
          disabled={submittingOrder}
          size="lg"
          className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          {submittingOrder ? (
            <>
              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
              Отправка заявки...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Подтвердить обмен
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );

  // Success Step
  const SuccessStep = () => (
    <motion.div
      key="success"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center space-y-8"
    >
      <div className="flex justify-center mb-6">
        <div className="p-6 bg-green-100 rounded-full">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
      </div>
      
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
          Заявка успешно отправлена!
        </h2>
        <p className="text-xl text-[#001D8D]/70 mb-8">
          Мы получили вашу заявку и свяжемся с вами в ближайшее время
        </p>
      </div>

      {orderData && (
        <div className="bg-blue-50 rounded-2xl p-6 max-w-md mx-auto">
          <div className="text-sm text-[#001D8D]/70 mb-2">Номер заявки:</div>
          <div className="text-2xl font-bold text-[#001D8D] mb-4">
            #{orderData.id.substring(0, 8).toUpperCase()}
          </div>
          <div className="text-sm text-[#001D8D]/70">
            Проверьте вашу электронную почту для получения дальнейших инструкций
          </div>
        </div>
      )}

      <div className="space-y-4 max-w-md mx-auto">
        <Button 
          onClick={resetWizard}
          size="lg"
          className="w-full bg-gradient-to-r from-[#001D8D] to-blue-600 text-white hover:opacity-90 py-3 text-lg font-semibold"
        >
          Создать новую заявку
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => window.location.href = '/dashboard'}
          className="w-full text-[#001D8D] border-[#001D8D]/20 py-3"
        >
          Перейти в личный кабинет
        </Button>
      </div>
    </motion.div>
  );

  // Main render
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-[#001D8D]/20 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#001D8D] to-blue-600 text-white py-6">
          <CardTitle className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Calculator className="h-8 w-8" />
              <span className="text-2xl md:text-3xl font-bold">
                Калькулятор обмена KenigSwap
              </span>
            </div>
            {currentStep !== 'success' && (
              <p className="text-white/90 text-lg">
                Безопасный и быстрый обмен криптовалют
              </p>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8 md:p-12">
          {/* Progress Indicator */}
          {currentStep !== 'success' && <ProgressIndicator />}
          
          {/* Step Content */}
          <AnimatePresence mode="wait">
            {currentStep === 'exchange' && <ExchangeStep />}
            {currentStep === 'contact' && <ContactStep />}
            {currentStep === 'confirmation' && <ConfirmationStep />}
            {currentStep === 'success' && <SuccessStep />}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}