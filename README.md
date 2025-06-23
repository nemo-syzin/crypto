# CryptoExchange - USDT to RUB Exchange Platform

Современная платформа для обмена USDT на рубли с актуальными курсами и безопасными транзакциями.

## 🚀 Быстрый старт

### Локальная разработка

1. **Клонируйте репозиторий:**
```bash
git clone <your-repo-url>
cd cryptoexchange
```

2. **Установите зависимости:**
```bash
npm install
```

3. **Настройте переменные окружения:**
```bash
cp .env.example .env.local
```
Заполните `.env.local` вашими данными Supabase.

4. **Запустите сервер разработки:**
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 🔧 Настройка Supabase

### 1. Создание проекта
1. Зарегистрируйтесь на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Скопируйте URL проекта и anon ключ

### 2. Настройка базы данных
Выполните SQL миграцию из файла `supabase/migrations/20250617163540_smooth_feather.sql`:

```sql
-- Создание таблицы курсов обмена
CREATE TABLE IF NOT EXISTS exchange_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  usdt_sell_rate decimal(10,4) NOT NULL,
  usdt_buy_rate decimal(10,4) NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Включение Row Level Security
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

-- Политики безопасности
CREATE POLICY "Anyone can read exchange rates"
  ON exchange_rates FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can insert rates"
  ON exchange_rates FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update rates"
  ON exchange_rates FOR UPDATE TO authenticated USING (true);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_exchange_rates_active 
  ON exchange_rates (source, is_active, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_exchange_rates_created_at 
  ON exchange_rates (created_at DESC);
```

### 3. Добавление тестовых данных
```sql
-- Вставка начальных курсов
INSERT INTO exchange_rates (source, usdt_sell_rate, usdt_buy_rate) VALUES
('kenig', 93.50, 92.00),
('bestchange', 93.20, 91.80),
('energo', 93.00, 91.50);
```

## 📦 Деплой

### Vercel (Рекомендуется)
1. Подключите репозиторий к [Vercel](https://vercel.com)
2. Добавьте переменные окружения в настройках проекта
3. Деплой произойдет автоматически

### Netlify
1. Подключите репозиторий к [Netlify](https://netlify.com)
2. Настройте команды сборки:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Добавьте переменные окружения

### Railway
1. Подключите репозиторий к [Railway](https://railway.app)
2. Добавьте переменные окружения
3. Деплой произойдет автоматически

## 🛠️ Технологии

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS, Framer Motion
- **UI Components:** Radix UI, Shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel/Netlify/Railway

## 📁 Структура проекта

```
├── app/                    # Next.js App Router
│   ├── exchange/          # Страница обмена
│   ├── rates/             # Страница курсов
│   └── globals.css        # Глобальные стили
├── components/            # React компоненты
│   ├── ui/               # UI компоненты
│   ├── home/             # Компоненты главной страницы
│   ├── layout/           # Компоненты макета
│   └── shared/           # Общие компоненты
├── lib/                  # Утилиты и хуки
│   ├── hooks/            # React хуки
│   ├── supabase/         # Supabase интеграция
│   └── utils.ts          # Вспомогательные функции
└── supabase/             # Supabase конфигурация
    └── migrations/       # SQL миграции
```

## 🔍 Основные функции

- ✅ Калькулятор обмена USDT ⟷ RUB
- ✅ Сравнение курсов разных обменников
- ✅ Автоматическое обновление курсов каждые 30 секунд
- ✅ Интеграция с Supabase для хранения курсов
- ✅ Адаптивный дизайн для всех устройств
- ✅ Анимации и интерактивные элементы

## 🐛 Отладка

Для диагностики проблем с Supabase используйте:
- `/debug-supabase` - Комплексная диагностика подключения

## 📄 Лицензия

MIT License - см. файл LICENSE для деталей.

## 🤝 Поддержка

Если у вас есть вопросы или проблемы, создайте issue в репозитории.