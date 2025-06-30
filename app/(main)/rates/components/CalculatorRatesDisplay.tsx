"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAllRates } from '@/lib/hooks/rates';
import { 
  Calculator, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  ArrowRightLeft,
  Zap,
  Shield,
  Clock,
  Plus,
  Minus,
  Equal,
  Divide,
  X,
  Percent,
  DollarSign
} from 'lucide-react';

interface CalculatorButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'number' | 'operator' | 'function' | 'equals';
  disabled?: boolean;
  className?: string;
}

const CalculatorButton = ({ 
  children, 
  onClick, 
  variant = 'number', 
  disabled = false,
  className = ""
}: CalculatorButtonProps) => {
  const baseClasses = "h-12 w-12 rounded-lg font-bold text-lg transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    number: "bg-white/90 text-[#001D8D] border-2 border-[#001D8D]/20 hover:border-[#001D8D]/40 hover:bg-[#001D8D]/5 shadow-md",
    operator: "bg-gradient-to-br from-[#001D8D] to-blue-600 text-white hover:from-[#001D8D]/90 hover:to-blue-600/90 shadow-lg",
    function: "bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:from-orange-500/90 hover:to-orange-600/90 shadow-lg",
    equals: "bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-500/90 hover:to-green-600/90 shadow-lg"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

interface RateDisplayProps {
  title: string;
  rate: number | null;
  change?: number;
  isLoading?: boolean;
  isBest?: boolean;
}

const RateDisplay = ({ title, rate, change, isLoading, isBest }: RateDisplayProps) => {
  const formatRate = (value: number | null): string => {
    if (value === null || isNaN(value)) return '----.--';
    return value.toFixed(2);
  };

  return (
    <div className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
      isBest 
        ? 'border-green-400 bg-green-50/50 shadow-lg' 
        : 'border-[#001D8D]/20 bg-white/80'
    }`}>
      {isBest && (
        <div className="absolute -top-2 left-4">
          <Badge className="bg-green-500 text-white text-xs px-2 py-1">
            ЛУЧШИЙ КУРС
          </Badge>
        </div>
      )}
      
      <div className="text-center">
        <div className="text-sm font-medium text-[#001D8D]/70 mb-2">{title}</div>
        
        {/* Digital Display Style */}
        <div className="bg-black/90 rounded-lg p-3 mb-3 font-mono">
          <div className="text-green-400 text-2xl font-bold tracking-wider">
            {isLoading ? (
              <div className="animate-pulse">88.88</div>
            ) : (
              formatRate(rate)
            )}
          </div>
          <div className="text-green-400/60 text-xs">RUB</div>
        </div>

        {change !== undefined && (
          <div className={`flex items-center justify-center gap-1 text-sm ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{Math.abs(change).toFixed(2)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export function CalculatorRatesDisplay() {
  const { rates, loading, error, lastUpdated, refetch } = useAllRates();
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [selectedRate, setSelectedRate] = useState<'sell' | 'buy'>('sell');

  // Calculator functions
  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  // Get best rates
  const getBestSellRate = () => {
    if (!rates) return null;
    const sellRates = [
      { source: 'KenigSwap', rate: rates.kenig.sell },
      { source: 'BestChange', rate: rates.bestchange.sell },
    ].filter(item => item.rate !== null && !isNaN(item.rate!)) as { source: string; rate: number }[];
    
    if (sellRates.length === 0) return null;
    return sellRates.reduce((best, current) => 
      current.rate < best.rate ? current : best
    );
  };

  const getBestBuyRate = () => {
    if (!rates) return null;
    const buyRates = [
      { source: 'KenigSwap', rate: rates.kenig.buy },
      { source: 'BestChange', rate: rates.bestchange.buy },
    ].filter(item => item.rate !== null && !isNaN(item.rate!)) as { source: string; rate: number }[];
    
    if (buyRates.length === 0) return null;
    return buyRates.reduce((best, current) => 
      current.rate > best.rate ? current : best
    );
  };

  const bestSell = getBestSellRate();
  const bestBuy = getBestBuyRate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-[#001D8D]/10 text-[#001D8D] border-[#001D8D]/20 px-6 py-2 text-lg rounded-full flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Калькулятор курсов
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
          Интерактивные курсы обмена
        </h2>
        <p className="text-xl text-[#001D8D]/70 max-w-3xl mx-auto">
          Профессиональный калькулятор с актуальными курсами в стиле цифрового дисплея
        </p>
      </motion.div>

      {/* Main Calculator Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Calculator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-4 border-[#001D8D]/30 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-[#001D8D] to-blue-700 text-white">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calculator className="h-6 w-6" />
                  KenigSwap Calculator
                </span>
                <Button
                  onClick={refetch}
                  disabled={loading}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              {/* Digital Display */}
              <div className="bg-black rounded-lg p-4 border-4 border-gray-700">
                <div className="text-right">
                  <div className="text-green-400 font-mono text-4xl font-bold tracking-wider mb-2">
                    {display}
                  </div>
                  <div className="text-green-400/60 text-sm font-mono">
                    {operation && `${previousValue} ${operation}`}
                  </div>
                </div>
              </div>

              {/* Rate Selection */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedRate('sell')}
                  variant={selectedRate === 'sell' ? 'default' : 'outline'}
                  className={selectedRate === 'sell' ? 'bg-[#001D8D] text-white' : 'text-[#001D8D]'}
                >
                  Продажа USDT
                </Button>
                <Button
                  onClick={() => setSelectedRate('buy')}
                  variant={selectedRate === 'buy' ? 'default' : 'outline'}
                  className={selectedRate === 'buy' ? 'bg-[#001D8D] text-white' : 'text-[#001D8D]'}
                >
                  Покупка USDT
                </Button>
              </div>

              {/* Calculator Buttons */}
              <div className="grid grid-cols-4 gap-3">
                {/* Row 1 */}
                <CalculatorButton onClick={clearAll} variant="function">
                  AC
                </CalculatorButton>
                <CalculatorButton onClick={clearEntry} variant="function">
                  CE
                </CalculatorButton>
                <CalculatorButton onClick={() => inputOperation('%')} variant="operator">
                  <Percent className="h-4 w-4" />
                </CalculatorButton>
                <CalculatorButton onClick={() => inputOperation('÷')} variant="operator">
                  <Divide className="h-4 w-4" />
                </CalculatorButton>

                {/* Row 2 */}
                <CalculatorButton onClick={() => inputNumber('7')}>7</CalculatorButton>
                <CalculatorButton onClick={() => inputNumber('8')}>8</CalculatorButton>
                <CalculatorButton onClick={() => inputNumber('9')}>9</CalculatorButton>
                <CalculatorButton onClick={() => inputOperation('×')} variant="operator">
                  <X className="h-4 w-4" />
                </CalculatorButton>

                {/* Row 3 */}
                <CalculatorButton onClick={() => inputNumber('4')}>4</CalculatorButton>
                <CalculatorButton onClick={() => inputNumber('5')}>5</CalculatorButton>
                <CalculatorButton onClick={() => inputNumber('6')}>6</CalculatorButton>
                <CalculatorButton onClick={() => inputOperation('-')} variant="operator">
                  <Minus className="h-4 w-4" />
                </CalculatorButton>

                {/* Row 4 */}
                <CalculatorButton onClick={() => inputNumber('1')}>1</CalculatorButton>
                <CalculatorButton onClick={() => inputNumber('2')}>2</CalculatorButton>
                <CalculatorButton onClick={() => inputNumber('3')}>3</CalculatorButton>
                <CalculatorButton onClick={() => inputOperation('+')} variant="operator">
                  <Plus className="h-4 w-4" />
                </CalculatorButton>

                {/* Row 5 */}
                <CalculatorButton onClick={() => inputNumber('0')} className="col-span-2">
                  0
                </CalculatorButton>
                <CalculatorButton onClick={() => inputNumber('.')}>.</CalculatorButton>
                <CalculatorButton onClick={performCalculation} variant="equals">
                  <Equal className="h-4 w-4" />
                </CalculatorButton>
              </div>

              {/* Quick Rate Buttons */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-white/80">Быстрый расчет по курсам:</div>
                <div className="grid grid-cols-2 gap-2">
                  {rates && (
                    <>
                      <Button
                        onClick={() => {
                          const rate = selectedRate === 'sell' ? rates.kenig.sell : rates.kenig.buy;
                          if (rate) {
                            const result = parseFloat(display) * rate;
                            setDisplay(result.toFixed(2));
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="text-white border-white/30 hover:bg-white/10"
                      >
                        × KenigSwap
                      </Button>
                      <Button
                        onClick={() => {
                          const rate = selectedRate === 'sell' ? rates.bestchange.sell : rates.bestchange.buy;
                          if (rate) {
                            const result = parseFloat(display) * rate;
                            setDisplay(result.toFixed(2));
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="text-white border-white/30 hover:bg-white/10"
                      >
                        × BestChange
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rates Display */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Sell Rates */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-2 border-[#001D8D]/20">
            <CardHeader>
              <CardTitle className="text-[#001D8D] flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                Продажа USDT → RUB
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RateDisplay
                title="KenigSwap"
                rate={rates?.kenig.sell || null}
                isLoading={loading}
                isBest={bestSell?.source === 'KenigSwap'}
              />
              <RateDisplay
                title="BestChange"
                rate={rates?.bestchange.sell || null}
                isLoading={loading}
                isBest={bestSell?.source === 'BestChange'}
              />
            </CardContent>
          </Card>

          {/* Buy Rates */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-2 border-[#001D8D]/20">
            <CardHeader>
              <CardTitle className="text-[#001D8D] flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Покупка USDT ← RUB
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RateDisplay
                title="KenigSwap"
                rate={rates?.kenig.buy || null}
                isLoading={loading}
                isBest={bestBuy?.source === 'KenigSwap'}
              />
              <RateDisplay
                title="BestChange"
                rate={rates?.bestchange.buy || null}
                isLoading={loading}
                isBest={bestBuy?.source === 'BestChange'}
              />
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="bg-gradient-to-br from-[#001D8D] to-blue-700 text-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Преимущества калькулятора</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <span>Мгновенные расчеты</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span>Актуальные курсы</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <span>Обновление каждые 30 сек</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-black/90 rounded-lg p-4 font-mono text-green-400"
      >
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span>STATUS: {loading ? 'UPDATING...' : 'READY'}</span>
            <span>MODE: {selectedRate.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span>LAST UPDATE: {lastUpdated.toLocaleTimeString()}</span>
            )}
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}