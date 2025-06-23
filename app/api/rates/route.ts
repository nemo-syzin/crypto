import { NextResponse } from 'next/server';
import { getTopCoins, getGlobalMarketData } from '@/lib/coingecko';
import { getFearGreedIndex } from '@/lib/fng';

// Cache for 30 seconds
let cache: {
  data: any;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 30 * 1000; // 30 seconds

export async function GET() {
  try {
    const now = Date.now();
    
    // Return cached data if still valid
    if (cache && (now - cache.timestamp) < CACHE_DURATION) {
      return NextResponse.json(cache.data);
    }

    // Fetch fresh data
    const [coins, global, fearGreed] = await Promise.allSettled([
      getTopCoins(10),
      getGlobalMarketData(),
      getFearGreedIndex(),
    ]);

    const data = {
      coins: coins.status === 'fulfilled' ? coins.value : [],
      global: global.status === 'fulfilled' ? global.value : null,
      fearGreed: fearGreed.status === 'fulfilled' ? fearGreed.value : null,
      lastUpdated: new Date().toISOString(),
    };

    // Update cache
    cache = {
      data,
      timestamp: now,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rates' },
      { status: 500 }
    );
  }
}