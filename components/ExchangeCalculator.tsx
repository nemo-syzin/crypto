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

  const { bases, loading: basesLoading } = useBaseAssets();
  const { quotes, loading: quotesLoading } = useQuoteAssets(fromCurrency);
  const { rate, lastUpdated, loading: rateLoading, error: rateError } = useExchangeRate(fromCurrency, toCurrency);

  useEffect(() => {
    if (!rate || rate <= 0) {
      if (activeInput === "give") setToAmount("");
      else setFromAmount("");
      return;
    }

    if (activeInput === "give" && fromAmount) {
      const num = parseFloat(fromAmount);
      if (!isNaN(num) && num > 0) setToAmount((num * rate).toFixed(2));
      else setToAmount("");
    } else if (activeInput === "receive" && toAmount) {
      const num = parseFloat(toAmount);
      if (!isNaN(num) && num > 0) setFromAmount((num / rate).toFixed(6));
      else setFromAmount("");
    }
  }, [rate, fromAmount, toAmount, activeInput]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    setActiveInput(activeInput === "give" ? "receive" : "give");
  };

  const handleSubmit = async () => {
    if (!fromAmount || !toAmount || !rate) {
      toast({
        title: "Ошибка",
        description: "Введите сумму обмена",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      toast({
        title: "Заявка создана",
        description: `${fromAmount} ${fromCurrency} → ${toAmount} ${toCurrency}`,
      });
      setFromAmount("1");
      setToAmount("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-10 bg-white text-[#001D8D] [color-scheme:light]">
      {/* Заголовок */}
      <h1 className="text-3xl font-bold mb-3 text-center">
        Конвертер и калькулятор криптовалют
      </h1>

      <p className="text-center text-[#001D8D]/70 mb-8">
        {fromCurrency} в {toCurrency}: 1 {fromCurrency} ≈{" "}
        {rate ? rate.toFixed(2) : "—"} {toCurrency}
        {lastUpdated && (
          <>{" "}по состоянию на {lastUpdated.toLocaleString("ru-RU", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "long" })}</>
        )}
      </p>

      {/* Основной калькулятор */}
      <div className="w-full max-w-3xl p-6 rounded-2xl bg-white shadow-[0_4px_30px_rgba(0,0,0,0.08)] border border-[#001D8D]/10 transition-all">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Отдаёте */}
          <div className="flex flex-1 border border-[#001D8D]/20 bg-white rounded-full px-5 py-3 items-center h-[60px]">
            <Input
              type="text"
              value={fromAmount}
              onChange={(e) => {
                setFromAmount(e.target.value);
                setActiveInput("give");
              }}
              className="flex-1 border-0 shadow-none focus-visible:ring-0 text-2xl font-medium text-[#001D8D] bg-transparent"
              placeholder="0"
              disabled={rateLoading}
            />
            <Select value={fromCurrency} onValueChange={setFromCurrency} disabled={basesLoading}>
              <SelectTrigger className="w-[100px] border-0 focus:ring-0 font-medium text-lg text-[#001D8D] bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#001D8D]/10 rounded-xl">
                {bases.map((currency) => (
                  <SelectItem
                    key={currency}
                    value={currency}
                    className="text-[#001D8D] hover:bg-[#001D8D]/5"
                  >
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Кнопка обмена */}
          <button
            onClick={swapCurrencies}
            disabled={rateLoading}
            className="p-3 rounded-full border border-[#001D8D]/20 bg-white hover:bg-[#001D8D]/10 transition disabled:opacity-50"
          >
            <ArrowLeftRight className="w-5 h-5 text-[#001D8D]" />
          </button>

          {/* Получаете */}
          <div className="flex flex-1 border border-[#001D8D]/20 bg-white rounded-full px-5 py-3 items-center h-[60px]">
            <Input
              type="text"
              value={toAmount}
              onChange={(e) => {
                setToAmount(e.target.value);
                setActiveInput("receive");
              }}
              className="flex-1 border-0 shadow-none focus-visible:ring-0 text-2xl font-medium text-[#001D8D] bg-transparent"
              placeholder="0"
              disabled={rateLoading}
            />
            <Select value={toCurrency} onValueChange={setToCurrency} disabled={quotesLoading}>
              <SelectTrigger className="w-[100px] border-0 focus:ring-0 font-medium text-lg text-[#001D8D] bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#001D8D]/10 rounded-xl">
                {quotes.map((currency) => (
                  <SelectItem
                    key={currency}
                    value={currency}
                    className="text-[#001D8D] hover:bg-[#001D8D]/5"
                  >
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Кнопка */}
        <Button
          onClick={handleSubmit}
          disabled={!rate || isSubmitting || rateLoading}
          className="mt-6 w-full h-14 text-lg bg-[#0052FF] hover:bg-[#0041cc] font-semibold rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Создание заявки..." : "Оставить заявку на обмен"}
        </Button>
      </div>
    </div>
  );
}