/*
  # Добавление недостающих полей в таблицу exchange_orders
  
  Добавляем поля network и full_name, которые используются в форме заявки
  но отсутствуют в текущей схеме таблицы.
  
  1. Новые поля
    - `network` (text) - Сеть для криптовалют (TRC20, ERC20, BEP20)
    - `full_name` (text) - ФИО клиента
    
  2. Обновление существующих записей
    - Установка значений по умолчанию для новых полей
*/

-- Добавляем поле network если не существует
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exchange_orders' AND column_name = 'network'
  ) THEN
    ALTER TABLE exchange_orders ADD COLUMN network TEXT NULL;
    RAISE NOTICE 'Добавлено поле network в таблицу exchange_orders';
  ELSE
    RAISE NOTICE 'Поле network уже существует в таблице exchange_orders';
  END IF;
END $$;

-- Добавляем поле full_name если не существует
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exchange_orders' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE exchange_orders ADD COLUMN full_name TEXT NULL;
    RAISE NOTICE 'Добавлено поле full_name в таблицу exchange_orders';
  ELSE
    RAISE NOTICE 'Поле full_name уже существует в таблице exchange_orders';
  END IF;
END $$;

-- Проверяем, что поля добавлены успешно
SELECT 
  'Поля network и full_name добавлены в таблицу exchange_orders' as status,
  COUNT(*) as total_records
FROM exchange_orders;