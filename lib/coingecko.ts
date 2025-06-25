import useSWR from 'swr';

export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  price_change_percentage_1h_in_currency: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: any;
  last_updated: string;
}

export interface GlobalMarketData {
  data: {
    active_cryptocurrencies: number;
    upcoming_icos: number;
    ongoing_icos: number;
    ended_icos: number;
    markets: number;
    total_market_cap: {
      [key: string]: number;
    };
    total_volume: {
      [key: string]: number;
    };
    market_cap_percentage: {
      [key: string]: number;
    };
    market_cap_change_percentage_24h_usd: number;
    updated_at: number;
  };
}

export interface CoinPriceHistory {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// Fetcher function for our proxy API
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Raw data fetching functions for direct use
export async function getTopCoins(limit: number = 10): Promise<CoinMarketData[]> {
  try {
    const params = new URLSearchParams({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: limit.toString(),
      page: '1',
      sparkline: 'false',
      price_change_percentage: '1h,24h,7d',
      locale: 'en'
    });

    const response = await fetch(`/api/coingecko?endpoint=/coins/markets&params=${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('CoinGecko API error:', errorData);
      
      // Return empty array instead of throwing
      return [];
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching top coins:', error);
    return [];
  }
}

export async function getGlobalMarketData(): Promise<GlobalMarketData | null> {
  try {
    const response = await fetch('/api/coingecko?endpoint=/global');
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('CoinGecko Global API error:', errorData);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching global market data:', error);
    return null;
  }
}

export async function getCoinHistory(coinId: string, days: number = 1): Promise<CoinPriceHistory | null> {
  try {
    const params = new URLSearchParams({
      vs_currency: 'usd',
      days: days.toString(),
      interval: days === 1 ? 'hourly' : 'daily'
    });

    const response = await fetch(`/api/coingecko?endpoint=/coins/${coinId}/market_chart&params=${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('CoinGecko History API error:', errorData);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching coin history:', error);
    return null;
  }
}

// Hook for market data (top coins) - 5 minute refresh
export function useMarket(limit: number = 10) {
  const { data, error, isLoading, mutate } = useSWR<CoinMarketData[]>(
    `market-data-${limit}`,
    () => getTopCoins(limit),
    {
      refreshInterval: 5 * 60 * 1000, // 5 minutes
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2 * 60 * 1000, // 2 minutes
      onError: (error) => {
        console.error('Market data hook error:', error);
      },
    }
  );

  return {
    data: data || [],
    error: error?.message || null,
    isLoading,
    refetch: mutate,
  };
}

// Hook for global market data - 10 minute refresh
export function useGlobal() {
  const { data, error, isLoading, mutate } = useSWR<GlobalMarketData>(
    'global-market-data',
    getGlobalMarketData,
    {
      refreshInterval: 10 * 60 * 1000, // 10 minutes
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5 * 60 * 1000, // 5 minutes
      onError: (error) => {
        console.error('Global market data hook error:', error);
      },
    }
  );

  return {
    data: data || null,
    error: error?.message || null,
    isLoading,
    refetch: mutate,
  };
}

// Hook for coin history
export function useCoinHistory(coinId: string, days: number = 1) {
  const { data, error, isLoading } = useSWR<CoinPriceHistory>(
    coinId ? `coin-history-${coinId}-${days}` : null,
    () => getCoinHistory(coinId, days),
    {
      refreshInterval: 5 * 60 * 1000, // 5 minutes
      revalidateOnFocus: false,
      dedupingInterval: 2 * 60 * 1000, // 2 minutes
      onError: (error) => {
        console.error('Coin history hook error:', error);
      },
    }
  );

  return {
    data: data || null,
    error: error?.message || null,
    isLoading,
  };
}