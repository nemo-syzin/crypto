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

  // Safe rate display helper
  const displayRate = (rateValue: number | null): string => {
    return (typeof rateValue === 'number' && !isNaN(rateValue)) ? rateValue.toFixed(2) : '—';
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
        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
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
          </AlertDescription>
        </Alert>
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
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-[#001D8D]" />
              Калькулятор обмена KenigSwap
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={loading}
              className="text-[#001D8D] border-[#001D8D]/20 hover:bg-[#001D8D]/5"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              {direction === 'usdt-to-rub' ? 'Сумма USDT' : 'Сумма RUB'}
            </Label>
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder={direction === 'usdt-to-rub' ? 'Введите сумму USDT' : 'Введите сумму RUB'}
              className="text-lg"
              disabled={isCalculationDisabled}
            />
          </div>

          {/* Direction Toggle */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={toggleDirection}
              disabled={isCalculationDisabled}
              className="bg-[#001D8D]/10 border-[#001D8D]/20 hover:bg-[#001D8D]/20 text-[#001D8D] disabled:opacity-50"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {direction === 'usdt-to-rub' ? 'USDT → RUB' : 'RUB → USDT'}
            </Button>
          </div>

          {/* Result */}
          <div className="space-y-2">
            <Label htmlFor="result">
              {direction === 'usdt-to-rub' ? 'Получите RUB' : 'Получите USDT'}
            </Label>
            <Input
              id="result"
              type="text"
              value={getResultDisplay()}
              readOnly
              placeholder={amount === '' ? 'Результат появится здесь' : ''}
              className={`text-lg font-semibold ${
                !hasValidRates ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-[#001D8D]'
              }`}
            />
          </div>

          {/* Rate Information */}
          {rate && !loading && !error && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold text-gray-900">Текущие курсы KenigSwap:</h4>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Продажа USDT:</span>
                  <span className="font-medium text-[#001D8D]">{displayRate(rate.sell)} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Покупка USDT:</span>
                  <span className="font-medium text-[#001D8D]">{displayRate(rate.buy)} ₽</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 border-t pt-2">
                Курс используется: {direction === 'usdt-to-rub' 
                  ? `${displayRate(rate.sell)} ₽ (продажа)` 
                  : `${displayRate(rate.buy)} ₽ (покупка)`}
                {lastUpdated && (
                  <span className="block mt-1">
                    Обновлено: {lastUpdated.toLocaleTimeString('ru-RU')}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-[#001D8D]">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Загрузка курсов из Supabase...</span>
              </div>
            </div>
          )}

          {/* Exchange Button */}
          <Button 
            className="w-full bg-[#001D8D] hover:bg-[#001D8D]/90 text-white py-3 disabled:opacity-50"
            disabled={isCalculationDisabled || amount === '' || numericAmount <= 0}
          >
            {getExchangeButtonText()}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}