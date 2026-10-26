'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Mail, RefreshCw, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { requestLoginOtp, verifyLoginOtp } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface FormErrors {
  email?: string;
  otp?: string;
  form?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { setSession, isAuthenticated } = useAuth();

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Step state
  const [step, setStep] = React.useState<'email' | 'otp'>('email');
  const [email, setEmail] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [cooldown, setCooldown] = React.useState(0);

  // Status and error handling
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [infoMessage, setInfoMessage] = React.useState('');

  // Resend cooldown timer
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setInfoMessage('');

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      setErrors({ email: 'Email address is required' });
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      setErrors({ email: 'Please provide a valid email address' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await requestLoginOtp({ email: trimmedEmail });
      setInfoMessage(
        response.message ||
          'If an active account is registered with this email, a verification code has been sent.',
      );
      setCooldown(response.cooldownSeconds || 60);
      setStep('otp');
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrors({ form: err.message });
      } else {
        setErrors({ form: 'An unexpected connection error occurred. Please try again.' });
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
      const response = await requestLoginOtp({ email: email.trim().toLowerCase() });
      setInfoMessage(
        response.message ||
          'If an active account is registered with this email, a verification code has been sent.',
      );
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
      const sessionData = await verifyLoginOtp({
        email: email.trim().toLowerCase(),
        otp: cleanOtp,
      });

      setSession(sessionData);
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrors({ otp: err.message });
      } else {
        setErrors({ form: 'Login verification failed. Please try again.' });
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

      <Card className="max-w-md w-full shadow-elevated border-brand-border">
        {step === 'email' ? (
          <>
            <CardHeader className="text-center space-y-2 pb-4">
              <div className="mx-auto w-10 h-10 rounded-xl bg-indigo-50 text-brand-primary flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Business Owner Log In
              </CardTitle>
              <CardDescription>
                Sign in securely to your business portal without passwords.
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
                <Input
                  label="Registered Email Address"
                  id="login-email"
                  type="email"
                  placeholder="owner@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  disabled={isLoading}
                  autoFocus
                  required
                  helperText="We will send a 6-digit one-time code to authenticate your session."
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-2 font-semibold"
                  isLoading={isLoading}
                >
                  <span>Send One-Time Code</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col items-center justify-center gap-2 border-t border-brand-border pt-4 text-xs text-brand-text-secondary">
              <p>
                Don&apos;t have an account yet?{' '}
                <Link href="/signup" className="font-semibold text-brand-primary hover:underline">
                  Register business
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
              {infoMessage && (
                <div
                  role="status"
                  className="p-3.5 rounded-xl bg-slate-50 border border-brand-border text-xs text-brand-text-secondary leading-relaxed"
                >
                  <div className="font-semibold text-brand-text-primary mb-0.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                    <span>Check your inbox</span>
                  </div>
                  {infoMessage}
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
                  <label htmlFor="login-otp" className="block text-xs font-semibold text-brand-text-primary mb-1.5 text-center">
                    6-Digit Verification Code
                  </label>
                  <input
                    id="login-otp"
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
                    aria-describedby={errors.otp ? 'login-otp-error' : undefined}
                  />
                  {errors.otp && (
                    <p id="login-otp-error" className="text-xs text-brand-error text-center mt-1.5">
                      {errors.otp}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-brand-text-secondary pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setOtp('');
                      setErrors({});
                      setInfoMessage('');
                    }}
                    className="text-brand-text-secondary hover:text-brand-text-primary underline"
                  >
                    Use different email
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
                  <span>Verify & Log In</span>
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
