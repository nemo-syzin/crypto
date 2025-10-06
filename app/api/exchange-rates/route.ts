export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSupabaseClient, isServerSupabaseConfigured } from '@/lib/supabase/server';

interface RateRow {
  source: string;
  base: string;
  quote: string;
  from_currency: string;
  to_currency: string;
  buy: number | null;
  sell: number | null;
  updated_at: string;
  is_active: boolean;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from')?.toUpperCase();
    const to = searchParams.get('to')?.toUpperCase();

    if (!from || !to) {
      return NextResponse.json(
        { error: 'Missing from or to currency parameters' },
        { status: 400 }
      );
    }

    if (!isServerSupabaseConfigured()) {
      console.error('Supabase not configured for exchange rates');
      return NextResponse.json(
        {
          error: 'Database not configured',
          rate: 0,
          mock: true
        },
        { status: 503 }
      );
    }

    const supabase = getServerSupabaseClient();

    // Query for both direct and inverse rates
    const { data, error } = await supabase
      .from('kenig_rates')
      .select('source, base, quote, from_currency, to_currency, buy, sell, updated_at, is_active')
      .eq('is_active', true)
      .or(`and(base.eq.${from},quote.eq.${to}),and(base.eq.${to},quote.eq.${from})`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Database query failed', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: `No rate found for ${from}/${to}`, rate: 0 },
        { status: 404 }
      );
    }

    const rows = data as RateRow[];

    // Priority sources
    const PRIORITY = ['kenig', 'bestchange', 'energo', 'derived'];

    // Try to find direct rate (FROM/TO) - use BUY rate
    for (const source of PRIORITY) {
      const direct = rows.find(
        r => r.source === source && r.base === from && r.quote === to && r.buy && Number(r.buy) > 0
      );
      if (direct) {
        return NextResponse.json({
          rate: Number(direct.buy),
          source: direct.source,
          direction: 'direct',
          updated_at: direct.updated_at,
          pair: `${from}/${to}`,
        });
      }
    }

    // Try inverse rate (TO/FROM) - use 1/SELL rate
    for (const source of PRIORITY) {
      const inverse = rows.find(
        r => r.source === source && r.base === to && r.quote === from && r.sell && Number(r.sell) > 0
      );
      if (inverse) {
        return NextResponse.json({
          rate: 1 / Number(inverse.sell),
          source: inverse.source,
          direction: 'inverse',
          updated_at: inverse.updated_at,
          pair: `${from}/${to}`,
        });
      }
    }

    // Fallback: any source
    const anyDirect = rows.find(r => r.base === from && r.quote === to && r.buy && Number(r.buy) > 0);
    if (anyDirect) {
      return NextResponse.json({
        rate: Number(anyDirect.buy),
        source: anyDirect.source,
        direction: 'direct',
        updated_at: anyDirect.updated_at,
        pair: `${from}/${to}`,
      });
    }

    const anyInverse = rows.find(r => r.base === to && r.quote === from && r.sell && Number(r.sell) > 0);
    if (anyInverse) {
      return NextResponse.json({
        rate: 1 / Number(anyInverse.sell),
        source: anyInverse.source,
        direction: 'inverse',
        updated_at: anyInverse.updated_at,
        pair: `${from}/${to}`,
      });
    }

    return NextResponse.json(
      { error: `No valid rate found for ${from}/${to}`, rate: 0 },
      { status: 404 }
    );

  } catch (error) {
    console.error('Exchange rates API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
