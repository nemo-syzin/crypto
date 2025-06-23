"use client";

import { useEffect, useState } from 'react';
import { checkSupabaseConnection } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function SupabaseConnectionStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const isConnected = await checkSupabaseConnection();
        setStatus(isConnected ? 'connected' : 'error');
        if (!isConnected) {
          setError('Failed to connect to Supabase. Please check your configuration.');
        }
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      }
    };

    testConnection();
  }, []);

  if (status === 'checking') {
    return (
      <Alert className="bg-blue-50 border-blue-200">
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        <AlertDescription className="text-blue-800">
          Checking Supabase connection...
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'connected') {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          ✅ Supabase connected successfully
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-red-50 border-red-200">
      <XCircle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        ❌ Supabase connection failed: {error}
      </AlertDescription>
    </Alert>
  );
}