# Backend API Integration Guide

This document records the verified backend contracts, health probe endpoint, and communication protocols.

---

## 1. Verified Endpoints

| Resource | Verified Backend Path | Frontend Usage |
| :--- | :--- | :--- |
| **Liveness Health Probe** | `GET /api/health` | Used by `src/lib/api/health.ts` and `verify:backend` script |
| **Readiness Health Probe** | `GET /api/ready` | Verifies MongoDB readiness |
| **Authentication Base** | `/api/v1/auth/*` | OTP signup, OTP login, sessions, CSRF |
| **Business Management** | `/api/v1/business/*` | Owner profile and settings |
| **QR Campaigns** | `/api/v1/qr-campaigns/*` | Campaign CRUD and PNG/SVG/PDF exports |
| **Public Customer Feedback** | `/api/v1/public/*` | QR landing, scan recording, feedback submission |
| **Internal Feedbacks** | `/api/v1/feedback/*` | Feedback list, sentiment filtering, AI assist |
| **Customer Directory** | `GET /api/v1/feedback/customers` | Directory list, customer stats, repeat patron analysis |
| **Dashboard Metrics** | `/api/v1/dashboard/*` | Real aggregates and trend series |
| **Billing & Subscriptions** | `/api/v1/billing/*` | Plan catalog, subscription checkout/cancel, payment history |

---

## 2. Health Check Probe

The backend health probe is located at `/api/health` (mounted via `rootRouter.use('/api', healthRouter)` in the backend).

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-10-24T12:00:00.000Z",
    "uptimeSeconds": 42,
    "environment": "development"
  },
  "meta": { "version": "0.1.0" }
}
```

To run the frontend connectivity verification probe:
```bash
npm run verify:backend
```

---

## 3. Verified Authentication & Session Contracts (Phase 4)

### A. Signup OTP Request
- **Endpoint**: `POST /api/v1/auth/signup/request-otp`
- **Rate Limit**: 10 requests / 15 minutes
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "businessName": "Jane Bakery",
    "category": "Restaurant & Dining",
    "googleReviewUrl": "https://g.page/r/...", // optional or empty string
    "consentAccepted": true
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Verification code has been sent to your email address.",
      "cooldownSeconds": 60
    }
  }
  ```
- **Error Codes**: `VALIDATION_ERROR` (400), `CONFLICT` (409 if verified account exists), `RATE_LIMIT_EXCEEDED` (429), `EMAIL_DELIVERY_FAILED` (500).

### B. Signup OTP Verification
- **Endpoint**: `POST /api/v1/auth/signup/verify-otp`
- **Rate Limit**: 15 requests / 15 minutes
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "otp": "123456"
  }
  ```
- **Success Response (201 Created)**:
  - Sets HTTP-only `session` cookie (`maxAge: 7 days, httpOnly: true, sameSite: lax, path: '/'`).
  - Sets JavaScript-readable `csrf_token` cookie (`httpOnly: false, sameSite: lax, path: '/'`).
  - Response payload:
    ```json
    {
      "success": true,
      "data": {
        "user": { "_id": "...", "name": "...", "email": "...", "role": "business_owner" },
        "business": { "_id": "...", "name": "...", "category": "..." }
      }
    }
    ```

### C. Login OTP Request
- **Endpoint**: `POST /api/v1/auth/login/request-otp`
- **Rate Limit**: 10 requests / 15 minutes
- **Account Enumeration Defense**: Returns a generic message regardless of whether the account exists.
- **Request Body**:
  ```json
  {
    "email": "owner@example.com"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "If an active account is registered with this email, a verification code has been sent.",
      "cooldownSeconds": 60
    }
  }
  ```

### D. Login OTP Verification
- **Endpoint**: `POST /api/v1/auth/login/verify-otp`
- **Request Body**:
  ```json
  {
    "email": "owner@example.com",
    "otp": "654321"
  }
  ```
- **Success Response (200 OK)**:
  - Sets HTTP-only `session` cookie and readable `csrf_token` cookie.
  - Returns `{ success: true, data: { user, business } }`.

### E. Authenticated Profile & Session Check
- **Endpoint**: `GET /api/v1/auth/me`
- **Credentials**: `credentials: 'include'`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user": { "name": "...", "email": "...", "role": "business_owner" },
      "business": { "name": "...", "category": "..." }
    }
  }
  ```
