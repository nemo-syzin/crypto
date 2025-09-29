"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useBaseAssets, useQuoteAssets } from "@/hooks/useAssets";

export default function ExchangeCalculator() {
  const { toast } = useToast();
  const [fromAmount, setFromAmount] = useState("1");
  const [toAmount, setToAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USDT");
  const [toCurrency, setToCurrency] = useState("RUB");
  const [activeInput, setActiveInput] = useState<"give" | "receive">("give");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Хуки для получения данных
  const { bases, loading: basesLoading, error: basesError } = useBaseAssets();
  const { quotes, loading: quotesLoading, error: quotesError } = useQuoteAssets(fromCurrency);
  const { rate, source, lastUpdated, loading: rateLoading, error: rateError, refetch } = useExchangeRate(fromCurrency, toCurrency);

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

  // Обработка отправки заявки
  const handleSubmit = async () => {
    if (!fromAmount || !toAmount || !rate) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля для создания заявки",
        variant: "destructive",
      });
      return;
    }

    const numFromAmount = parseFloat(fromAmount);
    const numToAmount = parseFloat(toAmount);

    if (isNaN(numFromAmount) || isNaN(numToAmount) || numFromAmount <= 0 || numToAmount <= 0) {
      toast({
        title: "Ошибка",
        description: "Введите корректные суммы для обмена",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Здесь будет API вызов для создания заявки
      await new Promise(resolve => setTimeout(resolve, 1000)); // Симуляция API вызова

      toast({
        title: "Заявка создана!",
        description: `Заявка на обмен ${fromAmount} ${fromCurrency} на ${toAmount} ${toCurrency} успешно создана.`,
      });

      // Сброс формы после успешной отправки
      setFromAmount("1");
      setToAmount("");
      setActiveInput("give");
    } catch (error) {
      console.error('Ошибка создания заявки:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать заявку. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Обработка ошибок загрузки
  useEffect(() => {
    if (basesError) {
      toast({
        title: "Ошибка загрузки валют",
        description: basesError,
        variant: "destructive",
      });
    }
    if (quotesError) {
      toast({
        title: "Ошибка загрузки валют",
        description: quotesError,
        variant: "destructive",
      });
    }
    if (rateError) {
      toast({
        title: "Ошибка загрузки курса",
        description: rateError,
        variant: "destructive",
      });
    }
  }, [basesError, quotesError, rateError, toast]);

  return (
    <div className="w-full flex flex-col items-center py-10">
      {/* Заголовок */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Обмен криптовалют
      </h2>

      {/* Курс (сверху под заголовком) */}
      <p className="text-gray-500 text-sm mb-6">
        1 {fromCurrency} ≈ {rate ? rate.toFixed(2) : "—"} {toCurrency}
        {source && ` • ${source}`}
        {lastUpdated && ` • ${lastUpdated.toLocaleTimeString("ru-RU")}`}
      </p>

      {/* Основной контейнер */}
      <div className="flex items-center gap-4 w-full max-w-2xl">
        {/* Отдаёте */}
        <div className="flex flex-1 border border-gray-300 rounded-lg px-6 py-4 items-center h-[60px]">
          <Input
            type="text"
            value={fromAmount}
            onChange={(e) => {
              setFromAmount(e.target.value);
              setActiveInput("give");
            }}
            className="flex-1 border-0 shadow-none focus-visible:ring-0 text-2xl font-medium bg-transparent"
            placeholder="0"
            disabled={rateLoading}
          />
    {/* Основной контейнер */}
    <div className="flex items-center gap-2 w-full max-w-2xl">
      {/* Отдаёте */}
      <div className="flex flex-1 border border-gray-300 rounded-md px-4 py-2 items-center bg-white h-[48px]">
        <Input
          type="text"
          value={fromAmount}
          onChange={(e) => {
            setFromAmount(e.target.value);
            setActiveInput("give");
          }}
          className="flex-1 border-0 shadow-none focus-visible:ring-0 text-lg font-medium bg-white"
          placeholder="0"
          disabled={rateLoading}
        />
        <Select value={fromCurrency} onValueChange={setFromCurrency} disabled={basesLoading}>
          <SelectTrigger className="w-[100px] border-0 focus:ring-0 font-medium text-lg bg-white">
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
      <div className="flex flex-1 border border-gray-300 rounded-md px-4 py-2 items-center bg-white h-[48px]">
        <Input
          type="text"
          value={toAmount}
          onChange={(e) => {
            setToAmount(e.target.value);
            setActiveInput("receive");
          }}
          className="flex-1 border-0 shadow-none focus-visible:ring-0 text-lg font-medium bg-white"
          placeholder="0"
          disabled={rateLoading}
        />
        <Select value={toCurrency} onValueChange={setToCurrency} disabled={quotesLoading}>
          <SelectTrigger className="w-[100px] border-0 focus:ring-0 font-medium text-lg bg-white">
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
  );
}

