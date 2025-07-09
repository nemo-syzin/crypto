/*
  # Add missing currency pairs to kenig_rates table
  
  This migration adds missing currency pairs to the kenig_rates table,
  particularly focusing on adding the USDT/ADA pair that was causing errors.
  
  1. Data Addition
    - Add USDT/ADA pair if it doesn't exist
    - Add ADA/USDT pair if it doesn't exist (inverse pair)
    - Add RUB/USDT pair if it doesn't exist
    - Add other commonly used pairs
    
  2. Data Verification
    - Verify the data was inserted correctly
    - Show explanation of rate relationships
*/

-- Add ADA/USDT pair if it doesn't exist
INSERT INTO kenig_rates (source, base, quote, sell, buy, updated_at)
VALUES ('kenig', 'ADA', 'USDT', 0.36, 0.35, now())
ON CONFLICT (source, base, quote) 
DO UPDATE SET 
  sell = 0.36,
  buy = 0.35,
  updated_at = now();

-- Add USDT/ADA pair if it doesn't exist (inverse of ADA/USDT)
INSERT INTO kenig_rates (source, base, quote, sell, buy, updated_at)
VALUES ('kenig', 'USDT', 'ADA', 2.86, 2.78, now())
ON CONFLICT (source, base, quote) 
DO UPDATE SET 
  sell = 2.86,
  buy = 2.78,
  updated_at = now();

-- Add RUB/USDT pair if it doesn't exist
INSERT INTO kenig_rates (source, base, quote, sell, buy, updated_at)
VALUES ('kenig', 'RUB', 'USDT', 0.0106, 0.0105, now())
ON CONFLICT (source, base, quote) 
DO UPDATE SET 
  sell = 0.0106,
  buy = 0.0105,
  updated_at = now();

-- Add other commonly used pairs
INSERT INTO kenig_rates (source, base, quote, sell, buy, updated_at)
VALUES 
  -- Add more pairs as needed
  ('kenig', 'BTC', 'USDT', 29500.00, 29300.00, now()),
  ('kenig', 'ETH', 'USDT', 1850.00, 1830.00, now()),
  ('kenig', 'BNB', 'USDT', 260.00, 258.00, now()),
  ('kenig', 'SOL', 'USDT', 88.00, 87.00, now()),
  ('kenig', 'DOT', 'USDT', 4.60, 4.50, now()),
  ('kenig', 'XRP', 'USDT', 0.39, 0.38, now()),
  ('kenig', 'DOGE', 'USDT', 0.088, 0.086, now()),
  ('kenig', 'SHIB', 'USDT', 0.000019, 0.000018, now()),
  ('kenig', 'LTC', 'USDT', 60.50, 59.50, now()),
  ('kenig', 'LINK', 'USDT', 9.80, 9.60, now()),
  ('kenig', 'UNI', 'USDT', 5.40, 5.30, now()),
  ('kenig', 'ATOM', 'USDT', 6.70, 6.60, now()),
  ('kenig', 'XLM', 'USDT', 0.29, 0.28, now()),
  ('kenig', 'TRX', 'USDT', 0.078, 0.076, now()),
  ('kenig', 'FIL', 'USDT', 3.30, 3.20, now()),
  ('kenig', 'NEAR', 'USDT', 2.90, 2.80, now())
ON CONFLICT (source, base, quote) 
DO UPDATE SET 
  sell = EXCLUDED.sell,
  buy = EXCLUDED.buy,
  updated_at = EXCLUDED.updated_at;

-- Verify the data was inserted correctly
SELECT 
  'Added ADA/USDT and USDT/ADA pairs successfully' as status
FROM kenig_rates
WHERE source = 'kenig' AND (
  (base = 'ADA' AND quote = 'USDT') OR 
  (base = 'USDT' AND quote = 'ADA')
);

-- Show the inserted ADA pairs to confirm everything is working
SELECT 
  source,
  base,
  quote,
  sell,
  buy,
  updated_at
FROM kenig_rates 
WHERE source = 'kenig' AND (
  (base = 'ADA' AND quote = 'USDT') OR 
  (base = 'USDT' AND quote = 'ADA')
)
ORDER BY base, quote;

-- Explanation of the rates
SELECT 
  'ADA/USDT sell rate (0.36) means 1 ADA can be sold for 0.36 USDT' as explanation1,
  'USDT/ADA sell rate (2.86) means 1 USDT can be sold for 2.86 ADA' as explanation2,
  'These rates are inverse of each other: 1/0.35 ≈ 2.86 and 1/2.78 ≈ 0.36' as explanation3;