- **Unauthorized (401)**: Returns `UNAUTHORIZED` if no session cookie or expired. Frontend interprets as unauthenticated without throwing uncaught errors.

### F. Session Revocation (Logout)
- **Endpoint**: `POST /api/v1/auth/logout`
- **Credentials**: `credentials: 'include'`
- **CSRF Protection**: If state-changing and session cookie present, frontend attaches `x-csrf-token` header matching `csrf_token` cookie value.
- **Response**: Clears `session` and `csrf_token` cookies on server and client.

---

## 4. Verified QR Campaign & Multi-Format Generator Contracts (Phase 6)

### A. List Campaigns
- **Endpoint**: `GET /api/v1/qr-campaigns`
- **Query Parameters**:
  - `page`: positive integer (default `1`)
  - `limit`: positive integer between 1 and 50 (default `10`)
  - `status`: optional `'active' | 'inactive'`
- **Authorization**: Session cookie with `role: 'business_owner'`. Tenant-scoped to authenticated `req.user.businessId`.
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "65f123456789abcdef012345",
        "businessId": "65f111111111abcdef000001",
        "title": "Front Counter Stand",
        "heading": "How was your coffee today?",
        "description": "Scan to share direct feedback or leave a Google review",
        "branding": {
          "primaryColor": "#2563EB",
          "backgroundColor": "#FFFFFF",
          "logoKey": null,
          "logoUrl": null
        },
        "status": "active",
        "publicToken": "a1b2c3d4e5f6789012345678",
        "scanCount": 14,
        "createdAt": "2026-10-24T10:00:00.000Z",
        "updatedAt": "2026-10-24T10:00:00.000Z"
      }
    ],
    "meta": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
  ```

### B. Create Campaign
- **Endpoint**: `POST /api/v1/qr-campaigns`
- **Headers**: `Content-Type: application/json` or `multipart/form-data`, `x-csrf-token: <csrf_token>`
- **Validation Constraints**:
  - `title`: required, string, trimmed, 2-100 characters
  - `heading`: required, string, trimmed, 2-120 characters
  - `description`: optional, string, trimmed, max 250 characters
  - `branding.primaryColor`: optional hex code matching `/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/` (default `#2563EB`)
  - `branding.backgroundColor`: optional hex code matching `/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/` (default `#FFFFFF`)
- **Success Response (201 Created)**: Returns `{ success: true, data: QrCampaign }` with auto-generated 24-character hexadecimal `publicToken`.

### C. Get Campaign By ID
- **Endpoint**: `GET /api/v1/qr-campaigns/:id`
- **Authorization**: Enforces tenant boundary isolation (Tenant B receives `404 NOT_FOUND` for Tenant A campaigns).
- **Success Response (200 OK)**: Returns `{ success: true, data: QrCampaign }`.

### D. Update Campaign
- **Endpoint**: `PATCH /api/v1/qr-campaigns/:id`
- **Protected Fields**: Rejects mass assignment on `businessId` and `publicToken` with `400 VALIDATION_ERROR`.

### E. Deactivate Campaign
- **Endpoint**: `POST /api/v1/qr-campaigns/:id/deactivate`
- **Effect**: Sets campaign `status = 'inactive'`, preventing further public feedback landing access.

### F. Multi-Format QR Export & Downloads
- **Endpoint**: `GET /api/v1/qr-campaigns/:id/export?format=png|svg|pdf`
- **Supported Formats**:
  1. `format=png`: High-resolution 600px raster image (`Content-Type: image/png`).
  2. `format=svg`: Scalable vector graphic (`Content-Type: image/svg+xml`).
  3. `format=pdf`: Print-ready A4 flyer sheet generated via PDFKit (`Content-Type: application/pdf`).
