/*
  # Manual Setup for Exchange Rates Table
  
  Since the Supabase CLI is not available in this environment, run this SQL
  directly in your Supabase dashboard under SQL Editor to create the required
  exchange_rates table and populate it with initial data.
  
  Steps to apply:
  1. Go to your Supabase dashboard
  2. Navigate to SQL Editor
  3. Copy and paste this entire SQL script
  4. Click "Run" to execute
  
  This will create the exchange_rates table with proper RLS policies and
  insert the initial data needed for the application to work.
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

-- Show the inserted data
SELECT * FROM exchange_rates ORDER BY source;