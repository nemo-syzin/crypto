import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    console.log('🔄 Debug: Checking table structures...');
    
    const results: any = {
      timestamp: new Date().toISOString(),
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
      },
      tables: {}
    };

    // Check kenig_rates table
    try {
      const { data: kenigData, error: kenigError } = await supabase
        .from('kenig_rates')
        .select('*')
        .limit(5);

      if (kenigError) {
        results.tables.kenig_rates = {
          exists: false,
          error: kenigError.message,
          code: kenigError.code
        };
      } else {
        results.tables.kenig_rates = {
          exists: true,
          rowCount: kenigData?.length || 0,
          sampleData: kenigData,
          columns: kenigData && kenigData.length > 0 ? Object.keys(kenigData[0]) : []
        };
      }
    } catch (error) {
      results.tables.kenig_rates = {
        exists: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Check exchange_rates table
    try {
      const { data: exchangeData, error: exchangeError } = await supabase
        .from('exchange_rates')
        .select('*')
        .limit(5);

      if (exchangeError) {
        results.tables.exchange_rates = {
          exists: false,
          error: exchangeError.message,
          code: exchangeError.code
        };
      } else {
        results.tables.exchange_rates = {
          exists: true,
          rowCount: exchangeData?.length || 0,
          sampleData: exchangeData,
          columns: exchangeData && exchangeData.length > 0 ? Object.keys(exchangeData[0]) : []
        };
      }
    } catch (error) {
      results.tables.exchange_rates = {
        exists: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    console.log('✅ Debug: Table structure check completed');
    
    return NextResponse.json({
      success: true,
      ...results
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