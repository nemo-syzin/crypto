"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  // --- Загрузка доступных валют ---
  const { bases, loading: basesLoading, error: basesError } = useBaseAssets();
  const { quotes, loading: quotesLoading, error: quotesError } =
    useQuoteAssets(fromCurrency);

  // --- Получение курса ---
  const {
    rate,
    source,
    lastUpdated,
    loading: rateLoading,
    error: rateError,
  } = useExchangeRate(fromCurrency, toCurrency);

  // --- Если выбранная правая валюта отсутствует ---
  useEffect(() => {
    if (!quotesLoading && quotes.length > 0 && !quotes.includes(toCurrency)) {
      setToCurrency(quotes[0]);
    }
  }, [quotes, toCurrency, quotesLoading]);

  // --- Корректный пересчёт ---
  useEffect(() => {
    if (!rate || rate <= 0) {
      setToAmount("");
      return;
    }

    if (activeInput === "give") {
      const num = parseFloat(fromAmount);
      if (!isNaN(num)) {
        const result = num * rate;
        setToAmount(result.toFixed(2));
      }
    } else if (activeInput === "receive") {
      const num = parseFloat(toAmount);
      if (!isNaN(num)) {
        const result = num / rate;
        setFromAmount(result.toFixed(6));
      }
    }
  }, [rate, fromAmount, toAmount, activeInput]);

  // --- Кнопка "поменять валюты местами" ---
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  // --- Корректное отображение курса ---
  const displayedRate = useMemo(() => {
    if (!rate || rate <= 0) return "—";
    // если конвертация в RUB — показываем напрямую, иначе переворачиваем
    const value =
      fromCurrency === "RUB" || fromCurrency === "USD"
        ? 1 / rate
        : rate;
    return value.toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  }, [rate, fromCurrency]);

  // --- Отправка заявки ---
  const handleSubmit = async () => {
    if (!fromAmount || !toAmount || !rate) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля для создания заявки",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));

    toast({
      title: "Заявка создана!",
      description: `Обмен ${fromAmount} ${fromCurrency} → ${toAmount} ${toCurrency} успешно создан.`,
    });

    setFromAmount("1");
    setToAmount("");
    setActiveInput("give");
    setIsSubmitting(false);
  };

  // --- Обработка ошибок ---
  useEffect(() => {
    if (basesError || quotesError || rateError) {
      toast({
        title: "Ошибка загрузки данных",
        description: basesError || quotesError || rateError,
        variant: "destructive",
      });
    }
  }, [basesError, quotesError, rateError, toast]);

  return (
    <div className="w-full flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">
        Конвертер и калькулятор криптовалют
      </h1>

      {/* Подзаголовок с курсом */}
      <p className="text-center text-gray-600 mb-8 text-lg">
        1 {fromCurrency} = {displayedRate} {toCurrency}
        <br />
        <span className="text-sm text-gray-500">
          по состоянию на{" "}
          {lastUpdated
            ? lastUpdated.toLocaleString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </span>
      </p>

      {/* Основная форма */}
      <div className="flex items-center gap-4 w-full max-w-2xl">
        {/* Отдаёте */}
        <div className="flex flex-1 border border-gray-300 rounded-full px-6 py-3 items-center h-[60px] bg-white">
          <Input
            type="text"
            value={fromAmount}
            onChange={(e) => {
              setFromAmount(e.target.value);
              setActiveInput("give");
            }}
            className="flex-1 border-0 shadow-none focus-visible:ring-0 text-2xl font-medium bg-transparent rounded-full px-6"
            placeholder="0"
          />
          <Select
            value={fromCurrency}
            onValueChange={setFromCurrency}
            disabled={basesLoading}
          >
            <SelectTrigger className="w-[100px] border-0 focus:ring-0 font-medium text-lg bg-transparent">
              <SelectValue placeholder={fromCurrency} />
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

        {/* Кнопка смены */}
        <button
          onClick={swapCurrencies}
          disabled={rateLoading}
          className="p-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition disabled:opacity-50"
        >
          <ArrowLeftRight className="w-5 h-5 text-gray-600" />
        </button>

        {/* Получаете */}
        <div className="flex flex-1 border border-gray-300 rounded-full px-6 py-3 items-center h-[60px] bg-white">
          <Input
            type="text"
            value={toAmount}
            onChange={(e) => {
              setToAmount(e.target.value);
              setActiveInput("receive");
            }}
            className="flex-1 border-0 shadow-none focus-visible:ring-0 text-2xl font-medium bg-transparent rounded-full px-6"
            placeholder="0"
          />
          <Select
            value={toCurrency}
            onValueChange={setToCurrency}
            disabled={quotesLoading}
          >
            <SelectTrigger className="w-[100px] border-0 focus:ring-0 font-medium text-lg bg-transparent">
              <SelectValue placeholder={toCurrency} />
            </SelectTrigger>
            <SelectContent>
              {quotes.length > 0 ? (
                quotes.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  Нет доступных валют
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!rate || isSubmitting || rateLoading}
        className="mt-8 w-full max-w-2xl h-14 text-lg bg-[#0052FF] hover:bg-[#0041cc] font-semibold rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Создание заявки..." : "Оставить заявку на обмен"}
      </button>
    </div>
  );
}