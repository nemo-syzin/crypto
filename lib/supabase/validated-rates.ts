import { supabase, isSupabaseAvailable, getSupabaseStatus } from './client';

export interface ValidatedKenigRate {
  id: number;
  source: string;
  sell: number;
  buy: number;
  updated_at: string;
  isValid: boolean;
  validationErrors: string[];
}

export interface RateValidationResult {
  rates: ValidatedKenigRate[];
  hasValidRates: boolean;
  totalRates: number;
  validRatesCount: number;
  invalidRatesCount: number;
  lastUpdated: Date;
  isFromDatabase: boolean;
  error?: string;
}

function validateRateValue(value: any, fieldName: string, min: number = 50, max: number = 200): { isValid: boolean; error?: string } {
  if (value === null || value === undefined) {
    return { isValid: false, error: `${fieldName} is null or undefined` };
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : Number(value);
  
  if (isNaN(numericValue) || !isFinite(numericValue)) {
    return { isValid: false, error: `${fieldName} is not a valid number` };
  }

  if (numericValue < min || numericValue > max) {
    return { isValid: false, error: `${fieldName} out of range (${min}-${max})` };
  }

  return { isValid: true };
}

function validateRateRecord(rate: any): ValidatedKenigRate {
  const validationErrors: string[] = [];
  let isValid = true;

  const sellField = rate.usdt_sell_rate !== undefined ? 'usdt_sell_rate' : 'sell';
  const buyField = rate.usdt_buy_rate !== undefined ? 'usdt_buy_rate' : 'buy';

  const sellValidation = validateRateValue(rate[sellField], 'Sell rate');
  if (!sellValidation.isValid) {
    validationErrors.push(sellValidation.error!);
    isValid = false;
  }

  const buyValidation = validateRateValue(rate[buyField], 'Buy rate');
  if (!buyValidation.isValid) {
    validationErrors.push(buyValidation.error!);
    isValid = false;
  }

  if (sellValidation.isValid && buyValidation.isValid) {
    const sellRate = parseFloat(rate[sellField]);
    const buyRate = parseFloat(rate[buyField]);
    
    if (sellRate <= buyRate) {
      validationErrors.push(`Sell rate should be higher than buy rate`);
      isValid = false;
    }
  }

  const timestamp = rate.updated_at || rate.created_at;
  if (!timestamp) {
    validationErrors.push('Timestamp is missing');
    isValid = false;
  }

  return {
    id: rate.id || 0,
    source: rate.source || 'unknown',
    sell: sellValidation.isValid ? parseFloat(rate[sellField]) : 0,
    buy: buyValidation.isValid ? parseFloat(rate[buyField]) : 0,
    updated_at: timestamp || new Date().toISOString(),
    isValid,
    validationErrors
  };
}

export async function getValidatedKenigRates(): Promise<RateValidationResult> {
  const status = getSupabaseStatus();
  
  if (!isSupabaseAvailable()) {
    return {
      rates: [],
      hasValidRates: false,
      totalRates: 0,
      validRatesCount: 0,
      invalidRatesCount: 0,
      lastUpdated: new Date(),
      isFromDatabase: false,
      error: 'Supabase not configured'
    };
  }

  try {
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        rates: [],
        hasValidRates: false,
        totalRates: 0,
        validRatesCount: 0,
        invalidRatesCount: 0,
        lastUpdated: new Date(),
        isFromDatabase: true,
        error: 'No data found'
      };
    }

    const validatedRates = data.map(validateRateRecord);
    const validRates = validatedRates.filter(rate => rate.isValid);

    return {
      rates: validatedRates,
      hasValidRates: validRates.length > 0,
      totalRates: validatedRates.length,
      validRatesCount: validRates.length,
      invalidRatesCount: validatedRates.length - validRates.length,
      lastUpdated: new Date(),
      isFromDatabase: true
    };

  } catch (error) {
    return {
      rates: [],
      hasValidRates: false,
      totalRates: 0,
      validRatesCount: 0,
      invalidRatesCount: 0,
      lastUpdated: new Date(),
      isFromDatabase: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}