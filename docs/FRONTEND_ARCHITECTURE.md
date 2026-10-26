# Frontend Architecture & Conventions

This document outlines the architectural patterns, folder structure, and conventions for the Review Management SaaS Next.js frontend.

---

## 1. Directory Structure

```
frontend/
├── public/                    # Static public assets (favicons, SVG badges)
├── src/
│   ├── app/                   # Next.js App Router routes & layouts
│   │   ├── (marketing)/       # Public marketing pages (landing, pricing, FAQ)
│   │   ├── (auth)/            # Passwordless OTP signup & login flows
│   │   ├── (dashboard)/       # Authenticated business owner SaaS portal
│   │   ├── feedback/[token]/  # Public customer feedback flow (mobile-first QR scan)
│   │   ├── globals.css        # Tailwind v4 import & central @theme tokens
│   │   └── layout.tsx         # Root layout with font injection & viewport metadata
│   ├── components/
│   │   ├── ui/                # Base primitives (Button, Input, Badge, Card, Modal)
│   │   ├── layout/            # Shell layout components (Sidebar, Navbar, MobileNav)
│   │   └── shared/            # Common shared widgets (EmptyState, ErrorBoundary, MetricCard)
│   ├── lib/
│   │   ├── api/               # Typed API client, health probe, CSRF header injector
│   │   ├── config/            # Environment validation & typed config
│   │   └── utils.ts           # Shared utilities (cn class merger)
│   ├── hooks/                 # Reusable client hooks (auth, countdown, media query)
│   └── types/                 # Domain interfaces mirroring backend contracts
├── tests/
│   └── unit/                  # Vitest + React Testing Library tests
├── docs/                      # Technical documentation
└── scripts/                   # Verification and maintenance scripts
```

---

## 2. Next.js App Router Conventions

### Server Components by Default
- All pages and layout components are **React Server Components (RSC)** by default.
- We introduce `"use client"` only when a component requires browser state (`useState`), event handlers (`onClick`, `onSubmit`), lifecycle effects (`useEffect`), or browser APIs.
- Data fetching occurs in Server Components where practical, reducing JavaScript sent to the client.

### Route Groups
- Route groups such as `(marketing)`, `(auth)`, and `(dashboard)` allow distinct visual layouts (e.g. public header vs. dashboard sidebar) without polluting or altering the public URL structure.

---

## 3. Session Security & Cookie Handling

- **No Tokens in Storage**: The frontend never stores authentication tokens in `localStorage` or `sessionStorage` (preventing XSS credential extraction).
- **HTTP-Only Cookies**: Authentication is maintained exclusively through the server's `session` cookie via `credentials: 'include'`.
- **Double-Submit CSRF Protection**: For state-changing requests (`POST`, `PUT`, `PATCH`, `DELETE`), the frontend reads the document cookie `csrf_token` and injects it into the `X-CSRF-Token` header.

---

## 4. Authenticated Owner Application Shell Architecture

The Phase 5 Owner Shell is organized under `src/components/dashboard/` and loaded via the route layout `src/app/dashboard/layout.tsx`:

### Key Shell Components
- **`DashboardLayout` (`src/components/dashboard/dashboard-layout.tsx`)**:
  - Top-level client container coordinating desktop sidebar, responsive app header, mobile drawer state, and the `<main id="dashboard-main">` landmark.
- **`AppSidebar` (`src/components/dashboard/app-sidebar.tsx`)**:
  - Desktop-only persistent sidebar (hidden on screens `< lg`).
  - Displays ReviewFlow brand identity, active business identity card, active route indicator (`aria-current="page"`), upcoming phase tags (`aria-disabled="true"`), and account logout action.
- **`AppHeader` (`src/components/dashboard/app-header.tsx`)**:
  - Sticky top bar featuring the mobile drawer trigger button, hierarchical breadcrumbs (`ReviewFlow / Overview`), Google review URL setup badge, and `UserMenu`.
