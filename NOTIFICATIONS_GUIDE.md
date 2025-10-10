# Система уведомлений KenigSwap

## Обзор

Современная система уведомлений для сайта KenigSwap, построенная на React Context API, TypeScript и Framer Motion. Поддерживает три типа уведомлений: ошибки, успех и информация.

## Возможности

- ✅ **Три типа уведомлений**: error, success, info
- ✅ **Плавные анимации** с использованием Framer Motion
- ✅ **Автоматическое закрытие** через 5 секунд (настраивается)
- ✅ **Прогресс-бар** показывает время до автозакрытия
- ✅ **Кнопка закрытия** для ручного закрытия
- ✅ **Фирменные цвета KenigSwap**
- ✅ **Поддержка темной темы** (dark mode)
- ✅ **Адаптивный дизайн** для всех устройств
- ✅ **Стек уведомлений** - несколько уведомлений могут отображаться одновременно
- ✅ **Иконки из lucide-react**

## Архитектура

### Файлы

1. **`components/ui/Notification.tsx`** - Компонент отдельного уведомления и контейнера
2. **`hooks/useNotification.tsx`** - React Context Provider и хук для управления уведомлениями
3. **`app/layout.tsx`** - Интеграция NotificationProvider в корневой layout
4. **`app/test-notifications/page.tsx`** - Демо-страница для тестирования

### Компоненты

#### `Notification`
Отдельное уведомление с анимацией, иконкой, заголовком, описанием и кнопкой закрытия.

#### `NotificationContainer`
Контейнер для всех уведомлений, фиксированный в правом нижнем углу экрана.

#### `NotificationProvider`
React Context Provider, который управляет состоянием уведомлений и рендерит контейнер.

## Использование

### Базовое использование

```tsx
import { useNotification } from '@/hooks/useNotification';

function MyComponent() {
  const { notifyError, notifySuccess, notifyInfo } = useNotification();

  const handleError = () => {
    notifyError(
      'Ошибка подключения',
      'Время ожидания подключения истекло. Попробуйте еще раз.'
    );
  };

  const handleSuccess = () => {
    notifySuccess(
      'Данные сохранены',
      'Все изменения успешно сохранены'
    );
  };

  const handleInfo = () => {
    notifyInfo(
      'Новое обновление',
      'Доступна новая версия приложения'
    );
  };

  return (
    <div>
      <button onClick={handleError}>Показать ошибку</button>
      <button onClick={handleSuccess}>Показать успех</button>
      <button onClick={handleInfo}>Показать инфо</button>
    </div>
  );
}
```

### Короткие уведомления (без описания)

```tsx
notifyError('Ошибка!');
notifySuccess('Готово!');
notifyInfo('Информация');
```

### Пользовательская продолжительность

```tsx
const { notify } = useNotification();

// Уведомление на 10 секунд
notify('info', 'Долгое уведомление', 'Описание...', 10000);

// Уведомление без автозакрытия (передайте 0)
notify('error', 'Важная ошибка', 'Требует ручного закрытия', 0);
```

## API

### `useNotification()`

Возвращает объект с методами:

```typescript
interface NotificationContextType {
  notify: (
    type: 'error' | 'success' | 'info',
    title: string,
    message?: string,
    duration?: number
  ) => void;

  notifyError: (title: string, message?: string) => void;
  notifySuccess: (title: string, message?: string) => void;
  notifyInfo: (title: string, message?: string) => void;
  removeNotification: (id: string) => void;
}
```

### Параметры

- **`type`**: Тип уведомления (`'error'`, `'success'`, `'info'`)
- **`title`**: Заголовок уведомления (обязательно)
- **`message`**: Текст описания (опционально)
- **`duration`**: Время отображения в миллисекундах (по умолчанию: 5000)

## Стилизация

### Цвета

```css
/* Ошибка */
background: #FF4D4F
text: #DC2626

/* Успех */
background: #3BB273
text: #16A34A

/* Информация */
background: #3B6DFF
text: #0A1630
```

### Позиционирование

Уведомления появляются в правом нижнем углу экрана:
```css
position: fixed;
bottom: 1.5rem; /* 24px */
right: 1.5rem; /* 24px */
z-index: 50;
```

