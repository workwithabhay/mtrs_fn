'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Star, ShieldCheck, LogOut } from 'lucide-react';
import { DASHBOARD_NAV_ITEMS } from './navigation-items';
import { useAuth } from '@/contexts/auth-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, business, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside
      aria-label="Owner Application Sidebar"
      className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 border-r border-brand-border bg-brand-surface z-30 select-none"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-brand-border">
        <Link href="/dashboard" className="flex items-center gap-2.5 focus-ring rounded-lg">
          <div className="w-8 h-8 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-subtle">
            <Star className="w-4 h-4 fill-white text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-brand-text-primary">
              ReviewFlow
            </span>
            <Badge variant="secondary" size="sm" className="text-[10px]">
              Owner
            </Badge>
          </div>
        </Link>
      </div>

      {/* Business Tenant Context Header */}
      <div className="px-4 py-3 border-b border-brand-border bg-slate-50/60">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-text-secondary">
            Active Business
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-brand-success font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>
        <p className="text-xs font-bold text-brand-text-primary truncate mt-0.5">
          {business?.name || 'Loading business...'}
        </p>
        <p className="text-[11px] text-brand-text-secondary truncate">
          {business?.category || 'Category not set'}
        </p>
      </div>

      {/* Navigation Links */}
      <nav aria-label="Dashboard Navigation" className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isAvailable) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors focus-ring ${
                  isActive
                    ? 'bg-indigo-50 text-brand-primary font-bold shadow-subtle border border-indigo-100'
                    : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-slate-50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-brand-primary' : 'text-slate-400'}`}
                  />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          }

          // Future phases disabled item
          return (
            <div
              key={item.id}
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 opacity-70 cursor-not-allowed select-none"
              title={`${item.label} — ${item.description} (Scheduled for ${item.badge})`}
              aria-disabled="true"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Profile Summary & Quick Logout */}
      {user && (
        <div className="p-3 border-t border-brand-border bg-slate-50/40 space-y-2">
          <div className="flex items-center justify-between px-2 text-xs">
            <div className="truncate">
              <p className="font-semibold text-brand-text-primary truncate">{user.name}</p>
              <p className="text-[11px] text-brand-text-secondary truncate font-mono">{user.email}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Session active" />
          </div>

          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 px-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>HTTP-only</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              isLoading={isLoggingOut}
              className="h-7 px-2 text-xs text-brand-error hover:bg-red-50 hover:text-red-700"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span>Exit</span>
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}