- **`MobileNavigation` (`src/components/dashboard/mobile-navigation.tsx`)**:
  - Accessible modal drawer dialog (`role="dialog"`, `aria-modal="true"`) for viewport widths down to 320px with zero horizontal scroll.
  - Automatically handles backdrop clicks, Escape key dismissal, body scroll locking, and closes immediately on link navigation.
- **`UserMenu` (`src/components/dashboard/user-menu.tsx`)**:
  - Accessible interactive dropdown menu showing owner initials, account email, business name, links to public marketing and design system, and CSRF-protected server logout.
- **`navigation-items.ts` (`src/components/dashboard/navigation-items.ts`)**:
  - Centralized nav items definition for all 8 product areas (Overview & QR Campaigns live, all deferred areas clearly tagged with Phase badges and disabled state).

---

## 5. QR Campaign Architecture & Multi-Format Generation (Phase 6)

The QR Campaign module is organized under `src/components/campaigns/` and routed under `src/app/dashboard/campaigns/`:

### App Router Routes
- **`/dashboard/campaigns` (`src/app/dashboard/campaigns/page.tsx`)**:
  - Main campaign directory displaying paginated campaigns, status filters, search input, and empty state.
- **`/dashboard/campaigns/new` (`src/app/dashboard/campaigns/new/page.tsx`)**:
  - Dedicated creation page rendering `CampaignForm` with live touchpoint preview.
- **`/dashboard/campaigns/[id]` (`src/app/dashboard/campaigns/[id]/page.tsx`)**:
  - Dynamic route rendering verified QR code preview (`QrPreview`), metadata summary, placement guidelines, and multi-format download triggers.

### Key Components
- **`CampaignList` (`src/components/campaigns/campaign-list.tsx`)**:
  - Handles client-side search, status filtering (`all`, `active`, `inactive`), pagination, skeleton states, and deactivation.
- **`CampaignCard` (`src/components/campaigns/campaign-card.tsx`)**:
  - Presentational card showing verified scan count, status badge, formatted creation date, color swatch, and quick download triggers.
- **`CampaignForm` (`src/components/campaigns/campaign-form.tsx`)**:
  - Client-side validation enforcing backend constraints (title 2-100, heading 2-120, description max 250, hex color regex).
  - 6 color presets with live touchpoint preview card.
- **`QrPreview` (`src/components/campaigns/qr-preview.tsx`)**:
  - Authoritative QR preview fetching server-generated SVG via `apiFetchBlob`.
  - Converts Blob into a safe Object URL rendered in a standard `<img>` element with aspect ratio preserved, quiet zone padding, and auto-cleanup.
- **`QrDownloadActions` (`src/components/campaigns/qr-download-actions.tsx`)**:
  - Multi-format download actions for PNG (600px), SVG (vector), and PDF (A4 sheet).
  - Triggers browser downloads with sanitized filenames (`qr-<slug>.<format>`) and object URL revocation.

---

## 6. Owner Feedback Inbox Architecture (Phase 8)

The owner feedback inbox module is located under `src/components/inbox/` and routed under `src/app/dashboard/feedback/`:

### App Router Route
- **`/dashboard/feedback` (`src/app/dashboard/feedback/page.tsx`)**:
  - Owner-facing inbox route with authenticated session guard and responsive layout shell.
  - Activates the "Customer Feedback" navigation link in desktop sidebar and mobile navigation.

### Key Components
- **`FeedbackInbox` (`src/components/inbox/feedback-inbox.tsx`)**:
  - Primary inbox controller managing query state (page, rating, status, sort order), real-time client search filter, drawer selection, and KPI totals.
  - Prevents fabricated metrics: displays exact verified submission totals from backend metadata (`meta.total`) and truthful count of submissions awaiting review on the active page.
