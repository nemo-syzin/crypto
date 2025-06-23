import { NextResponse } from 'next/server';
import { getValidatedKenigRates, formatRate, safeParseRate } from '@/lib/supabase/validated-rates';

export async function GET() {
  try {
    console.log('🔄 Debug: Testing validated rates function...');
    
    const result = await getValidatedKenigRates();
    
    // Add formatted versions for display
    const formattedRates = result.rates.map(rate => ({
      ...rate,
      formatted: {
        sell: formatRate(rate.sell),
        buy: formatRate(rate.buy),
        sellSafe: safeParseRate(rate.sell, 0),
        buySafe: safeParseRate(rate.buy, 0)
      }
    }));

    console.log('✅ Debug: Validated rates test completed');
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      validation: {
        totalRates: result.totalRates,
        validRatesCount: result.validRatesCount,
        invalidRatesCount: result.invalidRatesCount,
        hasValidRates: result.hasValidRates,
        isFromDatabase: result.isFromDatabase,
        error: result.error
      },
      rates: formattedRates,
      summary: {
        validSources: formattedRates.filter(r => r.isValid).map(r => r.source),
        invalidSources: formattedRates.filter(r => !r.isValid).map(r => ({
          source: r.source,
          errors: r.validationErrors
        }))
      }
    });
  } catch (error) {
    console.error('❌ Debug: Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error occurred',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}