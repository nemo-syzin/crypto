"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  // Получаем валюты и курсы
  const { bases, loading: basesLoading, error: basesError } = useBaseAssets();
  const { quotes, loading: quotesLoading, error: quotesError } =
    useQuoteAssets(fromCurrency);
  const {
    rate,
    lastUpdated,
    loading: rateLoading,
    error: rateError,
    refetch,
  } = useExchangeRate(fromCurrency, toCurrency);

  // Логирование
  useEffect(() => {
    console.log("[ExchangeCalculator] state:", {
      fromCurrency,
      toCurrency,
      quotes,
    });
  }, [fromCurrency, toCurrency, quotes]);

  // Если выбранная валюта недоступна в quotes — заменить на первую
  useEffect(() => {
    if (!quotesLoading && quotes.length > 0 && !quotes.includes(toCurrency)) {
      console.log(
        `[ExchangeCalculator] toCurrency ${toCurrency} не доступна, ставим:`,
        quotes[0]
      );
      setToCurrency(quotes[0]);
    }
  }, [quotes, toCurrency, quotesLoading]);

  // Пересчёт при изменении суммы/курса
  useEffect(() => {
    if (!rate || rate <= 0) {
      if (activeInput === "give") setToAmount("");
      else setFromAmount("");
      return;
    }

    if (activeInput === "give" && fromAmount) {
      const num = parseFloat(fromAmount);
      if (!isNaN(num) && num > 0) setToAmount((num * rate).toFixed(2));
    } else if (activeInput === "receive" && toAmount) {
      const num = parseFloat(toAmount);
      if (!isNaN(num) && num > 0) setFromAmount((num / rate).toFixed(6));
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

  // Создание заявки
  const handleSubmit = async () => {
    if (!fromAmount || !toAmount || !rate) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля перед отправкой заявки",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 1000)); // симуляция API
      toast({
        title: "Заявка создана!",
        description: `${fromAmount} ${fromCurrency} → ${toAmount} ${toCurrency}`,
      });
      setFromAmount("1");
      setToAmount("");
      setActiveInput("give");
    } catch (err) {
      console.error(err);
      toast({
        title: "Ошибка",
        description: "Не удалось создать заявку. Повторите попытку.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ошибки загрузки
  useEffect(() => {
    const err = basesError || quotesError || rateError;
    if (err)
      toast({
        title: "Ошибка загрузки данных",
        description: err,
        variant: "destructive",
      });
  }, [basesError, quotesError, rateError]);

  // Формат отображения курса
  const displayRate = (() => {
    if (!rate || rate <= 0) return "—";

    // если пользователь выбрал RUB → USDT/USD, то показываем обратный курс
    const inverted =
      fromCurrency === "RUB" && ["USDT", "USD"].includes(toCurrency);
    const value = inverted ? 1 / rate : rate;

    return value.toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  })();

  return (
    <div className="w-full flex flex-col items-center py-10">
      {/* Заголовок */}
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
        Конвертер и калькулятор криптовалют
      </h1>

      {/* Подзаголовок с курсом */}
      <div className="text-center text-gray-600 mb-8">
        <div className="text-lg font-medium text-gray-800">
          1 {fromCurrency} ={" "}
          <span className="text-blue-700 font-semibold">{displayRate}</span>{" "}
          {toCurrency}
        </div>
        <div className="text-sm text-gray-500 mt-1 flex justify-center items-center gap-1">
          <RotateCw
            className="w-4 h-4 text-gray-400 cursor-pointer"
            onClick={() => refetch()}
          />
          {lastUpdated
            ? `Обновлено ${lastUpdated.toLocaleString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : "Обновляется..."}
        </div>
      </div>

      {/* Основной блок */}
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
            className="flex-1 border-0 shadow-none focus-visible:ring-0 text-2xl font-medium bg-transparent"
            placeholder="0"
            disabled={rateLoading}
          />
          <Select
            value={fromCurrency}
            onValueChange={setFromCurrency}
            disabled={basesLoading}
          >
            <SelectTrigger className="w-[100px] border-0 focus:ring-0 text-lg bg-transparent">
              <SelectValue placeholder={fromCurrency} />
            </SelectTrigger>
            <SelectContent>
              {bases.map((cur) => (
                <SelectItem key={cur} value={cur}>
                  {cur}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* swap */}
        <button
          onClick={swapCurrencies}
          className="p-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition"
          disabled={rateLoading}
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
            className="flex-1 border-0 shadow-none focus-visible:ring-0 text-2xl font-medium bg-transparent"
            placeholder="0"
            disabled={rateLoading}
          />
          <Select
            value={toCurrency}
            onValueChange={setToCurrency}
            disabled={quotesLoading}
          >
            <SelectTrigger className="w-[100px] border-0 focus:ring-0 text-lg bg-transparent">
              <SelectValue placeholder={toCurrency} />
            </SelectTrigger>
            <SelectContent>
              {quotes.length > 0 ? (
                quotes.map((cur) => (
                  <SelectItem key={cur} value={cur}>
                    {cur}
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

      {/* Кнопка */}
      <button
        onClick={handleSubmit}
        disabled={!rate || isSubmitting || rateLoading}
        className="mt-8 w-full max-w-2xl h-14 text-lg bg-[#0052FF] hover:bg-[#0041cc] font-semibold rounded-full text-white transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Создание заявки..." : "Оставить заявку на обмен"}
      </button>
    </div>
  );
}