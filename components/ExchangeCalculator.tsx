"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { useBaseAssets, useQuoteAssets } from '@/hooks/useAssets';
import { useToast } from '@/hooks/use-toast';
import { ArrowUpDown, RefreshCw, Send, Loader2 } from 'lucide-react';

export default function ExchangeCalculator() {
  const { toast } = useToast();
  const [giveAmount, setGiveAmount] = useState<string>('1');
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [activeInput, setActiveInput] = useState<'give' | 'receive'>('give');
  const [fromCurrency, setFromCurrency] = useState<string>('USDT');
  const [toCurrency, setToCurrency] = useState<string>('RUB');
  
  // Get available currencies
  const { bases, loading: basesLoading } = useBaseAssets();
  const { quotes, loading: quotesLoading } = useQuoteAssets(fromCurrency);
  
  // Get exchange rate
  const { rate, source, loading, refreshing, error, lastUpdated, refetch } =
    useExchangeRate(fromCurrency, toCurrency);

  // Set initial toCurrency when quotes are loaded
  useEffect(() => {
    if (quotes.length > 0 && !toCurrency) {
      setToCurrency(quotes[0]);
    }
  }, [quotes, toCurrency]);

  // Set valid fromCurrency when bases are loaded
  useEffect(() => {
    if (bases.length > 0 && !bases.includes(fromCurrency)) {
      setFromCurrency(bases[0]);
      setToCurrency('');
    }
  }, [bases, fromCurrency]);

  // Calculate amounts based on active input and rate
  useEffect(() => {
    if (!rate || rate <= 0) {
      if (activeInput === 'give' && receiveAmount) {
        setReceiveAmount('');
      } else if (activeInput === 'receive' && giveAmount) {
        setGiveAmount('');
      }
      return;
    }

    if (activeInput === 'give' && giveAmount) {
      const giveNum = parseFloat(giveAmount);
      if (!isNaN(giveNum) && giveNum > 0) {
        const receiveNum = giveNum * rate;
        const formattedReceive = receiveNum < 1 ? receiveNum.toFixed(6) : receiveNum.toFixed(2);
        setReceiveAmount(formattedReceive);
      } else if (giveAmount === '') {
        setReceiveAmount('');
      }
    } else if (activeInput === 'receive' && receiveAmount) {
      const receiveNum = parseFloat(receiveAmount);
      if (!isNaN(receiveNum) && receiveNum > 0) {
        const giveNum = receiveNum / rate;
        const formattedGive = giveNum < 1 ? giveNum.toFixed(6) : giveNum.toFixed(2);
        setGiveAmount(formattedGive);
      } else if (receiveAmount === '') {
        setGiveAmount('');
      }
    }
  }, [rate, giveAmount, receiveAmount, activeInput]);

  const toggleDirection = () => {
    if (fromCurrency && toCurrency && !error) {
      const tempFrom = fromCurrency;
      setFromCurrency(toCurrency);
      setToCurrency(tempFrom);
      
      const tempGiveAmount = giveAmount;
      setGiveAmount(receiveAmount);
      setReceiveAmount(tempGiveAmount);
    }
  };

  const handleGiveAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setGiveAmount(value);
      setActiveInput('give');
    }
  };

  const handleReceiveAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setReceiveAmount(value);
      setActiveInput('receive');
    }
  };

  const handleFromCurrencyChange = (value: string) => {
    setFromCurrency(value);
    setToCurrency('');
  };

  const formatRate = (rateValue: number | null): string => {
    if (!rateValue || isNaN(rateValue)) return '—';
    
    if (toCurrency === 'RUB') {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(rateValue);
    } else {
      const decimals = rateValue < 1 ? 6 : rateValue < 100 ? 4 : 2;
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: decimals,
      }).format(rateValue) + ` ${toCurrency}`;
    }
  };

  const handleSubmitOrder = () => {
    if (!rate || !giveAmount || parseFloat(giveAmount) <= 0) {
      toast({
        title: "Ошибка",
        description: "Введите корректную сумму для обмена",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Заявка создана!",
      description: "Мы свяжемся с вами в ближайшее время.",
    });
  };

  const isButtonDisabled = !rate || !giveAmount || parseFloat(giveAmount) <= 0 || !toCurrency;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header with rate */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
          Обмен криптовалют
        </h1>
        
        {/* Current Rate Display */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <span>
            1 {fromCurrency} ≈ {formatRate(rate)}
          </span>
          {source && (
            <>
              <span>•</span>
              <span>{source}</span>
            </>
          )}
          {lastUpdated && (
            <>
              <span>•</span>
              <span>{lastUpdated.toLocaleTimeString('ru-RU')}</span>
            </>
          )}
          <button
            onClick={refetch}
            disabled={loading}
            className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading || refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Calculator Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="space-y-4">
          {/* Give Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Отдаете</label>
            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded-xl px-4 py-4 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <input
                  type="text"
                  value={giveAmount}
                  onChange={handleGiveAmountChange}
                  placeholder="0"
                  className="flex-1 text-2xl font-semibold bg-transparent outline-none text-gray-900 placeholder-gray-400"
                  disabled={!rate}
                />
                <div className="ml-4">
                  <Select 
                    value={bases.includes(fromCurrency) ? fromCurrency : undefined}
                    onValueChange={handleFromCurrencyChange}
                    disabled={basesLoading}
                  >
                    <SelectTrigger className="w-24 border-0 shadow-none text-lg font-semibold text-gray-900 hover:bg-gray-50 rounded-lg">
                      <SelectValue placeholder="Валюта" />
                    </SelectTrigger>
                    <SelectContent>
                      {bases.map((base) => (
                        <SelectItem key={base} value={base} className="text-lg">
                          {base}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={toggleDirection}
              disabled={!fromCurrency || !toCurrency || !!error}
              className="p-3 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUpDown className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Receive Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Получаете</label>
            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded-xl px-4 py-4 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <input
                  type="text"
                  value={receiveAmount}
                  onChange={handleReceiveAmountChange}
                  placeholder="0"
                  className="flex-1 text-2xl font-semibold bg-transparent outline-none text-gray-900 placeholder-gray-400"
                  disabled={!rate}
                />
                <div className="ml-4">
                  <Select 
                    value={quotes.includes(toCurrency) ? toCurrency : undefined}
                    onValueChange={setToCurrency}
                    disabled={quotesLoading || !fromCurrency}
                  >
                    <SelectTrigger className="w-24 border-0 shadow-none text-lg font-semibold text-gray-900 hover:bg-gray-50 rounded-lg">
                      <SelectValue placeholder="Валюта" />
                    </SelectTrigger>
                    <SelectContent>
                      {quotes.map((quote) => (
                        <SelectItem key={quote} value={quote} className="text-lg">
                          {quote}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && !rate && (
        <div className="mb-6 flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Загрузка курсов...</span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmitOrder}
        disabled={isButtonDisabled}
        size="lg"
        className="w-full py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="h-5 w-5 mr-2" />
        Оставить заявку на обмен
      </Button>

      {/* Additional Info */}
      {rate && giveAmount && parseFloat(giveAmount) > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Курс действителен в течение 15 минут
        </div>
      )}
    </div>
  );
}