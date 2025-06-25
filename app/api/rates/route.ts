import { NextResponse } from 'next/server';

// Cache for 30 seconds
let cache: {
  data: any;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 30 * 1000; // 30 seconds

// Fallback data in case of API failures
const getFallbackData = () => ({
  coins: [],
  global: null,
  fearGreed: {
    value: '50',
    value_classification: 'Neutral',
    timestamp: Date.now().toString(),
  },
  lastUpdated: new Date().toISOString(),
});

export async function GET() {
  try {
    const now = Date.now();
    
    // Return cached data if still valid
    if (cache && (now - cache.timestamp) < CACHE_DURATION) {
      return NextResponse.json(cache.data);
    }

    // Import functions dynamically to handle potential import errors
    let getTopCoins, getGlobalMarketData, getFearGreedIndex;
    
    try {
      const coingeckoModule = await import('@/lib/coingecko');
      getTopCoins = coingeckoModule.getTopCoins;
      getGlobalMarketData = coingeckoModule.getGlobalMarketData;
    } catch (error) {
      console.error('Failed to import CoinGecko functions:', error);
      // Return fallback data if imports fail
      const fallbackData = getFallbackData();
      return NextResponse.json(fallbackData);
    }

    try {
      const fngModule = await import('@/lib/fng');
      getFearGreedIndex = fngModule.getFearGreedIndex;
    } catch (error) {
      console.error('Failed to import Fear & Greed function:', error);
      // Continue without Fear & Greed data
    }

    // Fetch data with individual error handling
    const results = await Promise.allSettled([
      getTopCoins ? getTopCoins(10) : Promise.resolve([]),
      getGlobalMarketData ? getGlobalMarketData() : Promise.resolve(null),
      getFearGreedIndex ? getFearGreedIndex() : Promise.resolve({
        value: '50',
        value_classification: 'Neutral',
        timestamp: Date.now().toString(),
      }),
    ]);

    const data = {
      coins: results[0].status === 'fulfilled' ? results[0].value : [],
      global: results[1].status === 'fulfilled' ? results[1].value : null,
      fearGreed: results[2].status === 'fulfilled' ? results[2].value : {
        value: '50',
        value_classification: 'Neutral',
        timestamp: Date.now().toString(),
      },
      lastUpdated: new Date().toISOString(),
    };

    // Log any failed requests for debugging
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const sources = ['CoinGecko coins', 'CoinGecko global', 'Fear & Greed'];
        console.warn(`Failed to fetch ${sources[index]}:`, result.reason);
      }
    });

    // Update cache
    cache = {
      data,
      timestamp: now,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error in /api/rates:', error);
    
    // Return fallback data instead of error
    const fallbackData = getFallbackData();
    
    return NextResponse.json(fallbackData, {
      status: 200, // Return 200 with fallback data instead of 500
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }
}