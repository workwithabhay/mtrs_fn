'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, Mail, RefreshCw, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { requestSignupOtp, verifySignupOtp } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const CATEGORY_PRESETS = [
  'Restaurant & Dining',
  'Healthcare & Dental Clinic',
  'Retail Store & Boutique',
  'Salon, Spa & Wellness',
  'Automotive & Service Center',
  'Professional & Legal Services',
  'Hospitality & Hotel',
  'Fitness & Gym',
  'Other Local Business',
];

interface FormErrors {
  name?: string;
  email?: string;
  businessName?: string;
  category?: string;
  googleReviewUrl?: string;
  consentAccepted?: string;
  otp?: string;
  form?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { setSession, isAuthenticated } = useAuth();

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Step 1: Form state
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [businessName, setBusinessName] = React.useState('');
  const [category, setCategory] = React.useState(CATEGORY_PRESETS[0]);
  const [customCategory, setCustomCategory] = React.useState('');
  const [googleReviewUrl, setGoogleReviewUrl] = React.useState('');
  const [consentAccepted, setConsentAccepted] = React.useState(false);

  // Step 2: OTP state
  const [step, setStep] = React.useState<'form' | 'otp'>('form');
  const [otp, setOtp] = React.useState('');
  const [cooldown, setCooldown] = React.useState(0);

  // Status and errors
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = React.useState('');

  // Cooldown countdown timer
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const effectiveCategory = category === 'Other Local Business' && customCategory.trim()
    ? customCategory.trim()
    : category;

  // Client-side validation matching backend schema
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (name.trim().length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    } else if (businessName.trim().length < 2) {
      newErrors.businessName = 'Business name must be at least 2 characters';
    } else if (businessName.trim().length > 120) {
      newErrors.businessName = 'Business name cannot exceed 120 characters';
    }

    if (category === 'Other Local Business' && !customCategory.trim()) {
      newErrors.category = 'Please enter your business category';
    } else if (!effectiveCategory || effectiveCategory.length < 2) {
      newErrors.category = 'Category must be at least 2 characters';
    }

