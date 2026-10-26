import { apiFetch, apiFetchWithMeta } from './client';
import type {
  ListOwnerFeedbackQuery,
  OwnerFeedbackItem,
  OwnerFeedbackPaginatedResult,
  PaginationMeta,
  FeedbackLifecycleStatus,
} from './types';

/**
 * Retrieves paginated feedback records for the authenticated business owner.
 * Server filters by rating, status, date range, and sorting.
 */
export async function listOwnerFeedbacks(
  query: ListOwnerFeedbackQuery = {},
  fetchFn?: typeof fetch,
): Promise<OwnerFeedbackPaginatedResult> {
  const searchParams = new URLSearchParams();

  if (query.page) searchParams.set('page', query.page.toString());
  if (query.limit) searchParams.set('limit', query.limit.toString());
  if (query.rating) searchParams.set('rating', query.rating.toString());
  if (query.status) searchParams.set('status', query.status);
  if (query.startDate) searchParams.set('startDate', query.startDate);
  if (query.endDate) searchParams.set('endDate', query.endDate);
  if (query.sortBy) searchParams.set('sortBy', query.sortBy);
  if (query.sortOrder) searchParams.set('sortOrder', query.sortOrder);

  const queryString = searchParams.toString();
  const endpoint = `/feedback${queryString ? `?${queryString}` : ''}`;

  const res = await apiFetchWithMeta<OwnerFeedbackItem[]>(
    endpoint,
    {
      method: 'GET',
    },
    fetchFn,
  );

  const meta: PaginationMeta = {
    total: typeof res.meta?.total === 'number' ? res.meta.total : res.data.length,
    page: typeof res.meta?.page === 'number' ? res.meta.page : (query.page || 1),
    limit: typeof res.meta?.limit === 'number' ? res.meta.limit : (query.limit || 10),
    totalPages: typeof res.meta?.totalPages === 'number' ? res.meta.totalPages : 1,
  };

  return {
    feedbacks: res.data || [],
    meta,
  };
}

/**
 * Retrieves a single feedback record by ID scoped to the authenticated owner's tenant.
 */
export async function getOwnerFeedbackById(
  feedbackId: string,
  fetchFn?: typeof fetch,
): Promise<OwnerFeedbackItem> {
  const cleanId = encodeURIComponent(feedbackId.trim());
  return apiFetch<OwnerFeedbackItem>(
    `/feedback/${cleanId}`,
    {
      method: 'GET',
    },
    fetchFn,
  );
}

/**
 * Updates the lifecycle status of a feedback entry ('new' -> 'reviewed' -> 'resolved').
 * Automatically includes double-submit CSRF protection on the PATCH request.
 */
export async function updateOwnerFeedbackStatus(
  feedbackId: string,
  status: FeedbackLifecycleStatus,
  fetchFn?: typeof fetch,
): Promise<OwnerFeedbackItem> {
  const cleanId = encodeURIComponent(feedbackId.trim());
  return apiFetch<OwnerFeedbackItem>(
    `/feedback/${cleanId}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    },
    fetchFn,
  );
}
