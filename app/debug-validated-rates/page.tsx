"use client";

import { ValidatedRatesDisplay } from '@/components/ValidatedRatesDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, ExternalLink, Code, TestTube } from 'lucide-react';

export default function DebugValidatedRatesPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#001D8D] flex items-center gap-2">
                <TestTube className="h-6 w-6" />
                Validated Exchange Rates Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#001D8D]/70 mb-4">
                This page demonstrates the validated exchange rates function that ensures all rate data 
                is properly formatted, validated, and safe for display and calculations.
              </p>
              <div className="flex gap-4">
                <Button 
                  variant="outline"
                  onClick={() => window.open('/api/debug/table-structure', '_blank')}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Check Table Structure
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('/api/debug/validated-rates', '_blank')}
                >
                  <Code className="h-4 w-4 mr-2" />
                  View Raw API Response
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('/api/debug/kenig', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Legacy Debug Endpoint
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Validated Rates Display */}
          <ValidatedRatesDisplay />

          {/* Validation Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#001D8D]">
                Validation Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-[#001D8D] mb-3">Data Validation</h4>
                  <ul className="space-y-2 text-sm text-[#001D8D]/70">
                    <li>• Numeric value validation (NaN, Infinity checks)</li>
                    <li>• Range validation (50-200 RUB for rates)</li>
                    <li>• Decimal precision validation (max 4 decimal places)</li>
                    <li>• Spread validation (0.1% - 10% spread)</li>
                    <li>• Data freshness validation (max 24 hours old)</li>
                    <li>• Source field validation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#001D8D] mb-3">Error Handling</h4>
                  <ul className="space-y-2 text-sm text-[#001D8D]/70">
                    <li>• Safe number parsing with fallbacks</li>
                    <li>• Detailed validation error messages</li>
                    <li>• Graceful handling of missing data</li>
                    <li>• Automatic table detection (kenig_rates/exchange_rates)</li>
                    <li>• Configuration error detection</li>
                    <li>• Database connection error handling</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#001D8D]">
                Usage Examples
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <div className="text-yellow-400">// Import the validation functions</div>
                <div>import &#123; getValidatedKenigRates, formatRate, safeParseRate &#125; from '@/lib/supabase/validated-rates';</div>
                <br />
                <div className="text-yellow-400">// Get all validated rates</div>
                <div>const result = await getValidatedKenigRates();</div>
                <div>console.log(`Valid rates: $&#123;result.validRatesCount&#125;/$&#123;result.totalRates&#125;`);</div>
                <br />
                <div className="text-yellow-400">// Safe rate formatting</div>
                <div>const formattedRate = formatRate(93.5); // "93.50"</div>
                <div>const safeRate = safeParseRate("invalid", 0); // 0</div>
                <br />
                <div className="text-yellow-400">// Get best rates</div>
                <div>const bestSell = await getBestSellRate();</div>
                <div>const bestBuy = await getBestBuyRate();</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}