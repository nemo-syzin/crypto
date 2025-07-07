/*
  # Manual Setup for Exchange Rates Table
  
  INSTRUCTIONS:
  1. Go to your Supabase dashboard (https://supabase.com/dashboard)
  2. Select your project
  3. Navigate to "SQL Editor" in the left sidebar
  4. Create a new query
  5. Copy and paste this entire SQL script
  6. Click "Run" to execute
  
  This will create the exchange_rates table with proper RLS policies and
  insert the initial data needed for the KenigSwap application to work.
*/

-- Drop table if it exists to ensure clean state
DROP TABLE IF EXISTS exchange_rates CASCADE;

-- Create the exchange_rates table
CREATE TABLE exchange_rates (
  id SERIAL PRIMARY KEY,
  source TEXT NOT NULL UNIQUE,
  usdt_sell_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  usdt_buy_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (exchange rates are public information)
CREATE POLICY "Allow public read access to exchange rates"
  ON exchange_rates
  FOR SELECT
  TO public
  USING (true);

-- Create policy for authenticated users to insert/update rates
CREATE POLICY "Allow authenticated users to insert rates"
  ON exchange_rates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update rates"
  ON exchange_rates
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_exchange_rates_source ON exchange_rates(source);
CREATE INDEX idx_exchange_rates_updated_at ON exchange_rates(updated_at);

-- Insert initial sample data
INSERT INTO exchange_rates (source, usdt_sell_rate, usdt_buy_rate, updated_at) VALUES
  ('kenig', 95.50, 94.80, now()),
  ('bestchange', 95.30, 94.90, now()),
  ('energo', 95.20, 94.70, now());

-- Verify the data was inserted correctly
SELECT 
  'Table created successfully with ' || COUNT(*) || ' records' as status
FROM exchange_rates;

-- Show the inserted data to confirm everything is working
SELECT 
  source,
  usdt_sell_rate,
  usdt_buy_rate,
  updated_at
FROM exchange_rates 
ORDER BY source;