export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 30;

import { NextResponse } from 'next/server';
import { getKenigAndBestchangeUSDT } from '@/lib/supabase/validated-rates';

let cachedData: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 10000;

export async function GET() {
  const now = Date.now();

  if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('✅ [API] Returning cached rates comparison data');
    return NextResponse.json(cachedData, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=20',
        'CDN-Cache-Control': 'public, s-maxage=10',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=10',
      }
    });
  }
  try {
    console.log('🔄 [API] Fetching rates comparison data...');

    const result = await getKenigAndBestchangeUSDT();

    console.log('📊 [API] Rates data received:', {
      hasKenig: !!result.kenig,
      hasBestchange: !!result.bestchange,
      isFromDatabase: result.isFromDatabase,
      lastUpdated: result.lastUpdated
    });

    const kenigData = result.kenig ? {
      sell: Number(result.kenig.sell),
      buy: Number(result.kenig.buy),
      updated_at: result.kenig.updated_at
    } : null;

    const bestchangeData = result.bestchange ? {
      sell: Number(result.bestchange.sell),
      buy: Number(result.bestchange.buy),
      updated_at: result.bestchange.updated_at
    } : null;

    const response = {
      kenig: kenigData,
      bestchange: bestchangeData,
      timestamp: new Date().toISOString(),
      isFromDatabase: result.isFromDatabase,
      meta: {
        lastUpdated: result.lastUpdated.toISOString()
      }
    };

    if (!kenigData && !bestchangeData) {
      console.warn('⚠️ [API] No rate data available from database');
      return NextResponse.json({
        ...response,
        error: 'No rate data available. Please check if rates are configured in the database.'
      }, {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
    }

    console.log('✅ [API] Successfully returning rates comparison data');

    cachedData = response;
    cacheTimestamp = now;

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=20',
        'CDN-Cache-Control': 'public, s-maxage=10',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=10',
      }
    });

  } catch (error: any) {
    console.error('❌ [API] Error fetching rates comparison:', error);

    return NextResponse.json({
      kenig: null,
      bestchange: null,
      timestamp: new Date().toISOString(),
      isFromDatabase: false,
      error: error?.message || 'Failed to fetch rates comparison data',
      meta: {
        lastUpdated: new Date().toISOString()
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      }
    });
  }
}