    if (googleReviewUrl.trim()) {
      try {
        const parsed = new URL(googleReviewUrl.trim());
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          newErrors.googleReviewUrl = 'Google review URL must start with http:// or https://';
        }
      } catch {
        newErrors.googleReviewUrl = 'Please enter a valid URL';
      }
    }

    if (!consentAccepted) {
      newErrors.consentAccepted = 'You must accept the terms of service and review policy to register';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await requestSignupOtp({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        businessName: businessName.trim(),
        category: effectiveCategory,
        googleReviewUrl: googleReviewUrl.trim() || undefined,
        consentAccepted: true,
      });

      setSuccessMessage(response.message || 'Verification code sent to your email.');
      setCooldown(response.cooldownSeconds || 60);
      setStep('otp');
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.details && err.details.length > 0) {
          const fieldErrors: FormErrors = {};
          err.details.forEach((d) => {
            if (d.field) {
              fieldErrors[d.field as keyof FormErrors] = d.message;
            }
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ form: err.message });
        }
      } else {
        setErrors({ form: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || isLoading) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await requestSignupOtp({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        businessName: businessName.trim(),
        category: effectiveCategory,
        googleReviewUrl: googleReviewUrl.trim() || undefined,
        consentAccepted: true,
      });

      setSuccessMessage('A fresh verification code has been dispatched.');
      setCooldown(response.cooldownSeconds || 60);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrors({ form: err.message });
      } else {
        setErrors({ form: 'Failed to resend code. Please try again shortly.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const cleanOtp = otp.trim();
    if (!cleanOtp) {
      setErrors({ otp: 'Please enter the 6-digit verification code' });
      return;
    }

    if (!/^\d{6}$/.test(cleanOtp)) {
      setErrors({ otp: 'Code must be exactly 6 digits' });
      return;
    }

    setIsLoading(true);

    try {
      const sessionData = await verifySignupOtp({
        email: email.trim().toLowerCase(),
        otp: cleanOtp,
      });

      setSession(sessionData);
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrors({ otp: err.message });
      } else {
        setErrors({ form: 'Verification failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-brand-background px-4 py-12 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Brand Wordmark */}
      <div className="mb-6 flex items-center gap-2.5">
        <Link href="/" className="flex items-center gap-2.5 focus-ring rounded-lg">
          <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-white font-bold shadow-subtle">
            R
          </div>
          <span className="font-extrabold text-xl tracking-tight text-brand-text-primary">
            ReviewFlow
          </span>
        </Link>
      </div>

      <Card className="max-w-lg w-full shadow-elevated border-brand-border">
        {step === 'form' ? (
          <>
            <CardHeader className="text-center space-y-2 pb-4">
              <div className="mx-auto w-10 h-10 rounded-xl bg-indigo-50 text-brand-primary flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Create Your Business Account
              </CardTitle>
              <CardDescription>
                Collect customer feedback, print QR codes, and grow authentic Google reviews.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              {errors.form && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-brand-error leading-relaxed"
                >
                  {errors.form}
                </div>
              )}

              <form onSubmit={handleRequestOtp} className="space-y-4" noValidate>
                {/* Full Name */}
                <Input
                  label="Owner / Manager Full Name"
                  id="signup-name"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  disabled={isLoading}
                  required
                />

                {/* Email Address */}
                <Input
                  label="Email Address (Used for Passwordless Login)"
                  id="signup-email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  disabled={isLoading}
                  required
                  helperText="We will send a 6-digit verification code to this address."
                />

                {/* Business Name */}
                <Input
                  label="Business Name"
                  id="signup-business-name"
                  placeholder="e.g. Bluefin Bistro"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  error={errors.businessName}
                  disabled={isLoading}
                  required
                />

                {/* Business Category */}
                <div className="space-y-1.5">
                  <label htmlFor="signup-category" className="block text-xs font-semibold text-brand-text-primary">
                    Business Category <span className="text-brand-error">*</span>
                  </label>
                  <select
                    id="signup-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isLoading}
                    className="w-full h-10 px-3.5 rounded-xl border border-brand-border bg-brand-surface text-brand-text-primary text-sm focus-ring"
                  >
                    {CATEGORY_PRESETS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {category === 'Other Local Business' && (
                    <div className="pt-2">
                      <Input
                        label="Specify Custom Category"
                        id="signup-custom-category"
                        placeholder="e.g. Pet Grooming Studio"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        error={errors.category}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  )}
                  {errors.category && category !== 'Other Local Business' && (
                    <p className="text-xs text-brand-error">{errors.category}</p>
                  )}
                </div>

                {/* Google Review URL (Optional) */}
                <Input
                  label="Google Business Profile Review URL (Optional)"
                  id="signup-google-url"
                  type="url"
                  placeholder="https://g.page/r/your-business/review"
                  value={googleReviewUrl}
                  onChange={(e) => setGoogleReviewUrl(e.target.value)}
                  error={errors.googleReviewUrl}
                  disabled={isLoading}
                  helperText="You can also link your Google review page later in Business Settings."
                />

                {/* Policy Consent */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-brand-text-secondary select-none">
                    <input
                      type="checkbox"
                      id="signup-consent"
                      checked={consentAccepted}
                      onChange={(e) => setConsentAccepted(e.target.checked)}
                      disabled={isLoading}
                      className="mt-0.5 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                    />
                    <span>
                      I agree to the platform Terms of Service, Privacy Policy, and confirm that our business will adhere to non-gated review practices.
                    </span>
                  </label>
                  {errors.consentAccepted && (
                    <p className="text-xs text-brand-error mt-1">{errors.consentAccepted}</p>
                  )}
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-2 font-semibold"
                  isLoading={isLoading}
                >
                  <span>Request Verification Code</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col items-center justify-center gap-2 border-t border-brand-border pt-4 text-xs text-brand-text-secondary">
              <p>
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-brand-primary hover:underline">
                  Log in
                </Link>
              </p>
              <Link href="/" className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-text-primary transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to homepage</span>
              </Link>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader className="text-center space-y-2 pb-4">
              <div className="mx-auto w-10 h-10 rounded-xl bg-emerald-50 text-brand-success flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Enter Verification Code
              </CardTitle>
              <CardDescription>
                We sent a 6-digit one-time code to <strong className="text-brand-text-primary">{email}</strong>.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              {successMessage && (
                <div
                  role="status"
                  className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errors.form && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-brand-error leading-relaxed"
                >
                  {errors.form}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="signup-otp" className="block text-xs font-semibold text-brand-text-primary mb-1.5 text-center">
                    6-Digit Verification Code
                  </label>
                  <input
                    id="signup-otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    autoComplete="one-time-code"
                    autoFocus
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtp(val);
                      if (errors.otp) setErrors((prev) => ({ ...prev, otp: undefined }));
                    }}
                    placeholder="123456"
                    disabled={isLoading}
                    className="w-full h-14 text-center font-mono text-2xl tracking-[0.4em] rounded-xl border border-brand-border bg-brand-surface text-brand-text-primary focus-ring"
                    aria-invalid={Boolean(errors.otp)}
                    aria-describedby={errors.otp ? 'signup-otp-error' : undefined}
                  />
                  {errors.otp && (
                    <p id="signup-otp-error" className="text-xs text-brand-error text-center mt-1.5">
                      {errors.otp}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-brand-text-secondary pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('form');
                      setOtp('');
                      setErrors({});
                      setSuccessMessage('');
                    }}
                    className="text-brand-text-secondary hover:text-brand-text-primary underline"
                  >
                    Edit details or email
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={cooldown > 0 || isLoading}
                    className="font-medium text-brand-primary disabled:text-slate-400 disabled:no-underline hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
                  </button>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full font-semibold"
                  isLoading={isLoading}
                  disabled={otp.length !== 6 || isLoading}
                >
                  <span>Verify & Create Account</span>
                  <CheckCircle2 className="w-4 h-4 ml-1.5" />
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex justify-center border-t border-brand-border pt-4 text-xs text-brand-text-secondary">
              <div className="inline-flex items-center gap-1.5 text-slate-500">
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                <span>Zero password storage • Secure HTTP-only cookie sessions</span>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
