"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function CoinbaseStyleCalculator() {
  const [fromAmount, setFromAmount] = useState("1");
  const [toAmount, setToAmount] = useState("82.82");
  const [fromCurrency, setFromCurrency] = useState("USDT");
  const [toCurrency, setToCurrency] = useState("RUB");

  // Список валют (можешь заменить на useBaseAssets/useQuoteAssets)
  const currencies = ["USDT", "BTC", "ETH", "RUB", "ADA"];

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <div className="w-full flex flex-col items-center py-10">
      {/* Заголовок */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Обмен криптовалют
      </h2>

      {/* Курс (сверху под заголовком) */}
      <p className="text-gray-500 text-sm mb-6">
        1 {fromCurrency} ≈ {toAmount} {toCurrency}
      </p>

      {/* Основной контейнер */}
      <div className="flex items-center gap-4 w-full max-w-2xl">
        {/* Левая часть */}
        <div className="flex flex-1 border border-gray-300 rounded-lg px-4 py-3 items-center">
          <Input
            type="text"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            className="flex-1 border-0 shadow-none focus-visible:ring-0 text-lg font-medium"
          />
          <Select value={fromCurrency} onValueChange={setFromCurrency}>
            <SelectTrigger className="w-[120px] border-0 focus:ring-0 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((cur) => (
                <SelectItem key={cur} value={cur}>
                  {cur}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Кнопка swap */}
        <button
          onClick={swapCurrencies}
          className="p-3 rounded-full border border-gray-300 hover:bg-gray-50 transition"
        >
          <ArrowLeftRight className="w-5 h-5 text-gray-600" />
        </button>

        {/* Правая часть */}
        <div className="flex flex-1 border border-gray-300 rounded-lg px-4 py-3 items-center">
          <Input
            type="text"
            value={toAmount}
            onChange={(e) => setToAmount(e.target.value)}
            className="flex-1 border-0 shadow-none focus-visible:ring-0 text-lg font-medium"
          />
          <Select value={toCurrency} onValueChange={setToCurrency}>
            <SelectTrigger className="w-[120px] border-0 focus:ring-0 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((cur) => (
                <SelectItem key={cur} value={cur}>
                  {cur}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Кнопка */}
      <Button className="mt-8 w-full max-w-2xl h-12 text-lg bg-blue-600 hover:bg-blue-700">
        Оставить заявку на обмен
      </Button>
    </div>
  );
}