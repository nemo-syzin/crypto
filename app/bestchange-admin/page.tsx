import { Metadata } from 'next';
import { BestChangeAdminClient } from './BestChangeAdminClient';

export const metadata: Metadata = {
  title: 'BestChange Админ – KenigSwap',
  description: 'Административная панель для управления BestChange фидом и курсами обмена.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function BestChangeAdminPage() {
  return <BestChangeAdminClient />;
}