- **Headers Returned**:
  - `Content-Disposition: attachment; filename="qr-<sanitized-title>.<format>"`
- **Preview Mechanism**: The frontend fetches `format=svg` via `apiFetchBlob`, converts the Blob into a safe Object URL, and renders it inside an standard `<img>` element with aspect ratio preserved and quiet zone padding.
- **Encoded Destination URL**: Built canonically on backend as `${PUBLIC_APP_URL}/qr/${campaign.publicToken}`.

---

## 5. Verified Customer Feedback & Public QR Contracts (Phase 7)

### A. Resolve Public Campaign Landing
- **Endpoint**: `GET /api/v1/public/qr/:token`
- **Authentication**: None (Public customer access, rate-limited by `publicScanLimiter`)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "campaign": {
        "title": "Front Counter",
        "heading": "How was your experience today?",
        "description": "We value your honest feedback",
        "branding": {
          "primaryColor": "#2563EB",
          "backgroundColor": "#FFFFFF",
          "logoUrl": "http://.../logo.png"
        }
      },
      "business": {
        "name": "Artisan Bakery"
      },
      "googleReviewUrl": "https://g.page/r/.../review",
      "feedbackQuestions": [
        {
          "id": "overall_experience",
          "label": "What did you enjoy most about your visit?",
          "type": "text",
          "required": false
        }
      ]
    }
  }
  ```
- **Error Responses**:
  - `404 NOT_FOUND`: Returns `{ error: { code: "NOT_FOUND", message: "QR campaign not found or is currently inactive." } }` if the campaign was deactivated or token is non-existent.

### B. Record Public Scan Event
- **Endpoint**: `POST /api/v1/public/qr/:token/scan`
- **Effect**: Atomically increments `scanCount` on the campaign document and logs a `QrEvent` with metadata.
- **Frontend Protection**: Executed once per token session using `scanRecordedRef` to prevent duplicate counts during StrictMode re-renders.

### C. Submit Customer Feedback
- **Endpoint**: `POST /api/v1/public/qr/:token/feedback`
- **Authentication**: None (Public customer access, rate-limited by `publicFeedbackLimiter`)
- **Headers**: `Content-Type: application/json`
- **Validation Constraints**:
  - `rating`: required integer between 1 and 5.
  - `customerName`: required string, min 2, max 100 characters.
  - `customerEmail`: optional string (must be valid email format if supplied).
  - `customerPhone`: optional string (normalized on server).
  - **Contact Rule**: At least one contact method (`customerEmail` OR `customerPhone`) must be provided.
  - `text`: optional string, max 2000 characters.
  - `answers`: optional array of `{ questionId: string, answer: string }`, validated against active business question definitions.
  - `consentAccepted`: required boolean, must be `true`.
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Thank you for your valuable feedback!",
      "feedbackId": "65f...",
      "googleReviewUrl": "https://g.page/r/.../review"
    }
  }
  ```

### D. Google Review Click Tracking
- **Endpoint**: `POST /api/v1/public/qr/:token/google-review-click`
- **Anti-Gating Policy**: The Google review button is visible and active across ALL ratings (1 through 5 stars). When clicked, the frontend opens the link via `window.open` in a new tab and fires this endpoint in the background to record telemetry without obstructing navigation.

---

## 6. Verified Owner Feedback Inbox Contracts (Phase 8)

### A. List Owner Feedbacks
- **Endpoint**: `GET /api/v1/feedback`
- **Authentication**: Required (`session` HTTP-only cookie, verified `business_owner` role)
- **Tenant Scoping**: Automatically scoped by backend middleware using `req.user.businessId`. Client-supplied `businessId` query parameters are ignored.
- **Query Parameters**:
  - `page`: integer (default: 1)
  - `limit`: integer (default: 10, max: 50)
  - `rating`: integer between 1 and 5 (optional)
  - `status`: `'new' | 'reviewed' | 'resolved'` (optional)
  - `startDate`: ISO 8601 string (optional)
  - `endDate`: ISO 8601 string (optional)
  - `sortBy`: `'createdAt' | 'rating'` (default: `'createdAt'`)
  - `sortOrder`: `'asc' | 'desc'` (default: `'desc'`)
