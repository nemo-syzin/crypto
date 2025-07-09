export const dynamic = 'force-dynamic';   // ⬅️  запрет SSG / Static Export

import { NextResponse } from 'next/server';
import { getValidatedKenigRates } from '@/lib/supabase/validated-rates';

let cache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // Increase cache to 5 minutes to reduce database load

const getFallbackData = () => ({
  kenig: { sell: 95.50, buy: 94.80, updated_at: new Date().toISOString() },
  bestchange: { sell: 95.30, buy: 94.90, updated_at: new Date().toISOString() },
  energo: { sell: 95.20, buy: 94.70, updated_at: new Date().toISOString() },
  timestamp: new Date().toISOString(),
  isFromDatabase: false,
  isFallback: true,
  error: 'Using fallback data due to database connectivity issues'
});

export async function GET() {
  try {
    const now = Date.now();
    
    // Check cache first
    if (cache && (now - cache.timestamp) < CACHE_DURATION) {
      console.log('📦 Serving cached data');
      return NextResponse.json(cache.data);
    }

    console.log('🔄 Fetching fresh rates from database...');
    
    // Add timeout to the entire operation
    const validationResult = await Promise.race([
      getValidatedKenigRates(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout after 15 seconds')), 15000)
      )
    ]);
    
    const data = {
      kenig: { sell: null, buy: null },
      bestchange: { sell: null, buy: null },
      energo: { sell: null, buy: null },
      timestamp: new Date().toISOString(),
      isFromDatabase: validationResult.isFromDatabase,
      error: validationResult.error,
      debug: {
        totalRates: validationResult.totalRates,
        validRatesCount: validationResult.validRatesCount,
        invalidRatesCount: validationResult.invalidRatesCount
      }
    };

    if (validationResult.hasValidRates) {
      
      validationResult.rates.forEach(rate => {
        if (rate.isValid) {
          const rateData = {
            sell: Number(rate.sell),
            buy: Number(rate.buy),
            updated_at: rate.updated_at
          };

          if (rate.source === 'kenig') data.kenig = rateData;
          else if (rate.source === 'bestchange') data.bestchange = rateData;
          else if (rate.source === 'energo') data.energo = rateData;
        } else {
          console.warn(`⚠️ Invalid rate for ${rate.source}:`, rate.validationErrors);
        }
      });
      
      // Update cache with successful data
      cache = { data, timestamp: now };
      console.log('✅ Successfully fetched and cached fresh data');
    } else {
      console.warn('⚠️ No valid rates found, using fallback data. Error:', validationResult.error);
      const fallback = getFallbackData();
      fallback.error = validationResult.error || 'No valid rates available';
      Object.assign(data, fallback);
      
      // Only update cache if we don't have any cached data
      if (!cache) {
        cache = { data, timestamp: now };
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ API Error in /api/rates:', error);
    
    // If we have cached data, return it even if it's stale
    if (cache) {
      console.log('🔄 Returning stale cached data due to error');
      const staleData = { 
        ...cache.data, 
        error: `Database error: ${error instanceof Error ? error.message : 'Unknown error'}. Showing cached data.`,
        isStale: true 
      };
      return NextResponse.json(staleData);
    }
    
    const fallbackData = getFallbackData();
    fallbackData.error = error instanceof Error ? error.message : 'API request failed';
    return NextResponse.json(fallbackData);
  }
}