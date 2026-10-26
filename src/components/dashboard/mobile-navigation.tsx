'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { X, Star, ShieldCheck, LogOut } from 'lucide-react';
import { DASHBOARD_NAV_ITEMS } from './navigation-items';
import { useAuth } from '@/contexts/auth-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, business, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 lg:hidden flex"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xs bg-brand-surface border-r border-brand-border h-full flex flex-col shadow-elevated z-10 animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-brand-border">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5 focus-ring rounded-lg"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-subtle">
              <Star className="w-4 h-4 fill-white text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-brand-text-primary">
              ReviewFlow
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="p-2 rounded-xl text-brand-text-secondary hover:bg-slate-100 focus-ring"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Business Tenant Context Header */}
        <div className="px-5 py-3 border-b border-brand-border bg-slate-50/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-text-secondary">
              Active Business
            </span>
            <Badge variant="success" size="sm">
              Session Active
            </Badge>
          </div>
          <p className="text-xs font-bold text-brand-text-primary truncate mt-0.5">
            {business?.name || 'Owner Portal'}
          </p>
          <p className="text-[11px] text-brand-text-secondary truncate">
            {business?.category || 'General Business'}
          </p>
        </div>

        {/* Nav list */}
        <nav aria-label="Mobile Drawer Navigation" className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.isAvailable) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors focus-ring ${
                    isActive
                      ? 'bg-indigo-50 text-brand-primary font-bold border border-indigo-100'
                      : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-slate-50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-primary' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            }

            return (
              <div
                key={item.id}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 opacity-70 cursor-not-allowed select-none"
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

        {/* Mobile footer with user & logout */}
        {user && (
          <div className="p-4 border-t border-brand-border bg-slate-50/60 space-y-3">
            <div className="text-xs">
              <p className="font-semibold text-brand-text-primary">{user.name}</p>
              <p className="text-[11px] text-brand-text-secondary truncate font-mono">{user.email}</p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted Cookie</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                isLoading={isLoggingOut}
                className="h-8 text-xs text-brand-error border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                <span>Log Out</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
