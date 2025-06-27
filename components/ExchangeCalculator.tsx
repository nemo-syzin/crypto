"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useKenigRate } from '@/lib/hooks/rates';
import { Calculator, RefreshCw, ArrowUpDown, AlertTriangle, Settings, ArrowLeftRight } from 'lucide-react';

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

  // Format number with thousands separator
  const formatWithThousands = (value: string): string => {
    if (!value) return '';
    const number = parseFloat(value.replace(/[^\d.]/g, ''));
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('ru-RU').format(number);
  };

  // Handle amount change with thousands formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, ''); // Only digits and decimal point
    
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

      {/* Main Calculator - Двойная карточка */}
      <div className="relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calculator className="h-6 w-6 text-[#001D8D]" />
            <h2 className="text-2xl font-bold text-[#001D8D]">Калькулятор обмена KenigSwap</h2>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={loading}
              className="text-[#001D8D] border-[#001D8D]/20 hover:bg-[#001D8D]/5"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Обновить курсы
            </Button>
            {lastUpdated && (
              <span className="text-sm text-[#001D8D]/70">
                Обновлено: {lastUpdated.toLocaleTimeString('ru-RU')}
              </span>
            )}
          </div>
        </div>

        {/* Двойная карточка */}
        <div className="relative flex flex-col lg:flex-row gap-6 items-center">
          
          {/* Карточка "Отдаю" */}
          <div className="flex-1 w-full">
            <Card className="glass border border-[#E0E7FF] shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              {/* Градиентная тень для акцентной суммы */}
              {amount && numericAmount > 0 && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#001D8D]/5 to-blue-500/5 opacity-50" />
              )}
              
              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-lg font-semibold text-[#001D8D] flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-[#001D8D] to-blue-600 rounded-full" />
                  Отдаю
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  <div>
                    <Label className="text-[#001D8D]/70 font-medium">
                      {direction === 'usdt-to-rub' ? 'Сумма USDT' : 'Сумма RUB'}
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        type="text"
                        value={amount ? formatWithThousands(amount) : ''}
                        onChange={handleAmountChange}
                        placeholder={direction === 'usdt-to-rub' ? '1 000 USDT' : '95 000 ₽'}
                        className="text-2xl font-bold h-16 border-2 border-[#001D8D]/20 focus:border-[#001D8D] bg-white/80 backdrop-blur-sm"
                        disabled={isCalculationDisabled}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <span className="text-lg font-semibold text-[#001D8D]/70">
                          {direction === 'usdt-to-rub' ? 'USDT' : '₽'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Курс */}
                  {hasValidRates && (
                    <div className="text-sm text-[#001D8D]/60">
                      Курс: {direction === 'usdt-to-rub' 
                        ? `1 USDT = ${displayRate(rate.sell)} ₽` 
                        : `1 USDT = ${displayRate(rate.buy)} ₽`}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Круглая кнопка-стрелка для смены направления */}
          <div className="relative z-20 flex-shrink-0">
            <Button
              onClick={toggleDirection}
              disabled={isCalculationDisabled}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-[#001D8D] to-blue-600 hover:from-[#001D8D]/90 hover:to-blue-600/90 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 disabled:opacity-50"
            >
              <ArrowLeftRight className="h-6 w-6" />
            </Button>
            
            {/* Индикатор направления */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-[#001D8D]/60 whitespace-nowrap">
              {direction === 'usdt-to-rub' ? 'USDT → RUB' : 'RUB → USDT'}
            </div>
          </div>

          {/* Карточка "Получаю" */}
          <div className="flex-1 w-full">
            <Card className="glass border border-[#E0E7FF] shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              {/* Градиентная тень для результата */}
              {result > 0 && (
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-50" />
              )}
              
              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-lg font-semibold text-[#001D8D] flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                  Получаю
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  <div>
                    <Label className="text-[#001D8D]/70 font-medium">
                      {direction === 'usdt-to-rub' ? 'Получите RUB' : 'Получите USDT'}
                    </Label>
                    <div className="relative mt-2">
                      <div className={`h-16 flex items-center px-4 rounded-md border-2 text-2xl font-bold ${
                        !hasValidRates 
                          ? 'bg-yellow-50 border-yellow-200 text-yellow-600' 
                          : result > 0 
                          ? 'bg-green-50 border-green-200 text-green-700' 
                          : 'bg-gray-50 border-gray-200 text-[#001D8D]/50'
                      }`}>
                        {getResultDisplay() || (amount === '' ? 'Результат появится здесь' : '')}
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <span className="text-lg font-semibold text-[#001D8D]/70">
                          {direction === 'usdt-to-rub' ? '₽' : 'USDT'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Комиссия */}
                  <div className="text-sm text-[#001D8D]/60">
                    Комиссия: включена в курс
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rate Information */}
        {rate && !loading && !error && (
          <div className="mt-8">
            <Card className="bg-gradient-to-r from-gray-50 to-blue-50/30 border border-[#001D8D]/10">
              <CardContent className="p-6">
                <h4 className="font-semibold text-[#001D8D] mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#001D8D] rounded-full" />
                  Текущие курсы KenigSwap
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex justify-between items-center p-4 bg-white/80 rounded-lg border border-[#001D8D]/10">
                    <span className="text-[#001D8D]/70 font-medium">Продажа USDT:</span>
                    <span className="font-bold text-[#001D8D] text-lg">{displayRate(rate.sell)} ₽</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/80 rounded-lg border border-[#001D8D]/10">
                    <span className="text-[#001D8D]/70 font-medium">Покупка USDT:</span>
                    <span className="font-bold text-[#001D8D] text-lg">{displayRate(rate.buy)} ₽</span>
                  </div>
                </div>

                <div className="mt-4 text-center text-sm text-[#001D8D]/60 border-t border-[#001D8D]/10 pt-4">
                  Используется курс: {direction === 'usdt-to-rub' 
                    ? `${displayRate(rate.sell)} ₽ (продажа)` 
                    : `${displayRate(rate.buy)} ₽ (покупка)`}
                  {lastUpdated && (
                    <span className="block mt-1">
                      Обновлено: {lastUpdated.toLocaleTimeString('ru-RU')}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mt-8 flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-[#001D8D]">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Загрузка курсов из Supabase...</span>
            </div>
          </div>
        )}

        {/* Exchange Button */}
        <div className="mt-8">
          <Button 
            className="w-full bg-gradient-to-r from-[#001D8D] to-blue-600 hover:from-[#001D8D]/90 hover:to-blue-600/90 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:transform-none"
            disabled={isCalculationDisabled || amount === '' || numericAmount <= 0}
          >
            {getExchangeButtonText()}
          </Button>
        </div>
      </div>
    </div>
  );
}