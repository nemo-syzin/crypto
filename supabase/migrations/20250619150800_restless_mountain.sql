/*
  # Create exchange_rates table - Consolidated Migration
  
  This migration creates the exchange_rates table with the correct structure
  for the KenigSwap application.

  1. New Tables
    - `exchange_rates`
      - `id` (integer, primary key, auto-increment)
      - `source` (text, exchange source identifier)
      - `usdt_sell_rate` (numeric, USDT sell rate in RUB)
      - `usdt_buy_rate` (numeric, USDT buy rate in RUB)
      - `updated_at` (timestamptz, last update timestamp)

  2. Security
    - Enable RLS on `exchange_rates` table
    - Add policy for public read access (rates are public information)
    - Add policy for authenticated users to insert/update rates

  3. Initial Data
    - Insert sample data for KenigSwap, BestChange, and EnergoTransBank sources
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