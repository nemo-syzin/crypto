import { useState, useEffect } from 'react';

// API key for CoinGecko
const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY || 'CG-shU9QGkzZMvPXBdgbTkZDmcm';

// Base URL for CoinGecko API
const BASE_URL = 'https://api.coingecko.com/api/v3';

// Types for API responses
export interface Coin {
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
  last_updated: string;
}

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  description: {
    en: string;
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: {
      [key: string]: number;
    };
    market_cap: {
      [key: string]: number;
    };
    total_volume: {
      [key: string]: number;
    };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    twitter_screen_name: string;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
    };
  };
}

export interface MarketChart {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// Function to fetch top cryptocurrencies
export async function fetchTopCoins(
  currency: string = 'usd', 
  limit: number = 20, 
  page: number = 1
): Promise<Coin[]> {
  try {
    // Использовать наш прокси API вместо прямого вызова CoinGecko
    const params = new URLSearchParams({
      vs_currency: currency,
      order: 'market_cap_desc',
      per_page: limit.toString(),
      page: page.toString(),
      sparkline: 'false',
      price_change_percentage: '1h,24h,7d'
    });
    
    const response = await fetch(`/api/coingecko?endpoint=/coins/markets&params=${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Error fetching top coins: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch top coins:', error);
    throw error;
  }
}

// Функция для получения заголовков API
function getApiHeaders(): HeadersInit {
  return {
    'x-cg-pro-api-key': API_KEY,
    'Content-Type': 'application/json',
  };
}

// Function to fetch detailed information about a specific coin
export async function fetchCoinDetails(coinId: string): Promise<CoinDetail> {
  try {
    const params = new URLSearchParams({
      localization: 'false',
      tickers: 'false',
      market_data: 'true',
      community_data: 'false',
      developer_data: 'false'
    });
    
    const response = await fetch(`/api/coingecko?endpoint=/coins/${coinId}&params=${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Error fetching coin details: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch details for coin ${coinId}:`, error);
    throw error;
  }
}

// Function to fetch historical market data for a coin
export async function fetchCoinMarketChart(
  coinId: string,
  currency: string = 'usd',
  days: number = 7
): Promise<MarketChart> {
  try {
    const params = new URLSearchParams({
      vs_currency: currency,
      days: days.toString()
    });
    
    const response = await fetch(`/api/coingecko?endpoint=/coins/${coinId}/market_chart&params=${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Error fetching market chart: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch market chart for coin ${coinId}:`, error);
    throw error;
  }
}

// Function to search for coins
export async function searchCoins(query: string): Promise<any[]> {
  try {
    const params = new URLSearchParams({
      query: query
    });
    
    const response = await fetch(`/api/coingecko?endpoint=/search&params=${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Error searching coins: ${response.status}`);
    }

    const data = await response.json();
    return data.coins || [];
  } catch (error) {
    console.error('Failed to search coins:', error);
    throw error;
  }
}

// Function to fetch global market data
export async function fetchGlobalData(): Promise<any> {
  try {
    const response = await fetch(`/api/coingecko?endpoint=/global`);

    if (!response.ok) {
      throw new Error(`Error fetching global data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch global data:', error);
    throw error;
  }
}

// Function to fetch trending coins
export async function fetchTrendingCoins(): Promise<any> {
  try {
    const response = await fetch(`/api/coingecko?endpoint=/search/trending`);

    if (!response.ok) {
      throw new Error(`Error fetching trending coins: ${response.status}`);
    }
  }
}
// Custom hook for fetching top coins
export function useTopCoins(currency: string = 'usd', limit: number = 20, page: number = 1) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); 
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`🔄 Fetching top coins (${currency}, limit: ${limit}, page: ${page})...`);
        const data = await fetchTopCoins(currency, limit, page);
        setCoins(data);
        setLastUpdated(new Date());
        setRetryCount(0); // Сбрасываем счетчик повторных попыток при успехе
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error(`❌ Error fetching top coins: ${errorMessage}`);
        setError(errorMessage);
        
        // Автоматически повторяем запрос при ошибке, но не более 3 раз
        if (retryCount < 3) {
          const retryDelay = Math.pow(2, retryCount) * 1000; // Экспоненциальная задержка
          console.log(`⏱️ Retrying in ${retryDelay/1000}s (attempt ${retryCount + 1}/3)...`);
          
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            fetchData();
          }, retryDelay);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [currency, limit, page, retryCount]);

