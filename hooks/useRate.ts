import { useEffect, useState } from 'react';
import { getRate } from '@/lib/supabase/rates';

export function useRate(base: string, quote: string) {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!base || !quote || base === quote) {
      setRate(null);
      setError(null);
      return;
    }

    const fetchRate = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const rateValue = await getRate(base, quote);
        
        if (rateValue === null) {
          setError(`Курс ${base}/${quote} недоступен`);
        }
        
        setRate(rateValue);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch rate';
        console.error('❌ Error fetching rate:', errorMessage);
        setError(errorMessage);
        setRate(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, [base, quote]);

  return { rate, loading, error };
}