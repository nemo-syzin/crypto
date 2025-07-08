/*
  # Create exchange_rates table with correct structure

  1. New Tables
    - `exchange_rates`
      - `id` (serial, primary key)
      - `currency_code` (text, not null) - Currency code (e.g., USDT, BTC)
      - `currency_name` (text) - Currency name (e.g., Tether, Bitcoin)
      - `sell` (numeric) - Sell rate in RUB
      - `buy` (numeric) - Buy rate in RUB
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `exchange_rates` table
    - Add policy for public read access (exchange rates are public information)
    - Add policies for authenticated users to insert/update rates

  3. Initial Data
    - Insert sample exchange rates for various cryptocurrencies
*/

-- Drop table if it exists to ensure clean state
DROP TABLE IF EXISTS exchange_rates CASCADE;

-- Create the exchange_rates table with correct column names
CREATE TABLE exchange_rates (
  id SERIAL PRIMARY KEY,
  currency_code TEXT NOT NULL,
  currency_name TEXT,
  sell NUMERIC(15,2) NOT NULL DEFAULT 0,
  buy NUMERIC(15,2) NOT NULL DEFAULT 0,
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
CREATE INDEX idx_exchange_rates_currency_code ON exchange_rates(currency_code);
CREATE INDEX idx_exchange_rates_updated_at ON exchange_rates(updated_at);

-- Insert initial sample data with various cryptocurrencies
INSERT INTO exchange_rates (currency_code, currency_name, sell, buy, updated_at) VALUES
  ('USDT', 'Tether', 95.50, 94.80, now()),
  ('BTC', 'Bitcoin', 2800000.00, 2750000.00, now()),
  ('ETH', 'Ethereum', 180000.00, 175000.00, now()),
  ('BNB', 'Binance Coin', 25000.00, 24500.00, now()),
  ('USDC', 'USD Coin', 95.30, 94.70, now()),
  ('ADA', 'Cardano', 35.00, 34.00, now()),
  ('DOT', 'Polkadot', 450.00, 440.00, now()),
  ('SOL', 'Solana', 8500.00, 8300.00, now()),
  ('MATIC', 'Polygon', 45.00, 44.00, now()),
  ('AVAX', 'Avalanche', 2200.00, 2150.00, now()),
  ('XRP', 'Ripple', 38.00, 37.00, now()),
  ('DOGE', 'Dogecoin', 8.50, 8.30, now()),
  ('SHIB', 'Shiba Inu', 0.0018, 0.0017, now()),
  ('LTC', 'Litecoin', 5800.00, 5700.00, now()),
  ('LINK', 'Chainlink', 950.00, 930.00, now()),
  ('UNI', 'Uniswap', 520.00, 510.00, now()),
  ('ATOM', 'Cosmos', 650.00, 635.00, now()),
  ('XLM', 'Stellar', 28.00, 27.50, now()),
  ('TRX', 'TRON', 7.50, 7.30, now()),
  ('FIL', 'Filecoin', 320.00, 315.00, now()),
  ('NEAR', 'NEAR Protocol', 280.00, 275.00, now()),
  ('RUB', 'Russian Ruble', 1.00, 1.00, now());

-- Verify the data was inserted correctly
SELECT 
  'Table created successfully with ' || COUNT(*) || ' records' as status
FROM exchange_rates;

-- Show the inserted data to confirm everything is working
SELECT 
  currency_code,
  currency_name,
  sell,
  buy,
  updated_at
FROM exchange_rates 
ORDER BY currency_code;