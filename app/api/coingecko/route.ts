import { NextRequest, NextResponse } from 'next/server';

// Cache for API responses
let cache: Map<string, { data: any; timestamp: number }> = new Map();
const CACHE_DURATION = 60 * 1000; // Increased to 60 seconds to reduce API calls

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

// Retry function with exponential backoff and better error handling
async function fetchWithRetry(url: string, headers: HeadersInit, maxRetries: number = 2): Promise<Response> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries} - Fetching: ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // Reduced timeout to 8 seconds
      
      const response = await fetch(url, {
        headers,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      lastError = error as Error;
      console.warn(`⚠️ Attempt ${attempt} failed:`, error instanceof Error ? error.message : 'Unknown error');
      
      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Shorter backoff for faster recovery
      const delay = Math.pow(1.5, attempt - 1) * 1000;
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

// Fallback data for when API is unavailable
function getFallbackData(endpoint: string): any {
  if (endpoint === '/coins/markets') {
    return [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        current_price: 43000,
        market_cap: 850000000000,
        market_cap_rank: 1,
        price_change_percentage_24h: 2.5,
        total_volume: 25000000000,
        circulating_supply: 19750000,
        total_supply: 21000000,
        max_supply: 21000000,
        ath: 69000,
        atl: 67.81,
        last_updated: new Date().toISOString()
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        current_price: 2600,
        market_cap: 312000000000,
        market_cap_rank: 2,
        price_change_percentage_24h: 1.8,
        total_volume: 15000000000,
        circulating_supply: 120000000,
        total_supply: 120000000,
        max_supply: null,
        ath: 4878,
        atl: 0.43,
        last_updated: new Date().toISOString()
      }
    ];
  }
  
  if (endpoint === '/global') {
    return {
      data: {
        active_cryptocurrencies: 2500,
        upcoming_icos: 0,
        ongoing_icos: 49,
        ended_icos: 3376,
        markets: 750,
        total_market_cap: {
          usd: 1200000000000
        },
        total_volume: {
          usd: 45000000000
        },
        market_cap_percentage: {
          btc: 52.5,
          eth: 17.2
        },
        market_cap_change_percentage_24h_usd: 2.1,
        updated_at: Math.floor(Date.now() / 1000)
      }
    };
  }
  
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  const params = searchParams.get('params') || '';

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint parameter required' }, { status: 400 });
  }

  const cacheKey = `${endpoint}-${params}`;
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    console.log(`📦 Serving cached data for: ${endpoint}`);
    return NextResponse.json(cachedData);
  }

  // Check if API key is configured
  const apiKey = process.env.COINGECKO_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ CoinGecko API key not configured, using fallback data');
    const fallbackData = getFallbackData(endpoint);
    if (fallbackData) {
      return NextResponse.json(fallbackData);
    }
    
    return NextResponse.json(
      { 
        error: 'CoinGecko API key not configured',
        message: 'Please add COINGECKO_API_KEY to your environment variables. Get your free API key from https://www.coingecko.com/en/api/pricing',
        fallback: true
      }, 
      { status: 503 }
    );
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
      'User-Agent': 'KenigSwap/1.0',
    };

    console.log(`🔄 Fetching CoinGecko data from: ${endpoint}`);

    const response = await fetchWithRetry(url, headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ CoinGecko API error: ${response.status} ${response.statusText}`, errorText);
      
      // Handle specific error cases with fallback
      if (response.status === 401) {
        console.warn('⚠️ Invalid API key, using fallback data');
        const fallbackData = getFallbackData(endpoint);
        if (fallbackData) {
          return NextResponse.json(fallbackData);
        }
        
        return NextResponse.json(
          { 
            error: 'Invalid CoinGecko API key',
            message: 'Your CoinGecko API key is invalid. Please check your COINGECKO_API_KEY environment variable.',
            fallback: true
          },
          { status: 401 }
        );
      }
      
      if (response.status === 429) {
        console.warn('⚠️ Rate limit exceeded, using fallback data');
        const fallbackData = getFallbackData(endpoint);
        if (fallbackData) {
          return NextResponse.json(fallbackData);
        }
        
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            message: 'CoinGecko API rate limit exceeded. Please try again later.',
            retryAfter: 60,
            fallback: true
          },
          { status: 429 }
        );
      }

      // For other errors, try fallback
      const fallbackData = getFallbackData(endpoint);
      if (fallbackData) {
        console.warn(`⚠️ API error ${response.status}, using fallback data`);
        return NextResponse.json(fallbackData);
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
    
    // Try to serve fallback data when API fails
    const fallbackData = getFallbackData(endpoint);
    if (fallbackData) {
      console.warn('⚠️ API failed, serving fallback data');
      return NextResponse.json(fallbackData);
    }
    
    // Provide more specific error messages based on error type
    let errorMessage = 'Unknown error occurred';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('SocketError') || error.message.includes('other side closed')) {
        errorMessage = 'Network connection failed. This could be due to API key issues, rate limiting, or server problems. The application will use cached data when available.';
        statusCode = 503; // Service Unavailable
      } else if (error.message.includes('timeout') || error.message.includes('aborted')) {
        errorMessage = 'Request timed out. The CoinGecko API is taking too long to respond. Please try again.';
        statusCode = 504; // Gateway Timeout
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch data from CoinGecko',
        message: errorMessage,
        retryAfter: 30,
        fallback: true
      },
      { status: statusCode }
    );
  }
}