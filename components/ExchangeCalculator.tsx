"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAssets } from '@/hooks/useAssets';
import { useRate } from '@/hooks/useRate';
import { Calculator, RefreshCw, ArrowUpDown, AlertTriangle, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ExchangeCalculator() {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USDT');
  const [toCurrency, setToCurrency] = useState<string>('RUB');
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { assets, loading: assetsLoading, error: assetsError } = useAssets();
  const { rate, loading: rateLoading, error: rateError } = useRate(fromCurrency, toCurrency);
  const { toast } = useToast();

  // Show toast when rate is not available
  useEffect(() => {
    if (rateError && fromCurrency && toCurrency && fromCurrency !== toCurrency) {
      toast({
        title: "Курс недоступен",
        description: rateError,
        variant: "destructive",
      });
    }
  }, [rateError, fromCurrency, toCurrency, toast]);

  // Мемоизированные функции для предотвращения лишних ререндеров
  const parseAmount = useMemo(() => (value: string): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }, []);

  const calculateResult = useMemo((): number => {
    const numericAmount = parseAmount(amount);
    if (!rate || numericAmount <= 0) return 0;
    
    return numericAmount * rate;
  }, [amount, rate, parseAmount]);

  const toggleDirection = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 150);
  };

  // Мемоизированные функции форматирования
  const formatCurrency = useMemo(() => (value: number, currency: string): string => {
    if (value === 0) return '';
    
    // Format based on currency type
    if (currency === 'RUB') {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } else if (currency === 'USD' || currency === 'EUR') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } else {
      // For crypto currencies
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      }).format(value) + ` ${currency}`;
    }
  }, []);

  const formatRate = useMemo(() => (rateValue: number | null, from: string, to: string): string => {
    if (!rateValue || isNaN(rateValue)) return '—';
    
    return `1 ${from} = ${formatCurrency(rateValue, to)}`;
  }, [formatCurrency]);

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty string, digits and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // Мемоизированные проверки и вычисления
  const hasValidRate = rate !== null && !isNaN(rate) && rate > 0;
  const isCalculationDisabled = rateLoading || !!rateError || !hasValidRate;
  const numericAmount = parseAmount(amount);
  const result = calculateResult;

  // Мемоизированные функции отображения
  const getResultDisplay = useMemo((): string => {
    if (rateLoading) return 'Загрузка курса...';
    if (!hasValidRate) return 'Курс недоступен';
    if (amount === '' || numericAmount <= 0) return '';
    
    return formatCurrency(result, toCurrency);
  }, [rateLoading, hasValidRate, amount, numericAmount, result, toCurrency, formatCurrency]);

  const getExchangeButtonText = useMemo((): string => {
    if (rateLoading) return 'Загрузка курса...';
    if (!hasValidRate) return 'Курс недоступен для выбранной пары';
    if (amount === '' || numericAmount <= 0) return 'Введите сумму для обмена';
    
    const fromAmount = formatCurrency(numericAmount, fromCurrency);
    const toAmount = formatCurrency(result, toCurrency);
    
    return `Обменять ${fromAmount} → ${toAmount}`;
  }, [rateLoading, hasValidRate, amount, numericAmount, fromCurrency, toCurrency, result, formatCurrency]);

  const getHintText = useMemo((): string => {
    if (!hasValidRate) {
      return `Курс ${fromCurrency}/${toCurrency} временно недоступен`;
    }

    const formattedRate = formatRate(rate, fromCurrency, toCurrency);
    return `Текущий курс: ${formattedRate}`;
  }, [hasValidRate, fromCurrency, toCurrency, rate, formatRate]);

  // Check if error is configuration related
  const isConfigurationError = assetsError && (
    assetsError.includes('not configured') || 
    assetsError.includes('Invalid API key') || 
    assetsError.includes('environment variables')
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
            {assetsError}
          </AlertDescription>
        </Alert>
      )}

      {/* Other Errors Alert */}
      {(assetsError && !isConfigurationError) && (
        <div className="error-toast">
          <strong>Ошибка загрузки валют:</strong> {assetsError}
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
                Мультивалютный калькулятор обмена
              </span>
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* From Currency Selection */}
          <div className="space-y-3">
            <Label htmlFor="fromCurrency" className="text-[#001D8D] font-semibold text-base">
              Отдаете
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <input
                id="amount"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="100"
                disabled={isCalculationDisabled || assetsLoading}
                className={`input-field ${rateError ? 'border-red-300' : ''}`}
              />
              <Select value={fromCurrency} onValueChange={setFromCurrency} disabled={assetsLoading}>
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
            <div className="hint-text">
              {getHintText}
            </div>
          </div>

          {/* Direction Toggle */}
          <div className="flex justify-center">
            <button
              onClick={toggleDirection}
              disabled={isCalculationDisabled || assetsLoading}
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
            <div className="grid grid-cols-2 gap-3">
              <div className={`input-field bg-gray-50 ${isAnimating ? 'result-animation' : ''}`}>
                <div className="text-[#001D8D] font-semibold">
                  {getResultDisplay || (amount === '' ? 'Результат' : '')}
                </div>
              </div>
              <Select value={toCurrency} onValueChange={setToCurrency} disabled={assetsLoading}>
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
            <div className="hint-text">
              Итоговая сумма к получению
            </div>
          </div>

          {/* Loading State */}
          {(assetsLoading || rateLoading) && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 text-[#001D8D]">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span className="font-medium">
                  {assetsLoading ? 'Загрузка валют...' : 'Загрузка курса...'}
                </span>
              </div>
            </div>
          )}

          {/* Current Rate Display */}
          {hasValidRate && (
            <div className="rates-container">
              <h4 className="font-semibold text-[#001D8D] mb-3">Текущий курс</h4>
              <div className="text-center">
                <div className="rate-value">{formatRate(rate, fromCurrency, toCurrency)}</div>
              </div>
            </div>
          )}

          {/* Exchange Button */}
          <button 
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
              isCalculationDisabled || amount === '' || numericAmount <= 0 || assetsLoading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#001D8D] to-blue-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
            }`}
            disabled={isCalculationDisabled || amount === '' || numericAmount <= 0 || assetsLoading}
          >
            {getExchangeButtonText}
          </button>
        </CardContent>
      </div>
    </div>
  );
}