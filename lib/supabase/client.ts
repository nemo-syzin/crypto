import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are set
const hasValidEnvVars = !!(supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' && 
  supabaseAnonKey !== 'your-anon-public-key-here');

if (!hasValidEnvVars) {
  console.warn('⚠️ Supabase environment variables not properly configured.');
  console.warn('Please check your .env.local file and ensure you have:');
  console.warn('- NEXT_PUBLIC_SUPABASE_URL=https://jetfadpysjsvtqdgnsjp.supabase.co');
  console.warn('- NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  console.warn('Get these values from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api');
}

// Create Supabase client with fallback values to prevent initialization errors
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDk3NzEyMDAuImV4cCI6MTk2NTM0NzIwMH0.placeholder'
);

// Helper function to check if Supabase is properly configured
export const checkSupabaseConnection = async () => {
  try {
    if (!hasValidEnvVars) {
      console.warn('⚠️ Supabase environment variables not properly set');
      return false;
    }

    const { data, error } = await supabase
      .from('exchange_rates')
      .select('count')
      .limit(1);
    
    if (error) {
      console.warn('⚠️ Supabase connection test failed:', error.message);
      
      // Provide specific guidance for common errors
      if (error.message.includes('Invalid API key')) {
        console.error('❌ Invalid Supabase API key. Please check your NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
        console.error('Get the correct key from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api');
      }
      
      if (error.message.includes('relation "exchange_rates" does not exist') || error.code === '42P01') {
        console.error('❌ Table "exchange_rates" does not exist. Please run the migration to create it.');
      }
      
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.warn('❌ Supabase connection error:', error);
    return false;
  }
};

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => hasValidEnvVars;

// Helper function to get configuration status
export const getSupabaseStatus = () => {
  return {
    hasUrl: !!(supabaseUrl && supabaseUrl !== 'https://your-project-id.supabase.co'),
    hasKey: !!(supabaseAnonKey && supabaseAnonKey !== 'your-anon-public-key-here'),
    isConfigured: hasValidEnvVars,
    url: supabaseUrl,
  };
};