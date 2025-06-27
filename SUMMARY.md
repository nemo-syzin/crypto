# KenigSwap - Криптообменник

**Версия:** 1.0.0  
**Статус:** Production Ready  
**Последнее обновление:** Декабрь 2024

## Архитектура
- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **3D:** Three.js + React Three Fiber
- **Анимации:** Framer Motion
- **API:** CoinGecko для курсов криптовалют

## Ключевые страницы
- `/` - Главная с hero и манифестом
- `/exchange` - Калькулятор обмена + сравнение курсов
- `/rates` - Live курсы криптовалют (CoinGecko API)
- `/about` - О компании с 3D кристаллом целей
- `/support` - Поддержка и FAQ

## Основные компоненты
- `ManifestoStrip` - Интерактивная полоса ценностей
- `CrystalVisualization` - 3D кристалл стратегических целей
- `ExchangeCalculator` - Калькулятор обмена с Supabase
- `UnifiedVantaBackground` - Анимированные фоны

## База данных
- Таблица `exchange_rates` с курсами (kenig, bestchange, energo)
- RLS политики для публичного чтения
- Валидация курсов через `validated-rates.ts`

## Конфигурация
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- CoinGecko: `COINGECKO_API_KEY`
- Fallback данные при недоступности API

## Оптимизации
- SWR кэширование (30с для курсов, 5мин для рынка)
- Lazy loading 3D компонентов
- Оптимизированные изображения
- Минификация в production