"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import type { CoinMarketData } from '@/lib/coingecko';

interface TopMoversProps {
  coins: CoinMarketData[];
  calculate4hChange: (coinId: string, currentPrice: number) => number | null;
  loading?: boolean;
}

export function TopMovers({ coins, calculate4hChange, loading }: TopMoversProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Sort coins by 24h change for gainers/losers
  const gainers = [...coins]
    .filter(coin => coin.price_change_percentage_24h > 0)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 3);

  const losers = [...coins]
    .filter(coin => coin.price_change_percentage_24h < 0)
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 3);

  const formatPrice = (price: number): string => {
    if (price >= 1) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
      }).format(price);
    }
  };

  const renderCoinRow = (coin: CoinMarketData, isGainer: boolean) => {
    const change4h = calculate4hChange(coin.id, coin.current_price);
    const change24h = coin.price_change_percentage_24h;
    const change1h = coin.price_change_percentage_1h_in_currency || 0;
    
    return (
      <div key={coin.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          <img 
            src={coin.image} 
            alt={coin.name}
            className="w-8 h-8 rounded-full"
            loading="lazy"
          />
          <div>
            <div className="font-medium text-[#001D8D]">{coin.symbol.toUpperCase()}</div>
            <div className="text-sm text-gray-500">{formatPrice(coin.current_price)}</div>
          </div>
        </div>
        
        <div className="text-right">
          <Badge 
            variant="outline" 
            className={`mb-1 ${
              isGainer 
                ? 'border-green-200 text-green-700 bg-green-50' 
                : 'border-red-200 text-red-700 bg-red-50'
            }`}
          >
            {isGainer ? '+' : ''}{change24h.toFixed(2)}%
          </Badge>
          
          <div className="flex flex-col gap-1 text-xs text-gray-500">
            {change1h !== 0 && (
              <div className="flex items-center gap-1">
                <span>1h:</span>
                <span className={change1h >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {change1h >= 0 ? '+' : ''}{change1h.toFixed(2)}%
                </span>
              </div>
            )}
            {change4h !== null && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>4h:</span>
                <span className={change4h >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {change4h >= 0 ? '+' : ''}{change4h.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Top Gainers */}
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10 hover:border-[#001D8D]/30 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-[#001D8D] flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Top Gainers (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {gainers.length > 0 ? (
              gainers.map(coin => renderCoinRow(coin, true))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No gainers found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Losers */}
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10 hover:border-[#001D8D]/30 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-[#001D8D] flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            Top Losers (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {losers.length > 0 ? (
              losers.map(coin => renderCoinRow(coin, false))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No losers found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}