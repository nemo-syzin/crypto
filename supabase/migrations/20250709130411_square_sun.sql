/*
  # Add USDT/ADA pair and fix exchange rate lookup
  
  This migration adds the USDT/ADA pair and its inverse ADA/USDT pair to ensure
  the exchange calculator can properly find rates for these currencies.
  
  1. Data Addition
    - Add USDT/ADA pair with appropriate sell/buy rates
    - Add ADA/USDT pair with inverse rates
    - Add related pairs for comprehensive coverage
    
  2. Data Verification
    - Verify the data was inserted correctly
    - Show explanation of the rate relationships
*/

-- Add USDT/ADA pair if it doesn't exist
INSERT INTO kenig_rates (source, base, quote, sell, buy, updated_at)
VALUES ('kenig', 'USDT', 'ADA', 2.86, 2.78, now())
ON CONFLICT (source, base, quote) 
DO UPDATE SET 
  sell = 2.86,
  buy = 2.78,
  updated_at = now();

-- Add ADA/USDT pair if it doesn't exist (inverse of USDT/ADA)
INSERT INTO kenig_rates (source, base, quote, sell, buy, updated_at)
VALUES ('kenig', 'ADA', 'USDT', 0.36, 0.35, now())
ON CONFLICT (source, base, quote) 
DO UPDATE SET 
  sell = 0.36,
  buy = 0.35,
  updated_at = now();

-- Add other commonly requested pairs
INSERT INTO kenig_rates (source, base, quote, sell, buy, updated_at)
VALUES 
  -- Add more pairs as needed for common exchanges
  ('kenig', 'BTC', 'ADA', 82000.00, 81000.00, now()),
  ('kenig', 'ETH', 'ADA', 5200.00, 5100.00, now()),
  ('kenig', 'ADA', 'RUB', 35.00, 34.00, now()),
  ('kenig', 'RUB', 'ADA', 0.0294, 0.0286, now())
ON CONFLICT (source, base, quote) 
DO UPDATE SET 
  sell = EXCLUDED.sell,
  buy = EXCLUDED.buy,
  updated_at = EXCLUDED.updated_at;

-- Verify the data was inserted correctly
SELECT 
  'Added USDT/ADA and ADA/USDT pairs successfully' as status
FROM kenig_rates
WHERE source = 'kenig' AND (
  (base = 'USDT' AND quote = 'ADA') OR 
  (base = 'ADA' AND quote = 'USDT')
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
  (base = 'ADA') OR 
  (quote = 'ADA')
)
ORDER BY base, quote;

-- Explanation of the rates
SELECT 
  'USDT/ADA sell rate (2.86) means 1 USDT can be sold for 2.86 ADA' as explanation1,
  'ADA/USDT sell rate (0.36) means 1 ADA can be sold for 0.36 USDT' as explanation2,
  'These rates are inverse of each other: 1/0.35 ≈ 2.86 and 1/2.78 ≈ 0.36' as explanation3;