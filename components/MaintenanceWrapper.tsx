"use client";

import { usePathname } from 'next/navigation';
import { MAINTENANCE_MODE } from '@/config/maintenance';
import MaintenancePage from '@/app/maintenance/page';

export function MaintenanceWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (MAINTENANCE_MODE && pathname !== '/maintenance') {
    return <MaintenancePage />;
  }

  return <>{children}</>;
}
