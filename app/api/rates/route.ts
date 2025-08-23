export const runtime = 'edge'; // важно: Edge runtime → Web Fetch вместо undici

import { NextResponse } from 'next/server';
import { getValidatedKenigRates } from '@/lib/supabase/validated-rates';

let cache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 120 * 1000;

const getFallbackData = () => ({
  kenig: { sell: 95.50, buy: 94.80, updated_at: new Date().toISOString() },
  bestchange: { sell: 95.30, buy: 94.90, updated_at: new Date().toISOString() },
  energo: { sell: 95.20, buy: 94.70, updated_at: new Date().toISOString() },
  timestamp: new Date().toISOString(),
  isFromDatabase: false,
  isFallback: true,
});

export async function GET() {
  try {
    // простой cache-guard
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json(cache.data, {
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
      });
    }

    const result = await getValidatedKenigRates();

    // Find rates by source or use fallback
    const fallback = getFallbackData();
    const findRateBySource = (source: string) => {
      return result.rates.find(rate => rate.source === source && rate.isValid);
    };

    const kenigRate = findRateBySource('kenig');
    const bestchangeRate = findRateBySource('bestchange');
    const energoRate = findRateBySource('energo');

    // Схема ответа — подстрой под свой фронт:
    const payload: any = {
      kenig: kenigRate 
        ? { sell: kenigRate.sell, buy: kenigRate.buy, updated_at: kenigRate.updated_at }
        : fallback.kenig,
      bestchange: bestchangeRate
        ? { sell: bestchangeRate.sell, buy: bestchangeRate.buy, updated_at: bestchangeRate.updated_at }
        : fallback.bestchange,
      energo: energoRate
        ? { sell: energoRate.sell, buy: energoRate.buy, updated_at: energoRate.updated_at }
        : fallback.energo,
      timestamp: new Date().toISOString(),
      isFromDatabase: result.isFromDatabase,
      meta: {
        totalRates: result.totalRates,
        valid: result.validRatesCount,
        invalid: result.invalidRatesCount,
        lastUpdated: result.lastUpdated.toISOString(),
      },
    };

    if (!result.hasValidRates) {
      payload.error = result.error || 'No valid rates';
    }

    cache = { data: payload, timestamp: Date.now() };

    return NextResponse.json(payload, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (error: any) {
    const fb = getFallbackData();
    fb.error = error?.message || 'API request failed';
    return NextResponse.json(fb, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
    });
  }
}