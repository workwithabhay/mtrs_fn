/**
 * Commercial plan metadata and terms for ReviewFlow pricing and billing.
 * Centralized to prevent duplicated pricing constants across components.
 */

export interface CommercialPlanDefinition {
  planId: string;
  name: string;
  pricePaise: number;
  formattedPrice: string;
  billingCadence: string;
  durationLabel: string;
  termDescription: string;
  isRecurring: boolean;
  features: string[];
  isPopular?: boolean;
}

export const COMMERCIAL_PLANS: Record<'monthly' | 'five_month', CommercialPlanDefinition> = {
  monthly: {
    planId: 'monthly',
    name: 'Monthly Plan',
    pricePaise: 9900,
    formattedPrice: '₹99',
    billingCadence: 'per month',
    durationLabel: '1 Calendar Month',
    termDescription:
      '₹99 per month. Access lasts for 1 calendar month from verified payment. Renewal terms are confirmed before checkout.',
    isRecurring: true,
    features: [
      'Multi-format QR code generator (PNG & SVG)',
      'Smart review routing to Google Reviews',
      'Private feedback inbox for internal resolution',
      'Customer visit history & repeat customer insights',
      'Full rating analytics and trend breakdowns',
      'AI Feedback Studio for customer reviews',
    ],
    isPopular: false,
  },
  five_month: {
    planId: 'five_month',
    name: 'Five-Month Package',
    pricePaise: 39900,
    formattedPrice: '₹399',
    billingCadence: 'for 5 calendar months',
    durationLabel: '5 Calendar Months',
    termDescription:
      '₹399 one-time payment. Non-recurring; does not auto-renew. Access lasts for five full calendar months after verified payment.',
    isRecurring: false,
    features: [
      'All features included with ReviewFlow',
      'Full 5 calendar months of uninterrupted access',
      'One-time purchase (zero unexpected auto-charges)',
      'Data, QR campaigns, and feedback history preserved',
      'Complete sentiment tracking and analytics exports',
    ],
    isPopular: true,
  },
};

export const PROMO_CODE_DETAILS = {
  code: 'FREE4YOU',
  label: 'FREE4YOU Promotion',
  description:
    'Provides lifetime-free access while the promotion remains active. Access is unlocked only after the backend confirms successful redemption for your account.',
};

export const TRIAL_DETAILS = {
  durationDays: 7,
  label: '7-Day Free Trial',
  description:
    'New business accounts receive 7 days of full platform access with no credit card required. Official trial expiry is determined by the server.',
};
