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

async function getFearGreedIndex(): Promise<FearGreedData> {
  try {
    const response = await fetch('https://api.alternative.me/fng/?limit=1');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: FearGreedResponse = await response.json();
    return data.data[0];
  } catch (error) {
    console.error('Error fetching Fear & Greed Index:', error);
    return {
      value: '50',
      value_classification: 'Neutral',
      timestamp: Date.now().toString(),
    };
  }
}

const fngFetcher = async (): Promise<FearGreedData> => {
  return getFearGreedIndex();
};

export function useFearGreed() {
  const { data, error, isLoading, mutate } = useSWR<FearGreedData>(
    'fear-greed-index',
    fngFetcher,
    {
      refreshInterval: 10 * 60 * 1000,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5 * 60 * 1000,
      onError: (error) => console.error('Fear & Greed Index hook error:', error),
    }
  );

  return {
    data: data || null,
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

export { getFearGreedIndex };