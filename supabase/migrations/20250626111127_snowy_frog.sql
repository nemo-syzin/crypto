/*
  # Create exchange rates table

  1. New Tables
    - `exchange_rates`
      - `id` (serial, primary key)
      - `source` (text, unique, not null) - Exchange source name
      - `usdt_sell_rate` (numeric) - USDT sell rate
      - `usdt_buy_rate` (numeric) - USDT buy rate
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `exchange_rates` table
    - Add policy for public read access (exchange rates are public information)
    - Add policies for authenticated users to insert/update rates

  3. Initial Data
    - Insert sample exchange rates for kenig, bestchange, and energo
*/

-- Create the exchange_rates table
CREATE TABLE IF NOT EXISTS exchange_rates (
  id SERIAL PRIMARY KEY,
  source TEXT NOT NULL UNIQUE,
  usdt_sell_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  usdt_buy_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (exchange rates are public information)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'exchange_rates' 
    AND policyname = 'Allow public read access to exchange rates'
  ) THEN
    CREATE POLICY "Allow public read access to exchange rates"
      ON exchange_rates
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- Create policy for authenticated users to insert rates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'exchange_rates' 
    AND policyname = 'Allow authenticated users to insert rates'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert rates"
      ON exchange_rates
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- Create policy for authenticated users to update rates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'exchange_rates' 
    AND policyname = 'Allow authenticated users to update rates'
  ) THEN
    CREATE POLICY "Allow authenticated users to update rates"
      ON exchange_rates
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create indexes for better performance
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_exchange_rates_source'
  ) THEN
    CREATE INDEX idx_exchange_rates_source ON exchange_rates(source);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_exchange_rates_updated_at'
  ) THEN
    CREATE INDEX idx_exchange_rates_updated_at ON exchange_rates(updated_at);
  END IF;
END $$;

-- Insert initial sample data (only if table is empty)
INSERT INTO exchange_rates (source, usdt_sell_rate, usdt_buy_rate, updated_at)
SELECT 'kenig', 95.50, 94.80, now()
WHERE NOT EXISTS (SELECT 1 FROM exchange_rates WHERE source = 'kenig');

INSERT INTO exchange_rates (source, usdt_sell_rate, usdt_buy_rate, updated_at)
SELECT 'bestchange', 95.30, 94.90, now()
WHERE NOT EXISTS (SELECT 1 FROM exchange_rates WHERE source = 'bestchange');

INSERT INTO exchange_rates (source, usdt_sell_rate, usdt_buy_rate, updated_at)
SELECT 'energo', 95.20, 94.70, now()
WHERE NOT EXISTS (SELECT 1 FROM exchange_rates WHERE source = 'energo');