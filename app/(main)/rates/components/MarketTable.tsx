"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, ChevronUp, ChevronDown, BarChart3, Activity } from 'lucide-react';
import type { CoinMarketData } from '@/lib/coingecko';

interface MarketTableProps {
  coins: CoinMarketData[];
  onCoinClick: (coin: CoinMarketData) => void;
  loading?: boolean;
}

type SortField = 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h' | 'price_change_percentage_7d_in_currency' | 'market_cap' | 'total_volume';
type SortDirection = 'asc' | 'desc';

export function MarketTable({ coins, onCoinClick, loading }: MarketTableProps) {
  const [sortField, setSortField] = useState<SortField>('market_cap_rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCoins = [...coins].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle null values
    if (aValue === null) aValue = 0;
    if (bValue === null) bValue = 0;
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

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

  const formatMarketCap = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-semibold text-[#001D8D] hover:text-[#001D8D]/80"
      aria-label={`Sort by ${field}`}
    >
      <span className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? 
            <ChevronUp className="h-3 w-3" /> : 
            <ChevronDown className="h-3 w-3" />
        )}
      </span>
    </Button>
  );

  // Mini sparkline component for each coin
  const MiniSparkline = ({ coin }: { coin: CoinMarketData }) => {
    const change24h = coin.price_change_percentage_24h;
    const change7d = coin.price_change_percentage_7d_in_currency || 0;
    const change1h = coin.price_change_percentage_1h_in_currency || 0;
    
    // Create a simple trend visualization
    const points = [change7d, change24h, change1h];
    const isPositive = change24h >= 0;
    
    return (
      <div className="w-16 h-8 flex items-end justify-center gap-1">
        {points.map((point, index) => {
          const height = Math.min(Math.abs(point) * 2, 20);
          return (
            <div
              key={index}
              className={`w-1 rounded-sm transition-all duration-300 ${
                point >= 0 ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ height: `${Math.max(height, 2)}px` }}
            />
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="calculator-container">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#001D8D]">Обзор рынка</h3>
        </div>
        <div className="animate-pulse">
          <div className="grid grid-cols-8 gap-4 mb-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="grid grid-cols-8 gap-4 py-3 border-b border-gray-100">
              {Array.from({ length: 8 }).map((_, j) => (
                <div key={j} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="calculator-container hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#001D8D]">Обзор рынка</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          <Activity className="h-3 w-3 mr-1" />
          Живые данные
        </Badge>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full" role="table" aria-label="Cryptocurrency market data">
          <thead className="sticky top-0 bg-white/95 backdrop-blur-sm">
            <tr className="border-b border-[#001D8D]/10">
              <th className="text-left py-3 px-2" scope="col">
                <SortButton field="market_cap_rank">#</SortButton>
              </th>
              <th className="text-left py-3 px-2" scope="col">Название</th>
              <th className="text-center py-3 px-2" scope="col">Тренд</th>
              <th className="text-right py-3 px-2" scope="col">
                <SortButton field="current_price">Цена</SortButton>
              </th>
              <th className="text-right py-3 px-2" scope="col">
                <SortButton field="price_change_percentage_24h">24ч %</SortButton>
              </th>
              <th className="text-right py-3 px-2" scope="col">
                <SortButton field="price_change_percentage_7d_in_currency">7д %</SortButton>
              </th>
              <th className="text-right py-3 px-2" scope="col">
                <SortButton field="market_cap">Капитализация</SortButton>
              </th>
              <th className="text-right py-3 px-2" scope="col">
                <SortButton field="total_volume">Объем (24ч)</SortButton>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCoins.map((coin) => (
              <tr
                key={coin.id}
                onClick={() => onCoinClick(coin)}
                className="border-b border-gray-100 hover:bg-[#001D8D]/5 cursor-pointer transition-colors group"
                role="button"
                tabIndex={0}
                aria-label={`View details for ${coin.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onCoinClick(coin);
                  }
                }}
              >
                <td className="py-4 px-2 text-[#001D8D]/70 font-medium">
                  {coin.market_cap_rank}
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-3">
                    <img 
                      src={coin.image} 
                      alt={`${coin.name} logo`}
                      className="w-8 h-8 rounded-full"
                      loading="lazy"
                    />
                    <div>
                      <div className="font-semibold text-[#001D8D] group-hover:text-[#001D8D]/80">
                        {coin.name}
                      </div>
                      <div className="text-sm text-[#001D8D]/70">{coin.symbol.toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-2 text-center">
                  <MiniSparkline coin={coin} />
                </td>
                <td className="py-4 px-2 text-right font-semibold text-[#001D8D]">
                  {formatPrice(coin.current_price)}
                </td>
                <td className="py-4 px-2 text-right">
                  <Badge 
                    variant="outline" 
                    className={`${
                      coin.price_change_percentage_24h >= 0
                        ? 'border-green-200 text-green-700 bg-green-50'
                        : 'border-red-200 text-red-700 bg-red-50'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {coin.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  </Badge>
                </td>
                <td className="py-4 px-2 text-right">
                  <span className={`${
                    (coin.price_change_percentage_7d_in_currency || 0) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {(coin.price_change_percentage_7d_in_currency || 0) >= 0 ? '+' : ''}
                    {coin.price_change_percentage_7d_in_currency?.toFixed(2) || 'N/A'}%
                  </span>
                </td>
                <td className="py-4 px-2 text-right text-[#001D8D]/70">
                  {formatMarketCap(coin.market_cap)}
                </td>
                <td className="py-4 px-2 text-right text-[#001D8D]/70">
                  {formatMarketCap(coin.total_volume)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Table footer with info */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Activity className="h-3 w-3" />
          <span>Нажмите на любую строку для просмотра подробных графиков</span>
        </div>
        <div>
          Данные обновляются каждые 5 минут
        </div>
      </div>
    </div>
  );
}