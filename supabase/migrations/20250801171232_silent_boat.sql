/*
  # Добавление полей для BestChange фида в таблицу kenig_rates

  1. Новые поля
    - `min_amount` (numeric) - Минимальная сумма обмена
    - `max_amount` (numeric) - Максимальная сумма обмена  
    - `reserve` (numeric) - Резерв валюты
    - `operational_mode` (text) - Режим работы (auto, semi-auto, manual)
    - `working_hours` (jsonb) - Часы работы для ручных/полуавтоматических режимов
    - `is_active` (boolean) - Активно ли направление
    - `conditions` (text) - Условия обмена (KYC, подтверждения и т.д.)
    - `exchange_source` (text) - Источник курса (Binance, Kraken и т.д.)

  2. Обновление данных
    - Установка значений по умолчанию для существующих записей
    - Добавление примеров данных для тестирования
*/

-- Добавляем новые поля в таблицу kenig_rates
DO $$
BEGIN
  -- Добавляем min_amount если не существует
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'kenig_rates' AND column_name = 'min_amount'
  ) THEN
    ALTER TABLE kenig_rates ADD COLUMN min_amount NUMERIC(15,2) DEFAULT 100;
  END IF;

  -- Добавляем max_amount если не существует
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'kenig_rates' AND column_name = 'max_amount'
  ) THEN
    ALTER TABLE kenig_rates ADD COLUMN max_amount NUMERIC(15,2) DEFAULT 1000000;
  END IF;

  -- Добавляем reserve если не существует
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'kenig_rates' AND column_name = 'reserve'
  ) THEN
    ALTER TABLE kenig_rates ADD COLUMN reserve NUMERIC(15,2) DEFAULT 50000;
  END IF;

  -- Добавляем operational_mode если не существует
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'kenig_rates' AND column_name = 'operational_mode'
  ) THEN
    ALTER TABLE kenig_rates ADD COLUMN operational_mode TEXT DEFAULT 'auto';
  END IF;

  -- Добавляем working_hours если не существует
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'kenig_rates' AND column_name = 'working_hours'
  ) THEN
    ALTER TABLE kenig_rates ADD COLUMN working_hours JSONB DEFAULT '{"mon": {"start": "09:00", "end": "18:00"}, "tue": {"start": "09:00", "end": "18:00"}, "wed": {"start": "09:00", "end": "18:00"}, "thu": {"start": "09:00", "end": "18:00"}, "fri": {"start": "09:00", "end": "18:00"}, "sat": {"start": "10:00", "end": "16:00"}, "sun": {"start": "10:00", "end": "16:00"}}'::jsonb;
  END IF;

  -- Добавляем is_active если не существует
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'kenig_rates' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE kenig_rates ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
  END IF;

  -- Добавляем conditions если не существует
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'kenig_rates' AND column_name = 'conditions'
  ) THEN
    ALTER TABLE kenig_rates ADD COLUMN conditions TEXT DEFAULT '';
  END IF;

  -- Добавляем exchange_source если не существует
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'kenig_rates' AND column_name = 'exchange_source'
  ) THEN
    ALTER TABLE kenig_rates ADD COLUMN exchange_source TEXT DEFAULT '';
  END IF;
END $$;

-- Обновляем существующие записи с реалистичными значениями
UPDATE kenig_rates SET 
  min_amount = CASE 
    WHEN base = 'USDT' THEN 100
    WHEN base = 'BTC' THEN 0.001
    WHEN base = 'ETH' THEN 0.01
    WHEN base = 'RUB' THEN 10000
    ELSE 10
  END,
  max_amount = CASE 
    WHEN base = 'USDT' THEN 100000
    WHEN base = 'BTC' THEN 10
    WHEN base = 'ETH' THEN 100
    WHEN base = 'RUB' THEN 10000000
    ELSE 10000
  END,
  reserve = CASE 
    WHEN quote = 'RUB' THEN 5000000  -- 5 млн рублей резерв
    WHEN quote = 'USDT' THEN 50000   -- 50k USDT резерв
    WHEN quote = 'BTC' THEN 5        -- 5 BTC резерв
    WHEN quote = 'ETH' THEN 50       -- 50 ETH резерв
    ELSE 10000
  END,
  operational_mode = CASE 
    WHEN source = 'kenig' THEN 'auto'
    WHEN source = 'bestchange' THEN 'semi-auto'
    ELSE 'manual'
  END,
  is_active = TRUE,
  conditions = CASE 
    WHEN base IN ('BTC', 'ETH') THEN 'Требуется KYC, 3 подтверждения сети'
    WHEN base = 'USDT' THEN '1 подтверждение сети, быстрый обмен'
    WHEN base = 'RUB' THEN 'Верификация карты, мгновенный перевод'
    ELSE 'Стандартные условия обмена'
  END,
  exchange_source = CASE 
    WHEN source = 'kenig' THEN 'Binance'
    WHEN source = 'bestchange' THEN 'Kraken'
    ELSE 'Internal'
  END
WHERE min_amount IS NULL OR max_amount IS NULL OR reserve IS NULL;

-- Создаем индексы для новых полей
CREATE INDEX IF NOT EXISTS idx_kenig_rates_is_active ON kenig_rates(is_active);
CREATE INDEX IF NOT EXISTS idx_kenig_rates_operational_mode ON kenig_rates(operational_mode);

-- Показываем результат
SELECT 
  'Поля для BestChange успешно добавлены в таблицу kenig_rates' as status,
  COUNT(*) as total_records
FROM kenig_rates;

-- Показываем примеры обновленных данных
SELECT 
  source,
  base,
  quote,
  sell,
  buy,
  min_amount,
  max_amount,
  reserve,
  operational_mode,
  is_active,
  conditions
FROM kenig_rates 
WHERE base IS NOT NULL AND quote IS NOT NULL
ORDER BY source, base
LIMIT 10;