- **`FeedbackTable` (`src/components/inbox/feedback-table.tsx`)**:
  - Dual responsive presentation: structured, accessible HTML `<table>` for desktop (`sm:` and above) and responsive, high-density card list for mobile devices.
  - Integrates accessible pagination controls (`Previous`, page indicators, `Next`) that preserve active filter state.
- **`FeedbackFilters` (`src/components/inbox/feedback-filters.tsx`)**:
  - Search input (filtering across customer name, email, and feedback comments).
  - Star rating filter (`1` to `5` stars).
  - Status filter (`new`, `reviewed`, `resolved`).
  - Sort order control (`newest`, `oldest`, `highest_rating`, `lowest_rating`).
  - Active filter count indicator with one-click `Reset Filters` action.
- **`FeedbackDetailDrawer` (`src/components/inbox/feedback-detail-drawer.tsx`)**:
  - Accessible modal dialog (`role="dialog"`, `aria-labelledby`) displaying full customer feedback record.
  - Shows customer name, contact details, submission timestamp, star rating, origin campaign touchpoint, safe text comments, and custom business question answers.
  - Allows the owner to transition feedback lifecycle status (`Mark as Reviewed`, `Mark as Resolved`, `Re-open`) using the verified `PATCH /api/v1/feedback/:id/status` endpoint.
- **`FeedbackStatusBadge` (`src/components/inbox/feedback-status-badge.tsx`)**:
  - Color-coded accessible status badge for `'new'` (sky/blue), `'reviewed'` (amber/yellow), and `'resolved'` (emerald/green).
- **`FeedbackEmptyState` (`src/components/inbox/feedback-empty-state.tsx`)**:
  - Truthful zero-state display: when no feedback has ever been submitted, invites owner to share QR touchpoint cards. When filters yield zero results, provides a direct reset action.

### Security, Isolation, & Anti-Gating Protections
- **Zero Client-Supplied Tenant Scope**: Feedback retrieval is scoped exclusively by the backend session (`req.user.businessId`).
- **No HTML Injection**: Customer-authored feedback text and question responses are rendered strictly as text nodes in React, completely avoiding `dangerouslySetInnerHTML`.
- **Privacy Enforcement**: Customer phone numbers and emails are rendered exclusively inside authenticated owner views and never placed in URL query strings.

---

## 7. Owner Analytics & Reporting Architecture (Phase 9)

The owner analytics module is located under `src/components/analytics/` and routed under `src/app/dashboard/analytics/`:

### App Router Route
- **`/dashboard/analytics` (`src/app/dashboard/analytics/page.tsx`)**:
  - Owner-facing analytics route protected by session authentication.
  - Activates the "Analytics" navigation link in desktop sidebar and mobile navigation.

### Key Components
- **`AnalyticsDashboard` (`src/components/analytics/analytics-dashboard.tsx`)**:
  - Top-level analytics orchestrator coordinating reporting period selection (`7d`, `30d`, `90d`), concurrent API requests via `Promise.all`, skeleton loading states, error recovery, and manual refresh.
- **`AnalyticsDateSelector` (`src/components/analytics/analytics-date-selector.tsx`)**:
  - Accessible toggle group allowing the owner to switch between 7, 30, and 90 days with formatted UTC calendar bounds.
- **`AnalyticsKpiCards` (`src/components/analytics/analytics-kpi-cards.tsx`)**:
  - Displays 4 authentic metric cards: Period Scans (with all-time counter), Feedback Submissions (with lifecycle breakdown), Average Rating (with total ratings count), and Google Review Taps.
  - Explicit semantic disclaimers prevent conflating raw touchpoint events with unique visitors or verified published reviews on Google.
- **`AnalyticsTrendChart` (`src/components/analytics/analytics-trend-chart.tsx`)**:
  - Responsive, accessible zero-dependency SVG visualization rendering daily time-series curves for scans, feedback, and review link taps.
  - Features zero-event day support, interactive hover inspection, accessible `<title>`/`<desc>`, and a full screen-reader-accessible table fallback mode (`View as Table`).
