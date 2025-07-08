"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useKenigRate } from '@/lib/hooks/rates';
import { Calculator, RefreshCw, ArrowUpDown, AlertTriangle, Settings, Info } from 'lucide-react';

export default function ExchangeCalculator() {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USDT');
  const [toCurrency, setToCurrency] = useState<string>('RUB');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Используем тот же хук, что и в компоненте сравнения курсов
  const { rate, loading, error, lastUpdated, refetch } = useKenigRate();

  // Определяем направление обмена на основе выбранных валют
  const direction = useMemo(() => {
    if (fromCurrency === 'USDT' && toCurrency === 'RUB') {
      return 'sell'; // Продаем USDT за RUB
    } else if (fromCurrency === 'RUB' && toCurrency === 'USDT') {
      return 'buy'; // Покупаем USDT за RUB
    }
    // Для других пар используем sell как базовое направление
    return 'sell';
  }, [fromCurrency, toCurrency]);

  // Доступные валюты (только те, для которых есть курсы)
  const availableAssets = ['USDT', 'RUB'];

  // Мемоизированные функции для предотвращения лишних ререндеров
  const parseAmount = useMemo(() => (value: string): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }, []);

  const calculateResult = useMemo((): number => {
    const numericAmount = parseAmount(amount);
    if (!rate || numericAmount <= 0) return 0;
    
    // Check if rates are valid numbers
    const sellRate = typeof rate.sell === 'number' && !isNaN(rate.sell) ? rate.sell : null;
    const buyRate = typeof rate.buy === 'number' && !isNaN(rate.buy) ? rate.buy : null;
    
    if (direction === 'sell') {
      return sellRate ? numericAmount * sellRate : 0;
    } else {
      return buyRate ? numericAmount / buyRate : 0;
    }
  }, [amount, rate, direction, parseAmount]);

  const toggleDirection = () => {
    // Меняем местами валюты
    const tempFrom = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempFrom);
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 150);
  };

  // Мемоизированные функции форматирования
  const formatCurrency = useMemo(() => (value: number, currency: string): string => {
    if (value === 0) return '';
    
    if (currency === 'RUB') {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } else if (currency === 'USDT') {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(value) + ' USDT';
    } else {
      // Для других валют используем общий формат
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
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
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
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

  // Проверяем поддержку валютной пары
  const isPairSupported = useMemo(() => {
    return (fromCurrency === 'USDT' && toCurrency === 'RUB') || 
           (fromCurrency === 'RUB' && toCurrency === 'USDT');
  }, [fromCurrency, toCurrency]);

  // Мемоизированные проверки и вычисления
  const hasValidRates = useMemo(() => rate && 
    typeof rate.sell === 'number' && !isNaN(rate.sell) && rate.sell > 0 &&
    typeof rate.buy === 'number' && !isNaN(rate.buy) && rate.buy > 0 &&
    isPairSupported, [rate, isPairSupported]);

  const isCalculationDisabled = !hasValidRates || loading || !!error;
  const numericAmount = parseAmount(amount);
  const result = calculateResult;

  // Мемоизированные функции отображения
  const getResultDisplay = useMemo((): string => {
    if (loading) return 'Загрузка курсов...';
    if (!isPairSupported) return 'Данная валютная пара не поддерживается';
    if (!hasValidRates) return 'Курсы недоступны';
    if (amount === '' || numericAmount <= 0) return '';
    
    return formatCurrency(result, toCurrency);
  }, [loading, isPairSupported, hasValidRates, amount, numericAmount, result, toCurrency, formatCurrency]);

  const getExchangeButtonText = useMemo((): string => {
    if (loading) return 'Загрузка курсов...';
    if (!isPairSupported) return 'Выберите поддерживаемую валютную пару';
    if (!hasValidRates) return 'Ожидание актуальных курсов...';
    if (amount === '' || numericAmount <= 0) return 'Введите сумму для обмена';
    
    const fromAmount = formatCurrency(numericAmount, fromCurrency);
    const toAmount = formatCurrency(result, toCurrency);
    
    return `Обменять ${fromAmount} → ${toAmount}`;
  }, [loading, isPairSupported, hasValidRates, amount, numericAmount, fromCurrency, result, toCurrency, formatCurrency]);

  const getHintText = useMemo((): string => {
    if (!isPairSupported) {
      return `Валютная пара ${fromCurrency}/${toCurrency} не поддерживается. Доступны только USDT/RUB и RUB/USDT`;
    }

    if (!hasValidRates) {
      return direction === 'sell' 
        ? 'Введите количество USDT для обмена на рубли' 
        : 'Введите количество рублей для покупки USDT';
    }

    // Показываем курс для поддерживаемой пары
    if (rate) {
      const currentRate = direction === 'sell' ? rate.sell : rate.buy;
      const formattedRate = formatRate(currentRate, 'RUB');
      
      return direction === 'sell' 
        ? `Курс продажи USDT: ${formattedRate}`
        : `Курс покупки USDT: ${formattedRate}`;
    }

    return `Введите количество ${fromCurrency} для обмена на ${toCurrency}`;
  }, [isPairSupported, hasValidRates, fromCurrency, toCurrency, direction, rate, formatRate]);

  // Check if error is configuration related
  const isConfigurationError = error && (
    error.includes('not configured') || 
    error.includes('Invalid API key') || 
    error.includes('environment variables')
  );

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

      {/* Other Errors Alert */}
      {error && !isConfigurationError && (
        <div className="error-toast">
          <strong>Ошибка загрузки курсов:</strong> {error}
          <br />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refetch}
            className="mt-2 text-red-800 border-red-300 hover:bg-red-100"
          >
            Попробовать снова
          </Button>
        </div>
      )}

      {/* Unsupported Pair Alert */}
      {!isPairSupported && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Валютная пара не поддерживается</strong>
            <br />
            В настоящее время поддерживаются только обмены между USDT и RUB. Выберите одну из доступных валютных пар.
          </AlertDescription>
        </Alert>
      )}

      {/* Rate Unavailable Alert */}
      {isPairSupported && !hasValidRates && !loading && !isConfigurationError && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Обновление курсов...</strong>
            <br />
            Получаем актуальные курсы обмена из базы данных. Пожалуйста, подождите.
          </AlertDescription>
        </Alert>
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
              onValueChange={setFromCurrency}
            >
              <SelectTrigger className="input-field">
                <SelectValue placeholder="Выберите валюту обмена" />
              </SelectTrigger>
              <SelectContent>
                {availableAssets.map((asset) => (
                  <SelectItem key={asset} value={asset}>
                    {asset}
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
              disabled={isCalculationDisabled}
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
              disabled={isCalculationDisabled}
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
            >
              <SelectTrigger className="input-field">
                <SelectValue placeholder="Выберите валюту обмена" />
              </SelectTrigger>
              <SelectContent>
                {availableAssets.map((asset) => (
                  <SelectItem key={asset} value={asset}>
                    {asset}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Result */}
          <div className="space-y-3">
            <Label htmlFor="result" className="text-[#001D8D] font-semibold text-base">
              Получите {toCurrency}
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

          {/* Current Rates Display */}
          {hasValidRates && rate && (
            <div className="rates-container">
              <h4 className="font-semibold text-[#001D8D] mb-3">Текущие курсы KenigSwap</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-sm text-[#001D8D]/70 mb-1">Продажа USDT</div>
                  <div className="rate-value">{formatRate(rate.sell, 'RUB')}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-[#001D8D]/70 mb-1">Покупка USDT</div>
                  <div className="rate-value">{formatRate(rate.buy, 'RUB')}</div>
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
              isCalculationDisabled || amount === '' || numericAmount <= 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#001D8D] to-blue-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
            }`}
            disabled={isCalculationDisabled || amount === '' || numericAmount <= 0}
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
                <strong className="text-[#001D8D]">Доступные валютные пары:</strong> в настоящее время поддерживаются обмены USDT ⟷ RUB. Курсы обновляются каждые 30 секунд из базы данных exchange_rates.
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
}