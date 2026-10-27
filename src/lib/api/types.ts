export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: 'business_owner' | 'super_admin';
  status: 'pending' | 'active' | 'suspended';
  isEmailVerified: boolean;
  businessId?: string;
  lastLoginAt?: string;
}

export interface BusinessBranding {
  logoUrl?: string | null;
  primaryColor: string;
  secondaryColor: string;
}

export interface FeedbackQuestionSetting {
  id: string;
  label: string;
  type: 'text' | 'long_text' | 'single_choice';
  required: boolean;
  options?: string[];
}

export interface BusinessSettings {
  allowPublicReviews: boolean;
  notificationEmail?: string | null;
  defaultLanguage: 'en';
  headingText?: string | null;
  subheadingText?: string | null;
  feedbackQuestions?: FeedbackQuestionSetting[];
}

export interface Business {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  ownerId?: string;
  googleReviewUrl?: string | null;
  googlePlaceId?: string | null;
  status?: string;
  branding?: BusinessBranding;
  settings?: BusinessSettings;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateBusinessProfilePayload {
  name?: string;
  category?: string;
  googleReviewUrl?: string | null;
  googlePlaceId?: string | null;
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}

export interface UpdateBusinessSettingsPayload {
  defaultLanguage?: 'en';
  allowPublicReviews?: boolean;
  notificationEmail?: string | null;
  headingText?: string | null;
  subheadingText?: string | null;
  feedbackQuestions?: FeedbackQuestionSetting[];
}

export interface AuthSessionData {
  user: User;
  business: Business | null;
  token?: string;
}

export interface OtpChallengeResult {
  message: string;
  cooldownSeconds: number;
}

export interface SignupRequestOtpPayload {
  name: string;
  email: string;
  businessName: string;
  category: string;
  googleReviewUrl?: string;
  consentAccepted: boolean;
}

export interface SignupVerifyOtpPayload {
  email: string;
  otp: string;
}

export interface LoginRequestOtpPayload {
  email: string;
}

export interface LoginVerifyOtpPayload {
  email: string;
  otp: string;
}

export type QrCampaignStatus = 'active' | 'inactive';

export interface QrCampaignBranding {
  primaryColor?: string;
  backgroundColor?: string;
  logoKey?: string | null;
  logoUrl?: string | null;
}

export interface QrCampaign {
  _id: string;
  businessId: string;
  title: string;
  heading: string;
  description?: string | null;
  branding: QrCampaignBranding;
  status: QrCampaignStatus;
  publicToken: string;
  scanCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQrCampaignPayload {
  title: string;
  heading: string;
  description?: string;
  branding?: {
    primaryColor?: string;
    backgroundColor?: string;
  };
}

export interface UpdateQrCampaignPayload {
  title?: string;
  heading?: string;
  description?: string | null;
  branding?: {
    primaryColor?: string;
    backgroundColor?: string;
  };
}

export interface ListQrCampaignsQuery {
  page?: number;
  limit?: number;
  status?: QrCampaignStatus;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  campaigns: T[];
  meta: PaginationMeta;
}

export type QrExportFormat = 'png' | 'svg' | 'pdf';

export interface FeedbackQuestion {
  id: string;
  label: string;
  type: 'text' | 'long_text' | 'single_choice';
  required: boolean;
  options?: string[];
}

export interface PublicQrLandingData {
  campaign: {
    title: string;
    heading: string;
    description: string | null;
    branding: {
      primaryColor?: string;
      backgroundColor?: string;
      logoUrl?: string | null;
    };
  };
  business: {
    name: string;
  };
  googleReviewUrl: string | null;
  feedbackQuestions: FeedbackQuestion[];
}

export interface PublicScanResult {
  title: string;
  heading: string;
  description: string | null;
  branding: {
    primaryColor?: string;
    backgroundColor?: string;
    logoUrl?: string | null;
  };
}

export interface FeedbackQuestionAnswer {
  questionId: string;
  answer: string;
}

export interface SubmitFeedbackPayload {
  rating: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  text?: string | null;
  answers?: FeedbackQuestionAnswer[];
  consentAccepted: boolean;
}

export interface SubmitFeedbackResult {
  message: string;
  feedbackId: string;
  googleReviewUrl: string | null;
}

export interface GoogleReviewClickResult {
  destinationUrl: string;
  recorded?: boolean;
}

export type FeedbackLifecycleStatus = 'new' | 'reviewed' | 'resolved';

export interface OwnerFeedbackCustomer {
  _id?: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  lastVisitedAt?: string;
}

export interface OwnerFeedbackCampaign {
  _id?: string;
  title: string;
  publicToken?: string;
}

export interface OwnerFeedbackAnswer {
  questionId: string;
  questionLabel: string;
  answer: string;
}

export interface OwnerFeedbackItem {
  _id: string;
  businessId: string;
  qrCampaignId: OwnerFeedbackCampaign | string;
  customerId: OwnerFeedbackCustomer;
  rating: number; // 1-5
  text?: string | null;
  answers: OwnerFeedbackAnswer[];
  status: FeedbackLifecycleStatus;
  consentAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListOwnerFeedbackQuery {
  page?: number;
  limit?: number;
  rating?: number;
  status?: FeedbackLifecycleStatus;
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface OwnerFeedbackPaginatedResult {
  feedbacks: OwnerFeedbackItem[];
  meta: PaginationMeta;
}

// -------------------------------------------------------------
// Phase 9: Analytics & Dashboard Reporting Types
// -------------------------------------------------------------

export type AnalyticsDateRange = '7d' | '30d' | '90d';

export interface AnalyticsPeriod {
  range: AnalyticsDateRange;
  startDate: string;
  endDate: string;
}

export interface AnalyticsSummaryResponse {
  period: AnalyticsPeriod;
  feedbacks: {
    total: number;
    periodTotal: number;
    newCount: number;
    reviewedCount: number;
    resolvedCount: number;
  };
  ratings: {
    averageRating: number;
    totalRatings: number;
  };
  engagement: {
    totalScansAllTime: number;
    periodScans: number;
    googleReviewClicks: number;
    activeCampaignsCount: number;
  };
  semanticNotes: {
    scans: string;
    googleReviewClicks: string;
  };
}

export interface AnalyticsDailyTrendPoint {
  date: string; // YYYY-MM-DD
  feedbackCount: number;
  averageRating: number | null;
  scanCount: number;
  googleReviewClicks: number;
}

export interface AnalyticsTrendsResponse {
  period: AnalyticsPeriod;
  trends: AnalyticsDailyTrendPoint[];
}

export interface AnalyticsRatingsBreakdownItem {
  star: number; // 1-5
  count: number;
  percentage: number;
}

export interface AnalyticsRatingsBreakdownResponse {
  period: AnalyticsPeriod;
  totalRatings: number;
  averageRating: number;
  breakdown: AnalyticsRatingsBreakdownItem[];
}

export interface AnalyticsCampaignPerformanceItem {
  campaignId: string;
  title: string;
  heading: string;
  status: 'active' | 'inactive';
  publicToken: string;
  totalScansAllTime: number;
  periodScans: number;
  periodFeedbacks: number;
  periodGoogleReviewClicks: number;
  createdAt: string;
}

export interface AnalyticsCampaignPerformanceResponse {
  period: AnalyticsPeriod;
  campaigns: AnalyticsCampaignPerformanceItem[];
}

export interface AnalyticsRecentFeedbackItem {
  id: string;
  rating: number;
  status: FeedbackLifecycleStatus;
  textPreview: string | null;
  hasText: boolean;
  campaignTitle: string | null;
  createdAt: string;
}

export interface AnalyticsRecentFeedbackResponse {
  feedbacks: AnalyticsRecentFeedbackItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AiEditingAction =
  | 'fix_grammar'
  | 'improve_clarity'
  | 'make_concise'
  | 'professional_tone';

export interface AiAssistanceRequest {
  draftText: string;
  action?: AiEditingAction;
}

export interface AiAssistanceResponse {
  originalDraft: string;
  suggestedText: string;
  mode: string;
}

export type PlanInterval = 'monthly' | 'five_month' | 'yearly' | 'package';
export type SubscriptionStatus =
  | 'pending'
  | 'active'
  | 'cancelled'
  | 'expired'
  | 'trial_expired'
  | 'past_due';
export type EntitlementStatus =
  | 'trial_active'
  | 'trial_expired'
  | 'paid_active'
  | 'promo_active'
  | 'payment_pending'
  | 'payment_failed'
  | 'subscription_expired'
  | 'restricted';
export type EntitlementSource =
  | 'trial'
  | 'paid_subscription'
  | 'paid_package'
  | 'promo_free4you'
  | 'none';
export type PaymentEventStatus = 'pending' | 'success' | 'failed';

export interface PlanLimits {
  maxCampaigns: number;
  maxMonthlyScans: number;
  aiAssistanceEnabled: boolean;
}

export interface BillingPlan {
  planId: string;
  name: string;
  description: string;
  price: number; // Integer minor units (e.g. 0 for free, 9900 for ₹99, 39900 for ₹399)
  currency: string;
  interval: PlanInterval;
  features: string[];
  limits: PlanLimits;
}

export interface SubscriptionData {
  id?: string;
  _id?: string;
  planId: string;
  planName: string;
  status: SubscriptionStatus;
  entitlementStatus?: EntitlementStatus;
  canAccessProduct?: boolean;
  entitlementSource?: EntitlementSource;
  billingInterval: PlanInterval;
  priceSnapshot: {
    amount: number;
    currency: string;
  };
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt?: string | null;
  daysRemaining?: number | null;
  isLifetime?: boolean;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: string | null;
  isSimulated?: boolean;
  features?: string[];
  limits?: PlanLimits | null;
}

export interface CheckoutPayload {
  planId: string;
  interval?: PlanInterval;
  simulateSuccess?: boolean;
}

export interface CheckoutResult {
  message?: string;
  checkoutId: string;
  provider?: 'razorpay' | 'mock' | 'promo';
  isSimulated?: boolean;
  status?: string;
  amount?: number;
  currency?: string;
  planId?: string;
  interval?: string;
  keyId?: string;
  verified?: boolean;
  paymentReference?: string;
  subscription?: Partial<SubscriptionData>;
}

export interface VerifyPaymentPayload {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface VerifyPaymentResult {
  verified: boolean;
  checkoutId: string;
  paymentReference: string;
  status: string;
  isSimulated: boolean;
  amount: number;
  currency: string;
  subscription: Partial<SubscriptionData>;
  message: string;
  isIdempotent?: boolean;
}

export interface RedeemPromoPayload {
  code: string;
}

export interface RedeemPromoResult {
  success: boolean;
  code: string;
  message: string;
  isLifetime: boolean;
  subscription: Partial<SubscriptionData>;
}

export interface PaymentEventItem {
  id?: string;
  _id?: string;
  provider?: 'mock' | 'razorpay' | 'promo';
  isSimulated?: boolean;
  eventType: string;
  status: PaymentEventStatus;
  amount: number;
  currency: string;
  idempotencyKey?: string;
  checkoutId?: string | null;
  paymentReference?: string | null;
  failureReason?: string | null;
  createdAt: string;
}

export interface PaymentHistoryResponse {
  items?: PaymentEventItem[];
  events?: PaymentEventItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface CustomerDirectoryStats {
  totalCustomers: number;
  repeatCustomers: number;
  averageRating: number | null;
}

export interface CustomerDirectoryItem {
  id: string;
  _id?: string;
  name: string;
  email: string | null;
  phone: string | null;
  lastVisitedAt: string;
  createdAt: string;
  feedbackCount: number;
  avgRating: number | null;
  latestRating: number | null;
  isRepeat: boolean;
}

export interface CustomerDirectoryResponse {
  customers: CustomerDirectoryItem[];
  stats: CustomerDirectoryStats;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustomerFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'lastVisitedAt' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

