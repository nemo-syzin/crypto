"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useKenigRate } from '@/lib/hooks/rates';
import { Calculator, RefreshCw, ArrowUpDown, AlertTriangle, Settings } from 'lucide-react';

type ExchangeDirection = 'usdt-to-rub' | 'rub-to-usdt';

export default function ExchangeCalculator() {
  const [amount, setAmount] = useState<string>('');
  const [direction, setDirection] = useState<ExchangeDirection>('usdt-to-rub');
  const [isAnimating, setIsAnimating] = useState(false);
  const { rate, loading, error, lastUpdated, refetch } = useKenigRate();

  // Function to safely parse number
  const parseAmount = (value: string): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const calculateResult = (): number => {
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
  };

  const toggleDirection = () => {
    setDirection(prev => prev === 'usdt-to-rub' ? 'rub-to-usdt' : 'usdt-to-rub');
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 150);
  };

  const formatCurrency = (value: number, currency: 'USDT' | 'RUB'): string => {
    if (value === 0) return '';
    
    if (currency === 'RUB') {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } else {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(value) + ' USDT';
    }
  };

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty string, digits and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // Check if rates are available and valid
  const hasValidRates = rate && 
    typeof rate.sell === 'number' && !isNaN(rate.sell) && rate.sell > 0 &&
    typeof rate.buy === 'number' && !isNaN(rate.buy) && rate.buy > 0;

  const isCalculationDisabled = !hasValidRates || loading || !!error;
  const numericAmount = parseAmount(amount);
  const result = calculateResult();

  // Function to display result
  const getResultDisplay = (): string => {
    if (loading) return 'Загрузка...';
    if (!hasValidRates) return 'Курсы ещё загружаются…';
    if (amount === '' || numericAmount <= 0) return '';
    
    return formatCurrency(result, direction === 'usdt-to-rub' ? 'RUB' : 'USDT');
  };

  // Function to display exchange button text
  const getExchangeButtonText = (): string => {
    if (loading) return 'Загрузка...';
    if (!hasValidRates) return 'Курсы ещё загружаются…';
    if (amount === '' || numericAmount <= 0) return 'Введите сумму для обмена';
    
    const fromCurrency = direction === 'usdt-to-rub' ? 'USDT' : 'RUB';
    const toCurrency = direction === 'usdt-to-rub' ? 'RUB' : 'USDT';
    const fromAmount = direction === 'usdt-to-rub' 
      ? `${numericAmount} USDT` 
      : formatCurrency(numericAmount, 'RUB');
    const toAmount = formatCurrency(result, toCurrency);
    
    return `Обменять ${fromAmount} → ${toAmount}`;
  };

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

      {/* Rate Unavailable Alert */}
      {!hasValidRates && !loading && !isConfigurationError && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Курсы ещё загружаются…</strong>
            <br />
            Пожалуйста, подождите, пока курсы обмена загрузятся из базы данных.
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
          {/* Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-[#001D8D] font-semibold text-base">
              {direction === 'usdt-to-rub' ? 'Сумма USDT' : 'Сумма RUB'}
            </Label>
            <input
              id="amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder={direction === 'usdt-to-rub' ? '100 USDT' : '9500 RUB'}
              disabled={isCalculationDisabled}
              className={`input-field ${error ? 'border-red-300' : ''}`}
            />
            <div className="hint-text">
              {direction === 'usdt-to-rub' 
                ? 'Введите количество USDT для обмена на рубли' 
                : 'Введите количество рублей для покупки USDT'
              }
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

          {/* Result */}
          <div className="space-y-3">
            <Label htmlFor="result" className="text-[#001D8D] font-semibold text-base">
              {direction === 'usdt-to-rub' ? 'Получите RUB' : 'Получите USDT'}
            </Label>
            <div className={`input-field bg-gray-50 ${isAnimating ? 'result-animation' : ''}`}>
              <div className="text-[#001D8D] font-semibold">
                {getResultDisplay() || (amount === '' ? 'Результат появится здесь' : '')}
              </div>
            </div>
            <div className="hint-text">
              Итоговая сумма к получению без скрытых комиссий
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 text-[#001D8D]">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span className="font-medium">Загрузка курсов из Supabase...</span>
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
            {getExchangeButtonText()}
          </button>
        </CardContent>
      </div>
    </div>
  );
}