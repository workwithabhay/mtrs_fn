# Frontend Development Progress

Tracking document for the implementation phases of the Review Management SaaS Next.js frontend.

---

## 🧭 Phase Status Checklist

| Phase | Description | Status | Verification Summary |
| :--- | :--- | :---: | :--- |
| **Phase 1** | Next.js Frontend Foundation & Baseline Setup | **COMPLETED** | Next.js 16 App Router, TypeScript strict, Tailwind v4 design tokens, Google Sans/Inter font strategy, Vitest setup, backend health probe, 11/11 tests passing, production build succeeded. |
| **Phase 2** | Core Design System & Reusable UI Components | **COMPLETED** | Reusable typed primitives (Button, Input, Textarea, Select, Badge, Card, Dialog, Toast, Skeleton, GlowCard), non-circular typography tokens, /design-system showcase route, 39/39 tests passing across 13 suites. |
| **Phase 3** | Public Marketing Website & Responsive Navigation | **COMPLETED** | Public marketing landing page (`/`), responsive navbar with accessible drawer, 7 rich marketing sections, honest `/login` & `/signup` Phase 4 placeholders, 52/52 tests passing across 16 suites. |
| **Phase 4** | Passwordless Email OTP Authentication | **COMPLETED** | Full 2-step signup & login flows, 6-digit OTP verification, session context, CSRF token handling, authenticated dashboard placeholder, 80/80 tests passing across 20 suites. |
| **Phase 5** | Authenticated Owner App Shell & Dashboard | **COMPLETED** | Persistent desktop sidebar, mobile navigation drawer, account menu with CSRF logout, verified business overview, truthful onboarding checklist, 0 fabricated metrics, 92/92 tests passing across 22 suites. |
| **Phase 6** | QR Campaign Builder & Multi-Format Generator | **COMPLETED** | Campaign listing, creation with color presets, verified SVG preview, multi-format binary downloads (PNG, SVG, PDF), active owner navigation, 120/120 tests passing across 27 suites. |
| **Phase 7** | Mobile-First Customer Feedback Journey | **COMPLETED** | Public `/qr/[token]` landing page, accessible 1-5 star rating selector, verified business questions, contact capture with validation, un-gated Google review link-out, 141/141 tests passing across 32 suites. |
| **Phase 8** | Customer Feedback Management & Records | **COMPLETED** | Owner feedback inbox, verified backend contracts, status management, responsive table & mobile card list, 158/158 tests passing across 37 suites. |
| **Phase 9** | Real-Data Analytics & Visualizations | **COMPLETED** | Authentic summary KPIs, zero-event daily trend SVG charts, 1-5 star distributions, touchpoint campaign performance, 178/178 tests passing across 43 suites. |
| **Phase 10** | AI-Assisted Feedback Editing Studio | **COMPLETED** | Multi-action feedback wording polish, side-by-side desktop / stacked mobile workspace, truthful non-fabrication safeguards, manual review & edit, 194/194 frontend tests passing. |
| **Phase 11** | Business Settings & Profile Management | **COMPLETED** | Verified business profile editing, Google review URL destination with non-gating policy, branding defaults with live preview, feedback alerts & customer experience copy, 226/226 tests passing across 53 suites. |
| **Phase 12** | Billing & Plans Management | **COMPLETED** | Subscription tier viewer, active plan badge, monthly/annual switcher, mock checkout/upgrade, cancellation dialog, payment event history, INR (₹) formatting, 12/12 tests passing. |
| **Phase 13** | Customers Directory & Loyalty Tracking | **COMPLETED** | Multi-tenant customer directory, verified feedback count & average sentiment aggregation, repeat patron loyalty indicators, regex-safe search & sorting, 246/246 tests passing across 59 suites. |
| **Phase 14** | End-to-End Validation & Release Readiness | *Upcoming* | WCAG 2.2 AA audit, Lighthouse optimization, cross-browser tests. |

---

## 📌 Phase 13 Completion Details (Customers Directory & Loyalty Tracking)

