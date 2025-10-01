"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    <div className="w-full max-w-2xl mx-auto py-10">
      {/* === Шаг 1: Калькулятор === */}
      {step === 1 && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Конвертер и калькулятор криптовалют
            </h2>
            <p className="text-gray-600">
              {fromCurrency} в {toCurrency}: 1 {fromCurrency} конвертируется в{" "}
              {rate ? rate.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"}{" "}
              {toCurrency}
            </p>
          </div>

          {/* Основной контейнер */}
          <div className="flex items-center gap-4 w-full">
            {/* Отдаёте */}
            <div className="flex flex-1 border border-gray-300 rounded-full px-6 py-3 items-center h-[60px]">
              <Input
                type="text"
                value={fromAmount}
                onChange={(e) => {
                  setFromAmount(e.target.value);
                  setActiveInput("give");
                }}
                className="flex-1 border-0 shadow-none focus-visible:ring-0 text-2xl font-medium bg-transparent rounded-full px-6"
                placeholder="0"
                disabled={rateLoading}
              />
              <Select value={fromCurrency} onValueChange={setFromCurrency} disabled={basesLoading}>
                <SelectTrigger className="w-[100px] border-0 focus:ring-0 font-medium text-lg bg-transparent">
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

            {/* Кнопка swap */}
            <button
              onClick={swapCurrencies}
              disabled={rateLoading}
              className="p-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition disabled:opacity-50"
            >
              <ArrowLeftRight className="w-5 h-5 text-gray-600" />
            </button>

            {/* Получаете */}
            <div className="flex flex-1 border border-gray-300 rounded-full px-6 py-3 items-center h-[60px]">
              <Input
                type="text"
                value={toAmount}
                onChange={(e) => {
                  setToAmount(e.target.value);
                  setActiveInput("receive");
                }}
                className="flex-1 border-0 shadow-none focus-visible:ring-0 text-2xl font-medium bg-transparent rounded-full px-6"
                placeholder="0"
                disabled={rateLoading}
              />
              <Select value={toCurrency} onValueChange={setToCurrency} disabled={quotesLoading}>
                <SelectTrigger className="w-[100px] border-0 focus:ring-0 font-medium text-lg bg-transparent">
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

          {/* Кнопка создания заявки */}
          <button
            onClick={() => setStep(2)}
            disabled={!rate || rateLoading}
            className="w-full h-14 text-lg bg-[#0052FF] hover:bg-[#0041cc] font-semibold rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Оставить заявку на обмен
          </button>
        </div>
      )}

      {/* === Шаг 2: Форма заявки === */}
      {step === 2 && (
        <div className="space-y-6 bg-white shadow-md rounded-2xl p-6 text-left">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Введите данные</h2>
            <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-1">
              <p>Отдаёте: <strong>{fromAmount} {fromCurrency}</strong></p>
              <p>Получаете: <strong>{toAmount} {toCurrency}</strong></p>
              <p>Курс: <strong>1 {fromCurrency} = {rate?.toFixed(4)} {toCurrency}</strong></p>
            </div>
          </div>

          <Input 
            placeholder="ФИО" 
            value={fullName} 
            onChange={e => setFullName(e.target.value)} 
            className="h-12 rounded-full"
            required
          />
          
          <Input 
            placeholder="Email" 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="h-12 rounded-full"
            required
          />
          
          <Input 
            placeholder="Телефон (опционально)" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            className="h-12 rounded-full"
          />

          {/* Условные поля в зависимости от валюты получения */}
          {toCurrency === "RUB" ? (
            <Textarea 
              placeholder="Банковские реквизиты для получения рублей" 
              value={bankDetails} 
              onChange={e => setBankDetails(e.target.value)} 
              className="min-h-[80px] rounded-xl"
              required
            />
          ) : (
            <>
              <Input 
                placeholder={`Адрес кошелька ${toCurrency}`} 
                value={walletAddress} 
                onChange={e => setWalletAddress(e.target.value)} 
                className="h-12 rounded-full"
                required
              />
              <Select onValueChange={setNetwork} value={network} required>
                <SelectTrigger className="h-12 rounded-full">
                  <SelectValue placeholder="Выберите сеть"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ERC20">ERC20 (Ethereum)</SelectItem>
                  <SelectItem value="TRC20">TRC20 (Tron)</SelectItem>
                  <SelectItem value="BEP20">BEP20 (BSC)</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 h-12 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              Назад
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !fullName || !email || (toCurrency !== "RUB" && (!walletAddress || !network)) || (toCurrency === "RUB" && !bankDetails)}
              className="flex-1 h-12 bg-[#0052FF] hover:bg-[#0041cc] text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Создание заявки..." : "Подтвердить заявку"}
            </button>
          </div>
        </div>
      )}

      {/* === Шаг 3: Подтверждение === */}
      {step === 3 && (
        <div className="text-center space-y-6 p-6 bg-green-50 rounded-2xl">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-700">Заявка создана!</h2>
          <p className="text-gray-700">
            Наш менеджер свяжется с вами для подтверждения деталей обмена.
          </p>
          <button
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
            className="px-6 py-3 bg-[#0052FF] hover:bg-[#0041cc] text-white rounded-full transition-colors"
          >
            Создать новую заявку
          </button>
        </div>
      )}
    </div>
  );
}