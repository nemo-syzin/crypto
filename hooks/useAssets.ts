import { useState, useEffect } from 'react';
import { getAllAssets } from '@/lib/supabase/rates';

export function useAssets() {
  const [assets, setAssets] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        setError(null);
        const assetsList = await getAllAssets();
        setAssets(assetsList);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch assets';
        console.error('❌ Error fetching assets:', errorMessage);
        setError(errorMessage);
        // Set fallback assets
        setAssets(['USDT', 'RUB', 'USD', 'EUR', 'BTC', 'ETH']);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  return { assets, loading, error };
}