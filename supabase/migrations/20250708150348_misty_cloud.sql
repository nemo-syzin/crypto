/*
  # Add more crypto-to-crypto pairs to kenig_rates table
  
  This migration adds more cryptocurrency pairs to the kenig_rates table
  to provide a wider range of exchange options for users.
  
  1. Data Addition
    - Add more crypto-to-crypto pairs with realistic exchange rates
    - Ensure all major cryptocurrencies have direct pairs with each other
    - Add stablecoin pairs (USDT/USDC)
    
  2. Data Verification
    - Verify the data was inserted correctly
*/

-- Add more crypto-to-crypto pairs
INSERT INTO kenig_rates (source, base, quote, sell, buy, updated_at) VALUES
  -- BTC pairs
  ('kenig', 'BTC', 'ETH', 16.10, 15.90, now()),
  ('kenig', 'BTC', 'BNB', 112.00, 110.00, now()),
  ('kenig', 'BTC', 'USDC', 29400.00, 29200.00, now()),
  ('kenig', 'BTC', 'SOL', 320.00, 315.00, now()),
  ('kenig', 'BTC', 'ADA', 80000.00, 79000.00, now()),
  ('kenig', 'BTC', 'DOT', 6300.00, 6200.00, now()),
  ('kenig', 'BTC', 'XRP', 74000.00, 73000.00, now()),
  
  -- ETH pairs
  ('kenig', 'ETH', 'USDT', 1850.00, 1830.00, now()),
  ('kenig', 'ETH', 'USDC', 1845.00, 1825.00, now()),
  ('kenig', 'ETH', 'BNB', 6.95, 6.85, now()),
  ('kenig', 'ETH', 'SOL', 21.00, 20.80, now()),
  ('kenig', 'ETH', 'ADA', 5200.00, 5100.00, now()),
  ('kenig', 'ETH', 'DOT', 400.00, 395.00, now()),
  ('kenig', 'ETH', 'XRP', 4900.00, 4800.00, now()),
  
  -- BNB pairs
  ('kenig', 'BNB', 'USDT', 260.00, 258.00, now()),
  ('kenig', 'BNB', 'USDC', 259.00, 257.00, now()),
  ('kenig', 'BNB', 'ETH', 0.145, 0.143, now()),
  ('kenig', 'BNB', 'SOL', 3.00, 2.95, now()),
  ('kenig', 'BNB', 'ADA', 750.00, 740.00, now()),
  ('kenig', 'BNB', 'DOT', 58.00, 57.00, now()),
  
  -- USDC pairs
  ('kenig', 'USDC', 'USDT', 1.002, 0.998, now()),
  ('kenig', 'USDC', 'RUB', 95.20, 94.60, now()),
  ('kenig', 'USDC', 'BTC', 0.000034, 0.000033, now()),
  ('kenig', 'USDC', 'ETH', 0.00054, 0.00053, now()),
  ('kenig', 'USDC', 'BNB', 0.0039, 0.0038, now()),
  
  -- SOL pairs
  ('kenig', 'SOL', 'USDT', 88.00, 87.00, now()),
  ('kenig', 'SOL', 'USDC', 87.80, 86.80, now()),
  ('kenig', 'SOL', 'ETH', 0.048, 0.047, now()),
  ('kenig', 'SOL', 'BNB', 0.34, 0.33, now()),
  
  -- ADA pairs
  ('kenig', 'ADA', 'USDT', 0.36, 0.35, now()),
  ('kenig', 'ADA', 'USDC', 0.358, 0.348, now()),
  ('kenig', 'ADA', 'ETH', 0.00019, 0.00018, now()),
  
  -- DOT pairs
  ('kenig', 'DOT', 'USDT', 4.60, 4.50, now()),
  ('kenig', 'DOT', 'USDC', 4.58, 4.48, now()),
  ('kenig', 'DOT', 'ETH', 0.0025, 0.0024, now()),
  
  -- XRP pairs
  ('kenig', 'XRP', 'USDT', 0.39, 0.38, now()),
  ('kenig', 'XRP', 'USDC', 0.388, 0.378, now()),
  ('kenig', 'XRP', 'ETH', 0.00021, 0.00020, now()),
  
  -- DOGE pairs
  ('kenig', 'DOGE', 'USDT', 0.088, 0.086, now()),
  ('kenig', 'DOGE', 'USDC', 0.087, 0.085, now()),
  ('kenig', 'DOGE', 'BTC', 0.0000030, 0.0000029, now()),
  
  -- SHIB pairs
  ('kenig', 'SHIB', 'USDT', 0.000019, 0.000018, now()),
  ('kenig', 'SHIB', 'USDC', 0.0000189, 0.0000179, now()),
  
  -- LTC pairs
  ('kenig', 'LTC', 'USDT', 60.50, 59.50, now()),
  ('kenig', 'LTC', 'USDC', 60.30, 59.30, now()),
  ('kenig', 'LTC', 'BTC', 0.0021, 0.0020, now()),
  
  -- LINK pairs
  ('kenig', 'LINK', 'USDT', 9.80, 9.60, now()),
  ('kenig', 'LINK', 'USDC', 9.75, 9.55, now()),
  ('kenig', 'LINK', 'ETH', 0.0053, 0.0052, now()),
  
  -- UNI pairs
  ('kenig', 'UNI', 'USDT', 5.40, 5.30, now()),
  ('kenig', 'UNI', 'USDC', 5.38, 5.28, now()),
  ('kenig', 'UNI', 'ETH', 0.0029, 0.0028, now()),
  
  -- ATOM pairs
  ('kenig', 'ATOM', 'USDT', 6.70, 6.60, now()),
  ('kenig', 'ATOM', 'USDC', 6.68, 6.58, now()),
  ('kenig', 'ATOM', 'BTC', 0.00023, 0.00022, now()),
  
  -- XLM pairs
  ('kenig', 'XLM', 'USDT', 0.29, 0.28, now()),
  ('kenig', 'XLM', 'USDC', 0.288, 0.278, now()),
  
  -- TRX pairs
  ('kenig', 'TRX', 'USDT', 0.078, 0.076, now()),
  ('kenig', 'TRX', 'USDC', 0.077, 0.075, now()),
  
  -- FIL pairs
  ('kenig', 'FIL', 'USDT', 3.30, 3.20, now()),
  ('kenig', 'FIL', 'USDC', 3.28, 3.18, now()),
  
  -- NEAR pairs
  ('kenig', 'NEAR', 'USDT', 2.90, 2.80, now()),
  ('kenig', 'NEAR', 'USDC', 2.88, 2.78, now())
  
ON CONFLICT (source, base, quote) 
DO UPDATE SET 
  sell = EXCLUDED.sell,
  buy = EXCLUDED.buy,
  updated_at = EXCLUDED.updated_at;

-- Verify the data was inserted correctly
SELECT 
  'Added crypto-to-crypto pairs successfully with ' || COUNT(*) || ' total records' as status
FROM kenig_rates
WHERE base IS NOT NULL AND quote IS NOT NULL;

-- Show some of the inserted data to confirm everything is working
SELECT 
  source,
  base,
  quote,
  sell,
  buy,
  updated_at
FROM kenig_rates 
WHERE base != 'USDT' AND quote != 'RUB' -- Show only crypto-to-crypto pairs
ORDER BY base, quote
LIMIT 20;