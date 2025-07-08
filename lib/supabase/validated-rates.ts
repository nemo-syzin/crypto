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

  // Проверяем разные возможные названия полей
  const sellField = rate.usdt_sell_rate !== undefined ? 'usdt_sell_rate' : 
                   rate.sell_rate !== undefined ? 'sell_rate' : 
                   rate.sell !== undefined ? 'sell' : null;
                   
  const buyField = rate.usdt_buy_rate !== undefined ? 'usdt_buy_rate' : 
                  rate.buy_rate !== undefined ? 'buy_rate' : 
                  rate.buy !== undefined ? 'buy' : null;

  if (!sellField) {
    validationErrors.push('Sell rate field not found (checked: usdt_sell_rate, sell_rate, sell)');
    isValid = false;
  } else {
    const sellValidation = validateRateValue(rate[sellField], 'Sell rate');
    if (!sellValidation.isValid) {
      validationErrors.push(sellValidation.error!);
      isValid = false;
    }
  }

  if (!buyField) {
    validationErrors.push('Buy rate field not found (checked: usdt_buy_rate, buy_rate, buy)');
    isValid = false;
  } else {
    const buyValidation = validateRateValue(rate[buyField], 'Buy rate');
    if (!buyValidation.isValid) {
      validationErrors.push(buyValidation.error!);
      isValid = false;
    }
  }

  if (sellField && buyField && isValid) {
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
    sell: sellField && isValid ? parseFloat(rate[sellField]) : 0,
    buy: buyField && isValid ? parseFloat(rate[buyField]) : 0,
    updated_at: timestamp || new Date().toISOString(),
    isValid,
    validationErrors
  };
}

export async function getValidatedKenigRates(): Promise<RateValidationResult> {
  const status = getSupabaseStatus();
  
  console.log('🔍 Checking Supabase configuration:', {
    hasUrl: status.hasUrl,
    hasKey: status.hasKey,
    isConfigured: status.isConfigured,
    url: status.url?.substring(0, 30) + '...'
  });
  
  if (!isSupabaseAvailable()) {
    console.warn('⚠️ Supabase not available:', status);
    return {
      rates: [
        {
          id: 1,
          source: 'kenig',
          sell: 95.50,
          buy: 94.80,
          updated_at: new Date().toISOString(),
          isValid: true,
          validationErrors: []
        },
        {
          id: 2,
          source: 'bestchange',
          sell: 95.30,
          buy: 94.90,
          updated_at: new Date().toISOString(),
          isValid: true,
          validationErrors: []
        },
        {
          id: 3,
          source: 'energo',
          sell: 95.20,
          buy: 94.70,
          updated_at: new Date().toISOString(),
          isValid: true,
          validationErrors: []
        }
      ],
      hasValidRates: true,
      totalRates: 3,
      validRatesCount: 3,
      invalidRatesCount: 0,
      lastUpdated: new Date(),
      isFromDatabase: false,
      error: `Для подключения к реальной базе данных настройте Supabase: URL=${status.hasUrl ? 'OK' : 'MISSING'}, KEY=${status.hasKey ? 'OK' : 'MISSING'}`
    };
  }

  try {
    console.log('🔄 Querying kenig_rates table...');
    
    const { data, error } = await supabase
      .from('kenig_rates')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase query error:', error);
      throw new Error(`Supabase error: ${error.message} (Code: ${error.code})`);
    }

    console.log('📊 Raw data from Supabase kenig_rates table:', data);

    if (!data || data.length === 0) {
      console.warn('⚠️ No data found in kenig_rates table');
      return {
        rates: [],
        hasValidRates: false,
        totalRates: 0,
        validRatesCount: 0,
        invalidRatesCount: 0,
        lastUpdated: new Date(),
        isFromDatabase: true,
        error: 'No exchange rate data found in kenig_rates table'
      };
    }

    const validatedRates = data.map(validateRateRecord);
    const validRates = validatedRates.filter(rate => rate.isValid);

    console.log(`✅ Validation complete: ${validRates.length}/${validatedRates.length} rates are valid`);

    // Log invalid rates for debugging
    const invalidRates = validatedRates.filter(rate => !rate.isValid);
    if (invalidRates.length > 0) {
      console.warn('⚠️ Invalid rates found:', invalidRates.map(r => ({
        source: r.source,
        errors: r.validationErrors
      })));
    }

    // Log structure of first record for debugging
    if (data.length > 0) {
      console.log('📋 First record structure:', Object.keys(data[0]));
    }

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
    console.error('❌ Error in getValidatedKenigRates:', error);
    
    // Enhanced error handling to capture specific Supabase error messages
    let errorMessage = 'Unknown database error';
    
    if (error && typeof error === 'object') {
      // Handle Supabase error objects
      if ('message' in error && typeof error.message === 'string') {
        errorMessage = error.message;
      } else if ('error' in error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else if ('details' in error && typeof error.details === 'string') {
        errorMessage = error.details;
      } else if ('hint' in error && typeof error.hint === 'string') {
        errorMessage = `${errorMessage} (Hint: ${error.hint})`;
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      rates: [],
      hasValidRates: false,
      totalRates: 0,
      validRatesCount: 0,
      invalidRatesCount: 0,
      lastUpdated: new Date(),
      isFromDatabase: false,
      error: errorMessage
    };
  }
}