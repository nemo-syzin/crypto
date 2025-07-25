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
async function getTopCoins(limit: number = 20): Promise<CoinMarketData[]> {
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
      return getFallbackCoinsData(limit);
    }
    
    const data = await response.json();
    
    // Check if we got fallback data from the API
    if (data.fallback) {
      console.warn('⚠️ Received fallback data from API');
      return Array.isArray(data) ? data : getFallbackCoinsData(limit);
    }
    
    return Array.isArray(data) ? data : getFallbackCoinsData(limit);
  } catch (error) {
    console.warn('⚠️ Error fetching top coins, using fallback data:', error);
    return getFallbackCoinsData(limit);
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

// Fallback data functions - expanded to support more coins
function getFallbackCoinsData(limit: number = 20): CoinMarketData[] {
  // Base fallback data for top cryptocurrencies
  const baseFallbackData = [
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
    },
    {
      id: 'binancecoin',
      symbol: 'bnb',
      name: 'BNB',
      image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
      current_price: 310,
      market_cap: 47000000000,
      market_cap_rank: 3,
      fully_diluted_valuation: 47000000000,
      total_volume: 1200000000,
      high_24h: 315,
      low_24h: 305,
      price_change_24h: -5,
      price_change_percentage_24h: -0.5,
      price_change_percentage_7d_in_currency: -1.2,
      price_change_percentage_1h_in_currency: -0.1,
      market_cap_change_24h: -750000000,
      market_cap_change_percentage_24h: -0.5,
      circulating_supply: 153000000,
      total_supply: 153000000,
      max_supply: 200000000,
      ath: 686,
      ath_change_percentage: -54.8,
      ath_date: '2021-05-10T07:24:17.097Z',
      atl: 0.0398,
      atl_change_percentage: 778900.0,
      atl_date: '2017-10-19T00:00:00.000Z',
      roi: null,
      last_updated: new Date().toISOString()
    },
    {
      id: 'solana',
      symbol: 'sol',
      name: 'Solana',
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
      current_price: 150,
      market_cap: 65000000000,
      market_cap_rank: 4,
      fully_diluted_valuation: 82000000000,
      total_volume: 3500000000,
      high_24h: 155,
      low_24h: 145,
      price_change_24h: 5,
      price_change_percentage_24h: 3.5,
      price_change_percentage_7d_in_currency: 10.2,
      price_change_percentage_1h_in_currency: 0.7,
      market_cap_change_24h: 2100000000,
      market_cap_change_percentage_24h: 3.5,
      circulating_supply: 430000000,
      total_supply: 550000000,
      max_supply: null,
      ath: 260,
      ath_change_percentage: -42.3,
      ath_date: '2021-11-06T21:54:35.825Z',
      atl: 0.5,
      atl_change_percentage: 29900.0,
      atl_date: '2020-05-11T19:35:23.449Z',
      roi: null,
      last_updated: new Date().toISOString()
    },
    {
      id: 'ripple',
      symbol: 'xrp',
      name: 'XRP',
      image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
      current_price: 0.55,
      market_cap: 30000000000,
      market_cap_rank: 5,
      fully_diluted_valuation: 55000000000,
      total_volume: 1800000000,
      high_24h: 0.56,
      low_24h: 0.54,
      price_change_24h: 0.01,
      price_change_percentage_24h: 1.9,
      price_change_percentage_7d_in_currency: -2.3,
      price_change_percentage_1h_in_currency: 0.3,
      market_cap_change_24h: 550000000,
      market_cap_change_percentage_24h: 1.9,
      circulating_supply: 54000000000,
      total_supply: 100000000000,
      max_supply: 100000000000,
      ath: 3.4,
      ath_change_percentage: -83.8,
      ath_date: '2018-01-07T00:00:00.000Z',
      atl: 0.003,
      atl_change_percentage: 18233.3,
      atl_date: '2013-07-07T00:00:00.000Z',
      roi: null,
      last_updated: new Date().toISOString()
    },
    {
      id: 'cardano',
      symbol: 'ada',
      name: 'Cardano',
      image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
      current_price: 0.45,
      market_cap: 16000000000,
      market_cap_rank: 6,
      fully_diluted_valuation: 20000000000,
      total_volume: 700000000,
      high_24h: 0.46,
      low_24h: 0.44,
      price_change_24h: 0.01,
      price_change_percentage_24h: 2.3,
      price_change_percentage_7d_in_currency: 5.1,
      price_change_percentage_1h_in_currency: 0.4,
      market_cap_change_24h: 350000000,
      market_cap_change_percentage_24h: 2.3,
      circulating_supply: 35000000000,
      total_supply: 45000000000,
      max_supply: 45000000000,
      ath: 3.09,
      ath_change_percentage: -85.4,
      ath_date: '2021-09-02T06:00:10.474Z',
      atl: 0.019,
      atl_change_percentage: 2268.4,
      atl_date: '2020-03-13T02:22:55.044Z',
      roi: null,
      last_updated: new Date().toISOString()
    },
    {
      id: 'dogecoin',
      symbol: 'doge',
      name: 'Dogecoin',
      image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
      current_price: 0.12,
      market_cap: 15000000000,
      market_cap_rank: 7,
      fully_diluted_valuation: null,
      total_volume: 900000000,
      high_24h: 0.125,
      low_24h: 0.115,
      price_change_24h: 0.005,
      price_change_percentage_24h: 4.3,
      price_change_percentage_7d_in_currency: 8.2,
      price_change_percentage_1h_in_currency: 0.6,
      market_cap_change_24h: 600000000,
      market_cap_change_percentage_24h: 4.3,
      circulating_supply: 140000000000,
      total_supply: null,
      max_supply: null,
      ath: 0.73,
      ath_change_percentage: -83.6,
      ath_date: '2021-05-08T05:08:23.458Z',
      atl: 0.00008,
      atl_change_percentage: 149900.0,
      atl_date: '2015-05-06T00:00:00.000Z',
      roi: null,
      last_updated: new Date().toISOString()
    },
    {
      id: 'polkadot',
      symbol: 'dot',
      name: 'Polkadot',
      image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
      current_price: 6.5,
      market_cap: 9000000000,
      market_cap_rank: 8,
      fully_diluted_valuation: 9500000000,
      total_volume: 350000000,
      high_24h: 6.6,
      low_24h: 6.4,
      price_change_24h: 0.1,
      price_change_percentage_24h: 1.6,
      price_change_percentage_7d_in_currency: -2.8,
      price_change_percentage_1h_in_currency: 0.2,
      market_cap_change_24h: 140000000,
      market_cap_change_percentage_24h: 1.6,
      circulating_supply: 1380000000,
      total_supply: 1450000000,
      max_supply: null,
      ath: 55.0,
      ath_change_percentage: -88.2,
      ath_date: '2021-11-04T14:10:09.301Z',
      atl: 2.7,
      atl_change_percentage: 140.7,
      atl_date: '2020-08-20T05:48:11.359Z',
      roi: null,
      last_updated: new Date().toISOString()
    },
    {
      id: 'shiba-inu',
      symbol: 'shib',
      name: 'Shiba Inu',
      image: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png',
      current_price: 0.000018,
      market_cap: 8500000000,
      market_cap_rank: 9,
      fully_diluted_valuation: null,
      total_volume: 500000000,
      high_24h: 0.000019,
      low_24h: 0.000017,
      price_change_24h: 0.000001,
      price_change_percentage_24h: 5.9,
      price_change_percentage_7d_in_currency: 12.3,
      price_change_percentage_1h_in_currency: 0.8,
      market_cap_change_24h: 470000000,
      market_cap_change_percentage_24h: 5.9,
      circulating_supply: 589000000000000,
      total_supply: 1000000000000000,
      max_supply: null,
      ath: 0.00008,
      ath_change_percentage: -77.5,
      ath_date: '2021-10-28T03:54:55.568Z',
      atl: 0.000000000056,
      atl_change_percentage: 32142857.1,
      atl_date: '2020-11-28T11:26:25.838Z',
      roi: null,
      last_updated: new Date().toISOString()
    },
    {
      id: 'polygon',
      symbol: 'matic',
      name: 'Polygon',
      image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
      current_price: 0.65,
      market_cap: 6500000000,
      market_cap_rank: 10,
      fully_diluted_valuation: 6500000000,
      total_volume: 320000000,
      high_24h: 0.66,
      low_24h: 0.64,
      price_change_24h: 0.01,
      price_change_percentage_24h: 1.6,
      price_change_percentage_7d_in_currency: -3.2,
      price_change_percentage_1h_in_currency: 0.3,
      market_cap_change_24h: 100000000,
      market_cap_change_percentage_24h: 1.6,
      circulating_supply: 10000000000,
      total_supply: 10000000000,
      max_supply: 10000000000,
      ath: 2.92,
      ath_change_percentage: -77.7,
      ath_date: '2021-12-27T02:08:34.307Z',
      atl: 0.01,
      atl_change_percentage: 6400.0,
      atl_date: '2019-05-10T00:00:00.000Z',
      roi: null,
      last_updated: new Date().toISOString()
    },
    {
      id: 'avalanche-2',
      symbol: 'avax',
      name: 'Avalanche',
      image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
      current_price: 28.5,
      market_cap: 6200000000,
      market_cap_rank: 11,
      fully_diluted_valuation: 6800000000,
      total_volume: 280000000,
      high_24h: 29.0,
      low_24h: 28.0,
      price_change_24h: 0.5,
      price_change_percentage_24h: 1.8,
      price_change_percentage_7d_in_currency: -2.5,
      price_change_percentage_1h_in_currency: 0.2,
      market_cap_change_24h: 110000000,
      market_cap_change_percentage_24h: 1.8,
      circulating_supply: 217000000,
      total_supply: 720000000,
      max_supply: 720000000,
      ath: 146.22,
      ath_change_percentage: -80.5,
      ath_date: '2021-11-21T14:18:56.538Z',
      atl: 2.8,
      atl_change_percentage: 917.9,
      atl_date: '2020-12-31T13:15:21.540Z',
      roi: null,
      last_updated: new Date().toISOString()
    },
    {
      id: 'chainlink',
      symbol: 'link',
      name: 'Chainlink',
      image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
      current_price: 13.8,
      market_cap: 5900000000,
      market_cap_rank: 12,
      fully_diluted_valuation: 13800000000,
      total_volume: 450000000,
      high_24h: 14.0,
      low_24h: 13.5,
      price_change_24h: 0.3,
      price_change_percentage_24h: 2.2,
      price_change_percentage_7d_in_currency: 5.6,
      price_change_percentage_1h_in_currency: 0.4,
      market_cap_change_24h: 130000000,
      market_cap_change_percentage_24h: 2.2,
      circulating_supply: 427000000,
      total_supply: 1000000000,
      max_supply: 1000000000,
      ath: 52.7,
      ath_change_percentage: -73.8,
      ath_date: '2021-05-10T00:13:57.214Z',
      atl: 0.15,
      atl_change_percentage: 9100.0,
      atl_date: '2017-11-29T00:00:00.000Z',
      roi: null,
      last_updated: new Date().toISOString()
    },
    {
      id: 'uniswap',
      symbol: 'uni',
      name: 'Uniswap',
      image: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png',
      current_price: 7.2,
      market_cap: 5400000000,
      market_cap_rank: 13,
      fully_diluted_valuation: 7200000000,
      total_volume: 180000000,
      high_24h: 7.3,
      low_24h: 7.1,
      price_change_24h: 0.1,
      price_change_percentage_24h: 1.4,
      price_change_percentage_7d_in_currency: -2.1,
      price_change_percentage_1h_in_currency: 0.2,
      market_cap_change_24h: 75000000,
      market_cap_change_percentage_24h: 1.4,
      circulating_supply: 750000000,
      total_supply: 1000000000,
      max_supply: 1000000000,
      ath: 44.92,
      ath_change_percentage: -84.0,
      ath_date: '2021-05-03T05:25:04.822Z',
      atl: 1.03,
      atl_change_percentage: 598.1,
      atl_date: '2020-09-17T01:20:38.214Z',
      roi: null,
      last_updated: new Date().toISOString()
    },
    {
      id: 'litecoin',
      symbol: 'ltc',
      name: 'Litecoin',
      image: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png',
      current_price: 72.5,
      market_cap: 5300000000,
      market_cap_rank: 14,
      fully_diluted_valuation: null,
      total_volume: 350000000,
      high_24h: 73.0,
      low_24h: 71.5,
      price_change_24h: 1.0,
      price_change_percentage_24h: 1.4,
      price_change_percentage_7d_in_currency: -3.2,
      price_change_percentage_1h_in_currency: 0.2,
      market_cap_change_24h: 73000000,
      market_cap_change_percentage_24h: 1.4,
      circulating_supply: 73000000,
      total_supply: 84000000,
      max_supply: 84000000,
      ath: 410.26,
      ath_change_percentage: -82.3,
      ath_date: '2021-05-10T03:13:07.904Z',
      atl: 1.15,
      atl_change_percentage: 6204.3,
      atl_date: '2015-01-14T00:00:00.000Z',
      roi: null,
      last_updated: new Date().toISOString()
    },
    {
      id: 'bitcoin-cash',
      symbol: 'bch',
      name: 'Bitcoin Cash',
      image: 'https://assets.coingecko.com/coins/images/780/large/bitcoin-cash-circle.png',
      current_price: 260,
      market_cap: 5100000000,
      market_cap_rank: 15,
      fully_diluted_valuation: 5500000000,
      total_volume: 180000000,
      high_24h: 265,
      low_24h: 255,
      price_change_24h: 5,
      price_change_percentage_24h: 2.0,
      price_change_percentage_7d_in_currency: -1.8,
      price_change_percentage_1h_in_currency: 0.3,
      market_cap_change_24h: 100000000,
      market_cap_change_percentage_24h: 2.0,
      circulating_supply: 19500000,
      total_supply: 21000000,
      max_supply: 21000000,
      ath: 3785.82,
      ath_change_percentage: -93.1,
      ath_date: '2017-12-20T00:00:00.000Z',
      atl: 76.93,
      atl_change_percentage: 238.0,
      atl_date: '2018-12-15T00:00:00.000Z',
      roi: null,
      last_updated: new Date().toISOString()
    },
    {
      id: 'stellar',
      symbol: 'xlm',
      name: 'Stellar',
      image: 'https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png',
      current_price: 0.12,
      market_cap: 3400000000,
      market_cap_rank: 16,
      fully_diluted_valuation: 6000000000,
      total_volume: 120000000,
      high_24h: 0.122,
      low_24h: 0.118,
      price_change_24h: 0.002,
      price_change_percentage_24h: 1.7,
      price_change_percentage_7d_in_currency: -2.5,
      price_change_percentage_1h_in_currency: 0.2,
      market_cap_change_24h: 57000000,
      market_cap_change_percentage_24h: 1.7,
      circulating_supply: 28000000000,
      total_supply: 50000000000,
      max_supply: 50000000000,
      ath: 0.875,
      ath_change_percentage: -86.3,
      ath_date: '2018-01-03T00:00:00.000Z',
      atl: 0.001,
      atl_change_percentage: 11900.0,
      atl_date: '2015-03-05T00:00:00.000Z',
      roi: null,
      last_updated: new Date().toISOString()
    },
    {
      id: 'monero',
      symbol: 'xmr',
      name: 'Monero',
      image: 'https://assets.coingecko.com/coins/images/69/large/monero_logo.png',
      current_price: 180,
      market_cap: 3300000000,
      market_cap_rank: 17,
      fully_diluted_valuation: null,
      total_volume: 110000000,
      high_24h: 182,
      low_24h: 178,
      price_change_24h: 2,
      price_change_percentage_24h: 1.1,
      price_change_percentage_7d_in_currency: -2.3,
      price_change_percentage_1h_in_currency: 0.1,
      market_cap_change_24h: 36000000,
      market_cap_change_percentage_24h: 1.1,
      circulating_supply: 18300000,
      total_supply: null,
      max_supply: null,
      ath: 542.33,
      ath_change_percentage: -66.8,
      ath_date: '2021-05-07T12:44:47.246Z',
      atl: 0.216,
      atl_change_percentage: 83200.0,
      atl_date: '2015-01-14T00:00:00.000Z',
      roi: null,
      last_updated: new Date().toISOString()
    },
    {
      id: 'cosmos',
      symbol: 'atom',
      name: 'Cosmos Hub',
      image: 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png',
      current_price: 9.8,
      market_cap: 3200000000,
      market_cap_rank: 18,
      fully_diluted_valuation: null,
      total_volume: 150000000,
      high_24h: 9.9,
      low_24h: 9.7,
      price_change_24h: 0.1,
      price_change_percentage_24h: 1.0,
      price_change_percentage_7d_in_currency: -4.5,
      price_change_percentage_1h_in_currency: 0.2,
      market_cap_change_24h: 32000000,
      market_cap_change_percentage_24h: 1.0,
      circulating_supply: 326000000,
      total_supply: null,
      max_supply: null,
      ath: 44.45,
      ath_change_percentage: -78.0,
      ath_date: '2022-01-17T00:34:41.497Z',
      atl: 1.16,
      atl_change_percentage: 745.7,
      atl_date: '2020-03-13T02:27:44.591Z',
      roi: null,
      last_updated: new Date().toISOString()
    },
    {
      id: 'tron',
      symbol: 'trx',
      name: 'TRON',
      image: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png',
      current_price: 0.11,
      market_cap: 3100000000,
      market_cap_rank: 19,
      fully_diluted_valuation: null,
      total_volume: 180000000,
      high_24h: 0.112,
      low_24h: 0.108,
      price_change_24h: 0.002,
      price_change_percentage_24h: 1.9,
      price_change_percentage_7d_in_currency: -1.5,
      price_change_percentage_1h_in_currency: 0.3,
      market_cap_change_24h: 58000000,
      market_cap_change_percentage_24h: 1.9,
      circulating_supply: 28000000000,
      total_supply: 28000000000,
      max_supply: null,
      ath: 0.231,
      ath_change_percentage: -52.4,
      ath_date: '2018-01-05T00:00:00.000Z',
      atl: 0.001,
      atl_change_percentage: 10900.0,
      atl_date: '2017-11-12T00:00:00.000Z',
      roi: null,
      last_updated: new Date().toISOString()
    },
    {
      id: 'filecoin',
      symbol: 'fil',
      name: 'Filecoin',
      image: 'https://assets.coingecko.com/coins/images/12817/large/filecoin.png',
      current_price: 4.8,
      market_cap: 2900000000,
      market_cap_rank: 20,
      fully_diluted_valuation: 9600000000,
      total_volume: 130000000,
      high_24h: 4.85,
      low_24h: 4.75,
      price_change_24h: 0.05,
      price_change_percentage_24h: 1.1,
      price_change_percentage_7d_in_currency: -3.8,
      price_change_percentage_1h_in_currency: 0.2,
      market_cap_change_24h: 31000000,
      market_cap_change_percentage_24h: 1.1,
      circulating_supply: 600000000,
      total_supply: 1200000000,
      max_supply: 2000000000,
      ath: 237.24,
      ath_change_percentage: -98.0,
      ath_date: '2021-04-01T13:29:41.564Z',
      atl: 2.64,
      atl_change_percentage: 81.8,
      atl_date: '2022-12-16T22:45:28.552Z',
      roi: null,
      last_updated: new Date().toISOString()
    }
  ];

  // Return only the requested number of coins
  return baseFallbackData.slice(0, limit);
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
export function useMarket(limit: number = 20) {
  const { data, error, isLoading, mutate } = useSWR<CoinMarketData[]>(
    `market-data-${limit}`,
    () => getTopCoins(limit),
    {
      refreshInterval: 5 * 60 * 1000, // 5 minutes
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2 * 60 * 1000, // 2 minutes
      fallbackData: getFallbackCoinsData(limit), // Provide fallback data with correct limit
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
    data: data || getFallbackCoinsData(limit),
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