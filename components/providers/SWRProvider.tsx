"use client";

import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

interface SWRProviderProps {
  children: ReactNode;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      'Cache-Control': 'no-cache',
    },
  });

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }

  return res.json();
};

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher,
        dedupingInterval: 2000,
        focusThrottleInterval: 5000,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        shouldRetryOnError: true,
        errorRetryCount: 3,
        errorRetryInterval: 1000,
        onError: (error, key) => {
          console.error(`[SWR Error] Key: ${key}`, error);
        },
        onSuccess: (data, key) => {
          console.log(`[SWR Success] Key: ${key}`, { dataLength: JSON.stringify(data).length });
        },
        compare: (a, b) => {
          return JSON.stringify(a) === JSON.stringify(b);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
