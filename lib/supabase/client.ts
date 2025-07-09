import { createClient } from '@supabase/supabase-js';

// Configuration
const CONNECTION_TIMEOUT = 8000; // 8 seconds timeout for connections
const MAX_RETRIES = 3; // Maximum number of retries for failed requests

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const hasValidEnvVars = !!(supabaseUrl && supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' && 
  supabaseAnonKey !== 'your-anon-public-key-here');

// Log configuration status early
if (!hasValidEnvVars) {
  console.error(
    '\n⛔ Supabase is NOT configured.\n' +
    'Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY ' +
    'in your .env.local file or host environment variables.\n' +
    'Copy .env.example to .env.local and fill in your Supabase credentials.\n'
  );
}

export const isSupabaseAvailable = () => hasValidEnvVars;

export const getSupabaseStatus = () => {
  const status = {
    hasUrl: !!(supabaseUrl && supabaseUrl !== 'https://your-project-id.supabase.co'),
    hasKey: !!(supabaseAnonKey && supabaseAnonKey !== 'your-anon-public-key-here'),
    isConfigured: hasValidEnvVars,
    url: supabaseUrl,
  };
    
  return status;
};

// Create Supabase client only if environment variables are properly configured
export const supabase = hasValidEnvVars 
  ? createClient(
      supabaseUrl as string,
      supabaseAnonKey as string,
      {
        auth: { persistSession: false }, // Disable session persistence to reduce overhead
        global: {
          fetch: (url, options = {}) => {
            // Add timeout to prevent hanging connections
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONNECTION_TIMEOUT);
            
            const fetchPromise = fetch(url, {
              ...options,
              signal: controller.signal,
              headers: {
                ...options.headers,
                'Cache-Control': 'no-cache', // Prevent caching issues
              },
            });
            
            // Clear timeout when fetch completes
            fetchPromise.finally(() => clearTimeout(timeoutId));
            
            return fetchPromise;
          },
        },
      }
    )
  : null; // Return null if environment variables are not properly configured

// Helper function to retry failed operations with exponential backoff
export async function withRetry<T>(
  operation: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Supabase operation failed (attempt ${attempt + 1}/${retries}):`, error);
      
      if (attempt < retries - 1) {
        // Exponential backoff with jitter
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000) + Math.random() * 1000;
        console.log(`Retrying in ${Math.round(delay)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}