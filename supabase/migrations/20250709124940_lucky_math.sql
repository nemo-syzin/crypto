/*
  # Add RUB/USDT pair to kenig_rates table
  
  This migration adds the RUB/USDT pair to the kenig_rates table if it doesn't exist.
  This pair is essential for the exchange calculator to work correctly when converting
  between RUB and USDT in both directions.
  
  1. Data Addition
    - Add RUB/USDT pair with appropriate rates
    - Update if the pair already exists
    
  2. Data Verification
    - Verify the data was inserted correctly
    - Show both USDT/RUB and RUB/USDT pairs for comparison
*/

-- Add RUB/USDT pair if it doesn't exist
INSERT INTO kenig_rates (source, base, quote, sell, buy, updated_at)
VALUES ('kenig', 'RUB', 'USDT', 0.0106, 0.0105, now())
ON CONFLICT (source, base, quote) 
DO UPDATE SET 
  sell = 0.0106,
  buy = 0.0105,
  updated_at = now();

-- Verify the data was inserted correctly
SELECT 
  'Added RUB/USDT pair successfully' as status
FROM kenig_rates
WHERE source = 'kenig' AND base = 'RUB' AND quote = 'USDT';

-- Show both USDT/RUB and RUB/USDT pairs for comparison
SELECT 
  source,
  base,
  quote,
  sell,
  buy,
  updated_at
FROM kenig_rates 
WHERE source = 'kenig' AND (
  (base = 'USDT' AND quote = 'RUB') OR 
  (base = 'RUB' AND quote = 'USDT')
)
ORDER BY base, quote;

-- Add explanation of the rates
SELECT 
  'USDT/RUB sell rate (95.50) should be approximately 1/RUB/USDT buy rate (1/0.0105 ≈ 95.24)' as explanation,
  'USDT/RUB buy rate (94.80) should be approximately 1/RUB/USDT sell rate (1/0.0106 ≈ 94.34)' as explanation2;