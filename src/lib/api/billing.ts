import { apiFetch } from './client';
import type {
  BillingPlan,
  SubscriptionData,
  CheckoutPayload,
  CheckoutResult,
  VerifyPaymentPayload,
  VerifyPaymentResult,
  RedeemPromoResult,
  PaymentHistoryResponse,
} from './types';

/**
 * Lists all published subscription plans.
 * Endpoint: GET /api/v1/billing/plans
 */
export async function listBillingPlans(fetchFn?: typeof fetch): Promise<BillingPlan[]> {
  return apiFetch<BillingPlan[]>('/billing/plans', { method: 'GET' }, fetchFn);
}

/**
 * Retrieves the authenticated business's current subscription.
 * Endpoint: GET /api/v1/billing/subscription
 */
export async function getSubscription(fetchFn?: typeof fetch): Promise<SubscriptionData> {
  return apiFetch<SubscriptionData>('/billing/subscription', { method: 'GET' }, fetchFn);
}

/**
 * Initiates a plan checkout order (Razorpay or Mock).
 * Endpoint: POST /api/v1/billing/subscription/checkout
 */
export async function createCheckout(
  payload: CheckoutPayload,
  fetchFn?: typeof fetch,
): Promise<CheckoutResult> {
  return apiFetch<CheckoutResult>(
    '/billing/subscription/checkout',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    fetchFn,
  );
}

/**
 * Verifies Razorpay checkout payment signature and activates entitlement.
 * Endpoint: POST /api/v1/billing/verify-payment
 */
export async function verifyPayment(
  payload: VerifyPaymentPayload,
  fetchFn?: typeof fetch,
): Promise<VerifyPaymentResult> {
  return apiFetch<VerifyPaymentResult>(
    '/billing/verify-payment',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    fetchFn,
  );
}

/**
 * Redeems FREE4YOU promotional code for lifetime-free access.
 * Endpoint: POST /api/v1/billing/redeem-promo
 */
export async function redeemPromoCode(
  code: string,
  fetchFn?: typeof fetch,
): Promise<RedeemPromoResult> {
  return apiFetch<RedeemPromoResult>(
    '/billing/redeem-promo',
    {
      method: 'POST',
      body: JSON.stringify({ code }),
    },
    fetchFn,
  );
}

/**
 * Requests subscription cancellation.
 * Endpoint: POST /api/v1/billing/subscription/cancel
 */
export async function cancelSubscription(
  immediate = false,
  fetchFn?: typeof fetch,
): Promise<{ message: string; subscription: SubscriptionData }> {
  return apiFetch<{ message: string; subscription: SubscriptionData }>(
    '/billing/subscription/cancel',
    {
      method: 'POST',
      body: JSON.stringify({ immediate }),
    },
    fetchFn,
  );
}

/**
 * Retrieves paginated payment / invoice history.
 * Endpoint: GET /api/v1/billing/payment-history
 */
export async function getPaymentHistory(
  page = 1,
  limit = 10,
  fetchFn?: typeof fetch,
): Promise<PaymentHistoryResponse> {
  return apiFetch<PaymentHistoryResponse>(
    `/billing/payment-history?page=${page}&limit=${limit}`,
    { method: 'GET' },
    fetchFn,
  );
}
