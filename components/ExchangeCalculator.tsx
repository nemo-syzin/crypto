"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useKenigRate } from '@/lib/hooks/rates';
import { useAssets } from '@/hooks/useAssets';
import { Calculator, RefreshCw, ArrowUpDown, AlertTriangle, Settings } from 'lucide-react';

type ExchangeDirection = 'usdt-to-rub' | 'rub-to-usdt';

export default function ExchangeCalculator() {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USDT');
  const [toCurrency, setToCurrency] = useState<string>('RUB');
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { rate, loading, error, lastUpdated, refetch } = useKenigRate();
  const { assets, loading: assetsLoading, error: assetsError } = useAssets();

  // Определяем направление обмена на основе выбранных валют
  const direction: ExchangeDirection = useMemo(() => {
    if (fromCurrency === 'USDT' && toCurrency === 'RUB') {
      return 'usdt-to-rub';
    } else if (fromCurrency === 'RUB' && toCurrency === 'USDT') {
      return 'rub-to-usdt';
    }
    // Для других пар валют используем USDT->RUB как базовое направление
    return 'usdt-to-rub';
  }, [fromCurrency, toCurrency]);

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
    
    if (direction === 'usdt-to-rub') {
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

  const formatRate = useMemo(() => (rateValue: number | null): string => {
    if (!rateValue || isNaN(rateValue)) return '—';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rateValue);
  }, []);

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty string, digits and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // Мемоизированные проверки и вычисления
  const hasValidRates = useMemo(() => rate && 
    typeof rate.sell === 'number' && !isNaN(rate.sell) && rate.sell > 0 &&
    typeof rate.buy === 'number' && !isNaN(rate.buy) && rate.buy > 0, [rate]);

  const isCalculationDisabled = !hasValidRates || loading || !!error;
  const numericAmount = parseAmount(amount);
  const result = calculateResult;

  // Мемоизированные функции отображения
  const getResultDisplay = useMemo((): string => {
    if (loading) return 'Загрузка курсов...';
    if (!hasValidRates) return 'Курсы обновляются...';
    if (amount === '' || numericAmount <= 0) return '';
    
    return formatCurrency(result, toCurrency);
  }, [loading, hasValidRates, amount, numericAmount, result, toCurrency, formatCurrency]);

  const getExchangeButtonText = useMemo((): string => {
    if (loading) return 'Загрузка курсов...';
    if (!hasValidRates) return 'Ожидание актуальных курсов...';
    if (amount === '' || numericAmount <= 0) return 'Введите сумму для обмена';
    
    const fromAmount = formatCurrency(numericAmount, fromCurrency);
    const toAmount = formatCurrency(result, toCurrency);
    
    return `Обменять ${fromAmount} → ${toAmount}`;
  }, [loading, hasValidRates, amount, numericAmount, fromCurrency, result, toCurrency, formatCurrency]);

  const getHintText = useMemo((): string => {
    if (!hasValidRates) {
      return `Введите количество ${fromCurrency} для обмена на ${toCurrency}`;
    }

    // Показываем курс только для USDT/RUB пары
    if ((fromCurrency === 'USDT' && toCurrency === 'RUB') || (fromCurrency === 'RUB' && toCurrency === 'USDT')) {
      const currentRate = direction === 'usdt-to-rub' ? rate.sell : rate.buy;
      const formattedRate = formatRate(currentRate);
      
      return direction === 'usdt-to-rub' 
        ? `Введите количество USDT для обмена на рубли по курсу ${formattedRate}`
        : `Введите количество рублей для покупки USDT по курсу ${formattedRate}`;
    }

    return `Введите количество ${fromCurrency} для обмена на ${toCurrency}`;
  }, [hasValidRates, fromCurrency, toCurrency, direction, rate, formatRate]);

  // Check if error is configuration related
  const isConfigurationError = (error || assetsError) && (
    (error && (error.includes('not configured') || error.includes('Invalid API key') || error.includes('environment variables'))) ||
    (assetsError && (assetsError.includes('not configured') || assetsError.includes('Invalid API key') || assetsError.includes('environment variables')))
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
            {error || assetsError}
            <br />
            <span className="text-sm mt-2 block">
              Проверьте файл .env.local и убедитесь, что указаны правильные значения для NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Other Errors Alert */}
      {(error || assetsError) && !isConfigurationError && (
        <div className="error-toast">
          <strong>Ошибка загрузки данных:</strong> {error || assetsError}
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

      {/* Rate Unavailable Alert */}
      {!hasValidRates && !loading && !isConfigurationError && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Обновление курсов...</strong>
            <br />
            Получаем актуальные курсы обмена из базы данных kenig_rates. Пожалуйста, подождите.
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
              disabled={assetsLoading}
            >
              <SelectTrigger className="input-field">
                <SelectValue placeholder="Выберите валюту" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
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
              disabled={assetsLoading}
            >
              <SelectTrigger className="input-field">
                <SelectValue placeholder="Выберите валюту" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
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

          {/* Current Rates Display - только для USDT/RUB */}
          {hasValidRates && ((fromCurrency === 'USDT' && toCurrency === 'RUB') || (fromCurrency === 'RUB' && toCurrency === 'USDT')) && (
            <div className="rates-container">
              <h4 className="font-semibold text-[#001D8D] mb-3">Текущие курсы KenigSwap</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-sm text-[#001D8D]/70 mb-1">Продажа USDT</div>
                  <div className="rate-value">{formatRate(rate.sell)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-[#001D8D]/70 mb-1">Покупка USDT</div>
                  <div className="rate-value">{formatRate(rate.buy)}</div>
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
        </CardContent>
      </div>
    </div>
  );
}