  // Function to manually refresh data
  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🔄 Manually refreshing top coins data...`);
      const data = await fetchTopCoins(currency, limit, page);
      setCoins(data);
      setLastUpdated(new Date());
      setRetryCount(0); // Сбрасываем счетчик повторных попыток при ручном обновлении
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { coins, loading, error, lastUpdated, refetch };
}

// Custom hook for fetching coin details
export function useCoinDetails(coinId: string) {
  const [coinDetails, setCoinDetails] = useState<CoinDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!coinId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);        
        console.log(`🔄 Fetching coin details for ${coinId}...`);
        const data = await fetchCoinDetails(coinId);
        setCoinDetails(data);
        setRetryCount(0); // Сбрасываем счетчик повторных попыток при успехе
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error(`❌ Error fetching coin details: ${errorMessage}`);
        setError(errorMessage);
        
        // Автоматически повторяем запрос при ошибке, но не более 3 раз
        if (retryCount < 3) {
          const retryDelay = Math.pow(2, retryCount) * 1000; // Экспоненциальная задержка
          console.log(`⏱️ Retrying in ${retryDelay/1000}s (attempt ${retryCount + 1}/3)...`);
          
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            fetchData();
          }, retryDelay);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coinId, retryCount]);

  return { coinDetails, loading, error };
}

// Custom hook for fetching market chart data with auto-refresh
export function useCoinMarketChart(coinId: string, currency: string = 'usd', days: number = 7) {
  const [chartData, setChartData] = useState<MarketChart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);  
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!coinId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);        
        console.log(`🔄 Fetching market chart for ${coinId} (${currency}, ${days} days)...`);
        const data = await fetchCoinMarketChart(coinId, currency, days);
        setChartData(data);
        setLastUpdated(new Date());
        setRetryCount(0); // Сбрасываем счетчик повторных попыток при успехе
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error(`❌ Error fetching market chart: ${errorMessage}`);
        setError(errorMessage);
        
        // Автоматически повторяем запрос при ошибке, но не более 3 раз
        if (retryCount < 3) {
          const retryDelay = Math.pow(2, retryCount) * 1000; // Экспоненциальная задержка
          console.log(`⏱️ Retrying in ${retryDelay/1000}s (attempt ${retryCount + 1}/3)...`);
          
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            fetchData();
          }, retryDelay);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up auto-refresh every 15 minutes for chart data
    const refreshInterval = setInterval(fetchData, 15 * 60 * 1000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [coinId, currency, days, retryCount]);

  // Function to manually refresh data
  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🔄 Manually refreshing market chart data...`);
      const data = await fetchCoinMarketChart(coinId, currency, days);
      setChartData(data);
      setLastUpdated(new Date());
      setRetryCount(0); // Сбрасываем счетчик повторных попыток при ручном обновлении
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { chartData, loading, error, lastUpdated, refetch };
}

// Custom hook for fetching global market data
export function useGlobalData() {
  const [globalData, setGlobalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);  
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);        
        console.log(`🔄 Fetching global market data...`);
        const data = await fetchGlobalData();
        setGlobalData(data);
        setLastUpdated(new Date());
        setRetryCount(0); // Сбрасываем счетчик повторных попыток при успехе
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error(`❌ Error fetching global data: ${errorMessage}`);
        setError(errorMessage);
        
        // Автоматически повторяем запрос при ошибке, но не более 3 раз
        if (retryCount < 3) {
          const retryDelay = Math.pow(2, retryCount) * 1000; // Экспоненциальная задержка
          console.log(`⏱️ Retrying in ${retryDelay/1000}s (attempt ${retryCount + 1}/3)...`);
          
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            fetchData();
          }, retryDelay);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [retryCount]);

  // Function to manually refresh data
  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🔄 Manually refreshing global market data...`);
      const data = await fetchGlobalData();
      setGlobalData(data);
      setLastUpdated(new Date());
      setRetryCount(0); // Сбрасываем счетчик повторных попыток при ручном обновлении
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { globalData, loading, error, lastUpdated, refetch };
}

// Custom hook for fetching trending coins
export function useTrendingCoins() {
  const [trendingCoins, setTrendingCoins] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);  
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);        
        console.log(`🔄 Fetching trending coins...`);
        const data = await fetchTrendingCoins();
        setTrendingCoins(data);
        setLastUpdated(new Date());
        setRetryCount(0); // Сбрасываем счетчик повторных попыток при успехе
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error(`❌ Error fetching trending coins: ${errorMessage}`);
        setError(errorMessage);
        
        // Автоматически повторяем запрос при ошибке, но не более 3 раз
        if (retryCount < 3) {
          const retryDelay = Math.pow(2, retryCount) * 1000; // Экспоненциальная задержка
          console.log(`⏱️ Retrying in ${retryDelay/1000}s (attempt ${retryCount + 1}/3)...`);
          
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            fetchData();
          }, retryDelay);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up auto-refresh every 10 minutes
    const refreshInterval = setInterval(fetchData, 10 * 60 * 1000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [retryCount]);

  // Function to manually refresh data
  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🔄 Manually refreshing trending coins data...`);
      const data = await fetchTrendingCoins();
      setTrendingCoins(data);
      setLastUpdated(new Date());
      setRetryCount(0); // Сбрасываем счетчик повторных попыток при ручном обновлении
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { trendingCoins, loading, error, lastUpdated, refetch };
}