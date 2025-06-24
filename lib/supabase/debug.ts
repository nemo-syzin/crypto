/**
 * Comprehensive Supabase debugging utilities
 * This file provides tools to diagnose and troubleshoot Supabase connection and data issues
 */

import { supabase, getSupabaseStatus, isSupabaseAvailable } from './client';

export interface DebugResult {
  step: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: any;
}

export interface SupabaseDebugReport {
  timestamp: string;
  overallStatus: 'healthy' | 'issues' | 'critical';
  results: DebugResult[];
  recommendations: string[];
}

/**
 * Step 1: Check environment variables configuration
 */
export async function checkEnvironmentVariables(): Promise<DebugResult> {
  const status = getSupabaseStatus();
  
  if (!status.hasUrl) {
    return {
      step: 'Environment Variables - URL',
      status: 'error',
      message: 'NEXT_PUBLIC_SUPABASE_URL is missing or invalid',
      details: {
        current: process.env.NEXT_PUBLIC_SUPABASE_URL,
        expected: 'https://your-project-id.supabase.co'
      }
    };
  }
  
  if (!status.hasKey) {
    return {
      step: 'Environment Variables - API Key',
      status: 'error',
      message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or invalid',
      details: {
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
      }
    };
  }
  
  return {
    step: 'Environment Variables',
    status: 'success',
    message: 'All environment variables are properly configured',
    details: {
      url: status.url,
      keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length
    }
  };
}

/**
 * Step 2: Test basic Supabase client connection
 */
export async function testSupabaseConnection(): Promise<DebugResult> {
  if (!isSupabaseAvailable()) {
    return {
      step: 'Supabase Connection',
      status: 'error',
      message: 'Cannot test connection - environment variables not configured'
    };
  }
  
  try {
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('count')
      .limit(1);
    
    if (error) {
      return {
        step: 'Supabase Connection',
        status: 'error',
        message: `Connection failed: ${error.message}`,
        details: {
          code: error.code,
          hint: error.hint,
          details: error.details
        }
      };
    }
    
    return {
      step: 'Supabase Connection',
      status: 'success',
      message: 'Successfully connected to Supabase',
      details: data
    };
  } catch (error) {
    return {
      step: 'Supabase Connection',
      status: 'error',
      message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error
    };
  }
}

/**
 * Step 3: Check table structure and existence
 */
export async function checkTableStructure(): Promise<DebugResult> {
  if (!isSupabaseAvailable()) {
    return {
      step: 'Table Structure',
      status: 'error',
      message: 'Cannot check table - environment variables not configured'
    };
  }
  
  try {
    // Try to get table information
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        return {
          step: 'Table Structure',
          status: 'error',
          message: 'Table "exchange_rates" does not exist',
          details: {
            suggestion: 'Run the database migration to create the table',
            migrationFile: 'supabase/migrations/20250619150800_restless_mountain.sql'
          }
        };
      }
      
      if (error.code === '42703') {
        return {
          step: 'Table Structure',
          status: 'warning',
          message: 'Table exists but has column issues',
          details: {
            error: error.message,
            suggestion: 'Check if table structure matches expected schema'
          }
        };
      }
      
      return {
        step: 'Table Structure',
        status: 'error',
        message: `Table access error: ${error.message}`,
        details: error
      };
    }
    
    return {
      step: 'Table Structure',
      status: 'success',
      message: 'Table exists and is accessible',
      details: {
        sampleRecord: data?.[0] || null,
        hasData: data && data.length > 0
      }
    };
  } catch (error) {
    return {
      step: 'Table Structure',
      status: 'error',
      message: `Unexpected error checking table: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error
    };
  }
}

/**
 * Step 4: Check data availability
 */
export async function checkDataAvailability(): Promise<DebugResult> {
  if (!isSupabaseAvailable()) {
    return {
      step: 'Data Availability',
      status: 'error',
      message: 'Cannot check data - environment variables not configured'
    };
  }
  
  try {
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('*');
    
    if (error) {
      return {
        step: 'Data Availability',
        status: 'error',
        message: `Failed to fetch data: ${error.message}`,
        details: error
      };
    }
    
    if (!data || data.length === 0) {
      return {
        step: 'Data Availability',
        status: 'warning',
        message: 'Table exists but contains no data',
        details: {
          suggestion: 'Run data insertion migration or manually insert test data',
          expectedSources: ['kenig', 'bestchange', 'energo']
        }
      };
    }
    
    // Check for required sources
    const sources = data.map(row => row.source);
    const requiredSources = ['kenig', 'bestchange', 'energo'];
    const missingSources = requiredSources.filter(source => !sources.includes(source));
    
    if (missingSources.length > 0) {
      return {
        step: 'Data Availability',
        status: 'warning',
        message: `Missing data for sources: ${missingSources.join(', ')}`,
        details: {
          foundSources: sources,
          missingSources,
          totalRecords: data.length
        }
      };
    }
    
    return {
      step: 'Data Availability',
      status: 'success',
      message: `Found ${data.length} records with all required sources`,
      details: {
        sources,
        records: data
      }
    };
  } catch (error) {
    return {
      step: 'Data Availability',
      status: 'error',
      message: `Unexpected error checking data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error
    };
  }
}

