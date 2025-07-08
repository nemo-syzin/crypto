"use client";

import { useState, useEffect } from 'react';
import { useTopCoins, fetchCoinMarketChart } from '@/lib/coingecko-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, RefreshCw, Search, Info, ArrowUpDown, Filter } from 'lucide-react';
import Image from 'next/image';

export default function CryptoMarketOverview() {
  const [currency, setCurrency] = useState('usd');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [chartLoading, setChartLoading] = useState(false);
  const { coins, loading, error } = useTopCoins(currency, 20);
  const [filteredCoins, setFilteredCoins] = useState<any[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  }>({
    key: 'market_cap_rank',
    direction: 'ascending',
  });

  useEffect(() => {
    if (coins) {
      let filtered = [...coins];
      
      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(
          (coin) =>
            coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      
      setFilteredCoins(filtered);
    }
  }, [coins, searchQuery, sortConfig]);

  useEffect(() => {
    if (selectedCoin) {
      loadChartData(selectedCoin);
    }
  }, [selectedCoin]);

  const loadChartData = async (coinId: string) => {
    try {
      setChartLoading(true);
      const data = await fetchCoinMarketChart(coinId, currency, 7);
      setChartData(data);
    } catch (error) {
      console.error('Failed to load chart data:', error);
    } finally {
      setChartLoading(false);
    }
  };

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    });
  };

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

  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="calculator-container animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calculator-container">
        <div className="text-red-600 p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-bold mb-2">Error loading cryptocurrency data</h3>
          <p>{error}</p>
          <p className="mt-4 text-sm">
            Please check your API key or try again later. Make sure you're using a valid CoinGecko API key.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="calculator-container hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#001D8D]">Crypto Market Overview</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            <RefreshCw className="h-3 w-3 mr-1" />
            Live Data
          </Badge>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="input-field w-32"
        >
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="gbp">GBP</option>
        </select>
      </div>
      
      {/* Market Table */}
      <div className="overflow-x-auto">
        <table className="w-full" role="table" aria-label="Cryptocurrency market data">
          <thead className="sticky top-0 bg-white/95 backdrop-blur-sm">
            <tr className="border-b border-[#001D8D]/10">
              <th 
                className="text-left py-3 px-2 cursor-pointer hover:text-[#001D8D]/80" 
                scope="col"
                onClick={() => handleSort('market_cap_rank')}
              >
                <div className="flex items-center gap-1">
                  #
                  {sortConfig.key === 'market_cap_rank' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th className="text-left py-3 px-2" scope="col">Name</th>
              <th 
                className="text-right py-3 px-2 cursor-pointer hover:text-[#001D8D]/80" 
                scope="col"
                onClick={() => handleSort('current_price')}
              >
                <div className="flex items-center justify-end gap-1">
                  Price
                  {sortConfig.key === 'current_price' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="text-right py-3 px-2 cursor-pointer hover:text-[#001D8D]/80" 
                scope="col"
                onClick={() => handleSort('price_change_percentage_24h')}
              >
                <div className="flex items-center justify-end gap-1">
                  24h %
                  {sortConfig.key === 'price_change_percentage_24h' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="text-right py-3 px-2 cursor-pointer hover:text-[#001D8D]/80 hidden md:table-cell" 
                scope="col"
                onClick={() => handleSort('market_cap')}
              >
                <div className="flex items-center justify-end gap-1">
                  Market Cap
                  {sortConfig.key === 'market_cap' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="text-right py-3 px-2 cursor-pointer hover:text-[#001D8D]/80 hidden lg:table-cell" 
                scope="col"
                onClick={() => handleSort('total_volume')}
              >
                <div className="flex items-center justify-end gap-1">
                  Volume (24h)
                  {sortConfig.key === 'total_volume' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCoins.map((coin) => (
              <tr
                key={coin.id}
                onClick={() => setSelectedCoin(coin.id)}
                className="border-b border-gray-100 hover:bg-[#001D8D]/5 cursor-pointer transition-colors"
              >
                <td className="py-4 px-2 text-[#001D8D]/70 font-medium">
                  {coin.market_cap_rank}
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-3">
                    <Image
                      src={coin.image} 
                      alt={`${coin.name} logo`}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-[#001D8D]">
                        {coin.name}
                      </div>
                      <div className="text-sm text-[#001D8D]/70">{coin.symbol.toUpperCase()}</div>
                    </div>
                  </div>
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
                      {formatPercentage(coin.price_change_percentage_24h)}
                    </span>
                  </Badge>
                </td>
                <td className="py-4 px-2 text-right text-[#001D8D]/70 hidden md:table-cell">
                  {formatMarketCap(coin.market_cap)}
                </td>
                <td className="py-4 px-2 text-right text-[#001D8D]/70 hidden lg:table-cell">
                  {formatMarketCap(coin.total_volume)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredCoins.length === 0 && (
        <div className="text-center py-8 text-[#001D8D]/70">
          <div className="text-2xl mb-2">🔍</div>
          <p className="text-sm">No cryptocurrencies found matching your search criteria</p>
        </div>
      )}
      
      {/* Table footer with info */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Info className="h-3 w-3" />
          <span>Click on any row to view detailed information</span>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3 text-blue-500" />
            <span>Data updates every 5 minutes</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Filter className="h-3 w-3 text-purple-500" />
            <span>Sorted by: {
              sortConfig.key === 'market_cap_rank' ? 'rank' : 
              sortConfig.key === 'current_price' ? 'price' : 
              sortConfig.key === 'price_change_percentage_24h' ? '24h change' : 
              sortConfig.key === 'market_cap' ? 'market cap' : 
              sortConfig.key === 'total_volume' ? 'volume' : 'rank'
            }</span>
          </div>
        </div>
      </div>
      
      {/* Selected Coin Details */}
      {selectedCoin && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold text-[#001D8D] mb-4">
            {filteredCoins.find(c => c.id === selectedCoin)?.name} Details
          </h3>
          
          {chartLoading ? (
            <div className="h-64 flex items-center justify-center">
              <RefreshCw className="h-8 w-8 text-[#001D8D]/50 animate-spin" />
            </div>
          ) : chartData ? (
            <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-center justify-center">
              <p className="text-[#001D8D]/70">
                Chart data loaded successfully. In a full implementation, this would display a price chart using a library like Chart.js or Recharts.
              </p>
            </div>
          ) : (
            <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-center justify-center">
              <p className="text-[#001D8D]/70">Select a cryptocurrency to view its price chart</p>
            </div>
          )}
          
          <button 
            className="mt-4 text-[#001D8D] hover:text-[#001D8D]/80 text-sm"
            onClick={() => setSelectedCoin(null)}
          >
            ← Back to list
          </button>
        </div>
      )}
    </div>
  );
}