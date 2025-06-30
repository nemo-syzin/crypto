import { NextResponse } from 'next/server';
import { getValidatedKenigRates } from '@/lib/supabase/validated-rates';

let cache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 30 * 1000; // 30 seconds

const getFallbackData = () => ({
  kenig: { sell: 95.50, buy: 94.80, updated_at: new Date().toISOString() },
  bestchange: { sell: 95.30, buy: 94.90, updated_at: new Date().toISOString() },
  energo: { sell: 95.20, buy: 94.70, updated_at: new Date().toISOString() },
  timestamp: new Date().toISOString(),
  isFromDatabase: false,
});

export async function GET() {
  try {
    const now = Date.now();
    
    // Check cache first
    if (cache && (now - cache.timestamp) < CACHE_DURATION) {
      console.log('📦 Serving cached rates data');
      return NextResponse.json(cache.data);
    }

    console.log('🔄 Fetching fresh rates from database...');
    const validationResult = await getValidatedKenigRates();
    
    const data = {
      kenig: { sell: null, buy: null },
      bestchange: { sell: null, buy: null },
      energo: { sell: null, buy: null },
      timestamp: new Date().toISOString(),
      isFromDatabase: validationResult.isFromDatabase,
      error: validationResult.error
    };

    if (validationResult.hasValidRates) {
      console.log(`✅ Found ${validationResult.validRatesCount} valid rates`);
      
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
        }
      });
    } else {
      console.warn('⚠️ No valid rates found, using fallback data');
      const fallback = getFallbackData();
      Object.assign(data, fallback);
    }

    // Update cache
    cache = { data, timestamp: now };
    
    console.log('📤 Returning rates data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ API Error in /api/rates:', error);
    const fallbackData = getFallbackData();
    fallbackData.error = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(fallbackData);
  }
}