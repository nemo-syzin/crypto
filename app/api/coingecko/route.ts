import { NextRequest, NextResponse } from 'next/server';

// Cache for API responses
let cache: Map<string, { data: any; timestamp: number }> = new Map();
const CACHE_DURATION = 60 * 1000; // 60 seconds cache duration

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

// Enhanced fallback data for when API is unavailable
function getFallbackData(endpoint: string): any {
  console.log(`📦 Serving fallback data for endpoint: ${endpoint}`);
  
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
      },
      {
        id: 'binancecoin',
        symbol: 'bnb',
        name: 'BNB',
        image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
        current_price: 310,
        market_cap: 47000000000,
        market_cap_rank: 3,
        price_change_percentage_24h: -0.5,
        total_volume: 1200000000,
        circulating_supply: 153000000,
        total_supply: 153000000,
        max_supply: 200000000,
        ath: 686,
        atl: 0.096,
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

// Enhanced retry function with better error handling and connection management
async function fetchWithRetry(url: string, headers: HeadersInit, maxRetries: number = 5): Promise<Response> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries} - Fetching: ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // Reduced timeout to 8 seconds
      
      const response = await fetch(url, {
        headers: {
          ...headers,
          'Cache-Control': 'no-cache', // Prevent caching issues
        },
        signal: controller.signal,
        // Add keepalive false to prevent connection pooling issues
        keepalive: false,
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      lastError = error as Error;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`⚠️ Attempt ${attempt} failed:`, errorMessage);
      
      // Check if it's a network/socket error that might benefit from retry
      const isRetryableError = errorMessage.toLowerCase().includes('fetch failed') ||
                              errorMessage.toLowerCase().includes('socketerror') ||
                              errorMessage.toLowerCase().includes('other side closed') ||
                              errorMessage.toLowerCase().includes('network') ||
                              errorMessage.toLowerCase().includes('enotfound') ||
                              errorMessage.toLowerCase().includes('econnrefused') ||
                              errorMessage.toLowerCase().includes('timeout') ||
                              errorMessage.toLowerCase().includes('aborted');
      
      // Don't retry on the last attempt or if it's not a retryable error
      if (attempt === maxRetries || !isRetryableError) {
        break;
      }
      
      // Progressive backoff with jitter for network errors
      const baseDelay = Math.pow(2, attempt - 1) * 1500; // Increased base delay
      const jitter = Math.random() * 1000;
      const delay = baseDelay + jitter;
      
      console.log(`⏳ Network error detected, waiting ${Math.round(delay)}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
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
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your-api-key-here') {
    console.warn('⚠️ CoinGecko API key not configured or invalid, using fallback data');
    const fallbackData = getFallbackData(endpoint);
    if (fallbackData) {
      // Cache fallback data briefly to avoid repeated warnings
      setCachedData(cacheKey, fallbackData);
      return NextResponse.json(fallbackData);
    }
    
    return NextResponse.json(
      { 
        error: 'CoinGecko API key not configured',
        message: 'Please add a valid COINGECKO_API_KEY to your environment variables. Get your free API key from https://www.coingecko.com/en/api/pricing',
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
      // Add headers to help with connection stability
      'Accept-Encoding': 'gzip, deflate',
      'DNT': '1',
    };

    console.log(`🔄 Fetching CoinGecko data from: ${endpoint}`);

    const response = await fetchWithRetry(url, headers);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error response');
      console.error(`❌ CoinGecko API error: ${response.status} ${response.statusText}`, errorText);
      
      // Always try fallback for any API error
      const fallbackData = getFallbackData(endpoint);
      if (fallbackData) {
        console.warn(`⚠️ API error ${response.status}, using fallback data`);
        setCachedData(cacheKey, fallbackData);
        return NextResponse.json(fallbackData);
      }
      
      // Handle specific error cases
      if (response.status === 401) {
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

      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Cache the successful response
    setCachedData(cacheKey, data);

    console.log(`✅ CoinGecko data fetched successfully for: ${endpoint}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ CoinGecko API proxy error:', error);
    
    // Always try to serve fallback data when API fails
    const fallbackData = getFallbackData(endpoint);
    if (fallbackData) {
      console.warn('⚠️ API failed, serving fallback data');
      setCachedData(cacheKey, fallbackData);
      return NextResponse.json(fallbackData);
    }
    
    // Provide specific error messages based on error type
    let errorMessage = 'CoinGecko API is currently unavailable';
    let statusCode = 503;
    
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();
      
      if (errorMsg.includes('fetch failed') || 
          errorMsg.includes('socketerror') || 
          errorMsg.includes('other side closed') ||
          errorMsg.includes('network') ||
          errorMsg.includes('enotfound') ||
          errorMsg.includes('econnrefused')) {
        errorMessage = 'Network connection to CoinGecko API failed. This is likely due to network connectivity issues, API server problems, or rate limiting. The application will continue to work with fallback data.';
        statusCode = 503; // Service Unavailable
      } else if (errorMsg.includes('timeout') || errorMsg.includes('aborted')) {
        errorMessage = 'Request to CoinGecko API timed out. The service may be experiencing high load. The application will continue to work with fallback data.';
        statusCode = 504; // Gateway Timeout
      } else if (errorMsg.includes('unauthorized') || errorMsg.includes('401')) {
        errorMessage = 'Invalid CoinGecko API key. Please verify your COINGECKO_API_KEY environment variable.';
        statusCode = 401;
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch data from CoinGecko',
        message: errorMessage,
        retryAfter: 30,
        fallback: true,
        suggestion: 'The application will continue to work with cached or fallback data. This error is typically temporary and will resolve automatically.'
      },
      { status: statusCode }
    );
  }
}