- **Date Completed**: 2026-10-24
- **Backend Service & Endpoints (`backend/src/modules/feedbacks/`)**:
  - `GET /api/v1/feedback/customers`: Mounted in [feedback.routes.ts](file:///Users/abhhiolics/Desktop/mtrs/backend/src/modules/feedbacks/feedback.routes.ts), strictly scoped to authenticated owner tenant.
  - Implemented `feedbackService.listCustomers` with tenant-isolated MongoDB queries, regex-safe search (`name`, `email`, `phone`), customer pagination, and real-time MongoDB feedback aggregation for customer submission count, average rating, latest rating, and repeat patron detection (`feedbackCount > 1`).
  - Added [customers.test.ts](file:///Users/abhhiolics/Desktop/mtrs/backend/tests/integration/customers.test.ts) covering unauthenticated 401s, empty directories, verified feedback metrics, multi-tenant isolation, and search filtering. All 5/5 integration tests pass.
- **Frontend Architecture (`src/components/customers/`)**:
  - [customer-directory.tsx](file:///Users/abhhiolics/Desktop/mtrs/frontend/src/components/customers/customer-directory.tsx): Orchestrator managing parallel KPI fetches, 300ms debounced search, sorting options, retry banner, and refresh.
  - [customer-stats-cards.tsx](file:///Users/abhhiolics/Desktop/mtrs/frontend/src/components/customers/customer-stats-cards.tsx): 3 KPI cards displaying Total Customers, Repeat Patrons (% loyalty), and Average Sentiment score.
  - [customer-filters.tsx](file:///Users/abhhiolics/Desktop/mtrs/frontend/src/components/customers/customer-filters.tsx): Search input by name/email/phone, sort selector (Last Visited, Joined Date, Name), order toggle (Asc/Desc), and filter reset.
  - [customer-table.tsx](file:///Users/abhhiolics/Desktop/mtrs/frontend/src/components/customers/customer-table.tsx): Desktop table and responsive mobile card layout with avatar initials, contact details, loyalty badge (`Repeat Patron` / `First-Time`), submission count, star rating, visit timestamps, and pagination controls.
  - [customer-empty-state.tsx](file:///Users/abhhiolics/Desktop/mtrs/frontend/src/components/customers/customer-empty-state.tsx): Distinct empty states for no customers yet (with QR campaign CTA) and no search results.
  - [page.tsx](file:///Users/abhhiolics/Desktop/mtrs/frontend/src/app/dashboard/customers/page.tsx): Route component with authentication guard and skeleton loading.
  - Activated Customers tab in [navigation-items.ts](file:///Users/abhhiolics/Desktop/mtrs/frontend/src/components/dashboard/navigation-items.ts) (`isAvailable: true`).

---

## 📌 Phase 12 Completion Details (Billing & Plans Management)

- **Date Completed**: 2026-10-24
- **Backend Endpoints Utilized**:
  - `GET /api/v1/billing/plans`: Subscription tier catalog (Free, Starter, Pro, Enterprise).
  - `GET /api/v1/billing/subscription`: Active subscription status and quota usage.
  - `POST /api/v1/billing/subscription/checkout`: Mock checkout intent generation with simulated payment handling.
  - `POST /api/v1/billing/subscription/cancel`: At-period-end or immediate subscription cancellation.
  - `GET /api/v1/billing/subscription/history`: Paginated invoice / payment event history with INR (`₹`) formatting.
- **Frontend Architecture (`src/components/billing/`)**:
  - [billing-dashboard.tsx](file:///Users/abhhiolics/Desktop/mtrs/frontend/src/components/billing/billing-dashboard.tsx): Orchestrator coordinating plan listings, active subscription details, interval toggle (monthly vs. annual 20% discount), simulated checkout upgrades, and cancellation dialog.
  - [subscription-status-card.tsx](file:///Users/abhhiolics/Desktop/mtrs/frontend/src/components/billing/subscription-status-card.tsx): Status overview showing plan badge, QR scan limits, AI Studio access, next renewal date, and cancellation warning alert.
  - [plan-card.tsx](file:///Users/abhhiolics/Desktop/mtrs/frontend/src/components/billing/plan-card.tsx): Responsive plan cards with feature checklist and upgrade/switch buttons.
  - [payment-history-table.tsx](file:///Users/abhhiolics/Desktop/mtrs/frontend/src/components/billing/payment-history-table.tsx): Transaction ledger with date, amount, status badge, idempotency key, and simulated billing banner.
  - [cancel-subscription-dialog.tsx](file:///Users/abhhiolics/Desktop/mtrs/frontend/src/components/billing/cancel-subscription-dialog.tsx): Accessible Radix confirmation modal for subscription cancellation.
  - [page.tsx](file:///Users/abhhiolics/Desktop/mtrs/frontend/src/app/dashboard/billing/page.tsx): Route page protected by `useAuth()`.
  - Activated Billing & Plans tab in [navigation-items.ts](file:///Users/abhhiolics/Desktop/mtrs/frontend/src/components/dashboard/navigation-items.ts) (`isAvailable: true`).

---

## 📌 Phase 11 Completion Details

- **Date Completed**: 2026-10-24
- **Modules & Utilities Created (`src/lib/api/`)**:
  - `types.ts`: Extended `Business` interface with `googlePlaceId`, `settings`, `createdAt`, `updatedAt`, and added `BusinessBranding`, `FeedbackQuestionSetting`, `BusinessSettings`, `UpdateBusinessProfilePayload`, `UpdateBusinessSettingsPayload`.
  - `business.ts`: Dedicated owner API service connecting to verified backend endpoints (`getBusinessProfile`, `updateBusinessProfile`, `getBusinessSettings`, `updateBusinessSettings`).
- **Components Created (`src/components/settings/`)**:
  - `business-profile-form.tsx`: Section managing business name, category presets, tenant account ID badge, and status indicator.
  - `google-review-form.tsx`: Section managing Google review URL with format validation, live test link opener, and strict anti-gating policy disclaimer.
  - `branding-settings-form.tsx`: Section managing primary and secondary hex colors, 6 preset palettes, and live touchpoint card preview.
  - `notification-settings-form.tsx`: Section managing alert email, public review links toggle, default heading, and subheading copy.
  - `account-info-section.tsx`: Read-only account overview displaying owner name, verified email, role, passwordless security model, and session logout.
  - `settings-container.tsx`: Main settings controller coordinating parallel data fetching, tabbed navigation, loading skeletons, error retry, and session synchronization.
- **Routes Created / Updated (`src/app/dashboard/settings/`)**:
  - `/dashboard/settings`: Authenticated owner settings route with session protection and loading skeleton.
  - Unlocked "Settings" tab in `src/components/dashboard/navigation-items.ts` (`isAvailable: true`).
- **Tests Created / Updated**:
  - `tests/unit/api/business-api.test.ts`: 5 tests covering profile GET/PATCH and settings GET/PATCH API calls.
  - `tests/unit/settings/business-profile-form.test.tsx`: 6 tests covering initial values, validation, preset selection, save submission, cancel reset, and error alert.
  - `tests/unit/settings/google-review-form.test.tsx`: 5 tests covering URL validation, clearing URL, save submission, cancel reset, and anti-gating note.
  - `tests/unit/settings/branding-settings-form.test.tsx`: 5 tests covering initial hex colors, hex regex validation, preset palette selection, save submission, and cancel reset.
  - `tests/unit/settings/notification-settings-form.test.tsx`: 5 tests covering email validation, public reviews checkbox toggle, copy update, save submission, and cancel reset.
  - `tests/unit/settings/settings-container.test.tsx`: 3 tests covering parallel data fetch, tab switching, and error retry state.
  - `tests/unit/settings/settings-page.test.tsx`: 3 tests covering loading skeleton, unauthenticated redirect to `/login`, and authenticated rendering.
  - `tests/unit/dashboard/navigation.test.tsx`: Updated navigation assertions to verify active Settings link.
- **Verification Commands Executed**:
  - `npm run lint`: **0 errors, 0 warnings**
  - `npm run typecheck`: **0 errors**
  - `npm test -- --run`: **226/226 tests passed** across 53 test suites
  - `npm run build`: **Compiled successfully** in 878ms (all 14 routes statically prerendered)
  - Backend integration test suite `npm test -- tests/integration/business.test.ts`: **8/8 tests passed** confirming multi-tenant isolation, profile updates, and settings updates.

---

## 📌 Phase 10 Completion Details

- **Date Completed**: 2026-10-24
- **Modules & Utilities Created (`src/lib/api/`)**:
  - `types.ts`: Added strongly typed AI studio models (`AiEditingAction`, `AiAssistanceRequest`, `AiAssistanceResponse`).
  - `ai-studio.ts`: Focused owner API service connecting to verified backend route (`requestAiAssistance` via `POST /api/v1/feedback/ai-assistance`).
- **Components Created (`src/components/ai-studio/`)**:
  - `ai-action-selector.tsx`: Accessible radiogroup selecting among the 4 verified actions (`fix_grammar`, `improve_clarity`, `make_concise`, `professional_tone`).
  - `ai-disclaimer-banner.tsx`: Ethical boundaries banner explaining that AI strictly preserves original facts, names, sentiments, and events without fabricating reviews or ratings.
  - `ai-studio-workspace.tsx`: Responsive side-by-side (desktop `lg:grid-cols-2`) and stacked (mobile) comparison workspace with original text editor (character count 10–2,000 bounds), quick sample drafts, proposed revision editor with manual correction capability, status badge, word count comparison, outdated warning when source draft changes, copy to clipboard with toast confirmation, explicit accept action, discard action, and regenerate.
  - `ai-studio-container.tsx`: Main studio layout coordinating header, description, ethical banner, and workspace.
- **Routes Created / Updated (`src/app/dashboard/ai-studio/`)**:
  - `/dashboard/ai-studio`: Authenticated owner studio route with session protection and loading skeleton.
  - Unlocked "AI Assistant" tab in `src/components/dashboard/navigation-items.ts` (`isAvailable: true`).
- **Tests Created / Updated**:
  - `tests/unit/api/ai-studio-api.test.ts`: 2 tests verifying POST payload, stringified JSON body, and error handling.
  - `tests/unit/ai-studio/ai-studio.test.tsx`: 11 tests verifying container rendering, 10-char input validation, sample draft loading, action radio selection, generation flow, side-by-side comparison, manual editing of proposed revision, outdated revision warning on source edit, explicit accept, copy to clipboard, discard revision, and error banner display.
  - `tests/unit/ai-studio/ai-studio-page.test.tsx`: 3 tests for loading skeleton, unauthenticated redirect to `/login`, and authenticated rendering.
  - `tests/unit/dashboard/navigation.test.tsx`: Updated navigation assertions to verify active AI Assistant link.
- **Verification Commands Executed**:
  - `npm run lint`: **0 errors, 0 warnings**
  - `npm run typecheck`: **0 errors**
  - `npm test -- --run`: **194/194 tests passed** across 46 test suites
  - `npm run build`: **Compiled successfully** in 824ms (all 13 routes statically prerendered)
  - Backend integration test suite `npm test -- tests/integration/ai-assistance.test.ts`: **17/17 tests passed** including multi-action owner assistance and CSRF validation.

---

## 📌 Phase 9 Completion Details

- **Date Completed**: 2026-10-24
- **Modules & Utilities Created (`src/lib/api/`)**:
  - `types.ts`: Added strongly typed analytics models (`AnalyticsDateRange`, `AnalyticsPeriod`, `AnalyticsSummaryResponse`, `AnalyticsDailyTrendPoint`, `AnalyticsTrendsResponse`, `AnalyticsRatingsBreakdownItem`, `AnalyticsRatingsBreakdownResponse`, `AnalyticsCampaignPerformanceItem`, `AnalyticsCampaignPerformanceResponse`, `AnalyticsRecentFeedbackItem`, `AnalyticsRecentFeedbackResponse`).
  - `analytics.ts`: Focused owner analytics API service connecting to verified backend endpoints (`getAnalyticsSummary`, `getAnalyticsTrends`, `getRatingsBreakdown`, `getCampaignPerformance`, `getRecentFeedbackPreview`).
- **Components Created (`src/components/analytics/`)**:
  - `analytics-date-selector.tsx`: 7d/30d/90d range toggle with formatted UTC date range bounds.
  - `analytics-kpi-cards.tsx`: 4 high-level KPI cards (Period Scans, Feedback Submissions, Average Rating, and Google Review Clicks) with semantic notes.
  - `analytics-trend-chart.tsx`: Accessible interactive SVG chart comparing daily scans, feedback, and review taps over time with view-as-table fallback, hover tooltip inspection, and zero-filled trend points.
  - `analytics-rating-distribution.tsx`: 5-to-1 star progress bar distribution breakdown with percentage calculations and truthful empty state handling.
  - `analytics-campaign-table.tsx`: Per-campaign performance table showing period scans, feedback count, submission conversion rate, and external review taps across desktop table and mobile cards.
  - `analytics-dashboard.tsx`: Main dashboard orchestrator coordinating date ranges, parallel data fetching, loading skeletons, error retry, and refresh action.
- **Routes Created (`src/app/dashboard/analytics/`)**:
  - `/dashboard/analytics`: Authenticated owner analytics route with session guard and loading skeleton.
  - Unlocked "Analytics" tab in `src/components/dashboard/navigation-items.ts` (`isAvailable: true`).
- **Tests Created**:
  - `tests/unit/api/analytics-api.test.ts`: 5 tests for summary, trends, ratings breakdown, campaign performance, and recent feedback preview.
  - `tests/unit/analytics/analytics-kpi-cards.test.tsx`: 3 tests verifying KPI metrics, semantic notes, and zero-rating truthful display.
  - `tests/unit/analytics/analytics-trend-chart.test.tsx`: 3 tests for SVG rendering, table toggle, and empty trend handling.
  - `tests/unit/analytics/analytics-rating-distribution.test.tsx`: 3 tests for score calculation, progress bar accessibility, and empty review state.
  - `tests/unit/analytics/analytics-campaign-table.test.tsx`: 3 tests for conversion rate calculation, zero-scan handling, and empty touchpoint state.
  - `tests/unit/analytics/analytics-dashboard.test.tsx`: 3 tests for skeleton loading, date range switching, and error retry state.
- **Verification Commands Executed**:
  - `npm run lint`: **0 errors, 0 warnings**
  - `npm run typecheck`: **0 errors**
  - `npm test -- --run`: **178/178 tests passed** across 43 test suites
  - `npm run build`: **Compiled successfully** in 923ms (all 12 routes prerendered)
  - Backend integration test suite `npm test -- tests/integration/dashboard.test.ts`: **11/11 tests passed** confirming multi-tenant isolation, range validation, and zero-filled trend series.

---

## 📌 Phase 8 Completion Details

- **Date Completed**: 2026-10-24
- **Modules & Utilities Created (`src/lib/api/`)**:
  - `types.ts`: Added strongly typed feedback inbox models (`FeedbackLifecycleStatus`, `OwnerFeedbackCustomer`, `OwnerFeedbackCampaign`, `OwnerFeedbackAnswer`, `OwnerFeedbackItem`, `ListOwnerFeedbackQuery`, `OwnerFeedbackPaginatedResult`).
  - `feedback-inbox.ts`: Focused owner API service connecting to verified backend endpoints (`listOwnerFeedbacks`, `getOwnerFeedbackById`, `updateOwnerFeedbackStatus`).
- **Components Created (`src/components/inbox/`)**:
  - `feedback-status-badge.tsx`: Color-coded accessible badges for `'new'`, `'reviewed'`, and `'resolved'` feedback records.
  - `feedback-empty-state.tsx`: Truthful zero-submission display with QR campaign link-out and no-matching-filter state with reset action.
  - `feedback-detail-drawer.tsx`: Accessible dialog modal displaying verified customer details, star rating, feedback text, custom questions, and lifecycle status transition controls.
  - `feedback-filters.tsx`: Client search bar, star rating dropdown (1-5), status filter, sort order selector, and filter reset button.
  - `feedback-table.tsx`: Responsive desktop table (`sm:`) and mobile card list (`<sm`) with accessible pagination controls.
  - `feedback-inbox.tsx`: Primary inbox controller coordinating backend query state, client search, drawer selection, and truthful KPI metrics.
- **Routes Created (`src/app/dashboard/feedback/`)**:
  - `/dashboard/feedback`: Authenticated owner feedback inbox route with session protection and loading skeleton.
  - Unlocked "Customer Feedback" tab in `src/components/dashboard/navigation-items.ts` (`isAvailable: true`).
- **Tests Created**:
  - `tests/unit/api/feedback-inbox-api.test.ts`: 3 tests for list parameters, detail retrieval, and status update.
  - `tests/unit/inbox/feedback-status-badge.test.tsx`: 3 tests verifying rendering of 'new', 'reviewed', and 'resolved' states.
  - `tests/unit/inbox/feedback-filters.test.tsx`: 4 tests for filter inputs, rating selection, status selection, and reset action.
  - `tests/unit/inbox/feedback-detail-drawer.test.tsx`: 3 tests for detail rendering, status update action, and drawer dismissal.
  - `tests/unit/inbox/feedback-inbox.test.tsx`: 4 tests for loading skeletons, truthful empty state, filtered no-match state, and drawer click trigger.
- **Verification Commands Executed**:
  - `npm run lint`: **0 errors, 0 warnings**
  - `npm run typecheck`: **0 errors**
  - `npm test -- --run`: **158/158 tests passed** across 37 test suites
  - `npm run build`: **Compiled successfully** in 506ms (all 11 routes prerendered)
  - Backend integration test suite `npm test -- tests/integration/feedback.test.ts`: **17/17 tests passed** including tenant isolation and status updating.

---

## 📌 Phase 7 Completion Details

- **Date Completed**: 2026-10-24
- **Modules & Utilities Created (`src/lib/api/`)**:
  - `types.ts`: Added strongly typed feedback models (`FeedbackQuestion`, `PublicQrLandingData`, `PublicScanResult`, `FeedbackQuestionAnswer`, `SubmitFeedbackPayload`, `SubmitFeedbackResult`, `GoogleReviewClickResult`).
  - `feedback.ts`: Dedicated public API client service connecting to verified backend endpoints (`getPublicLanding`, `recordPublicScan`, `submitPublicFeedback`, `trackGoogleReviewClick`).
- **Components Created (`src/components/feedback/`)**:
  - `star-rating.tsx`: Accessible mobile-first 1-5 star selector with 48px touch targets, dynamic rating labels, full keyboard navigation (Arrows, 1-5 number keys), and field-level error support.
  - `question-input.tsx`: Form control dynamically rendering custom business questions (`text`, `long_text`, and `single_choice` touch pills) with validation and accessibility attributes.
  - `feedback-form.tsx`: Mobile-first responsive customer journey with verified business branding, non-gating Google review invitation banner, custom questions, contact validation (name required, at least one of email/phone required), consent checkbox, double-submit protection, and error recovery.
  - `feedback-success.tsx`: Genuine confirmation screen thanking the customer and providing an un-gated link to post on Google Reviews across all rating levels (1 through 5 stars).
  - `feedback-error.tsx`: Customer-friendly error display for inactive campaigns, invalid tokens, and network failures with a retry button.
- **Routes Created (`src/app/qr/[token]/`)**:
  - `/qr/[token]`: Public Next.js dynamic App Router route resolving the token against the backend, recording a single scan event per token session, and managing the feedback state.
- **Tests Created**:
  - `tests/unit/api/feedback-api.test.ts`: 4 tests for public landing, scan recording, feedback submission, and Google review click tracking.
  - `tests/unit/feedback/star-rating.test.tsx`: 6 tests for 5-star rendering, click selection, rating modification, keyboard navigation, error display, and disabled state.
  - `tests/unit/feedback/feedback-form.test.tsx`: 4 tests for form rendering, validation (rating, name, email/phone, consent, questions), valid payload submission, and network error retention.
  - `tests/unit/feedback/google-review-policy.test.tsx`: 3 tests verifying anti-gating compliance across all 1 to 5 star ratings and explicit user click requirements.
  - `tests/unit/feedback/qr-landing-page.test.tsx`: 4 tests for active campaign rendering, inactive campaign handling, invalid token handling, and network error retry.
- **Verification Commands Executed**:
  - `npm run lint`: **0 errors, 0 warnings**
  - `npm run typecheck`: **0 errors**
  - `npm run test -- --run`: **141/141 tests passed** across 32 test suites
  - `npm run build`: **Compiled successfully** in 530ms (all 11 routes prerendered)
  - Backend integration test suite `npm test -- tests/integration/feedback.test.ts`: **17/17 tests passed** including review anti-gating and rate-limiting tests.

---

## 📌 Phase 6 Completion Details

- **Date Completed**: 2026-10-24
- **Modules & Utilities Created (`src/lib/api/`)**:
  - `types.ts`: Strongly typed QR Campaign models (`QrCampaign`, `QrCampaignBranding`, `CreateQrCampaignPayload`, `UpdateQrCampaignPayload`, `ListQrCampaignsQuery`, `PaginationMeta`, `PaginatedResult`, `QrExportFormat`).
  - `client.ts`: Extended centralized API client with `apiFetchWithMeta<T>` for paginated responses and `apiFetchBlob` for authenticated binary downloads and SVG previews with JSON error normalization.
  - `campaigns.ts`: Dedicated API service connecting directly to verified backend endpoints (`listCampaigns`, `getCampaignById`, `createCampaign`, `updateCampaign`, `deactivateCampaign`, `exportCampaignQr`, `triggerCampaignDownload`, `getPublicCampaignLandingUrl`).
- **Components Created (`src/components/campaigns/`)**:
  - `campaign-list.tsx`: Paginated campaign directory with title/heading search, status filtering (`All`, `Active`, `Inactive`), loading skeletons, recoverable error retry, and empty state.
  - `campaign-card.tsx`: Campaign card displaying verified scan count, status badge, formatted creation date, color swatch, quick download actions, and detail link.
  - `campaign-form.tsx`: Responsive creation form with client-side validation (title 2-100, heading 2-120, description max 250), 6 color palette presets, live touchpoint preview card, and duplicate submission locking.
  - `qr-preview.tsx`: Authoritative QR preview component fetching backend SVG via safe Blob URL, aspect-ratio locked container with white quiet zone, copy destination URL button with visual feedback, and embedded downloads.
  - `qr-download-actions.tsx`: Multi-format download actions for High-Res PNG (600px), Scalable Vector SVG, and Printable A4 PDF sheet with independent loading spinners, filename sanitization, and object URL revocation.
  - `campaign-empty-state.tsx`: Actionable zero-state with direct CTA to create the first physical touchpoint.
- **Routes Created / Updated (`src/app/dashboard/campaigns/`)**:
  - `/dashboard/campaigns`: Authenticated campaign management list route.
  - `/dashboard/campaigns/new`: Dedicated campaign builder route with back navigation.
  - `/dashboard/campaigns/[id]`: Detailed view route with authoritative QR preview, metadata breakdown, placement print guidelines, and downloads.
  - `src/components/dashboard/navigation-items.ts`: Updated `campaigns` nav item to `isAvailable: true`.
  - `src/app/dashboard/page.tsx`: Updated onboarding checklist and capability overview cards to link to `/dashboard/campaigns`.
- **Tests Created (`tests/unit/campaigns/`)**:
  - `campaigns-api.test.ts`: 8 tests covering list, getById, create, update, deactivate, export binary, download helper, and destination URL builder.
  - `campaign-list.test.tsx`: 6 tests covering loading skeleton, verified rendering, empty state, search query filtering, status filtering, and retry recovery.
  - `campaign-form.test.tsx`: 5 tests covering field rendering, client validation, color presets, valid payload submission with router push, and API error banners.
  - `qr-preview.test.tsx`: 3 tests covering safe SVG Blob rendering in `<img>`, clipboard copy action, and error retry.
  - `qr-download-actions.test.tsx`: 6 tests covering all 3 format downloads (PNG, SVG, PDF), compact variant, and download error reporting.
- **Verification Commands Executed**:
  - `npm run lint`: **0 errors, 0 warnings**
  - `npm run typecheck`: **0 errors**
  - `npm run test -- --run`: **120/120 tests passed** across 27 test suites
  - `npm run build`: **Compiled successfully** in 833ms (all 10 routes prerendered)
  - Backend integration test suite `npm test -- tests/integration/qr-campaign.test.ts`: **24/24 tests passed** including tenant isolation and magic byte format checks.

---

## 📌 Phase 5 Completion Details

- **Date Completed**: 2026-10-24
- **Components & Layout Created (`src/components/dashboard/`)**:
  - `navigation-items.ts`: Central navigation registry with all 8 product areas (Overview live; QR Campaigns, Customer Feedback, Customers, Analytics, AI Studio, Settings, Billing marked with Phase badges and `isAvailable: false`).
  - `app-sidebar.tsx`: Desktop persistent 64-width navigation sidebar with ReviewFlow brand identity, active business identity card, active route indicator (`aria-current="page"`), upcoming phase tags, and authenticated user logout footer.
  - `app-header.tsx`: Responsive top application bar with mobile drawer toggle button, breadcrumb navigation context, Google Review link status badge, and `UserMenu`.
  - `mobile-navigation.tsx`: Mobile off-canvas drawer with `role="dialog"` and `aria-modal="true"`, background backdrop dismissal, keyboard Escape key listener, body scroll lock, and auto-dismiss on navigation.
  - `user-menu.tsx`: Accessible interactive account dropdown displaying owner initials, verified account status, direct links to Marketing and Design System, and CSRF-protected server logout with double-click defense and error state display.
  - `dashboard-layout.tsx`: Composite owner application shell coordinating sidebar, header, and main content area with accessible landmarks (`<aside>`, `<header>`, `<main id="dashboard-main">`).
- **Route Architecture (`src/app/dashboard/`)**:
  - `layout.tsx`: App Router layout wrapping authenticated `/dashboard` routes in `DashboardLayout`.
  - `page.tsx`: Polished Main Dashboard overview featuring:
    - Welcome hero banner with personalized owner name, business badge, and active status.
    - Verified Business Profile card displaying actual business name, owner email, category, and verified Google review URL (with safe external link opener).
    - Getting-started checklist with verified completion states (account active, review link configured, QR campaign pending Phase 6).
    - Capability overview cards with zero fabricated metrics (truthful "0 active", "0 feedbacks" empty state counts).
    - Recent customer activity section with an honest empty state explaining that feedback will appear once QR campaigns go live.
    - Quick next actions guiding the owner to configure business settings or explore how customer reviews flow.
- **Tests Created (`tests/unit/dashboard/`)**:
  - `navigation.test.tsx`: 7 tests covering desktop sidebar rendering, active link indicator, future phase badges, mobile drawer open/close, escape key dismissal, and link click auto-close.
  - `user-menu.test.tsx`: 5 tests covering trigger initials, dropdown toggle, escape listener, logout execution, and logout server error display.
  - `page.test.tsx`: 4 tests covering loading indicator, unauthenticated redirect to `/login`, verified profile rendering, and safe handling of missing Google review URL.
- **Verification Commands Executed**:
  - `npm run lint`: **0 errors, 0 warnings**
  - `npm run typecheck`: **0 errors**
  - `npm run test -- --run`: **92/92 tests passed** across 22 test suites
  - `npm run build`: **Compiled successfully** in 850ms (all 8 routes statically prerendered)

- **Date Completed**: 2026-10-24
- **Modules & Utilities Created**:
  - `src/lib/api/types.ts`: Strongly typed API success/error models, user, business, and OTP request/verify payloads.
  - `src/lib/api/client.ts`: Centralized fetch client enforcing base URL (`config.apiUrl`), `credentials: 'include'` for HTTP-only cookies, automated `x-csrf-token` header injection via `csrf_token` cookie for state-changing requests, and structured `ApiError` normalization.
  - `src/lib/api/auth.ts`: Strongly typed auth functions connecting directly to verified backend routes (`POST /auth/signup/request-otp`, `POST /auth/signup/verify-otp`, `POST /auth/login/request-otp`, `POST /auth/login/verify-otp`, `GET /auth/me`, `POST /auth/logout`).
  - `src/contexts/auth-context.tsx`: Client-side React context and `useAuth()` hook managing verified user/business state, initial session restoration without cascading renders, and session revocation.
- **Pages Created / Updated**:
  - `src/app/(auth)/signup/page.tsx`: Two-step business onboarding:
    - Step 1: Business information (Full Name, Business Email, Business Name, Category with presets, optional Google Review URL, and Policy Consent).
    - Step 2: 6-digit OTP verification with 60-second resend cooldown timer and return-to-edit action preserving form state.
  - `src/app/(auth)/login/page.tsx`: Two-step login flow:
    - Step 1: Email entry with account enumeration defense (generic message returned regardless of account existence).
    - Step 2: 6-digit OTP verification with countdown timer and use-different-email action.
  - `src/app/dashboard/page.tsx`: Authenticated destination placeholder page displaying real user & business profile from `GET /api/v1/auth/me`, active session verification badge, and functional Log Out button calling `POST /api/v1/auth/logout`.
  - `src/app/layout.tsx`: Wrapped application tree in `<AuthProvider>`.
- **Tests Created / Updated**:
  - `tests/unit/api/client.test.ts`: Credentials inclusion, CSRF header attachment, GET exclusion, and ApiError parsing.
  - `tests/unit/api/auth.test.ts`: Request/verify signup, login, session check, and logout API calls.
  - `tests/unit/auth/signup.test.tsx`: Client-side validation, error banners, OTP step transition, duplicate submission prevention, and navigation.
  - `tests/unit/auth/login.test.tsx`: Email validation, account enumeration defense copy, OTP verification, and navigation.
  - `tests/unit/auth/dashboard-placeholder.test.tsx`: Authenticated session rendering, unauthenticated state, and logout.
- **Verification Commands Executed**:
  - `npm run lint`: **0 errors, 0 warnings**
  - `npm run typecheck`: **0 errors**
  - `npm run test -- --run`: **80/80 tests passed** across 20 test suites
  - `npm run build`: **Compiled successfully** (all 8 routes prerendered)

---

## 📌 Phase 3 Completion Details

- **Date Completed**: 2026-10-24
- **Packages Added**:
  - `@radix-ui/react-slot`: `^1.1.2` (enables `asChild` composition on `Button` for `<Button asChild><Link href="..." /></Button>`)
- **Marketing Components Created (`src/components/marketing/`)**:
  - `navbar.tsx`: Sticky responsive header with brand logo, desktop navigation, `Log In` & `Get Started` CTAs, Design System link, and accessible mobile drawer with keyboard ESC listener and background scroll locking.
  - `hero.tsx`: High-converting headline ("Turn Customer Feedback Into Your Next Opportunity"), supporting copy, primary/secondary CTAs, and a CSS-built interactive illustrative dashboard/mobile preview card clearly labeled as illustrative.
  - `value-proposition.tsx`: Trust & value section highlighting physical QR touchpoints, non-gated review compliance, private recovery, and sentiment trends.
  - `features.tsx`: 6 capability cards using `Card` and `Badge` primitives (QR campaigns, mobile flow, direct Google review access, private owner channel, AI feedback polish, overview analytics).
  - `how-it-works.tsx`: Clear 3-step numbered workflow from business setup to QR sharing and feedback collection.
  - `pricing.tsx`: Transparent 3-tier pricing cards matching backend plans (Starter ₹999/mo, Growth ₹2,499/mo, Enterprise Custom) with clear notice that live payment checkout launches in a future phase.
  - `faq.tsx`: Accessible interactive accordion with `aria-expanded` and keyboard navigation answering core policy, QR, and private feedback questions.
  - `cta-banner.tsx`: High-impact conversion banner before the footer with primary `/signup` CTA and trust points.
  - `footer.tsx`: Semantic `<footer>` with brand wordmark, grouped navigation links, design system link, Google anti-gating compliance notice, and copyright.
- **Routes Created / Updated**:
  - `/`: Assembled public marketing landing page with skip link, navbar, all 7 sections, and footer.
  - `/login`: Intentional placeholder explaining passwordless email OTP authentication launches in Phase 4, with links back to Home and Design System.
  - `/signup`: Intentional placeholder explaining owner onboarding and email OTP launches in Phase 4, with links back to Home and Design System.
  - `/design-system`: Preserved and verified 100% operational.
- **UI Enhancements**:
  - Enhanced `src/components/ui/button.tsx` with Radix `Slot` (`asChild` prop) and direct child rendering when `asChild` is true.
- **Tests Created / Updated**:
  - `tests/unit/marketing/navbar.test.tsx`: Desktop links, mobile drawer toggle, Escape key listener.
  - `tests/unit/marketing/faq.test.tsx`: Questions rendering, default expansion, click toggle accordion interaction.
  - `tests/unit/marketing/auth-placeholders.test.tsx`: Login and Signup placeholder cards and navigation links.
  - `tests/unit/components/button.test.tsx`: Added `asChild` rendering test.
  - `tests/unit/page.test.tsx`: Full landing page render, headings, CTAs, and footer links.
- **Verification Commands Executed**:
  - `npm run lint`: **0 errors, 0 warnings**
  - `npm run typecheck`: **0 errors**
  - `npm run test -- --run`: **52/52 tests passed** across 16 test suites
  - `npm run build`: **Compiled successfully** in 709ms (all 7 routes statically prerendered)

---

## 📌 Phase 2 Completion Details

- **Date Completed**: 2026-10-24
- **Packages Added**:
  - `@radix-ui/react-dialog`: `^1.1.6` (accessible modal primitive with focus trapping and ESC handling)
  - `sonner`: `^2.0.7` (accessible toast notifications with ARIA live regions)
- **Artifacts Created / Updated**:
  - `src/components/ui/button.tsx`: Button primitive with 6 variants, 4 sizes, loading spinner, and icon slots.
  - `src/components/ui/input.tsx`: Input with label, error association (`aria-describedby`), helperText, and icons.
  - `src/components/ui/textarea.tsx`: Multi-line text field with character count tracking and error associations.
  - `src/components/ui/select.tsx`: Native select wrapped in accessible custom styled chevron container.
  - `src/components/ui/badge.tsx`: Semantic status badges with optional dot indicator.
  - `src/components/ui/card.tsx`: Composable card container with Header, Title, Description, Content, Footer.
  - `src/components/ui/dialog.tsx`: Accessible modal dialog with focus restoration and backdrop handling.
  - `src/components/ui/toast.tsx`: Toast container (`Toaster`) and programmatic API (`toast.success/error/info/warning`).
  - `src/components/ui/skeleton.tsx`: Loading placeholder with pulse and reduced-motion support.
  - `src/components/effects/glow-card.tsx`: ReactBits-inspired mouse-follow radial highlight card.
  - `src/app/design-system/page.tsx`: Interactive component showcase route at `/design-system`.
  - `src/app/globals.css`: Eliminated recursive `--font-sans` reference, refined color tokens, component heights, focus rings.
  - `src/app/layout.tsx`: Configured `--font-inter` and injected `<Toaster />`.
  - `tests/unit/components/`: 9 new test suites covering all primitives (**39/39 tests passing**).
  - Documentation: Updated `DESIGN_SYSTEM.md` and `PROGRESS.md`.
- **Verification Commands Executed**:
  - `npm run lint`: **0 errors, 0 warnings**
  - `npm run typecheck`: **0 errors**
  - `npm run test`: **39/39 tests passed** across 13 test suites
  - `npm run build`: **Compiled successfully** in 678ms (routes `/`, `/_not-found`, `/design-system`)

---

## 📌 Phase 1 Completion Details

- **Date Completed**: 2026-10-24
- **Packages & Versions**:
  - `next`: `16.4.3`
  - `react`: `19.3.0`
  - `tailwindcss`: `^4.0.0`
  - `typescript`: `^5.0.0`
  - `vitest`: `^5.0.5`
  - `lucide-react`: `^1.61.0`
- **Artifacts Created**:
  - `src/lib/config/env.ts`: Strongly typed configuration validator with `NEXT_PUBLIC_API_URL` parsing.
  - `src/lib/api/health.ts`: Backend health probe utility connecting to verified `GET /api/health`.
  - `src/lib/utils.ts`: `cn()` utility combining `clsx` and `tailwind-merge`.
  - `src/app/globals.css`: Global design tokens for colors, font families, shadows, radii, motion easing, and focus rings.
  - `src/app/layout.tsx`: Root layout with `Inter` font injection and responsive viewport tags.
  - `src/app/page.tsx`: Semantic foundation page showing active design tokens and backend connectivity.
  - `scripts/verify-backend.ts`: Standalone CLI connectivity verification tool (`npm run verify:backend`).
  - `.env.example`: Non-secret configuration example.
  - `vitest.config.mts` & `vitest.setup.ts`: Vitest testing baseline.
  - `tests/unit/`: 4 test suites covering env, health probe, utils, and page rendering (11/11 tests passing).

---

## 📌 Phase 12 Completion Details (Customer Billing & Pricing Frontend)

- **Date Completed**: 2026-10-26
- **Strict Scope Honored**: Customer-facing pricing and billing only. Zero Super Admin portal or admin-only controls created. No modifications to backend codebase.
- **Commercial Plans Implemented**:
  - **Monthly Plan**: ₹99 per month (`9900` paise in INR). 1 calendar month duration. Clearly communicates recurring billing terms.
  - **Five-Month Package**: ₹399 for 5 calendar months (`39900` paise in INR). Clearly identifies as a one-time purchase with zero auto-renewal.
  - **FREE4YOU Promotional Code**: Input form validating `FREE4YOU` and activating lifetime-free access upon server confirmation.
  - **Seven-Day Free Trial**: Server-authoritative trial expiry date and days remaining displayed.
- **Artifacts Created / Updated**:
  - `src/lib/billing-plans.ts`: Centralized commercial plan definitions and terms.
  - `src/lib/razorpay.ts`: Safe Razorpay SDK loader, modal launcher, and failure handling.
  - `src/lib/api/billing.ts`: Client methods for `listBillingPlans`, `getSubscription`, `createCheckout`, `verifyPayment`, `redeemPromoCode`, `cancelSubscription`, `getPaymentHistory`.
  - `src/lib/api/types.ts`: Strongly typed billing contracts matching actual backend schemas.
  - `src/app/pricing/page.tsx`: Dedicated responsive public pricing page at `/pricing`.
  - `src/components/marketing/pricing.tsx`: Homepage pricing section updated to ₹99 / ₹399 / FREE4YOU terms.
  - `src/components/billing/billing-dashboard.tsx`: Full billing page with plan selection, test mode indicator, and Razorpay modal.
  - `src/components/billing/subscription-status-card.tsx`: Status card rendering trial active/expired, paid active, promo lifetime, and days remaining.
  - `src/components/billing/redeem-promo-card.tsx`: Promo code redemption form.
  - `src/components/billing/checkout-dialog.tsx`: Pre-checkout terms and confirmation dialog.
  - `src/components/billing/payment-history-table.tsx`: Transaction history table with status badges and test mode indicators.
  - `src/components/billing/upgrade-required-banner.tsx`: Non-blocking alert banner for expired trial or subscription.
  - `tests/unit/billing/`: Comprehensive unit tests for plans, checkout, verification, script load failure, cancellation, and promo redemption (**261/261 tests passing across 61 test files**).
- **Verification Commands Executed**:
  - `npm run lint`: **0 errors, 0 warnings**
  - `npm run typecheck`: **0 errors**
  - `npm test`: **261/261 tests passing** across 61 test suites
  - `npm run build`: **Compiled successfully** in Turbopack (17 static & dynamic routes)
