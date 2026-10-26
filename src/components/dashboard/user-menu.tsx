'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, ExternalLink, ChevronDown, ShieldCheck, Palette } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function UserMenu() {
  const router = useRouter();
  const { user, business, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [logoutError, setLogoutError] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      await logout();
      router.push('/login');
    } catch {
      setLogoutError('Failed to revoke session on server. Please try again.');
      setIsLoggingOut(false);
    }
  };

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Open user account menu"
        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus-ring"
      >
        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-subtle shrink-0">
          {initials}
        </div>
        <div className="hidden sm:flex flex-col text-left leading-tight">
          <span className="text-xs font-semibold text-brand-text-primary truncate max-w-[120px]">
            {user.name}
          </span>
          <span className="text-[11px] text-brand-text-secondary truncate max-w-[120px]">
            {business?.name || 'Owner'}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-brand-text-secondary transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          role="menu"
          aria-label="User account actions"
          className="absolute right-0 mt-2 w-72 rounded-2xl bg-brand-surface border border-brand-border shadow-elevated p-2 z-50 text-xs text-brand-text-primary animate-in fade-in zoom-in-95 duration-100"
        >
          {/* Identity Header */}
          <div className="p-3 border-b border-brand-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-brand-text-primary">{user.name}</span>
              <Badge variant="success" size="sm">
                Verified Owner
              </Badge>
            </div>
            <p className="text-brand-text-secondary truncate font-mono text-[11px]">{user.email}</p>
            {business && (
              <p className="text-[11px] font-medium text-brand-primary pt-0.5 truncate">
                {business.name} • {business.category}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div className="py-1 border-b border-brand-border space-y-0.5">
            <Link
              href="/"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors text-brand-text-secondary hover:text-brand-text-primary"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>Marketing Homepage</span>
              </span>
            </Link>

            <Link
              href="/design-system"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors text-brand-text-secondary hover:text-brand-text-primary"
            >
              <span className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-500" />
                <span>Design System Showcase</span>
              </span>
            </Link>
          </div>

          {/* Security notice */}
          <div className="p-2.5 text-[11px] text-slate-500 flex items-center gap-1.5 border-b border-brand-border">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>HTTP-only cookie session active</span>
          </div>

          {logoutError && (
            <div className="p-2 text-[11px] text-brand-error bg-red-50 rounded-lg my-1">
              {logoutError}
            </div>
          )}

          {/* Logout Action */}
          <div className="pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              isLoading={isLoggingOut}
              disabled={isLoggingOut}
              className="w-full justify-start text-brand-error hover:bg-red-50 hover:text-red-700 font-medium"
              leadingIcon={<LogOut className="w-4 h-4" />}
            >
              <span>Log Out</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