- **`AnalyticsRatingDistribution` (`src/components/analytics/analytics-rating-distribution.tsx`)**:
  - Visual breakdown of customer ratings from 5 stars down to 1 star with percentage bars (`role="progressbar"`), counts, overall average score, and truthful empty states when no ratings exist.
- **`AnalyticsCampaignTable` (`src/components/analytics/analytics-campaign-table.tsx`)**:
  - Touchpoint performance comparison displaying campaign title, active status badge, period scans, feedback count, feedback conversion rate, and external review taps across desktop table and mobile cards.

---

## Phase 10 — AI-Assisted Feedback Editing Studio Architecture

### App Router Route
- **`/dashboard/ai-studio` (`src/app/dashboard/ai-studio/page.tsx`)**:
  - Owner-facing editing studio route protected by session authentication.
  - Activates the "AI Assistant" navigation item in the desktop sidebar and mobile navigation.

### Key Components
- **`AiStudioContainer` (`src/components/ai-studio/ai-studio-container.tsx`)**:
  - Top-level layout with page header, ethical boundaries banner, and main workspace.
- **`AiDisclaimerBanner` (`src/components/ai-studio/ai-disclaimer-banner.tsx`)**:
  - Clearly explains the ethical constraints: facts and sentiment are strictly preserved, AI never invents reviews, and human review is mandatory before using text.
- **`AiActionSelector` (`src/components/ai-studio/ai-action-selector.tsx`)**:
  - Accessible radiogroup allowing the owner to select between 4 supported editing actions: Fix Grammar, Improve Clarity, Make Concise, and Professional Tone.
- **`AiStudioWorkspace` (`src/components/ai-studio/ai-studio-workspace.tsx`)**:
  - Side-by-side (desktop `lg:grid-cols-2`) and stacked (mobile) comparison workspace.
  - Left panel: Original text editor with character counter (10-2,000 bounds), quick sample test buttons, action picker, and Generate Revision action with loading spinner.
  - Right panel: AI proposed revision editor with manual correction capability, status badge, word count comparison, outdated warning when source draft changes, copy to clipboard with toast confirmation, explicit accept action, discard action, and regenerate.

---

## Phase 11 — Business Settings & Profile Management Architecture

### App Router Route
- **`/dashboard/settings` (`src/app/dashboard/settings/page.tsx`)**:
  - Owner-facing settings route protected by session authentication.
  - Activates the "Settings" navigation link in desktop sidebar and mobile navigation.

### Key Components
- **`SettingsContainer` (`src/components/settings/settings-container.tsx`)**:
  - Top-level settings orchestrator coordinating parallel data loading (`GET /business`, `GET /business/settings`), tabbed section switching, session context synchronization via `useAuth().setSession`, loading skeletons, and error retry state.
- **`BusinessProfileForm` (`src/components/settings/business-profile-form.tsx`)**:
  - Form managing business name (2-120 chars), category (2-80 chars) with preset chips, immutable tenant ID badge, and account status indicator.
- **`GoogleReviewForm` (`src/components/settings/google-review-form.tsx`)**:
  - Form managing Google Review URL with protocol validation, live "Test Link" external opener, strict anti-gating compliance banner, and campaign inheritance notes.
- **`BrandingSettingsForm` (`src/components/settings/branding-settings-form.tsx`)**:
  - Form managing primary and secondary hex colors with preset palette buttons, live touchpoint preview card, and hex regex validation.
- **`NotificationSettingsForm` (`src/components/settings/notification-settings-form.tsx`)**:
  - Form managing feedback alert email, public reviews link-out toggle, default customer touchpoint heading, and subheading copy.
- **`AccountInfoSection` (`src/components/settings/account-info-section.tsx`)**:
  - Read-only account overview displaying verified owner email, role badge, passwordless OTP security explanation, and session logout trigger.

