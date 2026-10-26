'use client';

import * as React from 'react';
import { UserCheck, Shield, KeyRound, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

export function AccountInfoSection() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-6 space-y-6 shadow-xs">
      <div className="flex items-center gap-2.5 pb-4 border-b border-brand-border">
        <div className="p-2 rounded-xl bg-slate-100 text-brand-text-primary">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-brand-text-primary">Account &amp; Authentication</h2>
          <p className="text-xs text-brand-text-secondary">
            Your authenticated business owner identity and passwordless security credentials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Owner Name */}
        <div className="p-4 rounded-xl border border-brand-border bg-slate-50/50 space-y-1">
          <span className="text-[11px] font-semibold text-brand-text-secondary uppercase tracking-wider block">
            Account Holder Name
          </span>
          <span className="text-sm font-semibold text-brand-text-primary block">
            {user.name}
          </span>
          <span className="text-[11px] text-brand-text-secondary">
            Primary authorized owner
          </span>
        </div>

        {/* Email with Verified Badge */}
        <div className="p-4 rounded-xl border border-brand-border bg-slate-50/50 space-y-1">
          <span className="text-[11px] font-semibold text-brand-text-secondary uppercase tracking-wider block">
            Registered Email
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-brand-text-primary truncate">
              {user.email}
            </span>
            <Badge variant="success" className="text-[10px] shrink-0">
              Verified
            </Badge>
          </div>
          <span className="text-[11px] text-brand-text-secondary">
            Protected against unauthorized email migration
          </span>
        </div>

        {/* Role */}
        <div className="p-4 rounded-xl border border-brand-border bg-slate-50/50 space-y-1">
          <span className="text-[11px] font-semibold text-brand-text-secondary uppercase tracking-wider block">
            Account Role
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-brand-text-primary">
              Business Owner
            </span>
            <Badge variant="secondary" className="text-[10px]">
              Full Tenant Admin
            </Badge>
          </div>
          <span className="text-[11px] text-brand-text-secondary">
            Multi-tenant data isolation active
          </span>
        </div>

        {/* Authentication Security Method */}
        <div className="p-4 rounded-xl border border-brand-border bg-slate-50/50 space-y-1">
          <span className="text-[11px] font-semibold text-brand-text-secondary uppercase tracking-wider block">
            Authentication Security
          </span>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
            <KeyRound className="w-4 h-4 text-emerald-600" />
            <span>Passwordless Email OTP</span>
          </div>
          <span className="text-[11px] text-brand-text-secondary">
            Protected against password breaches and credential stuffing
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50/70 border border-brand-border/60 text-xs text-brand-text-secondary">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-primary shrink-0" />
          <span>
            Sessions are secured with HTTP-only cookies and double-submit CSRF defense.
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleLogout}
          isLoading={isLoggingOut}
          className="text-brand-text-primary hover:text-brand-error shrink-0"
        >
          <LogOut className="w-4 h-4 mr-1.5" />
          Log Out of Session
        </Button>
      </div>
    </div>
  );
}
