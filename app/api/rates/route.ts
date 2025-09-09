export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getKenigAndBestchangeUSDT } from '@/lib/supabase/validated-rates';

let cache: { data: any; t: number } | null = null;
const CACHE_MS = 60_000; // 60 сек, чтобы не отставать от воркера (который апдейтит раз/мин)

export async function GET() {
  // короткий edge-кэш
  if (cache && Date.now() - cache.t < CACHE_MS) {
    return NextResponse.json(cache.data, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
    });
  }

  try {
    const { kenig, bestchange, isFromDatabase, lastUpdated } =
      await getKenigAndBestchangeUSDT();

    const payload = {
      kenig: kenig
        ? { sell: Number(kenig.sell), buy: Number(kenig.buy), updated_at: kenig.updated_at }
        : null,
      bestchange: bestchange
        ? { sell: Number(bestchange.sell), buy: Number(bestchange.buy), updated_at: bestchange.updated_at }
        : null,
      timestamp: new Date().toISOString(),
      isFromDatabase,
      meta: { lastUpdated: lastUpdated?.toISOString?.() ?? new Date().toISOString() },
    };

    cache = { data: payload, t: Date.now() };

    return NextResponse.json(payload, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
    });
  } catch (e: any) {
    const fb = {
      kenig: null,
      bestchange: null,
      timestamp: new Date().toISOString(),
      isFromDatabase: false,
      error: e?.message || 'failed',
    };
    return NextResponse.json(fb, {
      status: 500,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}