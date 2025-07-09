import { createClient } from '@supabase/supabase-js';

// Configuration
const CONNECTION_TIMEOUT = 8000; // 8 seconds timeout for connections
const MAX_RETRIES = 3; // Maximum number of retries for failed requests

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const hasValidEnvVars = !!(supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' && 
  supabaseAnonKey !== 'your-anon-public-key-here');

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  hasValidEnvVars ? {
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
  } : {}
);

export const isSupabaseAvailable = () => hasValidEnvVars;

export const getSupabaseStatus = () => {
  const status = {
  hasUrl: !!(supabaseUrl && supabaseUrl !== 'https://your-project-id.supabase.co'),
  hasKey: !!(supabaseAnonKey && supabaseAnonKey !== 'your-anon-public-key-here'),
  isConfigured: hasValidEnvVars,
  url: supabaseUrl,
  };
  
  console.log('Supabase status:', {
    ...status,
    url: status.url ? `${status.url.substring(0, 15)}...` : 'undefined',
  });
  
  return status;
};

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