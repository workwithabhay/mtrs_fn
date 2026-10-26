import {
  LayoutDashboard,
  QrCode,
  MessageSquare,
  Users,
  BarChart3,
  Sparkles,
  Settings,
  CreditCard,
  type LucideIcon,
} from 'lucide-react';

export interface DashboardNavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  phase: number;
  badge?: string;
  isAvailable: boolean;
  description: string;
}

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    phase: 5,
    isAvailable: true,
    description: 'Main business dashboard and onboarding progress',
  },
  {
    id: 'campaigns',
    label: 'QR Campaigns',
    href: '/dashboard/campaigns',
    icon: QrCode,
    phase: 6,
    isAvailable: true,
    description: 'Multi-format touchpoint QR builder & exports',
  },
  {
    id: 'feedback',
    label: 'Customer Feedback',
    href: '/dashboard/feedback',
    icon: MessageSquare,
    phase: 8,
    isAvailable: true,
    description: 'Private customer inbox and review routing records',
  },
  {
    id: 'customers',
    label: 'Customers',
    href: '/dashboard/customers',
    icon: Users,
    phase: 8,
    isAvailable: true,
    description: 'Customer directory and visit sentiment histories',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    phase: 9,
    isAvailable: true,
    description: 'Rating trends, zero-event timelines, and scan distributions',
  },
  {
    id: 'ai-studio',
    label: 'AI Assistant',
    href: '/dashboard/ai-studio',
    icon: Sparkles,
    phase: 10,
    isAvailable: true,
    description: 'Side-by-side AI feedback wording assistance studio',
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    phase: 11,
    isAvailable: true,
    description: 'Business profile, Google review URL, and notification preferences',
  },
  {
    id: 'billing',
    label: 'Billing & Plans',
    href: '/dashboard/billing',
    icon: CreditCard,
    phase: 11,
    isAvailable: true,
    description: 'Subscription management and invoices',
  },
];
