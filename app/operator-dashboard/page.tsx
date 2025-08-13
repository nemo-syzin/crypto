import { Metadata } from 'next';
import { OperatorDashboardClient } from './OperatorDashboardClient';

export const metadata: Metadata = {
  title: 'Панель оператора – KenigSwap',
  description: 'Панель управления чатами для операторов службы поддержки KenigSwap.',
  robots: {
    index: false, // Не индексируем панель оператора
    follow: false,
  },
};

export default function OperatorDashboardPage() {
  return <OperatorDashboardClient />;
}