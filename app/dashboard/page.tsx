import { Metadata } from 'next';
import { DashboardClient } from './DashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard - KenigSwap',
  description: 'Manage your KenigSwap account, view transaction history, and access personalized features.',
};

export default function DashboardPage() {
  return <DashboardClient />;
}