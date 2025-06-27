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

export interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update?: string;
}

interface CoinPriceHistory {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// Enhanced fetcher function with better error handling
const fetcher = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Check if response has JSON error details
      let errorDetails;
      try {
        errorDetails = await response.json();
      } catch {
        errorDetails = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      
      throw new Error(errorDetails.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.warn('⚠️ CoinGecko fetch error:', error);
    
    // Return null instead of throwing to allow graceful degradation
    return null;
  }
};

// Enhanced data fetching functions with fallback data
async function getTopCoins(limit: number = 10): Promise<CoinMarketData[]> {
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
      console.warn('⚠️ CoinGecko API error, using fallback data');
      return getFallbackCoinsData();
    }
    
    const data = await response.json();
    
    // Check if we got fallback data from the API
    if (data.fallback) {
      console.warn('⚠️ Received fallback data from API');
      return Array.isArray(data) ? data : getFallbackCoinsData();
    }
    
    return Array.isArray(data) ? data : getFallbackCoinsData();
  } catch (error) {
    console.warn('⚠️ Error fetching top coins, using fallback data:', error);
    return getFallbackCoinsData();
  }
}

async function getGlobalMarketData(): Promise<GlobalMarketData | null> {
  try {
    const response = await fetch('/api/coingecko?endpoint=/global');
    
    if (!response.ok) {
      console.warn('⚠️ CoinGecko Global API error, using fallback data');
      return getFallbackGlobalData();
    }
    
    const data = await response.json();
    
    // Check if we got fallback data from the API
    if (data.fallback) {
      console.warn('⚠️ Received fallback global data from API');
      return data.data ? data : getFallbackGlobalData();
    }
    
    return data;
  } catch (error) {
    console.warn('⚠️ Error fetching global market data, using fallback data:', error);
    return getFallbackGlobalData();
  }
}

async function getCoinHistory(coinId: string, days: number = 1): Promise<CoinPriceHistory | null> {
  try {
    const params = new URLSearchParams({
      vs_currency: 'usd',
      days: days.toString(),
      interval: days === 1 ? 'hourly' : 'daily'
    });

    const response = await fetch(`/api/coingecko?endpoint=/coins/${coinId}/market_chart&params=${params.toString()}`);
    
    if (!response.ok) {
      console.warn('⚠️ CoinGecko History API error');
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.warn('⚠️ Error fetching coin history:', error);
    return null;
  }
}

// Fallback data functions
function getFallbackCoinsData(): CoinMarketData[] {
  return [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      current_price: 43000,
      market_cap: 850000000000,
      market_cap_rank: 1,
      fully_diluted_valuation: 900000000000,
      total_volume: 25000000000,
      high_24h: 44000,
      low_24h: 42000,
      price_change_24h: 1000,
      price_change_percentage_24h: 2.5,
      price_change_percentage_7d_in_currency: 5.2,
      price_change_percentage_1h_in_currency: 0.8,
      market_cap_change_24h: 20000000000,
      market_cap_change_percentage_24h: 2.4,
      circulating_supply: 19750000,
      total_supply: 19750000,
      max_supply: 21000000,
      ath: 69000,
      ath_change_percentage: -37.7,
      ath_date: '2021-11-10T14:24:11.849Z',
      atl: 67.81,
      atl_change_percentage: 63300.0,
      atl_date: '2013-07-06T00:00:00.000Z',
      roi: null,
      last_updated: new Date().toISOString()
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      current_price: 2600,
      market_cap: 312000000000,
      market_cap_rank: 2,
      fully_diluted_valuation: 312000000000,
      total_volume: 15000000000,
      high_24h: 2650,
      low_24h: 2550,
      price_change_24h: 45,
      price_change_percentage_24h: 1.8,
      price_change_percentage_7d_in_currency: 3.1,
      price_change_percentage_1h_in_currency: 0.5,
      market_cap_change_24h: 5400000000,
      market_cap_change_percentage_24h: 1.8,
      circulating_supply: 120000000,
      total_supply: 120000000,
      max_supply: null,
      ath: 4878,
      ath_change_percentage: -46.7,
      ath_date: '2021-11-10T14:24:19.604Z',
      atl: 0.43,
      atl_change_percentage: 604000.0,
      atl_date: '2015-10-20T00:00:00.000Z',
      roi: null,
      last_updated: new Date().toISOString()
    }
  ];
}

function getFallbackGlobalData(): GlobalMarketData {
  return {
    data: {
      active_cryptocurrencies: 2500,
      upcoming_icos: 0,
      ongoing_icos: 49,
      ended_icos: 3376,
      markets: 750,
      total_market_cap: {
        usd: 1200000000000
      },
      total_volume: {
        usd: 45000000000
      },
      market_cap_percentage: {
        btc: 52.5,
        eth: 17.2
      },
      market_cap_change_percentage_24h_usd: 2.1,
      updated_at: Math.floor(Date.now() / 1000)
    }
  };
}

// Enhanced hooks with better error handling and fallback data
export function useMarket(limit: number = 10) {
  const { data, error, isLoading, mutate } = useSWR<CoinMarketData[]>(
    `market-data-${limit}`,
    () => getTopCoins(limit),
    {
      refreshInterval: 5 * 60 * 1000, // 5 minutes
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2 * 60 * 1000, // 2 minutes
      fallbackData: getFallbackCoinsData(), // Provide fallback data
      onError: (error) => {
        console.warn('⚠️ Market data hook error, using fallback data:', error);
      },
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Only retry up to 3 times
        if (retryCount >= 3) return;
        
        // Retry after 5 seconds
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    }
  );

  return {
    data: data || getFallbackCoinsData(),
    error: error?.message || null,
    isLoading,
    refetch: mutate,
  };
}

export function useGlobal() {
  const { data, error, isLoading, mutate } = useSWR<GlobalMarketData>(
    'global-market-data',
    getGlobalMarketData,
    {
      refreshInterval: 10 * 60 * 1000, // 10 minutes
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5 * 60 * 1000, // 5 minutes
      fallbackData: getFallbackGlobalData(), // Provide fallback data
      onError: (error) => {
        console.warn('⚠️ Global market data hook error, using fallback data:', error);
      },
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Only retry up to 3 times
        if (retryCount >= 3) return;
        
        // Retry after 10 seconds
        setTimeout(() => revalidate({ retryCount }), 10000);
      },
    }
  );

  return {
    data: data || getFallbackGlobalData(),
    error: error?.message || null,
    isLoading,
    refetch: mutate,
  };
}

function useCoinHistory(coinId: string, days: number = 1) {
  const { data, error, isLoading } = useSWR<CoinPriceHistory>(
    coinId ? `coin-history-${coinId}-${days}` : null,
    () => getCoinHistory(coinId, days),
    {
      refreshInterval: 5 * 60 * 1000, // 5 minutes
      revalidateOnFocus: false,
      dedupingInterval: 2 * 60 * 1000, // 2 minutes
      onError: (error) => {
        console.warn('⚠️ Coin history hook error:', error);
      },
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Only retry up to 2 times for history data
        if (retryCount >= 2) return;
        
        // Retry after 5 seconds
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    }
  );

  return {
    data: data || null,
    error: error?.message || null,
    isLoading,
  };
}

// Export functions for direct use
export { getTopCoins, getGlobalMarketData, getCoinHistory };