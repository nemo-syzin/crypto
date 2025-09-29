// lib/supabase/server.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Берём те же публичные переменные — для чтения обычно хватает anon key.
// Если RLS у таблиц закрыт — добавь SUPABASE_SERVICE_ROLE_KEY и подсовывай его явно.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getServerSupabaseClient(options?: { useServiceRole?: boolean; timeoutMs?: number }): SupabaseClient {
  const { useServiceRole = false, timeoutMs = 15000 } = options ?? {};

  // Обёртка fetch с таймаутом — работает и в Edge, и в Node
  const withTimeoutFetch = (ms: number) => {
    return async (input: RequestInfo | URL, init?: RequestInit) => {
      console.log(`🌐 [Supabase Fetch] Starting request to: ${typeof input === 'string' ? input.substring(0, 100) : 'URL object'}`);
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), ms);
      try {
        const startTime = Date.now();
        const response = await fetch(input, { ...init, signal: controller.signal });
        const duration = Date.now() - startTime;
        console.log(`✅ [Supabase Fetch] Request completed in ${duration}ms, status: ${response.status}`);
        return response;
      } finally {
        clearTimeout(id);
      }
    };
  };

  console.log(`🔧 [Supabase Client] Creating client with timeout: ${timeoutMs}ms, useServiceRole: ${useServiceRole}`);
  
  return createClient(
    SUPABASE_URL,
    useServiceRole && SUPABASE_SERVICE ? SUPABASE_SERVICE : SUPABASE_ANON,
    {
      global: { fetch: withTimeoutFetch(timeoutMs) },
      auth: { persistSession: false },
    }
  );
}

export function isServerSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON && SUPABASE_URL.startsWith('https://'));
}

export function getServerSupabaseStatus() {
  return {
    hasUrl: Boolean(SUPABASE_URL && SUPABASE_URL.startsWith('https://')),
    hasAnon: Boolean(SUPABASE_ANON),
    hasService: Boolean(SUPABASE_SERVICE),
    url: SUPABASE_URL,
  };
}