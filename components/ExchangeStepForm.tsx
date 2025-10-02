"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight, Loader as Loader2, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const [walletAddress, setWalletAddress] = useState("");
  const [bankDetails, setBankDetails] = useState("");
  const [network, setNetwork] = useState("");
  const [fullName, setFullName] = useState("");

  // Хуки для получения данных
  const { bases, loading: basesLoading } = useBaseAssets();
  const { quotes, loading: quotesLoading } = useQuoteAssets(fromCurrency);
  const { rate, loading: rateLoading } = useExchangeRate(fromCurrency, toCurrency);

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
    console.log('🚀 [Form] Начинаем отправку заявки...');
    console.log('📝 [Form] Данные формы:', {
      fromCurrency,
      toCurrency,
      amountFrom: parseFloat(fromAmount),
      amountTo: parseFloat(toAmount),
      exchangeRate: rate,
      clientEmail: email,
      clientPhone: phone || null,
      clientWalletAddress: walletAddress || null,
      clientBankDetails: bankDetails || null,
      network: network || null,
      fullName,
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
          clientEmail: email,
          clientPhone: phone || null,
          clientWalletAddress: walletAddress || null,
          clientBankDetails: bankDetails || null,
          network: network || null,
          fullName,
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
    <div className="w-full max-w-4xl mx-auto">
      {/* === Шаг 1: Калькулятор === */}
      {step === 1 && (
        <Card className="calculator-container border-none shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl md:text-3xl font-bold text-[#001D8D] mb-4">
              Калькулятор обмена криптовалют
            </CardTitle>
            <p className="text-[#001D8D]/70 text-sm md:text-base">
              {fromCurrency} в {toCurrency}: 1 {fromCurrency} = {" "}
              {rate ? rate.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 6 }) : "—"}{" "}
              {toCurrency}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Основной контейнер калькулятора */}
            <div className="space-y-4">
              {/* Отдаёте */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#001D8D]/70">Отдаёте</Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={fromAmount}
                      onChange={(e) => {
                        setFromAmount(e.target.value);
                        setActiveInput("give");
                      }}
                      className="input-field text-lg md:text-xl font-semibold"
                      placeholder="0"
                      disabled={rateLoading}
                    />
                  </div>
                  <div className="w-full sm:w-32">
                    <Select value={fromCurrency} onValueChange={setFromCurrency} disabled={basesLoading}>
                      <SelectTrigger className="input-field">
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

              {/* Кнопка swap */}
              <div className="flex justify-center">
                <button
                  onClick={swapCurrencies}
                  disabled={rateLoading}
                  className="swap-button"
                  aria-label="Поменять валюты местами"
                >
                  <ArrowLeftRight className="w-5 h-5 text-[#001D8D]" />
                </button>
              </div>

              {/* Получаете */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#001D8D]/70">Получаете</Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={toAmount}
                      onChange={(e) => {
                        setToAmount(e.target.value);
                        setActiveInput("receive");
                      }}
                      className="input-field text-lg md:text-xl font-semibold"
                      placeholder="0"
                      disabled={rateLoading}
                    />
                  </div>
                  <div className="w-full sm:w-32">
                    <Select value={toCurrency} onValueChange={setToCurrency} disabled={quotesLoading}>
                      <SelectTrigger className="input-field">
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
              <div className="rates-container">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <div className="rate-value">
                      1 {fromCurrency} = {rate.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {toCurrency}
                    </div>
                    <div className="hint-text">Актуальный курс обмена</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Обновлено сейчас
                  </Badge>
                </div>
              </div>
            )}

            {/* Кнопка создания заявки */}
            <Button
              onClick={() => setStep(2)}
              disabled={!rate || rateLoading || !fromAmount || !toAmount}
              className="w-full h-12 md:h-14 text-base md:text-lg bg-gradient-to-r from-[#001D8D] to-blue-600 text-white font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
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
          </CardContent>
        </Card>
      )}

      {/* === Шаг 2: Форма заявки === */}
      {step === 2 && (
        <Card className="calculator-container border-none shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl md:text-2xl font-bold text-[#001D8D] mb-4">
              Данные для обмена
            </CardTitle>
            <div className="bg-blue-50 p-4 rounded-xl text-sm space-y-2">
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <span>Отдаёте:</span>
                <strong className="text-[#001D8D]">{fromAmount} {fromCurrency}</strong>
              </div>
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <span>Получаете:</span>
                <strong className="text-[#001D8D]">{toAmount} {toCurrency}</strong>
              </div>
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <span>Курс:</span>
                <strong className="text-[#001D8D]">1 {fromCurrency} = {rate?.toFixed(4)} {toCurrency}</strong>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Основная информация */}
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

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-[#001D8D]">
                Телефон (опционально)
              </Label>
              <Input 
                id="phone"
                placeholder="+7 (999) 123-45-67" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                className="input-field"
              />
            </div>

            {/* Условные поля в зависимости от валюты получения */}
            {toCurrency === "RUB" ? (
              <div className="space-y-2">
                <Label htmlFor="bankDetails" className="text-sm font-medium text-[#001D8D]">
                  Банковские реквизиты для получения рублей *
                </Label>
                <Textarea 
                  id="bankDetails"
                  placeholder="Номер карты или банковские реквизиты для получения рублей" 
                  value={bankDetails} 
                  onChange={e => setBankDetails(e.target.value)} 
                  className="min-h-[100px] border-[#001D8D]/20 focus:border-[#001D8D]"
                  required
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="walletAddress" className="text-sm font-medium text-[#001D8D]">
                    Адрес кошелька {toCurrency} *
                  </Label>
                  <Input 
                    id="walletAddress"
                    placeholder={`Введите адрес кошелька ${toCurrency}`} 
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

            {/* Кнопки действий */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="w-full sm:w-auto flex-1 h-12 text-[#001D8D] border-[#001D8D]/20 hover:bg-[#001D8D]/5"
              >
                Назад к калькулятору
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !fullName || !email || (toCurrency !== "RUB" && (!walletAddress || !network)) || (toCurrency === "RUB" && !bankDetails)}
                className="w-full sm:w-auto flex-1 h-12 bg-gradient-to-r from-[#001D8D] to-blue-600 text-white font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
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
          </CardContent>
        </Card>
      )}

      {/* === Шаг 3: Подтверждение === */}
      {step === 3 && (
        <Card className="calculator-container border-none shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-100 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">
              Заявка создана!
            </h2>
            
            <p className="text-[#001D8D]/70 mb-8 leading-relaxed">
              Наш менеджер свяжется с вами в течение 15 минут для подтверждения деталей обмена.
              Проверьте указанный email и телефон.
            </p>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg text-sm">
                <h4 className="font-semibold text-[#001D8D] mb-2">Детали заявки:</h4>
                <div className="space-y-1 text-[#001D8D]/70">
                  <div>Обмен: {fromAmount} {fromCurrency} → {toAmount} {toCurrency}</div>
                  <div>Email: {email}</div>
                  {phone && <div>Телефон: {phone}</div>}
                </div>
              </div>

              <Button
                onClick={() => {
                  setStep(1);
                  setFromAmount("1");
                  setToAmount("");
                  setEmail("");
                  setPhone("");
                  setWalletAddress("");
                  setBankDetails("");
                  setNetwork("");
                  setFullName("");
                }}
                className="w-full h-12 bg-gradient-to-r from-[#001D8D] to-blue-600 text-white font-semibold hover:opacity-90 transition-all duration-300"
              >
                Создать новую заявку
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}