'use client';

import * as React from 'react';
import { getCurrentSession, logout as apiLogout } from '@/lib/api/auth';
import type { AuthSessionData, Business, User } from '@/lib/api/types';

interface AuthContextValue {
  user: User | null;
  business: Business | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkSession: () => Promise<void>;
  setSession: (session: AuthSessionData) => void;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [business, setBusiness] = React.useState<Business | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const checkSession = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const session = await getCurrentSession();
      if (session && session.user) {
        setUser(session.user);
        setBusiness(session.business);
      } else {
        setUser(null);
        setBusiness(null);
      }
    } catch {
      setUser(null);
      setBusiness(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    getCurrentSession()
      .then((session) => {
        if (!isMounted) return;
        if (session && session.user) {
          setUser(session.user);
          setBusiness(session.business);
        } else {
          setUser(null);
          setBusiness(null);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setUser(null);
        setBusiness(null);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const setSession = React.useCallback((session: AuthSessionData) => {
    setUser(session.user);
    setBusiness(session.business);
    setIsLoading(false);
  }, []);

  const logout = React.useCallback(async () => {
    setIsLoading(true);
    try {
      await apiLogout();
    } finally {
      setUser(null);
      setBusiness(null);
      setIsLoading(false);
    }
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      business,
      isAuthenticated: Boolean(user),
      isLoading,
      checkSession,
      setSession,
      logout,
    }),
    [user, business, isLoading, checkSession, setSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useOptionalAuth(): AuthContextValue | null {
  const context = React.useContext(AuthContext);
  return context || null;
}
