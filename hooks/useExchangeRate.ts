// hooks/useExchangeRate.ts
import useSWR from 'swr';

const DEBUG = process.env.NODE_ENV === 'development';

function log(message: string, data?: any) {
  if (DEBUG) {
    console.log(`[useExchangeRate] ${message}`, data || '');
  }
}

type Direction = 'direct' | 'inverse';
type Source = 'kenig' | 'bestchange' | 'energo' | 'derived' | string;

interface RateResult {
  rate: number;
  updated_at: string;
  pair: string;
  source: Source;
  direction: Direction;
}

function up(s: string) {
  return (s || '').toUpperCase();
}

/**
 * Fetches exchange rate from API endpoint
 */
async function fetchRate(from: string, to: string): Promise<RateResult> {
  const A = up(from);
  const B = up(to);

  if (A === B) {
    return {
      rate: 1,
      updated_at: new Date().toISOString(),
      pair: `${A}/${B}`,
      source: 'system',
      direction: 'direct',
    };
  }

  log(`Fetching rate for ${A}/${B}`);

  const response = await fetch(`/api/exchange-rates?from=${A}&to=${B}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `Failed to fetch rate for ${A}/${B}`);
  }

  const data = await response.json();
  log(`Received rate for ${A}/${B}:`, data);

  return data;
}

/**
 * Hook for fetching exchange rates
 * Returns the rate for converting FROM currency to TO currency
 */
export function useExchangeRate(from: string, to: string) {
  const key = from && to && from !== to ? ['rate', up(from), up(to)] : null;

  log(`Hook called for ${from}/${to}`, { key });

  const fetcher = async () => {
    log(`Fetcher called for ${from}/${to}`);
    return fetchRate(from, to);
  };

  const { data, error, isLoading, isValidating, mutate } = useSWR<RateResult>(key, fetcher, {
    refreshInterval: 60_000, // Update every 1 minute
    dedupingInterval: 30_000, // Deduplicate requests within 30 seconds
    revalidateOnFocus: true, // Revalidate when window gets focus
    revalidateOnReconnect: true, // Revalidate on reconnect
    errorRetryCount: 3, // Retry 3 times on error
    errorRetryInterval: 5000, // Wait 5 seconds between retries
    onSuccess: (data) => {
      log(`SWR success for ${from}/${to}:`, data);
    },
    onError: (error) => {
      log(`SWR error for ${from}/${to}:`, error);
    },
  });

  log(`Hook returning for ${from}/${to}:`, {
    rate: data?.rate ?? 0,
    source: data?.source,
    loading: isLoading,
    error: error?.message,
  });

  return {
    rate: data?.rate ?? 0,
    source: data?.source as Source | undefined,
    direction: data?.direction as Direction | undefined,
    lastUpdated: data ? new Date(data.updated_at) : null,
    loading: isLoading,
    refreshing: isValidating,
    error: error?.message ?? null,
    refetch: mutate,
  };
}
