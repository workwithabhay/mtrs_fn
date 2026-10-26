import { apiFetchWithMeta } from './client';
import type {
  CustomerDirectoryResponse,
  CustomerFilterParams,
  CustomerDirectoryItem,
  CustomerDirectoryStats,
} from './types';

/**
 * Lists verified customer records and directory KPI statistics
 * for the authenticated business owner.
 * Scoped strictly to the authenticated tenant.
 */
export async function listCustomers(
  params: CustomerFilterParams = {},
  fetchFn?: typeof fetch,
): Promise<CustomerDirectoryResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());
  if (params.search && params.search.trim()) query.set('search', params.search.trim());
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.sortOrder) query.set('sortOrder', params.sortOrder);

  const queryString = query.toString();
  const endpoint = `/feedback/customers${queryString ? `?${queryString}` : ''}`;

  const res = await apiFetchWithMeta<{
    customers: CustomerDirectoryItem[];
    stats: CustomerDirectoryStats;
  }>(endpoint, { method: 'GET' }, fetchFn);

  const total =
    typeof res.meta?.total === 'number' ? res.meta.total : (res.data?.customers?.length ?? 0);
  const page = typeof res.meta?.page === 'number' ? res.meta.page : (params.page || 1);
  const limit = typeof res.meta?.limit === 'number' ? res.meta.limit : (params.limit || 10);
  const totalPages =
    typeof res.meta?.totalPages === 'number'
      ? res.meta.totalPages
      : Math.ceil(total / limit) || 1;

  return {
    customers: res.data?.customers || [],
    stats: res.data?.stats || {
      totalCustomers: 0,
      repeatCustomers: 0,
      averageRating: null,
    },
    total,
    page,
    limit,
    totalPages,
  };
}
