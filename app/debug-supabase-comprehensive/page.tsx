"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  runSupabaseDebug, 
  autoFixCommonIssues,
  type SupabaseDebugReport,
  type DebugResult 
} from '@/lib/supabase/debug';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Settings, 
  Database,
  Wrench,
  FileText,
  Activity,
  Zap
} from 'lucide-react';

export default function ComprehensiveSupabaseDebugPage() {
  const [debugReport, setDebugReport] = useState<SupabaseDebugReport | null>(null);
  const [autoFixResults, setAutoFixResults] = useState<DebugResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isAutoFixing, setIsAutoFixing] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    try {
      const report = await runSupabaseDebug();
      setDebugReport(report);
    } catch (error) {
      console.error('Failed to run diagnostics:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runAutoFix = async () => {
    setIsAutoFixing(true);
    try {
      const fixes = await autoFixCommonIssues();
      setAutoFixResults(fixes);
      // Re-run diagnostics after auto-fix
      await runDiagnostics();
    } catch (error) {
      console.error('Auto-fix failed:', error);
    } finally {
      setIsAutoFixing(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100 border-green-300';
      case 'issues':
        return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'critical':
        return 'text-red-600 bg-red-100 border-red-300';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#001D8D] flex items-center gap-2">
                <Database className="h-6 w-6" />
                Comprehensive Supabase Diagnostics
              </CardTitle>
              <p className="text-[#001D8D]/70">
                Complete troubleshooting and debugging tool for Supabase integration issues
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button onClick={runDiagnostics} disabled={isRunning}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
                  {isRunning ? 'Running Diagnostics...' : 'Run Full Diagnostics'}
                </Button>
                <Button onClick={runAutoFix} disabled={isAutoFixing || !debugReport} variant="outline">
                  <Wrench className={`h-4 w-4 mr-2 ${isAutoFixing ? 'animate-spin' : ''}`} />
                  {isAutoFixing ? 'Auto-Fixing...' : 'Auto-Fix Issues'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Overall Status */}
          {debugReport && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#001D8D]">
                  Overall System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getOverallStatusColor(debugReport.overallStatus)}`}>
                      {debugReport.overallStatus === 'healthy' && <CheckCircle className="h-6 w-6" />}
                      {debugReport.overallStatus === 'issues' && <AlertTriangle className="h-6 w-6" />}
                      {debugReport.overallStatus === 'critical' && <XCircle className="h-6 w-6" />}
                    </div>
                    <div>
                      <div className="font-semibold text-lg capitalize">
                        {debugReport.overallStatus}
                      </div>
                      <div className="text-sm text-gray-600">
                        Last checked: {new Date(debugReport.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Badge className={getOverallStatusColor(debugReport.overallStatus)}>
                    {debugReport.results.filter(r => r.status === 'success').length} / {debugReport.results.length} checks passed
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Content Tabs */}
          <Tabs defaultValue="diagnostics" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="diagnostics">
                <Activity className="h-4 w-4 mr-2" />
                Diagnostics
              </TabsTrigger>
              <TabsTrigger value="recommendations">
                <Zap className="h-4 w-4 mr-2" />
                Recommendations
              </TabsTrigger>
              <TabsTrigger value="autofix">
                <Settings className="h-4 w-4 mr-2" />
                Auto-Fix Results
              </TabsTrigger>
              <TabsTrigger value="guide">
                <FileText className="h-4 w-4 mr-2" />
                Setup Guide
              </TabsTrigger>
            </TabsList>

            {/* Diagnostics Tab */}
            <TabsContent value="diagnostics" className="space-y-6">
              {debugReport ? (
                <div className="space-y-4">
                  {debugReport.results.map((result, index) => (
                    <Card key={index} className={`border-2 ${getStatusColor(result.status)}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {getStatusIcon(result.status)}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-[#001D8D] mb-2">
                              {result.step}
                            </h3>
                            <p className="text-[#001D8D]/80 mb-3">
                              {result.message}
                            </p>
                            {result.details && (
                              <details className="mt-3">
                                <summary className="cursor-pointer text-sm font-medium text-[#001D8D]/70 hover:text-[#001D8D]">
                                  View Details
                                </summary>
                                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                                  {JSON.stringify(result.details, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                          <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                            {result.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Run diagnostics to see detailed results</p>
                </div>
              )}
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-6">
              {debugReport && debugReport.recommendations.length > 0 ? (
                <div className="space-y-4">
                  {debugReport.recommendations.map((recommendation, index) => (
                    <Alert key={index} className="bg-blue-50 border-blue-200">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <strong>Recommendation {index + 1}:</strong> {recommendation}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recommendations - system appears healthy!</p>
                </div>
              )}
            </TabsContent>

            {/* Auto-Fix Results Tab */}
            <TabsContent value="autofix" className="space-y-6">
              {autoFixResults.length > 0 ? (
                <div className="space-y-4">
                  {autoFixResults.map((result, index) => (
                    <Card key={index} className={`border-2 ${getStatusColor(result.status)}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {getStatusIcon(result.status)}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-[#001D8D] mb-2">
                              {result.step}
                            </h3>
                            <p className="text-[#001D8D]/80">
                              {result.message}
                            </p>
                            {result.details && (
                              <details className="mt-3">
                                <summary className="cursor-pointer text-sm font-medium text-[#001D8D]/70 hover:text-[#001D8D]">
                                  View Details
                                </summary>
                                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                                  {JSON.stringify(result.details, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No auto-fix results yet. Click "Auto-Fix Issues" to attempt automatic repairs.</p>
                </div>
              )}
            </TabsContent>

            {/* Setup Guide Tab */}
            <TabsContent value="guide" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-[#001D8D]">
                    Step-by-Step Setup Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-[#001D8D] mb-2">1. Environment Variables</h4>
                      <p className="text-[#001D8D]/70 mb-2">Create or update your .env.local file:</p>
                      <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm">
{`NEXT_PUBLIC_SUPABASE_URL=https://jetfadpysjsvtqdgnsjp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
                      </pre>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-[#001D8D] mb-2">2. Database Migration</h4>
                      <p className="text-[#001D8D]/70 mb-2">Run this SQL in your Supabase SQL Editor:</p>
                      <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm">
{`-- Create exchange_rates table
CREATE TABLE IF NOT EXISTS exchange_rates (
  id SERIAL PRIMARY KEY,
  source TEXT NOT NULL UNIQUE,
  usdt_sell_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  usdt_buy_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to exchange rates"
  ON exchange_rates FOR SELECT TO public USING (true);

-- Insert initial data
INSERT INTO exchange_rates (source, usdt_sell_rate, usdt_buy_rate) VALUES
  ('kenig', 95.50, 94.80),
  ('bestchange', 95.30, 94.90),
  ('energo', 95.20, 94.70)
ON CONFLICT (source) DO UPDATE SET
  usdt_sell_rate = EXCLUDED.usdt_sell_rate,
  usdt_buy_rate = EXCLUDED.usdt_buy_rate;`}
                      </pre>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold text-[#001D8D] mb-2">3. Restart Development Server</h4>
                      <p className="text-[#001D8D]/70 mb-2">After making changes, restart your server:</p>
                      <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm">
{`npm run dev`}
                      </pre>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-semibold text-[#001D8D] mb-2">4. Verify Setup</h4>
                      <p className="text-[#001D8D]/70">Use this page to run diagnostics and verify everything is working correctly.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}