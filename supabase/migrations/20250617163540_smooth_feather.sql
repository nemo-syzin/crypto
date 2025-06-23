/*
  # Create exchange rates table

  1. New Tables
    - `exchange_rates`
      - `id` (uuid, primary key)
      - `source` (text) - источник курса (kenig, bestchange, energo)
      - `usdt_sell_rate` (decimal) - курс продажи USDT
      - `usdt_buy_rate` (decimal) - курс покупки USDT
      - `created_at` (timestamp)
      - `is_active` (boolean) - активный курс
      
  2. Security
    - Enable RLS on `exchange_rates` table
    - Add policy for public read access
    - Add policy for authenticated insert/update
*/

CREATE TABLE IF NOT EXISTS exchange_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  usdt_sell_rate decimal(10,4) NOT NULL,
  usdt_buy_rate decimal(10,4) NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

-- Политика для чтения курсов (публичный доступ)
CREATE POLICY "Anyone can read exchange rates"
  ON exchange_rates
  FOR SELECT
  TO public
  USING (true);

-- Политика для вставки курсов (только аутентифицированные пользователи)
CREATE POLICY "Authenticated users can insert rates"
  ON exchange_rates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Политика для обновления курсов (только аутентифицированные пользователи)
CREATE POLICY "Authenticated users can update rates"
  ON exchange_rates
  FOR UPDATE
  TO authenticated
  USING (true);

-- Индекс для быстрого поиска активных курсов
CREATE INDEX IF NOT EXISTS idx_exchange_rates_active 
  ON exchange_rates (source, is_active, created_at DESC);

-- Индекс для временных запросов
CREATE INDEX IF NOT EXISTS idx_exchange_rates_created_at 
  ON exchange_rates (created_at DESC);