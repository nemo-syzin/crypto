/*
  # Create sample data for kenig_rates table
  
  This migration adds sample data to the kenig_rates table with various cryptocurrencies
  and their exchange rates against RUB.
  
  INSTRUCTIONS:
  1. Go to your Supabase dashboard (https://supabase.com/dashboard)
  2. Select your project
  3. Navigate to "SQL Editor" in the left sidebar
  4. Create a new query
  5. Copy and paste this entire SQL script
  6. Click "Run" to execute
*/

-- Insert sample data for various cryptocurrencies
INSERT INTO kenig_rates (source, base, quote, sell, buy, updated_at) VALUES
  ('kenig', 'USDT', 'RUB', 95.50, 94.80, now()),
  ('kenig', 'BTC', 'RUB', 2800000.00, 2750000.00, now()),
  ('kenig', 'ETH', 'RUB', 180000.00, 175000.00, now()),
  ('kenig', 'BNB', 'RUB', 25000.00, 24500.00, now()),
  ('kenig', 'USDC', 'RUB', 95.30, 94.70, now()),
  ('kenig', 'ADA', 'RUB', 35.00, 34.00, now()),
  ('kenig', 'DOT', 'RUB', 450.00, 440.00, now()),
  ('kenig', 'SOL', 'RUB', 8500.00, 8300.00, now()),
  ('kenig', 'MATIC', 'RUB', 45.00, 44.00, now()),
  ('kenig', 'AVAX', 'RUB', 2200.00, 2150.00, now()),
  ('kenig', 'XRP', 'RUB', 38.00, 37.00, now()),
  ('kenig', 'DOGE', 'RUB', 8.50, 8.30, now()),
  ('kenig', 'SHIB', 'RUB', 0.0018, 0.0017, now()),
  ('kenig', 'LTC', 'RUB', 5800.00, 5700.00, now()),
  ('kenig', 'LINK', 'RUB', 950.00, 930.00, now()),
  ('kenig', 'UNI', 'RUB', 520.00, 510.00, now()),
  ('kenig', 'ATOM', 'RUB', 650.00, 635.00, now()),
  ('kenig', 'XLM', 'RUB', 28.00, 27.50, now()),
  ('kenig', 'TRX', 'RUB', 7.50, 7.30, now()),
  ('kenig', 'FIL', 'RUB', 320.00, 315.00, now()),
  ('kenig', 'NEAR', 'RUB', 280.00, 275.00, now())
ON CONFLICT (source, base, quote) 
DO UPDATE SET 
  sell = EXCLUDED.sell,
  buy = EXCLUDED.buy,
  updated_at = EXCLUDED.updated_at;

-- Insert data for other sources (only for USDT/RUB)
INSERT INTO kenig_rates (source, base, quote, sell, buy, updated_at) VALUES
  ('bestchange', 'USDT', 'RUB', 95.30, 94.90, now()),
  ('energo', 'USDT', 'RUB', 95.20, 94.70, now())
ON CONFLICT (source, base, quote) 
DO UPDATE SET 
  sell = EXCLUDED.sell,
  buy = EXCLUDED.buy,
  updated_at = EXCLUDED.updated_at;

-- Verify the data was inserted correctly
SELECT 
  'Sample data inserted successfully with ' || COUNT(*) || ' records' as status
FROM kenig_rates
WHERE base IS NOT NULL AND quote IS NOT NULL;

-- Show the inserted data to confirm everything is working
SELECT 
  source,
  base,
  quote,
  sell,
  buy,
  updated_at
FROM kenig_rates 
WHERE base IS NOT NULL AND quote IS NOT NULL
ORDER BY source, base;