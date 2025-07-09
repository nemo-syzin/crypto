# KenigSwap - Криптовалютная биржа

Современная платформа для обмена криптовалют с фокусом на USDT/RUB пары.

## 🚀 Быстрый старт

### Локальная разработка

1. **Клонируйте репозиторий**
```bash
git clone <your-repo-url>
cd kenigswap
```

2. **Установите зависимости**
```bash
npm ci
```

3. **Настройте переменные окружения**
```bash
cp .env.example .env.local
```

Заполните `.env.local` вашими реальными значениями:
- `NEXT_PUBLIC_SUPABASE_URL` - URL вашего Supabase проекта
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Публичный ключ Supabase
- `COINGECKO_API_KEY` - API ключ CoinGecko (бесплатный)

4. **Запустите проект**
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 📦 Деплой

### Netlify (рекомендуется)

1. **Подключите репозиторий к Netlify**
   - Зайдите на [netlify.com](https://netlify.com)
   - Нажмите "New site from Git"
   - Выберите ваш репозиторий

2. **Настройте переменные окружения в Netlify**
   - Перейдите в Site settings → Environment variables
   - Добавьте все переменные из `.env.example`

3. **Деплой произойдет автоматически**
   - Build command: `npm ci && npm run build`
   - Publish directory: `out`

### Vercel

1. **Подключите к Vercel**
```bash
npx vercel
```

2. **Настройте переменные окружения**
   - В dashboard Vercel добавьте переменные из `.env.example`

## 🗄️ База данных

### Настройка Supabase

1. **Создайте проект в Supabase**
   - Зайдите на [supabase.com](https://supabase.com)
   - Создайте новый проект

2. **Выполните миграции**
   - Перейдите в SQL Editor в Supabase Dashboard
   - Выполните SQL из файла `supabase/migrations/20250707161120_autumn_fountain.sql`

3. **Получите ключи API**
   - Settings → API
   - Скопируйте URL и anon public key

## 🔧 Конфигурация

### CoinGecko API

Для работы страницы курсов нужен API ключ CoinGecko:

1. Зарегистрируйтесь на [coingecko.com](https://www.coingecko.com/en/api/pricing)
2. Получите бесплатный API ключ
3. Добавьте его в переменные окружения как `COINGECKO_API_KEY`

## 📁 Структура проекта

```
├── app/                    # Next.js App Router
│   ├── (main)/            # Основные страницы
│   ├── api/               # API routes
│   └── globals.css        # Глобальные стили
├── components/            # React компоненты
│   ├── ui/               # UI компоненты (shadcn/ui)
│   └── shared/           # Общие компоненты
├── lib/                  # Утилиты и хуки
├── supabase/            # Миграции базы данных
└── public/              # Статические файлы
```

## 🛠️ Технологии

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Animations**: Framer Motion
- **3D Graphics**: Three.js, React Three Fiber
- **Icons**: Lucide React
- **Deployment**: Netlify/Vercel

## 📊 Функциональность

- ✅ Калькулятор обмена криптовалют
- ✅ Сравнение курсов в реальном времени
- ✅ Страница с актуальными курсами
- ✅ Интерактивная 3D визуализация
- ✅ Адаптивный дизайн
- ✅ Темная/светлая тема
- ✅ SEO оптимизация

## 🔒 Безопасность

- Row Level Security (RLS) в Supabase
- Валидация данных на клиенте и сервере
- Защищенные API endpoints
- HTTPS принудительно

## 📈 Производительность

- Static Site Generation (SSG)
- Оптимизация изображений
- Code splitting
- Lazy loading компонентов
- Кэширование API запросов

## 🐛 Отладка

### Проблемы с Supabase
```bash
# Проверьте переменные окружения
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Проблемы с CoinGecko API
```bash
# Проверьте API ключ
echo $COINGECKO_API_KEY
```

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте переменные окружения
2. Убедитесь что Supabase настроен правильно
3. Проверьте логи в браузере (F12)
4. Проверьте логи деплоя в Netlify/Vercel

## 📄 Лицензия

MIT License