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
  console.log('🔄 [API /rates] Starting request...');
  
  // Логируем переменные окружения (без раскрытия полных значений)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Early validation of environment variables
  if (!supabaseUrl || !supabaseKey || 
      supabaseUrl === 'https://your-project-id.supabase.co' ||
      supabaseKey === 'your-anon-public-key-here' ||
      !supabaseUrl.startsWith('https://') ||
      supabaseKey.length < 50) {
    
    console.error('❌ [API /rates] Invalid Supabase configuration:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlIsPlaceholder: supabaseUrl === 'https://your-project-id.supabase.co',
      keyIsPlaceholder: supabaseKey === 'your-anon-public-key-here',
      urlValid: supabaseUrl?.startsWith('https://'),
      keyValid: supabaseKey && supabaseKey.length > 50
    });
    
    const fallback = getFallbackData();
    fallback.error = 'Supabase configuration error: Please check your environment variables';
    
    return NextResponse.json(fallback, {
      status: 500,
      headers: { 'Cache-Control': 'no-cache' },
    });
  }
  
  console.log('🔧 [API /rates] Environment check:', {
    hasSupabaseUrl: !!supabaseUrl,
    supabaseUrlValid: supabaseUrl?.startsWith('https://'),
    supabaseUrlPreview: supabaseUrl?.substring(0, 30) + '...',
    hasSupabaseKey: !!supabaseKey,
    supabaseKeyLength: supabaseKey?.length || 0,
    supabaseKeyPreview: supabaseKey?.substring(0, 10) + '...',
    nodeEnv: process.env.NODE_ENV,
    runtime: 'edge'
  });

  try {
    // простой cache-guard
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      console.log('📦 [API /rates] Returning cached data');
      return NextResponse.json(cache.data, {
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
      });
    }

    console.log('🔄 [API /rates] Fetching fresh data from Supabase...');
    const result = await getValidatedKenigRates();
    
    console.log('📊 [API /rates] Supabase result:', {
      isFromDatabase: result.isFromDatabase,
      totalRates: result.totalRates,
      validRatesCount: result.validRatesCount,
      invalidRatesCount: result.invalidRatesCount,
      hasValidRates: result.hasValidRates,
      error: result.error,
      lastUpdated: result.lastUpdated.toISOString()
    });

    // Find rates by source or use fallback
    const fallback = getFallbackData();
    const findRateBySource = (source: string) => {
      return result.rates.find(rate => rate.source === source && rate.isValid);
    };

    const kenigRate = findRateBySource('kenig');
    const bestchangeRate = findRateBySource('bestchange');
    const energoRate = findRateBySource('energo');
    
    console.log('💰 [API /rates] Found rates:', {
      kenig: kenigRate ? { sell: kenigRate.sell, buy: kenigRate.buy } : 'not found',
      bestchange: bestchangeRate ? { sell: bestchangeRate.sell, buy: bestchangeRate.buy } : 'not found',
      energo: energoRate ? { sell: energoRate.sell, buy: energoRate.buy } : 'not found'
    });

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
      console.warn('⚠️ [API /rates] No valid rates found, error:', payload.error);
    } else {
      console.log('✅ [API /rates] Successfully prepared response with valid rates');
    }

    cache = { data: payload, timestamp: Date.now() };

    console.log('📤 [API /rates] Sending response:', {
      hasKenigRate: !!payload.kenig?.sell,
      hasBestchangeRate: !!payload.bestchange?.sell,
      hasEnergoRate: !!payload.energo?.sell,
      isFromDatabase: payload.isFromDatabase,
      hasError: !!payload.error
    });

    return NextResponse.json(payload, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (error: any) {
    console.error('❌ [API /rates] Unexpected error:', {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      name: error?.name,
      cause: error?.cause
    });
    
    const fb = getFallbackData();
    fb.error = error?.message || 'API request failed';
    
    console.log('📦 [API /rates] Returning fallback data due to error');
    
    return NextResponse.json(fb, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
    });
  }
}