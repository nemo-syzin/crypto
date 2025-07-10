"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { useBaseAssets, useQuoteAssets } from '@/hooks/useAssets';
import { Calculator, RefreshCw, ArrowUpDown, AlertTriangle, Settings, Info } from 'lucide-react';

export default function ExchangeCalculator() {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USDT');
  const [toCurrency, setToCurrency] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Get available base currencies
  const { bases, loading: basesLoading, error: basesError } = useBaseAssets();
  
  // Get available quote currencies for selected base
  const { quotes, loading: quotesLoading, error: quotesError } = useQuoteAssets(fromCurrency);
  
  // Set initial toCurrency when quotes are loaded
  useEffect(() => {
    if (quotes.length > 0 && !toCurrency) {
      setToCurrency(quotes[0]);
    }
  }, [quotes, toCurrency]);
  
  // Use exchange rate hook
  const { rate, loading, error, lastUpdated, refetch } = useExchangeRate(fromCurrency, toCurrency);

  // Memoized functions to prevent unnecessary rerenders
  const parseAmount = useMemo(() => (value: string): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }, []);

  const calculateResult = useMemo(() => (): number => {
    const numericAmount = parseAmount(amount);
    if (rate === 0 || numericAmount <= 0) return 0;
    return numericAmount * rate;
  }, [amount, rate, parseAmount]);

  const toggleDirection = () => {
    // Only toggle if both currencies are selected and they're a valid pair
    if (fromCurrency && toCurrency && !error) {
      // Swap currencies
      const tempFrom = fromCurrency;
      setFromCurrency(toCurrency);
      setToCurrency(tempFrom);
      
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 150);
    }
  };

  // Memoized formatting functions
  const formatCurrency = useMemo(() => (value: number, currency: string): string => {
    if (value === 0) return '';
    
    if (currency === 'RUB') {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } else {
      // For cryptocurrencies use different decimal places based on value
      const decimals = value < 1 ? 6 : value < 100 ? 4 : 2;
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: decimals,
      }).format(value) + ` ${currency}`;
    }
  }, []);

  const formatRate = useMemo(() => (rateValue: number | null, currency: string = 'RUB'): string => {
    if (!rateValue || isNaN(rateValue)) return '—';
    
    if (currency === 'RUB') {
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
      }).format(rateValue) + ` ${currency}`;
    }
  }, []);

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty string, digits and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // Handle from currency change
  const handleFromCurrencyChange = (value: string) => {
    setFromCurrency(value);
    // Reset toCurrency when base currency changes
    setToCurrency('');
  };

  // Check if configuration error
  const isConfigurationError = error && (
    error.includes('not configured') || 
    error.includes('Invalid API key') || 
    error.includes('environment variables')
  );

  // Memoized calculations
  const isPairSupported = useMemo(() => {
    return rate !== 0 || (fromCurrency === toCurrency);
  }, [rate, fromCurrency, toCurrency]);

  const hasValidRate = useMemo(() => rate > 0, [rate]);

  const isCalculationDisabled = !hasValidRate || loading || !!error;
  const numericAmount = parseAmount(amount);
  const result = calculateResult();

  // Memoized display functions
  const getResultDisplay = useMemo((): string => {
    if (loading) return 'Загрузка курсов...';
    if (!isPairSupported) return 'Данная валютная пара не поддерживается';
    if (!hasValidRate) return 'Курсы недоступны';
    if (amount === '' || numericAmount <= 0) return '';
    
    return formatCurrency(result, toCurrency);
  }, [loading, isPairSupported, hasValidRate, amount, numericAmount, result, toCurrency, formatCurrency]);

  const getExchangeButtonText = useMemo((): string => {
    if (basesLoading || quotesLoading) return 'Загрузка валют...';
    if (loading) return 'Загрузка курсов...';
    if (!toCurrency) return 'Выберите валюту получения';
    if (!isPairSupported) return 'Выберите поддерживаемую валютную пару';
    if (!hasValidRate) return 'Ожидание актуальных курсов...';
    if (amount === '' || numericAmount <= 0) return 'Введите сумму для обмена';
    
    const fromAmount = formatCurrency(numericAmount, fromCurrency);
    const toAmount = formatCurrency(result, toCurrency);
    
    return `Обменять ${fromAmount} → ${toAmount}`;
  }, [basesLoading, quotesLoading, loading, isPairSupported, hasValidRate, amount, numericAmount, fromCurrency, toCurrency, result, formatCurrency]);

  const getHintText = useMemo((): string => {
    if (basesError) {
      return `Ошибка загрузки валют: ${basesError}`;
    }
    
    if (quotesError) {
      return `Ошибка загрузки валют для ${fromCurrency}: ${quotesError}`;
    }
    
    // If currencies are the same
    if (fromCurrency === toCurrency && toCurrency) {
      return `Выберите разные валюты для обмена`;
    }

    if (!toCurrency) {
      return `Выберите валюту получения`;
    }

    if (!isPairSupported) {
      return `Валютная пара ${fromCurrency}/${toCurrency} не поддерживается. Попробуйте другую пару.`;
    }

    if (!hasValidRate && rate === 0 && !loading) {
      return `Курс для пары ${fromCurrency}/${toCurrency} не найден. Попробуйте другую пару.`;
    }

    // Show rate for supported pair
    if (rate) {
      const formattedRate = formatRate(rate, toCurrency);
      return `Курс обмена ${fromCurrency}/${toCurrency}: ${formattedRate}`;
    }

    return `Введите количество ${fromCurrency} для обмена на ${toCurrency}`;
  }, [basesError, quotesError, isPairSupported, hasValidRate, rate, loading, fromCurrency, toCurrency, formatRate]);

  return (
    <div className="space-y-6">
      {/* Configuration Error Alert */}
      {isConfigurationError && (
        <Alert className="bg-orange-50 border-orange-200">
          <Settings className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Требуется настройка:</strong>
            <br />
            {error}
            <br />
            <span className="text-sm mt-2 block">
              Проверьте файл .env.local и убедитесь, что указаны правильные значения для NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY
            </span>
          </AlertDescription>
        </Alert>
      )}
      {hasValidRate && rate > 0 && (
      {/* Other Errors Alert */}
      {error && !isConfigurationError && (
        <div className="error-toast">
          <strong>Ошибка загрузки курсов:</strong> {error}
          <br />
              <div className="rate-value">{formatRate(rate, toCurrency)}</div>
            variant="outline" 
            size="sm" 
            onClick={refetch}
            className="mt-2 text-red-800 border-red-300 hover:bg-red-100"
              Обновлено: {lastUpdated ? lastUpdated.toLocaleString('ru-RU') : 'Недавно'}
            Повторить загрузку
          </Button>
        </div>
      )}

      {/* Main Calculator */}
      <div className="calculator-container">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <span className="text-[#001D8D] text-xl font-bold">
                Калькулятор обмена KenigSwap
              </span>
            </span>
            <button
              onClick={refetch}
              disabled={loading}
              className="refresh-button"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {lastUpdated && (
                <span className="timestamp">
                  {lastUpdated.toLocaleTimeString('ru-RU')}
                </span>
              )}
            </button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* From Currency Selection */}
          <div className="space-y-3">
            <Label htmlFor="fromCurrency" className="text-[#001D8D] font-semibold text-base">
              Отдаете
            </Label>
            <Select 
              value={fromCurrency} 
              onValueChange={handleFromCurrencyChange}
              disabled={basesLoading}
            >
              <SelectTrigger className="input-field">
                <SelectValue placeholder="Выберите валюту обмена" />
              </SelectTrigger>
              <SelectContent>
                {bases.map((base) => (
                  <SelectItem key={base} value={base}>
                    {base}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-[#001D8D] font-semibold text-base">
              Сумма {fromCurrency}
            </Label>
            <input
              id="amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder={`100 ${fromCurrency}`}
              disabled={isCalculationDisabled || basesLoading || quotesLoading}
              className={`input-field ${error ? 'border-red-300' : ''}`}
            />
            <div className="hint-text">
              {getHintText}
            </div>
          </div>

          {/* Direction Toggle */}
          <div className="flex justify-center">
            <button
              onClick={toggleDirection}
              disabled={isCalculationDisabled || basesLoading || quotesLoading || !toCurrency}
              className="swap-button"
            >
              <ArrowUpDown className="h-5 w-5 text-blue-600" />
            </button>
          </div>

          {/* To Currency Selection */}
          <div className="space-y-3">
            <Label htmlFor="toCurrency" className="text-[#001D8D] font-semibold text-base">
              Получаете
            </Label>
            <Select 
              value={toCurrency} 
              onValueChange={setToCurrency}
              disabled={quotesLoading || !fromCurrency}
            >
              <SelectTrigger className="input-field">
                <SelectValue placeholder="Выберите валюту получения" />
              </SelectTrigger>
              <SelectContent>
                {quotes.map((quote) => (
                  <SelectItem key={quote} value={quote}>
                    {quote}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Result */}
          <div className="space-y-3">
            <Label htmlFor="result" className="text-[#001D8D] font-semibold text-base">
              Получите {toCurrency || ''}
            </Label>
            <div className={`input-field bg-gray-50 ${isAnimating ? 'result-animation' : ''}`}>
              <div className="text-[#001D8D] font-semibold">
                {getResultDisplay || (amount === '' ? 'Результат появится здесь' : '')}
              </div>
            </div>
            <div className="hint-text">
              Итоговая сумма к получению без скрытых комиссий
            </div>
          </div>

          {/* Loading State */}
          {loading && !rate && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 text-[#001D8D]">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span className="font-medium">Загрузка актуальных курсов...</span>
              </div>
            </div>
          )}

          {/* Current Rate Display */}
          {hasValidRate && rate && (
            <div className="rates-container">
              <h4 className="font-semibold text-[#001D8D] mb-3">Текущий курс {fromCurrency}/{toCurrency}</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="text-center">
                  <div className="text-sm text-[#001D8D]/70 mb-1">Курс обмена</div>
                  <div className="rate-value">{formatRate(rate.sell, toCurrency)}</div>
                </div>
              </div>
              <div className="text-center mt-3">
                <div className="text-xs text-[#001D8D]/50">
                  Обновлено: {new Date(rate.updated_at).toLocaleString('ru-RU')}
                </div>
              </div>
            </div>
          )}

          {/* Exchange Button */}
          <button 
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
              isCalculationDisabled || amount === '' || numericAmount <= 0 || !toCurrency
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#001D8D] to-blue-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
            }`}
            disabled={isCalculationDisabled || amount === '' || numericAmount <= 0 || !toCurrency}
          >
            {getExchangeButtonText}
          </button>

          {/* Info about available pairs */}
          <div className="border-t border-gray-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 px-6 py-4 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Info className="h-4 w-4 text-[#001D8D]/70" />
              </div>
              <div className="text-sm text-[#001D8D]/80 leading-relaxed">
                <strong className="text-[#001D8D]">Доступные валютные пары:</strong> поддерживаются обмены между различными криптовалютами и фиатными валютами. Курсы обновляются каждые 30 секунд из базы данных kenig_rates.
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
}