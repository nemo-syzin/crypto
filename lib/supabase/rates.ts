import { supabase, isSupabaseAvailable, getSupabaseStatus } from './client';

export interface ExchangeRate {
  id: number;
  sell: number;
  buy: number;
  last_price: number;
  base: string;
  quote: string;
  source: string;
  updated_at: string;
}

export interface RateValidationResult {
  rates: ExchangeRate[];
  hasValidRates: boolean;
  totalRates: number;
  validRatesCount: number;
  invalidRatesCount: number;
  lastUpdated: Date;
  isFromDatabase: boolean;
  error?: string;
}

function validateRateRecord(rate: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required fields
  if (!rate.base || typeof rate.base !== 'string') {
    errors.push('Base currency is missing or invalid');
  }
  
  if (!rate.quote || typeof rate.quote !== 'string') {
    errors.push('Quote currency is missing or invalid');
  }
  
  // Validate numeric fields
  const numericFields = ['sell', 'buy', 'last_price'];
  numericFields.forEach(field => {
    const value = rate[field];
    if (value === null || value === undefined || isNaN(Number(value)) || Number(value) <= 0) {
      errors.push(`${field} is missing or invalid`);
    }
  });
  
  // Validate sell > buy for spread
  if (rate.sell && rate.buy && Number(rate.sell) <= Number(rate.buy)) {
    errors.push('Sell rate should be higher than buy rate');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export async function fetchRates(): Promise<ExchangeRate[]> {
  const status = getSupabaseStatus();
  
  if (!isSupabaseAvailable()) {
    console.warn('⚠️ Supabase not available:', status);
    return getFallbackRates();
  }

  try {
    console.log('🔄 Fetching exchange rates from Supabase...');
    
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase query error:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ No exchange rates found in database');
      return getFallbackRates();
    }

    console.log('📊 Raw exchange rates data:', data);

    // Validate and transform data
    const validRates: ExchangeRate[] = [];
    const invalidRates: any[] = [];

    data.forEach(rate => {
      const validation = validateRateRecord(rate);
      
      if (validation.isValid) {
        validRates.push({
          id: rate.id,
          sell: Number(rate.sell),
          buy: Number(rate.buy),
          last_price: Number(rate.last_price),
          base: rate.base,
          quote: rate.quote,
          source: rate.source || 'unknown',
          updated_at: rate.updated_at
        });
      } else {
        invalidRates.push({ rate, errors: validation.errors });
      }
    });

    if (invalidRates.length > 0) {
      console.warn('⚠️ Invalid rates found:', invalidRates);
    }

    console.log(`✅ Successfully loaded ${validRates.length} valid exchange rates`);
    return validRates.length > 0 ? validRates : getFallbackRates();

  } catch (error) {
    console.error('❌ Error fetching exchange rates:', error);
    return getFallbackRates();
  }
}

function getFallbackRates(): ExchangeRate[] {
  return [
    {
      id: 1,
      sell: 95.50,
      buy: 94.80,
      last_price: 95.15,
      base: 'USDT',
      quote: 'RUB',
      source: 'kenig',
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      sell: 95.30,
      buy: 94.90,
      last_price: 95.10,
      base: 'USDT',
      quote: 'RUB',
      source: 'bestchange',
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      sell: 2650.00,
      buy: 2600.00,
      last_price: 2625.00,
      base: 'ETH',
      quote: 'USD',
      source: 'kenig',
      updated_at: new Date().toISOString()
    },
    {
      id: 4,
      sell: 43500.00,
      buy: 43000.00,
      last_price: 43250.00,
      base: 'BTC',
      quote: 'USD',
      source: 'kenig',
      updated_at: new Date().toISOString()
    }
  ];
}

export async function getAllAssets(): Promise<string[]> {
  try {
    const rates = await fetchRates();
    const assets = [...new Set(rates.flatMap(r => [r.base, r.quote]))];
    return assets.sort();
  } catch (error) {
    console.error('❌ Error getting assets:', error);
    return ['USDT', 'RUB', 'USD', 'EUR', 'BTC', 'ETH'];
  }
}

export async function getRate(base: string, quote: string): Promise<number | null> {
  try {
    const rates = await fetchRates();
    const rate = rates.find(r => r.base === base && r.quote === quote);
    return rate?.last_price ?? null;
  } catch (error) {
    console.error('❌ Error getting rate:', error);
    return null;
  }
}