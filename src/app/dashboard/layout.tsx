import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

export const metadata: Metadata = {
  title: 'Business Dashboard | ReviewFlow',
  description: 'Manage customer feedback, touchpoint QR campaigns, and authentic Google review access.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
