/*
  # Создание таблицы заявок на обмен
  
  1. Новые таблицы
    - `exchange_orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - ID пользователя (может быть null для анонимных заявок)
      - `status` (text) - Статус заявки (pending, processing, completed, cancelled)
      - `from_currency` (text) - Валюта отправления
      - `to_currency` (text) - Валюта получения
      - `amount_from` (numeric) - Сумма отправления
      - `amount_to` (numeric) - Сумма получения
      - `exchange_rate` (numeric) - Курс обмена на момент создания
      - `client_email` (text) - Email клиента
      - `client_phone` (text) - Телефон клиента
      - `client_telegram` (text) - Telegram клиента
      - `client_wallet_address` (text) - Адрес кошелька клиента (для крипты)
      - `client_bank_details` (text) - Банковские реквизиты (legacy, не используется)
      - `network` (text) - Сеть для криптовалют (TRC20, ERC20, BEP20)
      - `full_name` (text) - ФИО клиента
      - `created_at` (timestamptz) - Время создания
      - `updated_at` (timestamptz) - Время последнего обновления
      
  2. Безопасность
    - Включить RLS для таблицы `exchange_orders`
    - Разрешить анонимное создание заявок
    - Пользователи видят только свои заявки
    
  3. Индексы
    - Индексы для оптимизации запросов по статусу, email, дате
*/

-- Создаем таблицу заявок на обмен
CREATE TABLE IF NOT EXISTS exchange_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  amount_from NUMERIC(20,8) NOT NULL,
  amount_to NUMERIC(20,8) NOT NULL,
  exchange_rate NUMERIC(20,8) NOT NULL,
  full_name TEXT,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  client_telegram TEXT,
  client_wallet_address TEXT,
  client_bank_details TEXT,
  network TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Включаем Row Level Security
ALTER TABLE exchange_orders ENABLE ROW LEVEL SECURITY;

-- Политика: анонимные пользователи могут создавать заявки
CREATE POLICY "Анонимные пользователи могут создавать заявки"
  ON exchange_orders
  FOR INSERT
  WITH CHECK (true);

-- Политика: пользователи могут видеть свои заявки
CREATE POLICY "Пользователи могут видеть свои заявки"
  ON exchange_orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Создаем индексы для производительности
CREATE INDEX IF NOT EXISTS idx_exchange_orders_user_id ON exchange_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_exchange_orders_status ON exchange_orders(status);
CREATE INDEX IF NOT EXISTS idx_exchange_orders_created_at ON exchange_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exchange_orders_email ON exchange_orders(client_email);

-- Создаем функцию для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_exchange_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создаем триггер для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_exchange_orders_updated_at_trigger ON exchange_orders;
CREATE TRIGGER update_exchange_orders_updated_at_trigger
  BEFORE UPDATE ON exchange_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_exchange_orders_updated_at();