/**
 * Step 5: Test data fetching logic
 */
export async function testDataFetching(): Promise<DebugResult> {
  if (!isSupabaseAvailable()) {
    return {
      step: 'Data Fetching Logic',
      status: 'error',
      message: 'Cannot test data fetching - environment variables not configured'
    };
  }
  
  try {
    // Test the actual query used by the application
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return {
        step: 'Data Fetching Logic',
        status: 'error',
        message: `Data fetching failed: ${error.message}`,
        details: {
          query: 'SELECT * FROM exchange_rates ORDER BY created_at DESC',
          error
        }
      };
    }
    
    if (!data || data.length === 0) {
      return {
        step: 'Data Fetching Logic',
        status: 'warning',
        message: 'Query executed successfully but returned no data',
        details: {
          query: 'SELECT * FROM exchange_rates ORDER BY created_at DESC',
          result: data
        }
      };
    }
    
    // Validate data structure
    const firstRecord = data[0];
    const requiredFields = ['id', 'source', 'usdt_sell_rate', 'usdt_buy_rate'];
    const missingFields = requiredFields.filter(field => !(field in firstRecord));
    
    if (missingFields.length > 0) {
      return {
        step: 'Data Fetching Logic',
        status: 'warning',
        message: `Data structure issues - missing fields: ${missingFields.join(', ')}`,
        details: {
          firstRecord,
          missingFields,
          availableFields: Object.keys(firstRecord)
        }
      };
    }
    
    return {
      step: 'Data Fetching Logic',
      status: 'success',
      message: `Successfully fetched ${data.length} records with correct structure`,
      details: {
        recordCount: data.length,
        sampleRecord: firstRecord,
        allSources: data.map(r => r.source)
      }
    };
  } catch (error) {
    return {
      step: 'Data Fetching Logic',
      status: 'error',
      message: `Unexpected error in data fetching: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error
    };
  }
}

/**
 * Run comprehensive Supabase diagnostics
 */
export async function runSupabaseDebug(): Promise<SupabaseDebugReport> {
  const results: DebugResult[] = [];
  const recommendations: string[] = [];
  
  console.log('🔍 Starting comprehensive Supabase diagnostics...');
  
  // Step 1: Environment Variables
  const envResult = await checkEnvironmentVariables();
  results.push(envResult);
  if (envResult.status === 'error') {
    recommendations.push('Configure missing environment variables in .env.local file');
  }
  
  // Step 2: Connection Test
  const connectionResult = await testSupabaseConnection();
  results.push(connectionResult);
  if (connectionResult.status === 'error') {
    recommendations.push('Check Supabase project settings and API keys');
  }
  
  // Step 3: Table Structure
  const tableResult = await checkTableStructure();
  results.push(tableResult);
  if (tableResult.status === 'error') {
    recommendations.push('Run database migrations to create required tables');
  }
  
  // Step 4: Data Availability
  const dataResult = await checkDataAvailability();
  results.push(dataResult);
  if (dataResult.status === 'warning' || dataResult.status === 'error') {
    recommendations.push('Insert initial data using the provided migration');
  }
  
  // Step 5: Data Fetching
  const fetchResult = await testDataFetching();
  results.push(fetchResult);
  if (fetchResult.status === 'error') {
    recommendations.push('Review and fix data fetching queries');
  }
  
  // Determine overall status
  const hasErrors = results.some(r => r.status === 'error');
  const hasWarnings = results.some(r => r.status === 'warning');
  
  const overallStatus = hasErrors ? 'critical' : hasWarnings ? 'issues' : 'healthy';
  
  const report: SupabaseDebugReport = {
    timestamp: new Date().toISOString(),
    overallStatus,
    results,
    recommendations
  };
  
  console.log('✅ Supabase diagnostics completed');
  return report;
}

/**
 * Auto-fix common issues
 */
export async function autoFixCommonIssues(): Promise<DebugResult[]> {
  const fixes: DebugResult[] = [];
  
  // Check if we can insert missing data
  try {
    const { data: existingData } = await supabase
      .from('exchange_rates')
      .select('source');
    
    const existingSources = existingData?.map(r => r.source) || [];
    const requiredSources = [
      { source: 'kenig', sell: 95.50, buy: 94.80 },
      { source: 'bestchange', sell: 95.30, buy: 94.90 },
      { source: 'energo', sell: 95.20, buy: 94.70 }
    ];
    
    for (const required of requiredSources) {
      if (!existingSources.includes(required.source)) {
        const { error } = await supabase
          .from('exchange_rates')
          .insert({
            source: required.source,
            usdt_sell_rate: required.sell,
            usdt_buy_rate: required.buy
          });
        
        if (error) {
          fixes.push({
            step: `Auto-fix: Insert ${required.source} data`,
            status: 'error',
            message: `Failed to insert data: ${error.message}`,
            details: error
          });
        } else {
          fixes.push({
            step: `Auto-fix: Insert ${required.source} data`,
            status: 'success',
            message: `Successfully inserted data for ${required.source}`
          });
        }
      }
    }
  } catch (error) {
    fixes.push({
      step: 'Auto-fix: Data insertion',
      status: 'error',
      message: `Auto-fix failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error
    });
  }
  
  return fixes;
}