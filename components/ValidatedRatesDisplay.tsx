"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { getValidatedKenigRates, formatRate, safeParseRate, type RateValidationResult } from '@/lib/supabase/validated-rates';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Database, TrendingUp, Clock } from 'lucide-react';

export function ValidatedRatesDisplay() {
  const [validationResult, setValidationResult] = useState<RateValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchValidatedRates = async () => {
    setIsLoading(true);
    try {
      const result = await getValidatedKenigRates();
      setValidationResult(result);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching validated rates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchValidatedRates();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchValidatedRates, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!validationResult) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-5 w-5 animate-spin text-[#001D8D] mr-2" />
            <span>Loading validated rates...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Alert */}
      {validationResult.error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Validation Error:</strong> {validationResult.error}
          </AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {validationResult.hasValidRates && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Validation Successful:</strong> {validationResult.validRatesCount} out of {validationResult.totalRates} rates are valid
          </AlertDescription>
        </Alert>
      )}

      {/* Main Rates Display */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#001D8D] flex items-center gap-2">
              <Database className="h-5 w-5" />
              Validated Exchange Rates
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={validationResult.isFromDatabase ? "default" : "secondary"}>
                {validationResult.isFromDatabase ? 'Database' : 'Fallback'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchValidatedRates}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-[#001D8D]/70">
              <Clock className="h-4 w-4" />
              Last updated: {lastUpdated.toLocaleTimeString('ru-RU')}
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Validation Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-700 mb-1">Total Rates</div>
              <div className="text-2xl font-bold text-blue-600">{validationResult.totalRates}</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-green-700 mb-1">Valid Rates</div>
              <div className="text-2xl font-bold text-green-600">{validationResult.validRatesCount}</div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-sm text-red-700 mb-1">Invalid Rates</div>
              <div className="text-2xl font-bold text-red-600">{validationResult.invalidRatesCount}</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-sm text-purple-700 mb-1">Success Rate</div>
              <div className="text-2xl font-bold text-purple-600">
                {validationResult.totalRates > 0 
                  ? Math.round((validationResult.validRatesCount / validationResult.totalRates) * 100)
                  : 0}%
              </div>
            </div>
          </div>

          {/* Individual Rate Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#001D8D]">Rate Details</h3>
            {validationResult.rates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No rates found in database
              </div>
            ) : (
              validationResult.rates.map((rate) => (
                <div
                  key={rate.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    rate.isValid
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {rate.isValid ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-900 capitalize">
                          {rate.source}
                        </h4>
                        <div className="text-xs text-gray-500">
                          ID: {rate.id} • Updated: {new Date(rate.updated_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant={rate.isValid ? "default" : "destructive"}>
                      {rate.isValid ? 'Valid' : 'Invalid'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="bg-white p-3 rounded border">
                      <div className="text-sm text-gray-600 mb-1">Sell Rate (USDT → RUB)</div>
                      <div className="text-xl font-bold text-[#001D8D]">
                        {formatRate(rate.sell)} ₽
                      </div>
                      <div className="text-xs text-gray-500">
                        Raw: {rate.sell} • Safe: {safeParseRate(rate.sell)}
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded border">
                      <div className="text-sm text-gray-600 mb-1">Buy Rate (RUB → USDT)</div>
                      <div className="text-xl font-bold text-[#001D8D]">
                        {formatRate(rate.buy)} ₽
                      </div>
                      <div className="text-xs text-gray-500">
                        Raw: {rate.buy} • Safe: {safeParseRate(rate.buy)}
                      </div>
                    </div>
                  </div>

                  {/* Spread Calculation */}
                  {rate.isValid && rate.sell > 0 && rate.buy > 0 && (
                    <div className="bg-white p-3 rounded border mb-3">
                      <div className="text-sm text-gray-600 mb-1">Spread Analysis</div>
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Spread: </span>
                          <span className="font-medium text-[#001D8D]">
                            {formatRate(rate.sell - rate.buy)} ₽
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Percentage: </span>
                          <span className="font-medium text-[#001D8D]">
                            {(((rate.sell - rate.buy) / rate.buy) * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Validation Errors */}
                  {!rate.isValid && rate.validationErrors.length > 0 && (
                    <div className="bg-red-100 p-3 rounded border border-red-200">
                      <div className="text-sm font-medium text-red-800 mb-2">Validation Errors:</div>
                      <ul className="text-sm text-red-700 space-y-1">
                        {rate.validationErrors.map((error, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Best Rates Summary */}
          {validationResult.hasValidRates && (
            <div className="bg-gradient-to-r from-[#001D8D] to-blue-700 text-white p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5" />
                <h3 className="text-lg font-bold">Best Available Rates</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-white/90 text-sm mb-1">Best Sell Rate</div>
                  <div className="text-2xl font-bold">
                    {(() => {
                      const validRates = validationResult.rates.filter(r => r.isValid);
                      const bestSell = validRates.reduce((best, current) => 
                        current.sell > best.sell ? current : best, validRates[0]
                      );
                      return bestSell ? `${formatRate(bestSell.sell)} ₽ (${bestSell.source})` : 'N/A';
                    })()}
                  </div>
                </div>
                <div>
                  <div className="text-white/90 text-sm mb-1">Best Buy Rate</div>
                  <div className="text-2xl font-bold">
                    {(() => {
                      const validRates = validationResult.rates.filter(r => r.isValid);
                      const bestBuy = validRates.reduce((best, current) => 
                        current.buy > best.buy ? current : best, validRates[0]
                      );
                      return bestBuy ? `${formatRate(bestBuy.buy)} ₽ (${bestBuy.source})` : 'N/A';
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}