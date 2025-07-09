/*
  # Add RUB/USDT exchange rate pair
  
  This migration adds the RUB/USDT exchange rate pair to the kenig_rates table.
  
  1. Data Addition
    - Add RUB/USDT pair with correct exchange rates
    - The rates are calculated as the inverse of the USDT/RUB rates
    
  2. Explanation
    - For currency pairs, if USDT/RUB sell rate is ~95, then RUB/USDT buy rate is ~1/95 = 0.0105
    - For currency pairs, if USDT/RUB buy rate is ~94, then RUB/USDT sell rate is ~1/94 = 0.0106
    - This ensures proper bidirectional exchange rate calculations
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

-- Show the inserted data to confirm everything is working
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