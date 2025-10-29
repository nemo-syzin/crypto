"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useBaseAssets, useQuoteAssets } from "@/hooks/useAssets";
import { getReadableRate } from "@/lib/currency-utils";

export default function ExchangeCalculator() {
  const { toast } = useToast();
  const [fromAmount, setFromAmount] = useState("1");
  const [toAmount, setToAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USDT");
  const [toCurrency, setToCurrency] = useState("RUB");
  const [activeInput, setActiveInput] = useState<"give" | "receive">("give");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Получаем данные
  const { bases, loading: basesLoading, error: basesError } = useBaseAssets();
  const { quotes, loading: quotesLoading, error: quotesError } = useQuoteAssets(fromCurrency);
  const { rate, lastUpdated, loading: rateLoading, error: rateError } = useExchangeRate(fromCurrency, toCurrency);

  // Обновление валют при смене fromCurrency
  useEffect(() => {
    if (!quotesLoading && quotes.length > 0 && !quotes.includes(toCurrency)) {
      setToCurrency(quotes[0]);
    }
  }, [quotes, toCurrency, quotesLoading]);

  // Пересчёт суммы
  useEffect(() => {
    if (!rate || rate <= 0) return;

    if (activeInput === "give" && fromAmount) {
      const num = parseFloat(fromAmount);
      if (!isNaN(num)) setToAmount((num * rate).toFixed(2));
    } else if (activeInput === "receive" && toAmount) {
      const num = parseFloat(toAmount);
      if (!isNaN(num)) setFromAmount((num / rate).toFixed(6));
    }
  }, [rate, fromAmount, toAmount, activeInput]);

  // Смена направления
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    setActiveInput(activeInput === "give" ? "receive" : "give");
  };

  // Отображение курса в читабельном формате
  const renderFormattedRate = () => {
    if (!rate || rate <= 0) return "—";

    const readableRate = getReadableRate(fromCurrency, toCurrency, rate);

    return (
      <>
        {readableRate.description}
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
      </>
    );
  };

  // Отправка заявки
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

    try {
      await new Promise((res) => setTimeout(res, 800));
      toast({
        title: "Заявка создана!",
        description: `Обмен ${fromAmount} ${fromCurrency} → ${toAmount} ${toCurrency} успешно создан.`,
      });
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось создать заявку, попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
        Конвертер и калькулятор криптовалют
      </h1>

      <p className="text-center text-gray-600 mb-8">{renderFormattedRate()}</p>

      {/* Основной блок */}
      <div className="flex items-center gap-4 w-full max-w-2xl">
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

        {/* Swap */}
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
                <div className="px-4 py-2 text-sm text-gray-500">Нет доступных валют</div>
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