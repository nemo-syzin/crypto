import { Metadata } from 'next';
import { DashboardClient } from './DashboardClient';

export const metadata: Metadata = {
  title: 'Личный кабинет – KenigSwap',
  description: 'Личный кабинет пользователя KenigSwap. Управление аккаунтом, история операций, настройки профиля.',
  keywords: ['личный кабинет', 'профиль', 'история операций', 'настройки', 'KenigSwap'],
  robots: {
    index: false, // Не индексируем личные кабинеты
    follow: false,
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
}