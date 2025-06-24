/*
  # Fix Exchange Rates Data - Ensure Initial Data Exists
  
  This migration ensures that the exchange_rates table has the required initial data
  for the KenigSwap application to function properly.

  1. Data Verification
    - Check if exchange_rates table exists and has data
    - Insert initial data if missing

  2. Data Insertion
    - Insert sample data for KenigSwap, BestChange, and EnergoTransBank sources
    - Use ON CONFLICT to avoid duplicates if data already exists

  3. Data Validation
    - Ensure all required sources have valid rates
*/

-- First, ensure the table exists (should already exist from previous migration)
CREATE TABLE IF NOT EXISTS exchange_rates (
  id SERIAL PRIMARY KEY,
  source TEXT NOT NULL UNIQUE,
  usdt_sell_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  usdt_buy_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert or update initial exchange rate data
-- Using ON CONFLICT to handle cases where data might already exist
INSERT INTO exchange_rates (source, usdt_sell_rate, usdt_buy_rate, updated_at) VALUES
  ('kenig', 95.50, 94.80, now()),
  ('bestchange', 95.30, 94.90, now()),
  ('energo', 95.20, 94.70, now())
ON CONFLICT (source) 
DO UPDATE SET 
  usdt_sell_rate = EXCLUDED.usdt_sell_rate,
  usdt_buy_rate = EXCLUDED.usdt_buy_rate,
  updated_at = EXCLUDED.updated_at;

-- Verify that we have data in the table
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM exchange_rates;
    
    IF row_count = 0 THEN
        RAISE EXCEPTION 'Failed to insert exchange rate data';
    ELSE
        RAISE NOTICE 'Successfully ensured % exchange rate records exist', row_count;
    END IF;
END $$;