import { useState, useEffect, useCallback, useRef } from 'react';
import { getAllRates, type AllRates } from '@/lib/supabase/rates';

// Optimized rates hook with caching and minimal API calls
export function useOptimizedRates() {
  const [rates, setRates] = useState<AllRates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const cacheRef = useRef<{ data: AllRates; timestamp: number } | null>(null);
  const requestRef = useRef<Promise<AllRates> | null>(null);
  
  // Cache duration: 30 seconds
  const CACHE_DURATION = 30000;
  
  const fetchRates = useCallback(async (forceRefresh = false) => {
    // Check cache first
    if (!forceRefresh && cacheRef.current) {
      const age = Date.now() - cacheRef.current.timestamp;
      if (age < CACHE_DURATION) {
        setRates(cacheRef.current.data);
        setLastUpdated(new Date(cacheRef.current.timestamp));
        return cacheRef.current.data;
      }
    }
    
    // Prevent duplicate requests
    if (requestRef.current) {
      return requestRef.current;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      requestRef.current = getAllRates();
      const ratesData = await requestRef.current;
      
      // Update cache
      cacheRef.current = {
        data: ratesData,
        timestamp: Date.now()
      };
      
      setRates(ratesData);
      setLastUpdated(new Date());
      return ratesData;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch rates';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
      requestRef.current = null;
    }
  }, []);
  
  // Auto-refresh with optimized intervals
  useEffect(() => {
    fetchRates();
    
    const interval = setInterval(() => {
      fetchRates();
    }, CACHE_DURATION);
    
    return () => clearInterval(interval);
  }, [fetchRates]);
  
  return {
    rates,
    isLoading,
    error,
    lastUpdated,
    refetch: () => fetchRates(true),
    isFromCache: cacheRef.current ? Date.now() - cacheRef.current.timestamp < CACHE_DURATION : false
  };
}