- **Backend Populated Associations**:
  - `customerId`: populated with `{ _id, name, email, phone, lastVisitedAt }`
  - `qrCampaignId`: populated with `{ _id, title, publicToken }`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "671...",
        "businessId": "670...",
        "qrCampaignId": { "_id": "...", "title": "Patio Table 2", "publicToken": "..." },
        "customerId": { "_id": "...", "name": "Marcus Cole", "email": "marcus@example.com", "phone": "+1234567890" },
        "rating": 5,
        "text": "Best dining experience in town!",
        "answers": [
          { "questionId": "q1", "questionLabel": "Seating Comfort", "answer": "Very comfortable" }
        ],
        "status": "new",
        "consentAccepted": true,
        "createdAt": "2026-10-24T16:00:00.000Z",
        "updatedAt": "2026-10-24T16:00:00.000Z"
      }
    ],
    "meta": {
      "total": 42,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
  ```

### B. Feedback Detail Retrieval
- **Endpoint**: `GET /api/v1/feedback/:id`
- **Authentication**: Required (`business_owner`)
- **Tenant Scoping**: Backend enforces `businessId: req.user.businessId, _id: req.params.id`. Attempting to access another business's feedback ID yields `404 NOT_FOUND`.
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "671...",
      "businessId": "670...",
      "qrCampaignId": { "_id": "...", "title": "Bar Counter", "publicToken": "..." },
      "customerId": { "_id": "...", "name": "Jane Doe", "email": "jane@example.com", "phone": "+1..." },
      "rating": 4,
      "text": "Great service, cocktails were wonderful.",
      "answers": [],
      "status": "reviewed",
      "consentAccepted": true,
      "createdAt": "2026-10-24T15:30:00.000Z",
      "updatedAt": "2026-10-24T16:15:00.000Z"
    }
  }
  ```

### C. Update Feedback Lifecycle Status
- **Endpoint**: `PATCH /api/v1/feedback/:id/status`
- **Authentication**: Required (`business_owner`)
- **CSRF Protection**: Requires valid `X-CSRF-Token` header.
- **Request Body**:
  ```json
  {
    "status": "reviewed"
  }
  ```
  *(Permitted values: `'new'`, `'reviewed'`, `'resolved'`)*
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "671...",
      "status": "reviewed",
      "updatedAt": "2026-10-24T16:20:00.000Z"
    }
  }
  ```

### D. Unsupported Endpoints & Known Limitations
- **Full-Text Search**: The backend query schema does not accept a `search` or `query` parameter. Search is performed client-side across loaded customer names, emails, and feedback comments.
- **Internal Notes**: The backend feedback schema currently has no fields or endpoints for internal staff notes. No simulated notes are stored in local state.
- **Feedback Deletion / Archival**: The backend provides no delete or archive routes for feedback.
- **CSV / Spreadsheet Export**: No backend feedback export route exists.

---

## 7. Verified Owner Analytics & Reporting Contracts (Phase 9)

Mounted at `/api/v1/dashboard/*`. All routes require authenticated session with `business_owner` role, rate-limited via `dashboardLimiter`, and strictly scoped to `req.businessId`.

### A. High-Level Analytics Summary
- **Endpoint**: `GET /api/v1/dashboard/summary`
- **Query Parameters**:
  - `range`: `'7d' | '30d' | '90d'` (default: `'30d'`)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "period": {
        "range": "30d",
        "startDate": "2026-09-24T12:00:00.000Z",
        "endDate": "2026-10-24T12:00:00.000Z"
      },
      "feedbacks": {
        "total": 85,
        "periodTotal": 24,
        "newCount": 6,
        "reviewedCount": 14,
        "resolvedCount": 4
      },
      "ratings": {
        "averageRating": 4.75,
        "totalRatings": 20
      },
      "engagement": {
        "totalScansAllTime": 320,
        "periodScans": 98,
        "googleReviewClicks": 42,
        "activeCampaignsCount": 3
      },
      "semanticNotes": {
        "scans": "Raw QR scan events recorded by the platform (not unique visitors).",
        "googleReviewClicks": "Raw clicks on the external Google Review link recorded by the platform (not verified published reviews on Google)."
      }
    }
  }
  ```

### B. Activity Trends Time-Series
- **Endpoint**: `GET /api/v1/dashboard/feedback-trends`
- **Query Parameters**:
  - `range`: `'7d' | '30d' | '90d'` (default: `'30d'`)
- **Zero-Filling Guarantee**: Backend generates zero-filled daily records for every calendar day in the UTC range.
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "period": { "range": "30d", "startDate": "...", "endDate": "..." },
      "trends": [
        {
          "date": "2026-10-21",
          "feedbackCount": 3,
          "averageRating": 4.5,
          "scanCount": 10,
          "googleReviewClicks": 2
        }
      ]
    }
  }
  ```

### C. Ratings Distribution Breakdown
- **Endpoint**: `GET /api/v1/dashboard/ratings-breakdown`
- **Query Parameters**:
  - `range`: `'7d' | '30d' | '90d'` (default: `'30d'`)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "period": { "range": "30d", "startDate": "...", "endDate": "..." },
      "totalRatings": 30,
      "averageRating": 4.67,
      "breakdown": [
        { "star": 1, "count": 1, "percentage": 3.3 },
        { "star": 2, "count": 1, "percentage": 3.3 },
        { "star": 3, "count": 3, "percentage": 10.0 },
        { "star": 4, "count": 7, "percentage": 23.3 },
        { "star": 5, "count": 18, "percentage": 60.0 }
      ]
    }
  }
  ```

### D. Per-Campaign Performance Metrics
- **Endpoint**: `GET /api/v1/dashboard/qr-performance`
- **Query Parameters**:
  - `range`: `'7d' | '30d' | '90d'` (default: `'30d'`)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "period": { "range": "30d", "startDate": "...", "endDate": "..." },
      "campaigns": [
        {
          "campaignId": "671...",
          "title": "Front Counter Display",
          "heading": "How did we do today?",
          "status": "active",
          "publicToken": "tok_123",
          "totalScansAllTime": 120,
          "periodScans": 40,
          "periodFeedbacks": 10,
          "periodGoogleReviewClicks": 8,
          "createdAt": "2026-10-01T10:00:00.000Z"
        }
      ]
    }
  }
  ```

### E. Semantic Distinctions & Known Reporting Boundaries
- **Unique Visitors**: Not tracked by design. Scans are recorded as raw platform touchpoint events (`QrEvent`).
- **Google Reviews**: Clicks represent patron taps on the public review link. ReviewFlow does not claim automatic synchronization or verification of published reviews on Google.
- **Conversion Metric**: Measured as Feedback Submissions divided by Period Scans per touchpoint.

---

## 9. Owner AI Feedback Studio Integration (Phase 10)

### A. Feedback Wording Assistance
- **Endpoint**: `POST /api/v1/feedback/ai-assistance`
- **Authentication**: Mandatory session cookie + CSRF token (`X-CSRF-Token`).
- **Authorization**: Business Owner role scoped to tenant business.
- **Request Body**:
  ```json
  {
    "draftText": "the dessert was recieved late and i was unhappy with the wait staff.",
    "action": "fix_grammar" // 'fix_grammar' | 'improve_clarity' | 'make_concise' | 'professional_tone'
  }
  ```
- **Validation**:
  - `draftText`: String, min 10 characters, max 2000 characters.
  - `action`: Enum `['fix_grammar', 'improve_clarity', 'make_concise', 'professional_tone']` (default: `'fix_grammar'`).
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "originalDraft": "the dessert was recieved late and i was unhappy with the wait staff.",
      "suggestedText": "The dessert was received late and I was unhappy with the wait staff.",
      "mode": "fix_grammar"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Input shorter than 10 or longer than 2000 chars, or invalid action.
  - `401 Unauthorized`: Missing or invalid session cookie.
  - `403 Forbidden`: Invalid or missing CSRF token.
  - `503 Service Unavailable`: AI provider offline, timeout, or invalid output format.

### B. Ethical Boundaries & Content Safeguards
- **Fact & Sentiment Preservation**: The server prompts and provider adapters strictly instruct models to preserve authentic sentiment, criticism, dates, amounts, and facts.
- **Zero Hallucination / Anti-Gating**: Never generates fake customer testimonials, awards, or 5-star ratings.
- **No Automatic Publication or Persistence**: Output is purely assistive; no feedback records in MongoDB are mutated or created automatically.

---

## 10. Business Profile & Settings Integration (Phase 11)

### A. Business Profile Endpoints
- **Get Profile**: `GET /api/v1/business`
  - Authentication: Session cookie required.
  - Authorization: Business Owner role.
  - Returns authenticated `Business` profile scoped to session `businessId` and `ownerId`.
- **Update Profile**: `PATCH /api/v1/business`
  - Authentication: Session cookie + `X-CSRF-Token` header.
  - Supported update fields:
    ```json
    {
      "name": "Artisan Bakery Roastery",
      "category": "Coffee & Roastery",
      "googleReviewUrl": "https://g.page/r/new/review",
      "googlePlaceId": "ChIJN1t_tDeuEmsRUsoyG83frY4",
      "branding": {
        "primaryColor": "#10B981",
        "secondaryColor": "#064E3B"
      }
    }
    ```
  - Validation:
    - `name`: 2 to 120 characters.
    - `category`: 2 to 80 characters.
    - `googleReviewUrl`: Valid HTTP/HTTPS URL or null/empty string.
    - `branding`: Hex colors `#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})`.
    - Disallowed fields (`ownerId`, `status`, `settings`) are strictly rejected.

### B. Business Settings Endpoints
- **Get Settings**: `GET /api/v1/business/settings`
  - Returns `IBusinessSettings` (`defaultLanguage`, `allowPublicReviews`, `notificationEmail`, `headingText`, `subheadingText`, `feedbackQuestions`).
- **Update Settings**: `PATCH /api/v1/business/settings`
  - Authentication: Session cookie + `X-CSRF-Token` header.
  - Supported update fields:
    ```json
    {
      "allowPublicReviews": true,
      "notificationEmail": "alerts@bakery.com",
      "headingText": "How was your experience today?",
      "subheadingText": "Your review helps our staff improve."
    }
    ```
  - Validation:
    - `notificationEmail`: Valid email format or null/empty.
    - `headingText`: Max 120 characters.
    - `subheadingText`: Max 250 characters.
    - `allowPublicReviews`: Boolean.
    - Mass-assignment protection against unauthorized settings injection.

### C. Campaign Inheritance vs. Global Defaults
- **Touchpoint Inheritance**: Settings configured in Business Profile set default values for newly generated touchpoints.
- **Existing Campaigns**: Existing QR campaigns retain their specific branding and question settings unless updated individually in the Campaign Builder.

---

## 11. Verified Billing, Subscriptions & Razorpay Integration (Phase 12)

### A. List Published Plans
- **Endpoint**: `GET /api/v1/billing/plans`
- **Access**: Public rate-limited (100 req / 15 min).
- **Commercial Plans**:
  - `monthly`: ₹99.00 (`9900` paise). 1 calendar month duration. Recurring billing mandate.
  - `five_month`: ₹399.00 (`39900` paise). 5 calendar months duration. One-time purchase, non-recurring.
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "planId": "monthly",
        "name": "Monthly Plan",
        "description": "Flexible monthly subscription",
        "price": 9900,
        "currency": "INR",
        "interval": "monthly",
        "features": ["Unlimited Touchpoints", "Google Review Routing", "AI Feedback Studio"],
        "limits": { "maxCampaigns": 1000, "maxMonthlyScans": 100000, "aiAssistanceEnabled": true }
      },
      {
        "planId": "five_month",
        "name": "Five-Month Package",
        "description": "One-time 5 calendar months purchase",
        "price": 39900,
        "currency": "INR",
        "interval": "five_month",
        "features": ["5 Calendar Months Access", "Non-recurring", "Priority Support"],
        "limits": { "maxCampaigns": 1000, "maxMonthlyScans": 100000, "aiAssistanceEnabled": true }
      }
    ]
  }
  ```

### B. Current Subscription & Entitlement Status
- **Endpoint**: `GET /api/v1/billing/subscription`
- **Authentication**: Session cookie required (`business_owner` role).
- **Entitlement States**:
  - `trial_active`: 7-day trial active (`daysRemaining` > 0).
  - `trial_expired`: 7-day trial ended. Upgrade required.
  - `paid_active`: Paid subscription or 5-month package active.
  - `promo_active`: Permanent lifetime-free access via `FREE4YOU`.
  - `subscription_expired`: Paid period ended. Renewal required.
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "671...",
      "planId": "monthly",
      "planName": "Monthly Plan",
      "status": "active",
      "entitlementStatus": "paid_active",
      "canAccessProduct": true,
      "entitlementSource": "paid_subscription",
      "billingInterval": "monthly",
      "priceSnapshot": { "amount": 9900, "currency": "INR" },
      "currentPeriodStart": "2026-10-20T00:00:00.000Z",
      "currentPeriodEnd": "2026-11-20T00:00:00.000Z",
      "trialEndsAt": null,
      "daysRemaining": 30,
      "isLifetime": false,
      "cancelAtPeriodEnd": false,
      "features": ["Unlimited Touchpoints", "Google Review Routing"],
      "limits": { "maxCampaigns": 1000, "maxMonthlyScans": 100000, "aiAssistanceEnabled": true }
    }
  }
  ```

### C. Create Checkout Order
- **Endpoint**: `POST /api/v1/billing/subscription/checkout`
- **Authentication**: Session cookie + `X-CSRF-Token` header.
- **Request Body**:
  ```json
  {
    "planId": "monthly", // 'monthly' | 'five_month'
    "interval": "monthly" // optional
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "checkoutId": "order_rzp_123",
      "provider": "razorpay",
      "isSimulated": false,
      "status": "initiated",
      "amount": 9900,
      "currency": "INR",
      "planId": "monthly",
      "keyId": "rzp_test_..."
    }
  }
  ```

### D. Verify Razorpay Payment Signature
- **Endpoint**: `POST /api/v1/billing/verify-payment`
- **Authentication**: Session cookie + `X-CSRF-Token` header.
- **Request Body**:
  ```json
  {
    "orderId": "order_rzp_123",
    "paymentId": "pay_rzp_456",
    "signature": "hmac_sha256_signature..."
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "verified": true,
      "checkoutId": "order_rzp_123",
      "paymentReference": "pay_rzp_456",
      "status": "succeeded",
      "isSimulated": false,
      "amount": 9900,
      "currency": "INR",
      "message": "Payment verified successfully and paid access activated."
    }
  }
  ```

### E. Redeem FREE4YOU Promotional Code
- **Endpoint**: `POST /api/v1/billing/redeem-promo`
- **Authentication**: Session cookie + `X-CSRF-Token` header.
- **Request Body**:
  ```json
  {
    "code": "FREE4YOU"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "success": true,
      "code": "FREE4YOU",
      "isLifetime": true,
      "message": "Promotional code FREE4YOU redeemed successfully! Lifetime-free access granted."
    }
  }
  ```

### F. Payment History & Transactions
- **Endpoint**: `GET /api/v1/billing/payment-history?page=1&limit=10`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "pay_evt_1",
          "provider": "razorpay",
          "isSimulated": false,
          "eventType": "payment.succeeded",
          "status": "success",
          "amount": 9900,
          "currency": "INR",
          "checkoutId": "order_rzp_123",
          "paymentReference": "pay_rzp_456",
          "failureReason": null,
          "createdAt": "2026-10-20T10:00:00.000Z"
        }
      ],
      "pagination": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
    }
  }
  ```

