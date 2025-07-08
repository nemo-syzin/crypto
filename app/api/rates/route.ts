import { NextResponse } from 'next/server';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

interface ExchangeRateRecord {
  id: number;
  currency_code: string;
  sell: number;
  buy: number;
  updated_at: string;
}

interface RatesResponse {
  rates: { [currencyCode: string]: { sell: number | null; buy: number | null; updated_at?: string } };
  timestamp: string;
  isFromDatabase: boolean;
  error?: string;
  isFallback?: boolean;
}

let cache: { data: RatesResponse; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 1000; // Увеличиваем кэш до 1 минуты

const getFallbackData = (): RatesResponse => ({
  rates: {
    USDT: { sell: 95.50, buy: 94.80, updated_at: new Date().toISOString() },
    BTC: { sell: 2800000, buy: 2750000, updated_at: new Date().toISOString() },
    ETH: { sell: 180000, buy: 175000, updated_at: new Date().toISOString() },
    BNB: { sell: 25000, buy: 24500, updated_at: new Date().toISOString() },
    ADA: { sell: 35, buy: 34, updated_at: new Date().toISOString() },
    DOT: { sell: 450, buy: 440, updated_at: new Date().toISOString() }
  },
  timestamp: new Date().toISOString(),
  isFromDatabase: false,
  isFallback: true
});

export async function GET() {
  try {
    const now = Date.now();
    
    // Check cache first
    if (cache && (now - cache.timestamp) < CACHE_DURATION) {
      return NextResponse.json(cache.data);
    }

    console.log('🔄 Fetching fresh rates from database...');
    
    if (!isSupabaseAvailable()) {
      console.warn('⚠️ Supabase not available, using fallback data');
      const fallbackData = getFallbackData();
      fallbackData.error = 'Supabase configuration issue: URL or KEY missing';
      return NextResponse.json(fallbackData);
    }

    // Получаем все курсы из базы данных
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase query error:', error);
      const fallbackData = getFallbackData();
      fallbackData.error = `Database error: ${error.message}`;
      return NextResponse.json(fallbackData);
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ No data found in exchange_rates table');
      const fallbackData = getFallbackData();
      fallbackData.error = 'No exchange rate data found in database';
      return NextResponse.json(fallbackData);
    }

    console.log(`📊 Found ${data.length} exchange rate records`);

    // Группируем курсы по валютам (берем последний курс для каждой валюты)
    const ratesMap: { [currencyCode: string]: { sell: number | null; buy: number | null; updated_at?: string } } = {};
    
    data.forEach((record: ExchangeRateRecord) => {
      if (record.currency_code && record.sell && record.buy) {
        // Если курс для этой валюты еще не добавлен или текущий курс новее
        if (!ratesMap[record.currency_code] || 
            new Date(record.updated_at) > new Date(ratesMap[record.currency_code].updated_at || '')) {
          ratesMap[record.currency_code] = {
            sell: Number(record.sell),
            buy: Number(record.buy),
            updated_at: record.updated_at
          };
        }
      }
    });

    const responseData: RatesResponse = {
      rates: ratesMap,
      timestamp: new Date().toISOString(),
      isFromDatabase: true
    };

    // Update cache
    cache = { data: responseData, timestamp: now };
    
    console.log(`✅ Successfully loaded rates for ${Object.keys(ratesMap).length} currencies`);
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('❌ API Error in /api/rates:', error);
    const fallbackData = getFallbackData();
    fallbackData.error = error instanceof Error ? error.message : 'API request failed';
    return NextResponse.json(fallbackData);
  }
}