### Темная тема

Компоненты автоматически поддерживают темную тему через Tailwind CSS классы:

```tsx
className="bg-red-50 dark:bg-red-900/20"
className="text-red-900 dark:text-red-100"
```

## Примеры интеграции

### В компоненте чата

```tsx
const startChat = async () => {
  try {
    // Подключение к чату...
    notifySuccess(
      'Чат подключен',
      'Вы подключены к службе поддержки'
    );
  } catch (error) {
    notifyError(
      'Ошибка подключения',
      'Не удалось подключиться к чату'
    );
  }
};
```

### В форме

```tsx
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!email || !password) {
    notifyError(
      'Заполните все поля',
      'Пожалуйста, укажите email и пароль'
    );
    return;
  }

  try {
    await login(email, password);
    notifySuccess('Вход выполнен', 'Добро пожаловать!');
  } catch (error) {
    notifyError('Ошибка входа', error.message);
  }
};
```

### Последовательные уведомления

```tsx
const handleMultiStep = async () => {
  notifyInfo('Начинаем обработку...');

  await step1();
  notifySuccess('Шаг 1 завершен');

  await step2();
  notifySuccess('Шаг 2 завершен');

  await step3();
  notifySuccess('Все готово!', 'Операция завершена успешно');
};
```

## Тестирование

Откройте страницу `/test-notifications` для интерактивного тестирования всех типов уведомлений.

### Доступные тесты:
- ✅ Различные типы ошибок
- ✅ Различные типы успешных действий
- ✅ Различные информационные сообщения
- ✅ Множественные уведомления
- ✅ Последовательные уведомления

## Особенности реализации

### 1. Анимации
Используется Framer Motion для плавного появления и исчезновения:

```tsx
<motion.div
  initial={{ opacity: 0, y: 50, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: 20, scale: 0.95 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
```

### 2. Прогресс-бар
Автоматический прогресс-бар показывает время до закрытия:

```tsx
<motion.div
  initial={{ width: '100%' }}
  animate={{ width: '0%' }}
  transition={{ duration: duration / 1000, ease: 'linear' }}
  className="absolute top-0 left-0 h-1 bg-blue-500"
/>
```

### 3. Генерация ID
Используется `crypto.randomUUID()` для генерации уникальных ID (работает в браузере без внешних зависимостей):

```tsx
const id = crypto.randomUUID();
```

## Производительность

- ✅ Легковесная реализация (< 10 KB)
- ✅ Оптимизированные анимации с GPU-ускорением
- ✅ Минимальные перерисовки через React Context
- ✅ Автоматическая очистка таймеров

## Совместимость

- ✅ React 18+
- ✅ Next.js 14+
- ✅ TypeScript 5+
- ✅ Tailwind CSS 3+
- ✅ Framer Motion 11+
- ✅ Все современные браузеры

## Будущие улучшения

- [ ] Звуковые уведомления
- [ ] Кастомные иконки
- [ ] Позиционирование (top/bottom, left/right)
- [ ] Анимированные действия (undo, retry)
- [ ] История уведомлений
- [ ] Группировка похожих уведомлений
- [ ] Push-уведомления браузера
- [ ] Интеграция с системой логирования

## Troubleshooting

### Уведомления не появляются

1. Убедитесь, что `NotificationProvider` добавлен в `app/layout.tsx`
2. Проверьте, что используете хук внутри компонента-потомка Provider
3. Проверьте z-index (должен быть 50)

### Анимации не работают

1. Убедитесь, что установлен `framer-motion`
2. Проверьте, что в компоненте есть `'use client'` директива

### Стили не применяются

1. Проверьте конфигурацию Tailwind CSS
2. Убедитесь, что dark mode настроен правильно
3. Проверьте, что файлы компонентов включены в `tailwind.config.ts`

## Поддержка

При возникновении проблем:
1. Проверьте консоль браузера на ошибки
2. Откройте `/test-notifications` для проверки работоспособности
3. Убедитесь, что все зависимости установлены

---

**Версия**: 1.0.0
**Автор**: KenigSwap Team
**Последнее обновление**: 2025-10-10
