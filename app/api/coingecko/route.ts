import { NextRequest, NextResponse } from 'next/server';

// Cache for API responses
let cache: Map<string, { data: any; timestamp: number }> = new Map();
const CACHE_DURATION = 30 * 1000; // 30 seconds

function getCachedData(key: string): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  const params = searchParams.get('params') || '';

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint parameter required' }, { status: 400 });
  }

  // Check if API key is configured
  const apiKey = process.env.COINGECKO_API_KEY;
  if (!apiKey) {
    console.error('❌ CoinGecko API key not configured');
    return NextResponse.json(
      { 
        error: 'CoinGecko API key not configured',
        message: 'Please add COINGECKO_API_KEY to your environment variables. Get your free API key from https://www.coingecko.com/en/api/pricing'
      }, 
      { status: 500 }
    );
  }

  const cacheKey = `${endpoint}-${params}`;
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return NextResponse.json(cachedData);
  }

  try {
    const baseUrl = 'https://api.coingecko.com/api/v3';
    
    let url = `${baseUrl}${endpoint}`;
    if (params) {
      url += `?${params}`;
    }

    const headers: HeadersInit = {
      'Accept': 'application/json',
      'x-cg-demo-api-key': apiKey,
    };

    console.log(`🔄 Fetching CoinGecko data from: ${endpoint}`);

    const response = await fetch(url, {
      headers,
      next: { revalidate: 30 }, // Edge caching with 30s revalidation
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ CoinGecko API error: ${response.status} ${response.statusText}`, errorText);
      
      // Handle specific error cases
      if (response.status === 401) {
        return NextResponse.json(
          { 
            error: 'Invalid CoinGecko API key',
            message: 'Your CoinGecko API key is invalid. Please check your COINGECKO_API_KEY environment variable.'
          },
          { status: 401 }
        );
      }
      
      if (response.status === 422) {
        return NextResponse.json(
          { 
            error: 'Invalid request parameters',
            message: 'The request parameters are invalid. Please check the endpoint and parameters.'
          },
          { status: 422 }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            message: 'CoinGecko API rate limit exceeded. Please try again later.'
          },
          { status: 429 }
        );
      }

      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Cache the response
    setCachedData(cacheKey, data);

    console.log(`✅ CoinGecko data fetched successfully for: ${endpoint}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ CoinGecko API proxy error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch data from CoinGecko',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}