import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getBusinessProfile,
  updateBusinessProfile,
  getBusinessSettings,
  updateBusinessSettings,
} from '@/lib/api/business';
import * as client from '@/lib/api/client';

describe('Business Settings API Client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('getBusinessProfile', () => {
    it('calls GET /business and returns Business document', async () => {
      const mockBusiness = {
        _id: 'b-1',
        name: 'The Bistro',
        category: 'Dining',
        googleReviewUrl: 'https://g.page/r/test/review',
        branding: { primaryColor: '#2563EB', secondaryColor: '#1E293B' },
      };

      const apiFetchSpy = vi.spyOn(client, 'apiFetch').mockResolvedValue(mockBusiness);

      const result = await getBusinessProfile();

      expect(apiFetchSpy).toHaveBeenCalledWith('/business', { method: 'GET' }, undefined);
      expect(result).toEqual(mockBusiness);
    });
  });

  describe('updateBusinessProfile', () => {
    it('calls PATCH /business with JSON body', async () => {
      const mockUpdated = {
        _id: 'b-1',
        name: 'Updated Bistro',
        category: 'Fine Dining',
        googleReviewUrl: 'https://g.page/r/new/review',
        branding: { primaryColor: '#10B981', secondaryColor: '#064E3B' },
      };

      const apiFetchSpy = vi.spyOn(client, 'apiFetch').mockResolvedValue(mockUpdated);

      const payload = {
        name: 'Updated Bistro',
        category: 'Fine Dining',
        googleReviewUrl: 'https://g.page/r/new/review',
        branding: { primaryColor: '#10B981', secondaryColor: '#064E3B' },
      };

      const result = await updateBusinessProfile(payload);

      expect(apiFetchSpy).toHaveBeenCalledWith(
        '/business',
        {
          method: 'PATCH',
          body: JSON.stringify(payload),
        },
        undefined,
      );
      expect(result).toEqual(mockUpdated);
    });

    it('propagates ApiError on validation failure', async () => {
      vi.spyOn(client, 'apiFetch').mockRejectedValue(
        new client.ApiError('VALIDATION_ERROR', 'Name must be at least 2 characters', 400),
      );

      await expect(updateBusinessProfile({ name: 'A' })).rejects.toThrow(
        'Name must be at least 2 characters',
      );
    });
  });

  describe('getBusinessSettings', () => {
    it('calls GET /business/settings', async () => {
      const mockSettings = {
        allowPublicReviews: true,
        defaultLanguage: 'en' as const,
        notificationEmail: 'alerts@bistro.com',
        headingText: 'How was your meal?',
        subheadingText: 'Tell us about your experience.',
      };

      const apiFetchSpy = vi.spyOn(client, 'apiFetch').mockResolvedValue(mockSettings);

      const result = await getBusinessSettings();

      expect(apiFetchSpy).toHaveBeenCalledWith('/business/settings', { method: 'GET' }, undefined);
      expect(result).toEqual(mockSettings);
    });
  });

  describe('updateBusinessSettings', () => {
    it('calls PATCH /business/settings with stringified body', async () => {
      const mockUpdated = {
        allowPublicReviews: false,
        defaultLanguage: 'en' as const,
        notificationEmail: 'new-alerts@bistro.com',
      };

      const apiFetchSpy = vi.spyOn(client, 'apiFetch').mockResolvedValue(mockUpdated);

      const payload = {
        allowPublicReviews: false,
        notificationEmail: 'new-alerts@bistro.com',
      };

      const result = await updateBusinessSettings(payload);

      expect(apiFetchSpy).toHaveBeenCalledWith(
        '/business/settings',
        {
          method: 'PATCH',
          body: JSON.stringify(payload),
        },
        undefined,
      );
      expect(result).toEqual(mockUpdated);
    });
  });
});
