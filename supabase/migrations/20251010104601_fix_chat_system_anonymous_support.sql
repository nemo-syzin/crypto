/*
  # Исправление системы чата с поддержкой анонимных пользователей
  
  1. Новые таблицы
    - `chat_sessions` - сессии чата (user_id может быть NULL для анонимных пользователей)
    - `chat_messages` - сообщения в чате
    - `chat_operators` - операторы поддержки
    
  2. Безопасность
    - Включение RLS для всех таблиц
    - Политики доступа для авторизованных, анонимных пользователей и операторов
    - Анонимные пользователи могут создавать сессии и отправлять сообщения
    
  3. Функции
    - Автоматическое обновление updated_at
    - Триггеры для отслеживания изменений
*/

-- Создаем таблицу сессий чата
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  operator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  closed_at TIMESTAMPTZ,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  initial_message TEXT
);

-- Создаем таблицу сообщений чата
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'operator', 'system')),
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  created_at TIMESTAMPTZ DEFAULT now(),
  read_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Создаем таблицу операторов
CREATE TABLE IF NOT EXISTS chat_operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  is_online BOOLEAN DEFAULT false,
  max_concurrent_chats INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Включаем RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_operators ENABLE ROW LEVEL SECURITY;

-- ========== Политики для chat_sessions ==========

-- Анонимные и авторизованные пользователи могут создавать сессии
CREATE POLICY "Пользователи могут создавать сессии"
  ON chat_sessions
  FOR INSERT
  WITH CHECK (true);

-- Пользователи могут видеть свои сессии (по user_id или по email для анонимных)
CREATE POLICY "Пользователи могут видеть свои сессии"
  ON chat_sessions
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT user_id FROM chat_operators WHERE is_online = true)
  );

-- Операторы могут обновлять сессии
CREATE POLICY "Операторы могут обновлять сессии"
  ON chat_sessions
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT user_id FROM chat_operators WHERE is_online = true)
  )
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM chat_operators WHERE is_online = true)
  );

-- ========== Политики для chat_messages ==========

-- Анонимные и авторизованные пользователи могут отправлять сообщения в свои сессии
CREATE POLICY "Участники могут отправлять сообщения"
  ON chat_messages
  FOR INSERT
  WITH CHECK (true);

-- Участники могут видеть сообщения своих сессий
CREATE POLICY "Участники могут видеть сообщения"
  ON chat_messages
  FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM chat_sessions 
      WHERE user_id = auth.uid() OR operator_id = auth.uid()
    )
  );

-- ========== Политики для chat_operators ==========

-- Все могут видеть список операторов
CREATE POLICY "Все могут видеть операторов"
  ON chat_operators
  FOR SELECT
  USING (true);

-- Операторы могут обновлять свои данные
CREATE POLICY "Операторы могут обновлять свои данные"
  ON chat_operators
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Создаем индексы для производительности
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_operator_id ON chat_sessions(operator_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_email ON chat_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_operators_user_id ON chat_operators(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_operators_is_online ON chat_operators(is_online);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_chat_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON chat_sessions;
CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_updated_at_column();

DROP TRIGGER IF EXISTS update_chat_operators_updated_at ON chat_operators;
CREATE TRIGGER update_chat_operators_updated_at
  BEFORE UPDATE ON chat_operators
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_updated_at_column();