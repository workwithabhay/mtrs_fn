'use client';

import * as React from 'react';
import {
  Building2,
  Star,
  Palette,
  Bell,
  UserCheck,
  RotateCcw,
  AlertCircle,
  Settings as SettingsIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';
import { getBusinessProfile, getBusinessSettings } from '@/lib/api/business';
import type { Business, BusinessSettings } from '@/lib/api/types';
import { BusinessProfileForm } from './business-profile-form';
import { GoogleReviewForm } from './google-review-form';
import { BrandingSettingsForm } from './branding-settings-form';
import { NotificationSettingsForm } from './notification-settings-form';
import { AccountInfoSection } from './account-info-section';

type SettingsTab = 'profile' | 'reviews' | 'branding' | 'notifications' | 'account';

interface TabItem {
  id: SettingsTab;
  label: string;
  icon: React.ElementType;
}

const SETTINGS_TABS: TabItem[] = [
  { id: 'profile', label: 'Business Profile', icon: Building2 },
  { id: 'reviews', label: 'Google Review Destination', icon: Star },
  { id: 'branding', label: 'Branding Defaults', icon: Palette },
  { id: 'notifications', label: 'Customer Experience & Alerts', icon: Bell },
  { id: 'account', label: 'Account & Security', icon: UserCheck },
];

export function SettingsContainer() {
  const { user, business: contextBusiness, setSession } = useAuth();
  const [business, setBusiness] = React.useState<Business | null>(contextBusiness);
  const [settings, setSettings] = React.useState<BusinessSettings | null>(null);
  const [activeTab, setActiveTab] = React.useState<SettingsTab>('profile');
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    try {
      const [fetchedBusiness, fetchedSettings] = await Promise.all([
        getBusinessProfile(),
        getBusinessSettings(),
      ]);

      setBusiness(fetchedBusiness);
      setSettings(fetchedSettings);
      setErrorMessage(null);

      if (user) {
        setSession({ user, business: fetchedBusiness });
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to load business settings. Please check your network and try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [user, setSession]);

  React.useEffect(() => {
    let isCancelled = false;

    async function loadInitial() {
      try {
        const [fetchedBusiness, fetchedSettings] = await Promise.all([
          getBusinessProfile(),
          getBusinessSettings(),
        ]);
        if (isCancelled) return;
        setBusiness(fetchedBusiness);
        setSettings(fetchedSettings);
        setErrorMessage(null);
        if (user) {
          setSession({ user, business: fetchedBusiness });
        }
      } catch (err: unknown) {
        if (isCancelled) return;
        const msg =
          err instanceof Error
            ? err.message
            : 'Unable to load business settings. Please check your network and try again.';
        setErrorMessage(msg);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadInitial();

    return () => {
      isCancelled = true;
    };
  }, [user, setSession]);

  const handleBusinessUpdated = (updated: Business) => {
    setBusiness(updated);
    if (user) {
      setSession({ user, business: updated });
    }
  };

  const handleSettingsUpdated = (updated: BusinessSettings) => {
    setSettings(updated);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header section */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-text-primary">
            Settings &amp; Profile Management
          </h1>
        </div>
        <p className="text-sm text-brand-text-secondary max-w-2xl">
          Manage your business identity, Google review link destination, default touchpoint branding, and
          feedback notification preferences.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="border-b border-brand-border">
        <div
          role="tablist"
          aria-label="Settings categories"
          className="flex overflow-x-auto gap-2 no-scrollbar pb-px"
        >
          {SETTINGS_TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                id={`tab-${tab.id}`}
                aria-selected={isSelected}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors rounded-t-lg ${
                  isSelected
                    ? 'border-brand-primary text-brand-primary bg-brand-primary/5'
                    : 'border-transparent text-brand-text-secondary hover:text-brand-text-primary hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4" role="status" aria-label="Loading settings">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      )}

      {/* Error display */}
      {!isLoading && errorMessage && (
        <div
          role="alert"
          className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-sm">{errorMessage}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchData}
            className="bg-white shrink-0"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Retry
          </Button>
        </div>
      )}

      {/* Active Tab Panel */}
      {!isLoading && !errorMessage && business && settings && (
        <div>
          {activeTab === 'profile' && (
            <div role="tabpanel" id="panel-profile" aria-labelledby="tab-profile">
              <BusinessProfileForm
                business={business}
                onBusinessUpdated={handleBusinessUpdated}
              />
            </div>
          )}

          {activeTab === 'reviews' && (
            <div role="tabpanel" id="panel-reviews" aria-labelledby="tab-reviews">
              <GoogleReviewForm
                business={business}
                onBusinessUpdated={handleBusinessUpdated}
              />
            </div>
          )}

          {activeTab === 'branding' && (
            <div role="tabpanel" id="panel-branding" aria-labelledby="tab-branding">
              <BrandingSettingsForm
                business={business}
                onBusinessUpdated={handleBusinessUpdated}
              />
            </div>
          )}

          {activeTab === 'notifications' && (
            <div role="tabpanel" id="panel-notifications" aria-labelledby="tab-notifications">
              <NotificationSettingsForm
                settings={settings}
                onSettingsUpdated={handleSettingsUpdated}
              />
            </div>
          )}

          {activeTab === 'account' && (
            <div role="tabpanel" id="panel-account" aria-labelledby="tab-account">
              <AccountInfoSection />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
