import useSWR from 'swr';

export interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update?: string;
}

interface FearGreedResponse {
  name: string;
  data: FearGreedData[];
}

// Enhanced data fetching function with better error handling
async function getFearGreedIndex(): Promise<FearGreedData> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch('https://api.alternative.me/fng/?limit=1', {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: FearGreedResponse = await response.json();
    return data.data[0];
  } catch (error) {
    console.warn('⚠️ Error fetching Fear & Greed Index, using fallback data:', error);
    
    // Return fallback data instead of throwing
    return getFallbackFearGreedData();
  }
}

// Fallback data function
function getFallbackFearGreedData(): FearGreedData {
  return {
    value: '50',
    value_classification: 'Neutral',
    timestamp: Date.now().toString(),
    time_until_update: '24 hours'
  };
}

// Enhanced fetcher function for Fear & Greed Index
const fngFetcher = async (): Promise<FearGreedData> => {
  return getFearGreedIndex();
};

// Enhanced hook with better error handling and fallback data
export function useFearGreed() {
  const { data, error, isLoading, mutate } = useSWR<FearGreedData>(
    'fear-greed-index',
    fngFetcher,
    {
      refreshInterval: 60 * 60 * 1000, // Increased to 1 hour
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30 * 60 * 1000, // Increased to 30 minutes
      fallbackData: getFallbackFearGreedData(), // Provide fallback data
      onError: (error) => {
        console.warn('⚠️ Fear & Greed Index hook error, using fallback data:', error);
      },
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Only retry up to 3 times
        if (retryCount >= 3) return;
        
        // Retry after 30 seconds
        setTimeout(() => revalidate({ retryCount }), 30000);
      },
    }
  );

  return {
    data: data || getFallbackFearGreedData(),
    error: error?.message || null,
    isLoading,
    refetch: mutate,
  };
}

export function getFearGreedColor(value: number): string {
  if (value <= 25) return 'text-red-600';
  if (value <= 45) return 'text-orange-600';
  if (value <= 55) return 'text-yellow-600';
  if (value <= 75) return 'text-green-600';
  return 'text-blue-600';
}

export function getFearGreedBgColor(value: number): string {
  if (value <= 25) return 'bg-red-100';
  if (value <= 45) return 'bg-orange-100';
  if (value <= 55) return 'bg-yellow-100';
  if (value <= 75) return 'bg-green-100';
  return 'bg-blue-100';
}

function getFearGreedDescription(value: number): string {
  if (value <= 25) return 'Extreme Fear';
  if (value <= 45) return 'Fear';
  if (value <= 55) return 'Neutral';
  if (value <= 75) return 'Greed';
  return 'Extreme Greed';
}

// Export function for direct use
export { getFearGreedIndex };