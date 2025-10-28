"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight, Loader as Loader2, Check, CircleAlert as AlertCircle, CircleCheck as CheckCircle2, Mail, Phone, MessageCircle, ArrowRight, RefreshCw, TrendingUp, Shield, Zap, Star, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useBaseAssets, useQuoteAssets } from "@/hooks/useAssets";

export default function ExchangeStepForm() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [fromAmount, setFromAmount] = useState("1");
  const [toAmount, setToAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USDT");
  const [toCurrency, setToCurrency] = useState("RUB");
  const [activeInput, setActiveInput] = useState<"give" | "receive">("give");
  const [loading, setLoading] = useState(false);

  // Поля клиента
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [network, setNetwork] = useState("");
  const [fullName, setFullName] = useState("");
  const [acceptAmlKyc, setAcceptAmlKyc] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [consentErrors, setConsentErrors] = useState({ amlKyc: "", terms: "" });

  // Хуки для получения данных
  const { bases, loading: basesLoading } = useBaseAssets();
  const { quotes, loading: quotesLoading } = useQuoteAssets(fromCurrency);
  const { rate, loading: rateLoading, error: rateError, refetch: refetchRate, refreshing } = useExchangeRate(fromCurrency, toCurrency);

  // Пересчёт при изменении курса или сумм
  useEffect(() => {
    if (!rate || rate <= 0) {
      if (activeInput === "give") {
        setToAmount("");
      } else {
        setFromAmount("");
      }
      return;
    }

    if (activeInput === "give" && fromAmount) {
      const numAmount = parseFloat(fromAmount);
      if (!isNaN(numAmount) && numAmount > 0) {
        const result = numAmount * rate;
        setToAmount(result.toFixed(2));
      } else {
        setToAmount("");
      }
    } else if (activeInput === "receive" && toAmount) {
      const numAmount = parseFloat(toAmount);
      if (!isNaN(numAmount) && numAmount > 0) {
        const result = numAmount / rate;
        setFromAmount(result.toFixed(6));
      } else {
        setFromAmount("");
      }
    }
  }, [rate, fromAmount, toAmount, activeInput]);

  // Смена направления обмена
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    setActiveInput(activeInput === "give" ? "receive" : "give");
  };

  const handleSubmit = async () => {
    const errors = { amlKyc: "", terms: "" };

    if (!acceptAmlKyc) {
      errors.amlKyc = "Необходимо принять политику AML/CTF и KYC";
    }

    if (!acceptTerms) {
      errors.terms = "Необходимо принять условия пользования";
    }

    if (errors.amlKyc || errors.terms) {
      setConsentErrors(errors);
      toast({
        title: "Ошибка",
        description: "Пожалуйста, примите все необходимые соглашения",
        variant: "destructive",
      });
      return;
    }

    const isCryptoInvolved = fromCurrency !== "RUB" || toCurrency !== "RUB";

    console.log('🚀 [Form] Начинаем отправку заявки...');
    console.log('📝 [Form] Данные формы:', {
      fromCurrency,
      toCurrency,
      amountFrom: parseFloat(fromAmount),
      amountTo: parseFloat(toAmount),
      exchangeRate: rate,
      fullName,
      clientEmail: email,
      clientPhone: phone,
      clientTelegram: telegram,
      clientWalletAddress: isCryptoInvolved ? walletAddress : null,
      network: isCryptoInvolved ? network : null,
    });

    setLoading(true);
    try {
      const res = await fetch("/api/exchange-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromCurrency,
          toCurrency,
          amountFrom: parseFloat(fromAmount),
          amountTo: parseFloat(toAmount),
          exchangeRate: rate,
          fullName,
          clientEmail: email,
          clientPhone: phone,
          clientTelegram: telegram,
          clientWalletAddress: isCryptoInvolved ? walletAddress : null,
          network: isCryptoInvolved ? network : null,
          acceptedAmlKyc: acceptAmlKyc,
          acceptedTerms: acceptTerms,
        }),
      });

      console.log('📡 [Form] Ответ сервера - статус:', res.status);
      const data = await res.json();
      console.log('📡 [Form] Ответ сервера - данные:', data);

      if (!res.ok) {
        throw new Error(data.message || data.error || "Ошибка при создании заявки");
      }

      toast({
        title: "Заявка успешно создана",
        description: `Номер заявки: ${data.orderId}`,
      });
      setStep(3);
    } catch (err: any) {
      console.error('❌ [Form] Ошибка создания заявки:', err);
      toast({
        title: "Ошибка",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto" style={{ colorScheme: 'light' }} data-theme="light">
      {/* === Шаг 1: Калькулятор (стиль Coinbase) === */}
      {step === 1 && (
        <div className="w-full">
          {/* Заголовок */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#001D8D] mb-3">
              Конвертер и калькулятор криптовалют
            </h1>
            {rate && !rateError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-2 flex-wrap"
              >
                <p className="text-base md:text-lg text-[#001D8D]/70">
                  <span className="font-semibold text-[#001D8D]">{fromCurrency}</span> в <span className="font-semibold text-[#001D8D]">{toCurrency}</span>: 1 {fromCurrency} = {rate.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                  {toCurrency === "RUB" ? "₽" : ""} {toCurrency}
                </p>
                <button
                  onClick={() => refetchRate()}
                  disabled={rateLoading || refreshing}
                  className="p-2 rounded-full hover:bg-[#001D8D]/10 transition-all disabled:opacity-50 group"
                  title="Обновить курс"
                >
                  <RefreshCw className={`w-4 h-4 text-[#001D8D] group-hover:text-[#001D8D] ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </motion.div>
            )}
            {rateError && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <p className="text-red-600 text-sm">{rateError}</p>
                <button
                  onClick={() => refetchRate()}
                  disabled={rateLoading || refreshing}
                  className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm hover:bg-red-200 transition-colors disabled:opacity-50"
                >
                  Повторить
                </button>
              </div>
            )}
          </motion.div>

          {/* Калькулятор */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {/* Decorative Background Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-[#001D8D]/10 to-blue-500/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-[#001D8D]/10 rounded-full blur-2xl"></div>

            <Card className="calc-light-forced border-2 border-[#001D8D]/10 shadow-2xl bg-white/95 backdrop-blur-sm relative overflow-hidden" style={{ colorScheme: 'light', background: 'rgba(255, 255, 255, 0.95)' }}>
              {/* Gradient Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#001D8D] via-blue-500 to-[#001D8D]"></div>

              <CardContent className="p-6 md:p-10">
              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#001D8D]/5 to-blue-50 px-4 py-2 rounded-full border border-[#001D8D]/10"
                >
                  <Shield className="w-4 h-4 text-[#001D8D]" />
                  <span className="text-xs font-semibold text-[#001D8D]">Защищенный обмен</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200/50"
                >
                  <Award className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-semibold text-green-700">Лучший курс</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-2 rounded-full border border-orange-200/50"
                >
                  <Zap className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-semibold text-orange-700">За 15 минут</span>
                </motion.div>
              </div>

              {/* Preset Amount Buttons */}
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                <span className="text-sm text-[#001D8D]/60 font-medium whitespace-nowrap">Быстрый выбор:</span>
                {['100', '500', '1000', '5000', '10000'].map((amount) => (
                  <motion.button
                    key={amount}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setFromAmount(amount);
                      setActiveInput('give');
                    }}
                    className="px-3 py-1.5 bg-white border border-[#001D8D]/20 rounded-full text-sm font-medium text-[#001D8D] hover:bg-[#001D8D]/5 hover:border-[#001D8D]/40 transition-all whitespace-nowrap"
                  >
                    {amount}
                  </motion.button>
                ))}
              </div>

              {/* Горизонтальная раскладка полей */}
              <div className="flex flex-col md:flex-row items-center gap-4">
                {/* Поле "Отдаёте" */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative flex-1 w-full group"
                >
                  <label className="absolute -top-2 left-6 px-2 bg-white text-xs font-semibold text-[#001D8D]/70 z-10">Отдаёте</label>
                  <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl h-[80px] flex items-center px-6 gap-4 shadow-lg hover:shadow-xl transition-all border-2 border-[#001D8D]/20 group-hover:border-[#001D8D]/40">
                    <Input
                      type="text"
                      value={fromAmount}
                      onChange={(e) => {
                        setFromAmount(e.target.value);
                        setActiveInput("give");
                      }}
                      className="flex-1 bg-transparent border-none text-2xl md:text-4xl font-bold focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto text-[#001D8D] placeholder:text-[#001D8D]/30"
                      placeholder="0.00"
                      disabled={rateLoading}
                    />
                    <div className="shrink-0">
                      <Select value={fromCurrency} onValueChange={setFromCurrency} disabled={basesLoading}>
                        <SelectTrigger className="bg-white border border-[#001D8D]/20 rounded-xl h-14 px-4 min-w-[120px] text-lg font-bold shadow-md hover:shadow-lg hover:border-[#001D8D]/40 transition-all" style={{ colorScheme: 'light', backgroundColor: '#fff' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {bases.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>

                {/* Кнопка обмена (по центру) */}
                <div className="flex justify-center shrink-0 md:my-0 my-2">
                  <motion.button
                    onClick={swapCurrencies}
                    disabled={rateLoading}
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-[#001D8D] to-blue-600 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group relative overflow-hidden"
                    aria-label="Поменять валюты местами"
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <ArrowLeftRight className="w-6 h-6 text-white relative z-10" />
                  </motion.button>
                </div>

                {/* Поле "Получаете" */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative flex-1 w-full group"
                >
                  <label className="absolute -top-2 left-6 px-2 bg-white text-xs font-semibold text-[#001D8D]/70 z-10">Получаете</label>
                  <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-2xl h-[80px] flex items-center px-6 gap-4 shadow-lg hover:shadow-xl transition-all border-2 border-blue-500/30 group-hover:border-blue-500/50">
                    <Input
                      type="text"
                      value={toAmount}
                      onChange={(e) => {
                        setToAmount(e.target.value);
                        setActiveInput("receive");
                      }}
                      className="flex-1 bg-transparent border-none text-2xl md:text-4xl font-bold focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto text-blue-600 placeholder:text-blue-600/30"
                      placeholder="0.00"
                      disabled={rateLoading}
                    />
                    <div className="shrink-0">
                      <Select value={toCurrency} onValueChange={setToCurrency} disabled={quotesLoading}>
                        <SelectTrigger className="bg-white border border-blue-500/30 rounded-xl h-14 px-4 min-w-[120px] text-lg font-bold shadow-md hover:shadow-lg hover:border-blue-500/50 transition-all" style={{ colorScheme: 'light', backgroundColor: '#fff' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {quotes.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Enhanced Rate Display */}
              {rate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 p-6 bg-gradient-to-br from-[#001D8D]/5 via-blue-50/50 to-[#001D8D]/5 rounded-2xl border border-[#001D8D]/10"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#001D8D] flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-[#001D8D]/60 font-medium">Текущий курс</div>
                        <div className="text-2xl font-bold text-[#001D8D]">
                          1 {fromCurrency} = {rate.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {toCurrency}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-full">
                        <Star className="w-4 h-4 text-green-600 fill-green-600" />
                        <span className="text-sm font-bold text-green-700">Выгодный курс</span>
                      </div>
                      <span className="text-xs text-[#001D8D]/50 mt-1">Обновлено только что</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Кнопка создания заявки */}
              <motion.div
                className="pt-8"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => setStep(2)}
                  disabled={!rate || rateLoading || !fromAmount || !toAmount}
                  className="exchange-submit-button relative w-full px-8 py-6 text-xl font-bold !bg-gradient-to-r from-[#001D8D] via-blue-600 to-[#001D8D] hover:!opacity-90 !text-white shadow-2xl hover:shadow-[0_20px_50px_rgba(0,29,141,0.4)] transition-all duration-300 rounded-2xl overflow-hidden group"
                  style={{ background: 'linear-gradient(90deg, #001D8D 0%, #2563eb 50%, #001D8D 100%)', color: 'white', WebkitTextFillColor: 'white' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {rateLoading ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Загрузка курса...
                      </>
                    ) : (
                      <>
                        Оставить заявку на обмен
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>

              {/* Additional Info */}
              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-[#001D8D]/60">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Все транзакции защищены 256-битным шифрованием
                </p>
                <p className="text-xs text-[#001D8D]/40">
                  Среднее время обработки: 10-15 минут
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        </div>
      )}

      {/* === Шаг 2: Форма заявки === */}
      {step === 2 && (
        <Card className="calc-light-forced calculator-container border-none shadow-xl" style={{ colorScheme: 'light', background: '#fff' }}>
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl md:text-2xl font-bold text-[#001D8D] mb-4">
              Данные для обмена
            </CardTitle>
            <div className="bg-blue-50 p-3 sm:p-4 rounded-xl text-xs sm:text-sm space-y-2">
              <div className="flex justify-between items-center gap-2">
                <span className="text-gray-700">Отдаёте:</span>
                <strong className="text-[#001D8D] break-words text-right">{fromAmount} {fromCurrency}</strong>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-gray-700">Получаете:</span>
                <strong className="text-[#001D8D] break-words text-right">{toAmount} {toCurrency}</strong>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-gray-700">Курс:</span>
                <strong className="text-[#001D8D] break-words text-right text-xs sm:text-sm">1 {fromCurrency} = {rate?.toFixed(4)} {toCurrency}</strong>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Основная информация - всегда обязательные поля */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-[#001D8D]">
                  ФИО *
                </Label>
                <Input
                  id="fullName"
                  placeholder="Введите ваше полное имя"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#001D8D]">
                  Email *
                </Label>
                <Input
                  id="email"
                  placeholder="your@email.com"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-[#001D8D]">
                  Телефон *
                </Label>
                <Input
                  id="phone"
                  placeholder="+7 (999) 123-45-67"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegram" className="text-sm font-medium text-[#001D8D]">
                  Telegram *
                </Label>
                <Input
                  id="telegram"
                  placeholder="@username или ссылка"
                  value={telegram}
                  onChange={e => setTelegram(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Условные поля: только если участвует крипта */}
            {(fromCurrency !== "RUB" || toCurrency !== "RUB") && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <Label htmlFor="walletAddress" className="text-sm font-medium text-[#001D8D]">
                    Адрес кошелька *
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">
                    {fromCurrency !== "RUB"
                      ? "Укажите адрес, с которого вы будете отправлять криптовалюту"
                      : "Укажите адрес, на который вы хотите получить криптовалюту"
                    }
                  </p>
                  <Input
                    id="walletAddress"
                    placeholder="Введите адрес кошелька"
                    value={walletAddress}
                    onChange={e => setWalletAddress(e.target.value)}
                    className="input-field font-mono text-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="network" className="text-sm font-medium text-[#001D8D]">
                    Сеть *
                  </Label>
                  <Select onValueChange={setNetwork} value={network} required>
                    <SelectTrigger className="input-field">
                      <SelectValue placeholder="Выберите сеть для перевода"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ERC20">ERC20 (Ethereum)</SelectItem>
                      <SelectItem value="TRC20">TRC20 (Tron)</SelectItem>
                      <SelectItem value="BEP20">BEP20 (BSC)</SelectItem>
                      <SelectItem value="POLYGON">Polygon</SelectItem>
                      <SelectItem value="ARBITRUM">Arbitrum</SelectItem>
                      <SelectItem value="OPTIMISM">Optimism</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Согласия */}
            <div className="space-y-3 p-4 bg-blue-50/50 rounded-lg border border-[#001D8D]/10 mt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAcceptAmlKyc(!acceptAmlKyc);
                    if (consentErrors.amlKyc) {
                      setConsentErrors(prev => ({ ...prev, amlKyc: "" }));
                    }
                  }}
                  className={`h-4 w-4 rounded border flex items-center justify-center transition-all shrink-0 ${
                    acceptAmlKyc
                      ? 'bg-[#001D8D] border-[#001D8D]'
                      : 'border-[#001D8D]/30 hover:border-[#001D8D]/50 bg-white'
                  } ${consentErrors.amlKyc ? 'border-red-300' : ''}`}
                  disabled={loading}
                >
                  {acceptAmlKyc && (
                    <Check className="h-3 w-3 text-white stroke-[3]" />
                  )}
                </button>
                <label className="text-xs text-[#001D8D]/80 leading-tight">
                  Я согласен с{' '}
                  <Link
                    href="/policy/aml-kyc"
                    target="_blank"
                    className="text-[#001D8D] font-medium hover:underline"
                  >
                    AML/CTF и KYC Политикой
                  </Link>
                </label>
              </div>
              {consentErrors.amlKyc && (
                <p className="text-xs text-red-600">{consentErrors.amlKyc}</p>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAcceptTerms(!acceptTerms);
                    if (consentErrors.terms) {
                      setConsentErrors(prev => ({ ...prev, terms: "" }));
                    }
                  }}
                  className={`h-4 w-4 rounded border flex items-center justify-center transition-all shrink-0 ${
                    acceptTerms
                      ? 'bg-[#001D8D] border-[#001D8D]'
                      : 'border-[#001D8D]/30 hover:border-[#001D8D]/50 bg-white'
                  } ${consentErrors.terms ? 'border-red-300' : ''}`}
                  disabled={loading}
                >
                  {acceptTerms && (
                    <Check className="h-3 w-3 text-white stroke-[3]" />
                  )}
                </button>
                <label className="text-xs text-[#001D8D]/80 leading-tight">
                  Я прочитал и согласен с{' '}
                  <Link
                    href="/policy/terms"
                    target="_blank"
                    className="text-[#001D8D] font-medium hover:underline"
                  >
                    условиями пользования
                  </Link>
                </label>
              </div>
              {consentErrors.terms && (
                <p className="text-xs text-red-600">{consentErrors.terms}</p>
              )}
            </div>

            {/* Кнопки действий */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="w-full sm:flex-1 h-12 text-[#001D8D] border-[#001D8D]/20 hover:bg-[#001D8D]/5"
              >
                Назад к калькулятору
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !fullName || !email || !phone || !telegram || !acceptAmlKyc || !acceptTerms || ((fromCurrency !== "RUB" || toCurrency !== "RUB") && (!walletAddress || !network))}
                className="w-full sm:flex-1 h-12 bg-gradient-to-r from-[#001D8D] to-blue-600 text-white font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Создание заявки...
                  </>
                ) : (
                  "Подтвердить заявку"
                )}
              </Button>
            </div>

            {/* Контактная информация */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs">
              <p className="text-[#001D8D] font-medium mb-1.5 text-center">Наши контакты:</p>
              <div className="flex flex-wrap justify-center gap-3 text-gray-700">
                <a href="mailto:support@kenigswap.com" className="hover:text-[#001D8D] transition-colors">
                  support@kenigswap.com
                </a>
                <span className="text-gray-300">|</span>
                <a href="https://t.me/kenigswap_39" target="_blank" rel="noopener noreferrer" className="hover:text-[#001D8D] transition-colors">
                  @kenigswap_39
                </a>
                <span className="text-gray-300">|</span>
                <a href="tel:+79211038275" className="hover:text-[#001D8D] transition-colors">
                  +7 921 103 8275
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* === Шаг 3: Подтверждение === */}
      {step === 3 && (
        <div className="max-w-[700px] mx-auto" style={{ colorScheme: 'light' }}>
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-8 sm:p-10">
              {/* Иконка успеха */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-700" />
                </div>
              </div>

              {/* Заголовок */}
              <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
                Заявка успешно создана
              </h2>
              <p className="text-gray-600 text-center mb-8 text-sm">
                Мы получили вашу заявку и свяжемся с вами в течение 15 минут
              </p>

              {/* Детали обмена */}
              <div className="bg-white border border-gray-200 rounded-lg mb-6 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Детали обмена</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="px-5 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Отдаёте</span>
                    <span className="text-sm font-semibold text-gray-900">{fromAmount} {fromCurrency}</span>
                  </div>
                  <div className="px-5 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Получаете</span>
                    <span className="text-sm font-semibold text-gray-900">{toAmount} {toCurrency}</span>
                  </div>
                </div>
              </div>

              {/* Контактная информация */}
              <div className="bg-white border border-gray-200 rounded-lg mb-8 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Контактная информация</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="px-5 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email</span>
                    <span className="text-sm text-gray-900 break-all text-right ml-4">{email}</span>
                  </div>
                  {phone && (
                    <div className="px-5 py-3 flex items-center justify-between">
                      <span className="text-sm text-gray-600">Телефон</span>
                      <span className="text-sm text-gray-900">{phone}</span>
                    </div>
                  )}
                  {telegram && (
                    <div className="px-5 py-3 flex items-center justify-between">
                      <span className="text-sm text-gray-600">Telegram</span>
                      <span className="text-sm text-gray-900">{telegram}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Кнопка новой заявки */}
              <Button
                onClick={() => {
                  setStep(1);
                  setFromAmount("1");
                  setToAmount("");
                  setEmail("");
                  setPhone("");
                  setTelegram("");
                  setWalletAddress("");
                  setNetwork("");
                  setFullName("");
                  setAcceptAmlKyc(false);
                  setAcceptTerms(false);
                  setConsentErrors({ amlKyc: "", terms: "" });
                }}
                className="w-full h-12 bg-[#0052FF] hover:bg-[#0045D8] text-white font-semibold rounded-full transition-colors duration-200"
              >
                Создать новую заявку
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}