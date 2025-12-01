"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftRight, RefreshCw, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useBaseAssets, useQuoteAssets } from "@/hooks/useAssets";
import { getReadableRate } from "@/lib/currency-utils";

interface ConversionRate {
  rate: number;
  lastUpdated: Date;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
  icon?: string;
}

const currencies: Currency[] = [
  { code: "USDT", name: "Tether", symbol: "₮" },
  { code: "BTC", name: "Bitcoin", symbol: "₿" },
  { code: "ETH", name: "Ethereum", symbol: "Ξ" },
  { code: "RUB", name: "Российский рубль", symbol: "₽" },
  { code: "USD", name: "US Dollar", symbol: "$" },
];

export default function ProfessionalConverter() {
  const [fromCurrencyCode, setFromCurrencyCode] = useState<string>("USDT");
  const [toCurrencyCode, setToCurrencyCode] = useState<string>("RUB");
  const [fromAmount, setFromAmount] = useState<string>("100");
  const [toAmount, setToAmount] = useState<string>("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const { bases, loading: basesLoading } = useBaseAssets();
  const { quotes, loading: quotesLoading } = useQuoteAssets(fromCurrencyCode);
  const { rate, lastUpdated, loading: rateLoading, refetch } = useExchangeRate(fromCurrencyCode, toCurrencyCode);

  const fromCurrency = currencies.find(c => c.code === fromCurrencyCode) || currencies[0];
  const toCurrency = currencies.find(c => c.code === toCurrencyCode) || currencies[3];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const darkMode = document.documentElement.classList.contains("dark");
      setIsDark(darkMode);

      const observer = new MutationObserver(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    if (rate && rate > 0 && fromAmount) {
      const numAmount = parseFloat(fromAmount.replace(/,/g, ""));
      if (!isNaN(numAmount)) {
        const result = (numAmount * rate).toFixed(2);
        setToAmount(result);
      }
    }
  }, [rate, fromAmount]);

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      const tempCode = fromCurrencyCode;
      const tempAmount = fromAmount;
      setFromCurrencyCode(toCurrencyCode);
      setToCurrencyCode(tempCode);
      setFromAmount(toAmount);
      setToAmount(tempAmount);
      setIsSwapping(false);
    }, 300);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleAmountChange = (value: string) => {
    const sanitized = value.replace(/[^\d.,]/g, "");
    setFromAmount(sanitized);
  };

  const formatNumber = (num: string) => {
    return parseFloat(num).toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center py-20 px-4 overflow-hidden bg-gradient-to-br from-[#F8FBFF] via-[#EAF1FF] to-[#F8FBFF] dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A] transition-colors duration-500">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/20 dark:bg-blue-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-500/20 dark:bg-indigo-400/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0C1E5B] dark:text-white mb-4"
          >
             Сервис покупки и продажи криптовалюты
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl lg:text-3xl font-medium text-[#0A0F1C]/70 dark:text-white/70"
          >
            Конвертер и калькулятор криптовалют
          </motion.h2>
        </motion.div>

        {/* Converter Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-[#111827] rounded-3xl p-4 md:p-8 shadow-[0_0_40px_rgba(37,99,235,0.1)] dark:shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all duration-300 mx-auto max-w-3xl"
        >
          <div className="space-y-6">
            {/* From Currency Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="space-y-3"
            >
              <label className="text-sm font-semibold text-[#0A0F1C]/60 dark:text-white/60 uppercase tracking-wide">
                Отдаёте
              </label>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={fromAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="flex-1 text-3xl md:text-4xl font-bold text-[#0C1E5B] dark:text-white bg-[#F3F6FF] dark:bg-[#1E293B] rounded-2xl px-6 py-4 border-2 border-transparent focus:border-[#2563EB] focus:outline-none transition-all"
                  placeholder="0.00"
                />
                <select
                  value={fromCurrency.code}
                  onChange={(e) => setFromCurrencyCode(e.target.value)}
                  disabled={basesLoading}
                  className="text-xl font-semibold text-[#0C1E5B] dark:text-white bg-[#F3F6FF] dark:bg-[#1E293B] hover:bg-[#EAF1FF] dark:hover:bg-[#2D3B50] rounded-2xl px-6 py-4 border-2 border-transparent focus:border-[#2563EB] focus:outline-none transition-all cursor-pointer disabled:opacity-50"
                >
                  {bases.map((code) => {
                    const curr = currencies.find(c => c.code === code);
                    return (
                      <option key={code} value={code}>
                        {curr?.symbol || ''} {code}
                      </option>
                    );
                  })}
                </select>
              </div>
            </motion.div>

            {/* Swap Button */}
            <div className="flex justify-center -my-2">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                animate={{ rotate: isSwapping ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                onClick={handleSwap}
                className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-full shadow-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center justify-center transition-all"
              >
                <ArrowLeftRight className="w-6 h-6" />
              </motion.button>
            </div>

            {/* To Currency Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="space-y-3"
            >
              <label className="text-sm font-semibold text-[#0A0F1C]/60 dark:text-white/60 uppercase tracking-wide">
                Получаете
              </label>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 text-3xl md:text-4xl font-bold text-[#2563EB] bg-[#F3F6FF] dark:bg-[#1E293B] rounded-2xl px-6 py-4 border-2 border-[#2563EB]/20">
                  {formatNumber(toAmount)}
                </div>
                <select
                  value={toCurrency.code}
                  onChange={(e) => setToCurrencyCode(e.target.value)}
                  disabled={quotesLoading}
                  className="text-xl font-semibold text-[#0C1E5B] dark:text-white bg-[#F3F6FF] dark:bg-[#1E293B] hover:bg-[#EAF1FF] dark:hover:bg-[#2D3B50] rounded-2xl px-6 py-4 border-2 border-transparent focus:border-[#2563EB] focus:outline-none transition-all cursor-pointer disabled:opacity-50"
                >
                  {quotes.map((code) => {
                    const curr = currencies.find(c => c.code === code);
                    return (
                      <option key={code} value={code}>
                        {curr?.symbol || ''} {code}
                      </option>
                    );
                  })}
                </select>
              </div>
            </motion.div>

            {/* Exchange Rate Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="flex items-center justify-between pt-4 border-t border-[#0A0F1C]/10 dark:border-white/10"
            >
              <div className="flex items-center gap-2 text-sm text-[#0A0F1C]/60 dark:text-white/60">
                <TrendingUp className="w-4 h-4" />
                <span>
                  {rate && rate > 0 ? getReadableRate(fromCurrency.code, toCurrency.code, rate).description : '—'}
                  <span className="ml-2 text-xs">— {rateLoading ? 'Загрузка...' : 'Актуальный курс обмена'}</span>
                </span>
              </div>
              <motion.button
                whileHover={{ rotate: 180, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ rotate: rateLoading ? 360 : 0 }}
                transition={{ duration: 0.5 }}
                onClick={handleRefresh}
                disabled={rateLoading}
                className="p-2 hover:bg-[#F3F6FF] dark:hover:bg-[#1E293B] rounded-full transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 text-[#2563EB] ${rateLoading ? 'animate-spin' : ''}`} />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="text-center mt-8"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-300"
            >
              Оставить заявку
            </Button>
          </motion.div>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mt-12"
        >
          {[
            { icon: Zap, text: "Моментальный обмен" },
            { icon: Shield, text: "Безопасные транзакции" },
            { icon: TrendingUp, text: "Лучший курс" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 + index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-white/50 dark:bg-[#111827]/50 backdrop-blur-sm rounded-full px-6 py-3 shadow-md"
            >
              <feature.icon className="w-5 h-5 text-[#2563EB]" />
              <span className="text-sm font-medium text-[#0C1E5B] dark:text-white">
                {feature.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
