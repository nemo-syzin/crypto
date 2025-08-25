/*
  # Создание view для последних курсов по каждой валютной паре
  
  Этот view возвращает только последние курсы для каждой уникальной пары (source, base, quote),
  что значительно уменьшает количество данных и улучшает производительность API.
  
  1. View
    - `kenig_pairs_latest` - последние курсы для каждой пары
    
  2. Оптимизация
    - Использует DISTINCT ON для получения только последних записей
    - Сортировка по updated_at DESC для получения самых свежих данных
    - Значительно уменьшает объем данных для API
*/

-- Создаем view для получения последних курсов по каждой паре
CREATE OR REPLACE VIEW kenig_pairs_latest AS
SELECT DISTINCT ON (source, base, quote)
  id,
  source,
  base,
  quote,
  sell,
  buy,
  rate,
  min_amount,
  max_amount,
  reserve,
  operational_mode,
  working_hours,
  is_active,
  conditions,
  exchange_source,
  updated_at,
  last_price
FROM kenig_rates
WHERE base IS NOT NULL 
  AND quote IS NOT NULL
  AND source IS NOT NULL
ORDER BY source, base, quote, updated_at DESC;

-- Создаем индекс для оптимизации view
CREATE INDEX IF NOT EXISTS idx_kenig_rates_source_base_quote_updated 
ON kenig_rates(source, base, quote, updated_at DESC);

-- Проверяем, что view создан успешно
SELECT 
  'View kenig_pairs_latest created successfully' as status,
  COUNT(*) as unique_pairs_count
FROM kenig_pairs_latest;

-- Показываем примеры данных из view
SELECT 
  source,
  base,
  quote,
  sell,
  buy,
  updated_at
FROM kenig_pairs_latest
WHERE source IN ('kenig', 'bestchange', 'energo')
ORDER BY source, base, quote
LIMIT 10;