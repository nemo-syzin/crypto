// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log configuration status for debugging
console.log('🔧 [Supabase Client] Configuration check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlValid: supabaseUrl?.startsWith('https://') && !supabaseUrl.includes('your-project-id'),
  keyValid: supabaseAnonKey && supabaseAnonKey !== 'your-anon-public-key-here' && supabaseAnonKey.length > 50
});

// Этот клиент ИСПОЛЬЗУЕМ ТОЛЬКО В БРАУЗЕРЕ / "use client" компонентах.
// На сервере импортируй фабрику из lib/supabase/server.ts
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'x-client-info': 'kenigswap-web@1.0.0',
      },
    },
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

const hasValidEnvVars = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-public-key-here' &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 50
);

export const isSupabaseAvailable = () => {
  const available = hasValidEnvVars;
  if (!available) {
    console.warn('🔧 [Supabase Client] Configuration not available:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      urlValid: supabaseUrl?.startsWith('https://'),
      keyValid: supabaseAnonKey && supabaseAnonKey.length > 50
    });
  }
  return available;
};

export const getSupabaseStatus = () => ({
  hasUrl: !!(supabaseUrl && supabaseUrl !== 'https://your-project-id.supabase.co'),
  hasKey: !!(supabaseAnonKey && supabaseAnonKey !== 'your-anon-public-key-here'),
  isConfigured: hasValidEnvVars,
  url: supabaseUrl,
});