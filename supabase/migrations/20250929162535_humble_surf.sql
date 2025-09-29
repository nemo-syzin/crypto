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
      - `client_wallet_address` (text) - Адрес кошелька клиента
      - `client_bank_details` (text) - Банковские реквизиты клиента
      - `network` (text) - Сеть для криптовалют (TRC20, ERC20, BEP20)
      - `created_at` (timestamptz) - Время создания
      - `updated_at` (timestamptz) - Время последнего обновления
      
  2. Безопасность
    - Включить RLS для таблицы `exchange_orders`
    - Добавить политики для чтения и создания заявок
    
  3. Индексы
    - Индексы для оптимизации запросов
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
  client_email TEXT NOT NULL,
  client_phone TEXT,
  client_wallet_address TEXT,
  client_bank_details TEXT,
  network TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Включаем Row Level Security
ALTER TABLE exchange_orders ENABLE ROW LEVEL SECURITY;

-- Создаем политики доступа
CREATE POLICY "Пользователи могут видеть свои заявки"
  ON exchange_orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Анонимные пользователи могут создавать заявки"
  ON exchange_orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Пользователи могут создавать заявки"
  ON exchange_orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Администраторы могут видеть все заявки"
  ON exchange_orders
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM chat_operators WHERE is_online = true
    )
  );

CREATE POLICY "Администраторы могут обновлять заявки"
  ON exchange_orders
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM chat_operators WHERE is_online = true
    )
  );

-- Создаем индексы для производительности
CREATE INDEX IF NOT EXISTS idx_exchange_orders_user_id ON exchange_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_exchange_orders_status ON exchange_orders(status);
CREATE INDEX IF NOT EXISTS idx_exchange_orders_created_at ON exchange_orders(created_at);
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
CREATE TRIGGER update_exchange_orders_updated_at_trigger
  BEFORE UPDATE ON exchange_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_exchange_orders_updated_at();

-- Проверяем, что таблица создана успешно
SELECT 
  'Таблица exchange_orders создана успешно' as status;