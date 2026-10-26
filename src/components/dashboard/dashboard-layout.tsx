'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';
import { MobileNavigation } from './mobile-navigation';
import { UpgradeRequiredBanner } from '@/components/billing/upgrade-required-banner';
import { getSubscription } from '@/lib/api/billing';
import { useAuth } from '@/contexts/auth-context';
import type { SubscriptionData } from '@/lib/api/types';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [subscription, setSubscription] = React.useState<SubscriptionData | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    if (!isAuthenticated) return;

    // Check subscription status non-blockingly for expired banner
    getSubscription()
      .then((sub) => {
        if (isMounted) setSubscription(sub);
      })
      .catch(() => {
        // Silently catch to avoid disrupting dashboard if unconfigured
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, pathname]);

  const isBillingRoute = pathname === '/dashboard/billing';

  return (
    <div className="min-h-screen flex bg-brand-background text-brand-text-primary selection:bg-indigo-100 selection:text-indigo-900">
      {/* Desktop Sidebar */}
      <AppSidebar />

      {/* Mobile Navigation Drawer */}
      <MobileNavigation isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AppHeader onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {!isBillingRoute && <UpgradeRequiredBanner subscription={subscription} />}
          {children}
        </main>
      </div>
    </div>
  );
}
