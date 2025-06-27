import { supabase, isSupabaseAvailable, getSupabaseStatus } from './client';

interface ValidatedKenigRate {
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

/**
 * Validates a numeric rate value
 * @param value - The value to validate
 * @param fieldName - Name of the field for error reporting
 * @param min - Minimum allowed value (default: 0)
 * @param max - Maximum allowed value (default: 1000)
 * @returns Object with isValid flag and error message if invalid
 */
function validateRateValue(
  value: any, 
  fieldName: string, 
  min: number = 0, 
  max: number = 1000
): { isValid: boolean; error?: string } {
  // Check if value exists
  if (value === null || value === undefined) {
    return { isValid: false, error: `${fieldName} is null or undefined` };
  }

  // Convert to number if it's a string
  let numericValue: number;
  if (typeof value === 'string') {
    numericValue = parseFloat(value);
  } else if (typeof value === 'number') {
    numericValue = value;
  } else {
    return { isValid: false, error: `${fieldName} is not a valid number type` };
  }

  // Check if conversion resulted in NaN
  if (isNaN(numericValue)) {
    return { isValid: false, error: `${fieldName} cannot be parsed as a number` };
  }

  // Check if it's a finite number
  if (!isFinite(numericValue)) {
    return { isValid: false, error: `${fieldName} is not a finite number` };
  }

  // Check range
  if (numericValue < min) {
    return { isValid: false, error: `${fieldName} (${numericValue}) is below minimum value (${min})` };
  }

  if (numericValue > max) {
    return { isValid: false, error: `${fieldName} (${numericValue}) exceeds maximum value (${max})` };
  }

  // Check for reasonable decimal places (max 4 decimal places for currency)
  const decimalPlaces = (numericValue.toString().split('.')[1] || '').length;
  if (decimalPlaces > 4) {
    return { isValid: false, error: `${fieldName} has too many decimal places (${decimalPlaces}, max 4)` };
  }

  return { isValid: true };
}

/**
 * Validates a complete rate record
 * @param rate - The rate record to validate
 * @returns Validated rate with validation results
 */
function validateRateRecord(rate: any): ValidatedKenigRate {
  const validationErrors: string[] = [];
  let isValid = true;

  // Determine which field names to use based on what's available
  const sellField = rate.usdt_sell_rate !== undefined ? 'usdt_sell_rate' : 'sell';
  const buyField = rate.usdt_buy_rate !== undefined ? 'usdt_buy_rate' : 'buy';

  // Validate sell rate
  const sellValidation = validateRateValue(rate[sellField], 'Sell rate', 50, 200);
  if (!sellValidation.isValid) {
    validationErrors.push(sellValidation.error!);
    isValid = false;
  }

  // Validate buy rate
  const buyValidation = validateRateValue(rate[buyField], 'Buy rate', 50, 200);
  if (!buyValidation.isValid) {
    validationErrors.push(buyValidation.error!);
    isValid = false;
  }

  // Validate that sell rate is higher than buy rate (normal market condition)
  if (sellValidation.isValid && buyValidation.isValid) {
    const sellRate = parseFloat(rate[sellField]);
    const buyRate = parseFloat(rate[buyField]);
    
    if (sellRate <= buyRate) {
      validationErrors.push(`Sell rate (${sellRate}) should be higher than buy rate (${buyRate})`);
      isValid = false;
    }

    // Check for reasonable spread (should be between 0.1% and 10%)
    const spread = ((sellRate - buyRate) / buyRate) * 100;
    if (spread < 0.1) {
      validationErrors.push(`Spread is too low (${spread.toFixed(2)}%), minimum 0.1%`);
      isValid = false;
    } else if (spread > 10) {
      validationErrors.push(`Spread is too high (${spread.toFixed(2)}%), maximum 10%`);
      isValid = false;
    }
  }

  // Validate source
  if (!rate.source || typeof rate.source !== 'string' || rate.source.trim().length === 0) {
    validationErrors.push('Source is missing or invalid');
    isValid = false;
  }

  // Validate timestamp - check for both updated_at and created_at
  const timestamp = rate.updated_at || rate.created_at;
  if (!timestamp) {
    validationErrors.push('Timestamp is missing (neither updated_at nor created_at found)');
    isValid = false;
  } else {
    const updateDate = new Date(timestamp);
    if (isNaN(updateDate.getTime())) {
      validationErrors.push('Timestamp is invalid');
      isValid = false;
    } else {
      // Check if data is not too old (more than 24 hours)
      const hoursOld = (Date.now() - updateDate.getTime()) / (1000 * 60 * 60);
      if (hoursOld > 24) {
        validationErrors.push(`Data is too old (${hoursOld.toFixed(1)} hours old)`);
        isValid = false;
      }
    }
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

/**
 * Formats a rate value for display with appropriate decimal places
 * @param rate - The rate value to format
 * @param defaultValue - Default value if rate is invalid (default: 0)
 * @returns Formatted rate string
 */
export function formatRate(rate: number | null | undefined, defaultValue: number = 0): string {
  if (rate === null || rate === undefined || isNaN(rate) || !isFinite(rate)) {
    return defaultValue.toFixed(2);
  }

  // Format with 2 decimal places for rates above 1, 4 decimal places for rates below 1
  if (rate >= 1) {
    return rate.toFixed(2);
  } else {
    return rate.toFixed(4);
  }
}

/**
 * Safely parses a rate value to number with fallback
 * @param value - The value to parse
 * @param defaultValue - Default value if parsing fails (default: 0)
 * @returns Parsed number or default value
 */
export function safeParseRate(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined) {
    return defaultValue;
  }

  const parsed = typeof value === 'string' ? parseFloat(value) : Number(value);
  
  if (isNaN(parsed) || !isFinite(parsed)) {
    return defaultValue;
  }

  return parsed;
}

/**
 * Fetches and validates exchange rates from the database with improved error handling
 * @returns Promise with validation results and formatted rates
 */
export async function getValidatedKenigRates(): Promise<RateValidationResult> {
  const status = getSupabaseStatus();
  
  if (!isSupabaseAvailable()) {
    const errorMessage = !status.hasUrl 
      ? 'Supabase URL not configured. Please set NEXT_PUBLIC_SUPABASE_URL in your .env.local file.'
      : !status.hasKey 
      ? 'Supabase API key not configured. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
      : 'Supabase not properly configured. Please check your environment variables.';
    
    console.error('❌ Supabase configuration error:', errorMessage);
    
    // Return fallback data with validation errors
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

  try {
    console.log('🔄 Fetching and validating rates from database...');
    
    // Try exchange_rates table first (the newer table structure)
    let data: any[] = [];
    let tableName = '';
    
    try {
      console.log('🔄 Trying exchange_rates table...');
      const { data: exchangeData, error: exchangeError } = await supabase
        .from('exchange_rates')
        .select('*')
        .order('created_at', { ascending: false });

      if (exchangeError) {
        console.log('⚠️ exchange_rates table query failed:', exchangeError.message);
        
        // Check if it's a column issue and try with updated_at
        if (exchangeError.code === '42703' && exchangeError.message.includes('updated_at')) {
          console.log('🔄 Retrying with updated_at column...');
          const { data: retryData, error: retryError } = await supabase
            .from('exchange_rates')
            .select('*')
            .order('updated_at', { ascending: false });
          
          if (retryError) {
            throw exchangeError; // Use original error
          }
          
          data = retryData || [];
          tableName = 'exchange_rates';
          console.log(`✅ Found ${data.length} records in exchange_rates table (using updated_at)`);
        } else {
          throw exchangeError;
        }
      } else {
        data = exchangeData || [];
        tableName = 'exchange_rates';
        console.log(`✅ Found ${data.length} records in exchange_rates table (using created_at)`);
      }
    } catch (exchangeError: any) {
      // Try kenig_rates table as fallback
      console.log('🔄 Trying kenig_rates table as fallback...');
      try {
        const { data: kenigData, error: kenigError } = await supabase
          .from('kenig_rates')
          .select('*')
          .order('updated_at', { ascending: false });

        if (kenigError) {
          console.error('❌ Both tables failed:', { exchangeError, kenigError });
          throw new Error(`Neither exchange_rates nor kenig_rates table accessible. Exchange error: ${exchangeError.message}, Kenig error: ${kenigError.message}`);
        }

        data = kenigData || [];
        tableName = 'kenig_rates';
        console.log(`✅ Found ${data.length} records in kenig_rates table`);
      } catch (kenigError) {
        console.error('❌ All table access attempts failed:', { exchangeError, kenigError });
        throw new Error(`No accessible tables found. Please check database setup and migrations.`);
      }
    }

    if (data.length === 0) {
      console.warn(`⚠️ No data found in ${tableName} table`);
      return {
        rates: [],
        hasValidRates: false,
        totalRates: 0,
        validRatesCount: 0,
        invalidRatesCount: 0,
        lastUpdated: new Date(),
        isFromDatabase: true,
        error: `No exchange rate data found in ${tableName} table. Please run the data insertion migration.`
      };
    }

    // Validate each rate record
    const validatedRates = data.map(validateRateRecord);
    const validRates = validatedRates.filter(rate => rate.isValid);
    const invalidRates = validatedRates.filter(rate => !rate.isValid);

    // Log validation results
    console.log(`✅ Validated ${validatedRates.length} rates from ${tableName} table:`);
    console.log(`   - Valid rates: ${validRates.length}`);
    console.log(`   - Invalid rates: ${invalidRates.length}`);
    
    if (invalidRates.length > 0) {
      console.warn('⚠️ Invalid rates found:');
      invalidRates.forEach(rate => {
        console.warn(`   - ${rate.source}: ${rate.validationErrors.join(', ')}`);
      });
    }

    return {
      rates: validatedRates,
      hasValidRates: validRates.length > 0,
      totalRates: validatedRates.length,
      validRatesCount: validRates.length,
      invalidRatesCount: invalidRates.length,
      lastUpdated: new Date(),
      isFromDatabase: true
    };

  } catch (error) {
    console.error('❌ Error fetching validated rates:', error);
    
    return {
      rates: [],
      hasValidRates: false,
      totalRates: 0,
      validRatesCount: 0,
      invalidRatesCount: 0,
      lastUpdated: new Date(),
      isFromDatabase: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Gets a specific rate by source with validation
 * @param source - The source to get rates for (e.g., 'kenig', 'bestchange', 'energo')
 * @returns Promise with validated rate or null if not found/invalid
 */
async function getValidatedRateBySource(source: string): Promise<ValidatedKenigRate | null> {
  try {
    const result = await getValidatedKenigRates();
    
    if (!result.hasValidRates) {
      return null;
    }

    const rate = result.rates.find(r => r.source === source && r.isValid);
    return rate || null;
  } catch (error) {
    console.error(`❌ Error fetching rate for source ${source}:`, error);
    return null;
  }
}

/**
 * Gets the best (highest) sell rate from all valid rates
 * @returns Promise with the best sell rate or null if none found
 */
async function getBestSellRate(): Promise<{ rate: number; source: string } | null> {
  try {
    const result = await getValidatedKenigRates();
    
    if (!result.hasValidRates) {
      return null;
    }

    const validRates = result.rates.filter(r => r.isValid);
    const bestRate = validRates.reduce((best, current) => 
      current.sell > best.sell ? current : best
    );

    return {
      rate: bestRate.sell,
      source: bestRate.source
    };
  } catch (error) {
    console.error('❌ Error finding best sell rate:', error);
    return null;
  }
}

/**
 * Gets the best (highest) buy rate from all valid rates
 * @returns Promise with the best buy rate or null if none found
 */
async function getBestBuyRate(): Promise<{ rate: number; source: string } | null> {
  try {
    const result = await getValidatedKenigRates();
    
    if (!result.hasValidRates) {
      return null;
    }

    const validRates = result.rates.filter(r => r.isValid);
    const bestRate = validRates.reduce((best, current) => 
      current.buy > best.buy ? current : best
    );

    return {
      rate: bestRate.buy,
      source: bestRate.source
    };
  } catch (error) {
    console.error('❌ Error finding best buy rate:', error);
    return null;
  }
}