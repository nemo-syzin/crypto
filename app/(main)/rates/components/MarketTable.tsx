"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, ChevronUp, ChevronDown, BarChart3, Activity, Info, Download, Filter, Globe, Search } from 'lucide-react';
import type { CoinMarketData } from '@/lib/coingecko';

// Функция для проверки и исправления URL изображений
const getSafeImageUrl = (url: string): string => {
  // Заменяем coin-images.coingecko.com на assets.coingecko.com
  if (url && url.includes('coin-images.coingecko.com')) {
    return url.replace('coin-images.coingecko.com', 'assets.coingecko.com');
  }
  return url;
};

interface MarketTableProps {
  coins: CoinMarketData[];
  onCoinClick: (coin: CoinMarketData) => void;
  loading?: boolean;
}

type SortField = 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h' | 'price_change_percentage_7d_in_currency' | 'market_cap' | 'total_volume' | 'circulating_supply';
type SortDirection = 'asc' | 'desc';

export function MarketTable({ coins, onCoinClick, loading }: MarketTableProps) {
  const [sortField, setSortField] = useState<SortField>('market_cap_rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Use coins directly
  const displayCoins = coins;

  // Filter coins based on search query
  const filteredCoins = useMemo(() => {
    if (!searchQuery.trim()) return displayCoins;
    
    const query = searchQuery.toLowerCase().trim();
    return displayCoins.filter(coin => 
      coin.name.toLowerCase().includes(query) || 
      coin.symbol.toLowerCase().includes(query)
    );
  }, [displayCoins, searchQuery]);

  const sortedCoins = [...filteredCoins].sort((a, b) => {
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

  // Pagination
  const totalPages = Math.ceil(sortedCoins.length / itemsPerPage);
  const paginatedCoins = sortedCoins.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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

  const formatSupply = (value: number | null): string => {
    if (!value) return 'N/A';
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toLocaleString();
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
          <h3 className="text-xl font-bold text-[#001D8D]">Полная таблица рынка</h3>
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
    <div className="calculator-container hover:shadow-xl transition-all duration-300 mobile-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#001D8D]">Глобальный крипторынок</h3>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск монет..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-2 px-3 pr-10 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-colors w-full sm:w-auto min-w-[200px]"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Badge variant="outline" className="text-xs whitespace-nowrap">
            <Activity className="h-3 w-3 mr-1" />
            Данные в реальном времени
          </Badge>
        </div>
      </div>
      
      <div className="mobile-table-scroll overflow-x-auto">
        <table className="w-full" role="table" aria-label="Cryptocurrency market data">
          <thead className="sticky top-0 bg-white border-b border-gray-200">
            <tr className="border-b border-[#001D8D]/10 text-sm">
              <th className="text-left py-3 px-2" scope="col">
                <SortButton field="market_cap_rank">Ранг</SortButton>
              </th>
              <th className="text-left py-3 px-2 min-w-[120px]" scope="col">Название</th>
              <th className="text-center py-3 px-2 hidden md:table-cell" scope="col">Тренд</th>
              <th className="text-right py-3 px-2 min-w-[80px]" scope="col">
                <SortButton field="current_price">Цена</SortButton>
              </th>
              <th className="text-right py-3 px-2 min-w-[70px]" scope="col">
                <SortButton field="price_change_percentage_24h">24ч %</SortButton>
              </th>
              <th className="text-right py-3 px-2 min-w-[100px]" scope="col">
                <SortButton field="market_cap">Капитализация</SortButton>
              </th>
              <th className="text-right py-3 px-2 hidden md:table-cell min-w-[100px]" scope="col">
                <SortButton field="total_volume">Объем (24ч)</SortButton>
              </th>
              <th className="text-right py-3 px-2 hidden lg:table-cell min-w-[120px]" scope="col">
                <SortButton field="circulating_supply">В обращении</SortButton>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedCoins.map((coin) => (
              <tr
                key={coin.id}
                onClick={() => onCoinClick(coin)}
                className="border-b border-gray-100 hover:bg-[#001D8D]/5 cursor-pointer transition-colors group touch-friendly mobile-touch-target"
                role="button"
                tabIndex={0}
                aria-label={`Просмотр деталей для ${coin.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onCoinClick(coin);
                  }
                }}
              >
                <td className="py-4 px-2 text-[#001D8D]/70 font-medium text-sm">
                  {coin.market_cap_rank}
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-3">
                    <Image
                      src={getSafeImageUrl(coin.image)} 
                      alt={`${coin.name} logo`}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0eH/xAAVAQEBAQAAAAAAAAAAAAAAAAAAAQID/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[#001D8D] group-hover:text-[#001D8D]/80 text-sm sm:text-base">
                        {coin.name}
                      </div>
                      <div className="text-xs sm:text-sm text-[#001D8D]/70 truncate">{coin.symbol.toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-2 text-center hidden md:table-cell">
                  <div className="flex justify-center">
                    {coin.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </td>
                <td className="py-4 px-2 text-right font-semibold text-[#001D8D] text-sm sm:text-base">
                  {formatPrice(coin.current_price)}
                </td>
                <td className="py-4 px-2 text-right">
                  <Badge 
                    variant="outline" 
                    className={`${
                      coin.price_change_percentage_24h >= 0
                        ? 'border-green-200 text-green-700 bg-green-50'
                        : 'border-red-200 text-red-700 bg-red-50'
                    } text-xs whitespace-nowrap`}
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
                <td className="py-4 px-2 text-right text-[#001D8D]/70 text-sm">
                  {formatMarketCap(coin.market_cap)}
                </td>
                <td className="py-4 px-2 text-right text-[#001D8D]/70 hidden md:table-cell text-sm">
                  {formatMarketCap(coin.total_volume)}
                </td>
                <td className="py-4 px-2 text-right text-[#001D8D]/70 hidden lg:table-cell text-sm">
                  <div className="flex flex-col items-end">
                    <div className="truncate max-w-[100px]">{formatSupply(coin.circulating_supply)} {coin.symbol.toUpperCase()}</div>
                    {coin.max_supply && (
                      <div className="text-xs text-[#001D8D]/50">
                        Макс: {formatSupply(coin.max_supply)}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[#001D8D]/70 flex items-center gap-2 order-2 sm:order-1">
            <span>Показано</span>
            <strong>{(page - 1) * itemsPerPage + 1}-{Math.min(page * itemsPerPage, sortedCoins.length)}</strong>
            <span>из</span>
            <strong>{sortedCoins.length}</strong>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="text-[#001D8D] mobile-touch-target"
            >
              Назад
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const pageNum = totalPages <= 5 ? i + 1 : 
                page <= 3 ? i + 1 :
                page >= totalPages - 2 ? totalPages - 4 + i :
                page - 2 + i;
              
              return (
              <Button
                key={pageNum}
                variant={page === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(pageNum)}
                className={`${page === pageNum ? "bg-[#001D8D] text-white" : "text-[#001D8D]"} mobile-touch-target hidden sm:inline-flex`}
              >
                {pageNum}
              </Button>
              );
            })}
            {/* Mobile: show current page info */}
            <div className="sm:hidden text-sm text-[#001D8D]/70 px-3 py-2 bg-gray-100 rounded-lg">
              {page} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="text-[#001D8D] mobile-touch-target"
            >
              Далее
            </Button>
          </div>
        </div>
      )}
      
      {/* Table Legend */}
      <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm">
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-semibold text-blue-900 mb-2">Информация о таблице</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-blue-800">
              <div>• <strong>Ранг</strong>: Позиция по рыночной капитализации</div>
              <div>• <strong>Цена</strong>: Текущая цена в USD</div>
              <div>• <strong>24ч %</strong>: Изменение цены за последние 24 часа</div>
              <div>• <strong>Капитализация</strong>: Общая рыночная стоимость</div>
              <div>• <strong>Объем (24ч)</strong>: Объем торгов за 24 часа</div>
              <div>• <strong>В обращении</strong>: Количество монет в обращении</div>
              <div className="sm:col-span-2">• <strong>Макс. предложение</strong>: Максимально возможное количество монет</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}