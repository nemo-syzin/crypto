"use client";

import { SupabaseConnectionStatus } from '@/components/supabase/connection-status';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestSupabasePage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#001D8D]">
                Supabase Connection Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <SupabaseConnectionStatus />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#001D8D]">
                  Environment Variables Check
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">NEXT_PUBLIC_SUPABASE_URL:</span>
                    <span className="font-mono text-xs">
                      {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                    <span className="font-mono text-xs">
                      {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Setup Instructions:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  <li>Go to your Supabase dashboard</li>
                  <li>Navigate to Settings → API</li>
                  <li>Copy the &quot;Project URL&quot; and &quot;anon public&quot; key</li>
                  <li>Add them to your .env.local file</li>
                  <li>Restart your development server</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}