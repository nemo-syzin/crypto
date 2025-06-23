# 🚀 Руководство по деплою KenigSwap

## 📋 Подготовка к деплою

### 1. Проверьте готовность проекта
```bash
# Убедитесь, что проект собирается без ошибок
npm run build

# Проверьте, что все зависимости установлены
npm install
```

### 2. Настройте переменные окружения
Создайте файл `.env.local` с необходимыми переменными:
```env
# Supabase (ОБЯЗАТЕЛЬНО)
NEXT_PUBLIC_SUPABASE_URL=https://jetfadpysjsvtqdgnsjp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpldGZhZHB5c2pzdnRxZGduc2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNjY1OTEsImV4cCI6MjA2NTc0MjU5MX0.WNUax6bkFNW8NMWKxpRQ9SIFE_M2BaTxcNt2eevQT34

# CoinGecko API (ОБЯЗАТЕЛЬНО для страницы /rates)
COINGECKO_API_KEY=CG-shU9QGkzZMvPXBdgbTkZDmcm

# Окружение
NODE_ENV=production
```

---

## 🌐 Вариант 1: Vercel (Рекомендуется)

### Преимущества:
- ✅ Автоматический деплой из Git
- ✅ Глобальная CDN
- ✅ Serverless функции
- ✅ Бесплатный план

### Шаги деплоя:

1. **Подготовьте репозиторий**
   ```bash
   # Инициализируйте Git (если еще не сделано)
   git init
   git add .
   git commit -m "Initial commit"
   
   # Загрузите на GitHub
   git remote add origin https://github.com/ваш-username/kenigswap.git
   git push -u origin main
   ```

2. **Деплой на Vercel**
   - Перейдите на [vercel.com](https://vercel.com)
   - Войдите через GitHub
   - Нажмите "New Project"
   - Выберите ваш репозиторий
   - Настройте переменные окружения:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://jetfadpysjsvtqdgnsjp.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     COINGECKO_API_KEY=CG-shU9QGkzZMvPXBdgbTkZDmcm
     NODE_ENV=production
     ```
   - Нажмите "Deploy"

3. **Настройте домен (опционально)**
   - В настройках проекта добавьте свой домен
   - Настройте DNS записи

---

## 🌊 Вариант 2: Netlify

### Преимущества:
- ✅ Простой деплой
- ✅ Форм-обработка
- ✅ Бесплатный план
- ✅ Хорошая интеграция с Git

### Шаги деплоя:

1. **Подготовьте build команды**
   ```bash
   # Убедитесь, что package.json содержит правильные скрипты
   npm run build
   ```

2. **Деплой на Netlify**
   - Перейдите на [netlify.com](https://netlify.com)
   - Нажмите "New site from Git"
   - Выберите ваш репозиторий
   - Настройки сборки:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Добавьте переменные окружения в настройках сайта

3. **Настройте redirects**
   Создайте файл `public/_redirects`:
   ```
   /*    /index.html   200
   ```

---

## 🚂 Вариант 3: Railway

### Преимущества:
- ✅ Простая настройка
- ✅ Автоматический деплой
- ✅ Встроенная база данных
- ✅ Хорошая производительность

### Шаги деплоя:

1. **Деплой на Railway**
   - Перейдите на [railway.app](https://railway.app)
   - Нажмите "Start a New Project"
   - Выберите "Deploy from GitHub repo"
   - Выберите ваш репозиторий

2. **Настройте переменные**
   - В настройках проекта добавьте переменные окружения
   - Railway автоматически определит, что это Next.js проект

---

## ☁️ Вариант 4: DigitalOcean App Platform

### Преимущества:
- ✅ Хорошая производительность
- ✅ Простое масштабирование
- ✅ Интеграция с базами данных

### Шаги деплоя:

1. **Создайте приложение**
   - Перейдите в DigitalOcean App Platform
   - Создайте новое приложение из GitHub репозитория

2. **Настройте сборку**
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Добавьте переменные окружения

---

## 🗄️ Настройка базы данных Supabase

### 1. Создайте проект Supabase
- Перейдите на [supabase.com](https://supabase.com)
- Создайте новый проект
- Скопируйте URL и anon key

### 2. Выполните миграции
В SQL Editor Supabase выполните:
```sql
-- Создание таблицы exchange_rates
CREATE TABLE IF NOT EXISTS exchange_rates (
  id SERIAL PRIMARY KEY,
  source TEXT NOT NULL UNIQUE,
  usdt_sell_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  usdt_buy_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Включение Row Level Security
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

-- Политики безопасности
CREATE POLICY "Allow public read access to exchange rates"
  ON exchange_rates FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to insert rates"
  ON exchange_rates FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update rates"
  ON exchange_rates FOR UPDATE TO authenticated USING (true);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_exchange_rates_source ON exchange_rates(source);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_updated_at ON exchange_rates(updated_at);

-- Тестовые данные
INSERT INTO exchange_rates (source, usdt_sell_rate, usdt_buy_rate, updated_at) VALUES
  ('kenig', 95.50, 94.80, now()),
  ('bestchange', 95.30, 94.90, now()),
  ('energo', 95.20, 94.70, now());
```

---

## 🔑 Получение API ключей

### CoinGecko API
1. Перейдите на [coingecko.com/en/api/pricing](https://www.coingecko.com/en/api/pricing)
2. Зарегистрируйтесь для получения бесплатного API ключа
3. Скопируйте ключ в переменные окружения

---

## ✅ Проверка после деплоя

### 1. Функциональность
- [ ] Главная страница загружается
- [ ] Страница /exchange работает
- [ ] Страница /rates показывает данные
- [ ] Страница /about загружается
- [ ] Страница /support работает

### 2. API интеграции
- [ ] Supabase подключение работает
- [ ] CoinGecko API возвращает данные
- [ ] Калькулятор обмена функционирует

### 3. Производительность
- [ ] Страницы загружаются быстро
- [ ] Изображения оптимизированы
- [ ] Анимации работают плавно

---

## 🐛 Решение проблем

### Ошибка сборки
```bash
# Очистите кэш и переустановите зависимости
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Проблемы с переменными окружения
- Убедитесь, что все переменные добавлены в настройки платформы
- Проверьте правильность значений
- Перезапустите деплой после изменения переменных

### Ошибки Supabase
- Проверьте правильность URL и ключа
- Убедитесь, что таблицы созданы
- Проверьте RLS политики

---

## 📊 Мониторинг

### Рекомендуемые инструменты:
- **Vercel Analytics** - для Vercel
- **Google Analytics** - общая аналитика
- **Sentry** - отслеживание ошибок
- **Uptime Robot** - мониторинг доступности

---

## 🔄 Автоматизация

### GitHub Actions (опционально)
Создайте `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🎉 Готово!

После успешного деплоя ваш сайт будет доступен по адресу, предоставленному платформой. 

**Рекомендуемый порядок:**
1. **Vercel** - для быстрого старта
2. **Настройка домена** - для профессионального вида
3. **Мониторинг** - для отслеживания работы
4. **Оптимизация** - для улучшения производительности

Удачи с деплоем! 🚀