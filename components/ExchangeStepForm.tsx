"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight, Loader as Loader2, Check, CircleAlert as AlertCircle, CheckCircle2, Mail, Phone, MessageCircle, ArrowRight, RefreshCw } from "lucide-react";
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
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Конвертер и калькулятор криптовалют
            </h1>
            {rate && !rateError && (
              <div className="flex items-center justify-center gap-2">
                <p className="text-lg text-gray-600">
                  {fromCurrency} в {toCurrency}: 1 {fromCurrency === "BTC" ? "Bitcoin" : fromCurrency} конвертируется в{" "}
                  {rate.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                  {toCurrency === "RUB" ? "₽" : ""} {toCurrency} по состоянию на{" "}
                  {new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" })} в{" "}
                  {new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                </p>
                <button
                  onClick={() => refetchRate()}
                  disabled={rateLoading || refreshing}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                  title="Обновить курс"
                >
                  <RefreshCw className={`w-4 h-4 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
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
          </div>

          {/* Калькулятор */}
          <Card className="calc-light-forced border-none shadow-lg bg-white" style={{ colorScheme: 'light', background: '#fff' }}>
            <CardContent className="p-6 md:p-8">
              {/* Горизонтальная раскладка полей */}
              <div className="flex flex-col md:flex-row items-center gap-3">
                {/* Поле "Отдаёте" */}
                <div className="relative flex-1 w-full">
                  <div className="bg-gray-50 rounded-full h-[72px] flex items-center px-6 gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <Input
                      type="text"
                      value={fromAmount}
                      onChange={(e) => {
                        setFromAmount(e.target.value);
                        setActiveInput("give");
                      }}
                      className="flex-1 bg-transparent border-none text-2xl md:text-3xl font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                      placeholder="0"
                      disabled={rateLoading}
                    />
                    <div className="shrink-0">
                      <Select value={fromCurrency} onValueChange={setFromCurrency} disabled={basesLoading}>
                        <SelectTrigger className="bg-white border-none rounded-full h-12 px-4 min-w-[120px] text-base font-semibold shadow-sm" style={{ colorScheme: 'light', backgroundColor: '#fff' }}>
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
                </div>

                {/* Кнопка обмена (по центру) */}
                <div className="flex justify-center shrink-0">
                  <button
                    onClick={swapCurrencies}
                    disabled={rateLoading}
                    className="w-12 h-12 rounded-full bg-white border-4 border-gray-50 shadow-md hover:shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    style={{ colorScheme: 'light', backgroundColor: '#fff' }}
                    aria-label="Поменять валюты местами"
                  >
                    <ArrowLeftRight className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Поле "Получаете" */}
                <div className="relative flex-1 w-full">
                  <div className="bg-gray-50 rounded-full h-[72px] flex items-center px-6 gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <Input
                      type="text"
                      value={toAmount}
                      onChange={(e) => {
                        setToAmount(e.target.value);
                        setActiveInput("receive");
                      }}
                      className="flex-1 bg-transparent border-none text-2xl md:text-3xl font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                      placeholder="0"
                      disabled={rateLoading}
                    />
                    <div className="shrink-0">
                      <Select value={toCurrency} onValueChange={setToCurrency} disabled={quotesLoading}>
                        <SelectTrigger className="bg-white border-none rounded-full h-12 px-4 min-w-[120px] text-base font-semibold shadow-sm" style={{ colorScheme: 'light', backgroundColor: '#fff' }}>
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
                </div>
              </div>

              {/* Информация о курсе */}
              {rate && (
                <div className="pt-6">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-gray-900">
                      1 {fromCurrency} = {rate.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {toCurrency}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Актуальный курс обмена
                    </div>
                  </div>
                </div>
              )}

              {/* Кнопка создания заявки */}
              <div className="pt-6">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!rate || rateLoading || !fromAmount || !toAmount}
                  className="exchange-submit-button w-full h-14 text-base font-semibold !bg-[#001D8D] hover:!bg-[#001D8D]/90 !text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {rateLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Загрузка курса...
                    </>
                  ) : (
                    "Оставить заявку на обмен"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
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
                className="exchange-submit-button w-full sm:flex-1 h-12 bg-gradient-to-r from-[#001D8D] to-blue-600 text-white font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
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
                className="exchange-submit-button w-full h-12 bg-[#0052FF] hover:bg-[#0045D8] text-white font-semibold rounded-full transition-colors duration-200"
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