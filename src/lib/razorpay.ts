/**
 * Safe Razorpay checkout integration utilities for ReviewFlow customer billing.
 * Handles dynamic SDK loading, signature callbacks, cancellation, and error handling.
 */

export interface RazorpaySuccessCallbackPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayFailureCallbackPayload {
  error: {
    code: string;
    description: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: {
      order_id?: string;
      payment_id?: string;
    };
  };
}

export interface OpenCheckoutConfig {
  keyId: string;
  orderId: string;
  amount: number; // Integer minor units (e.g. 9900 paise = ₹99.00)
  currency: string;
  name?: string;
  description?: string;
  customerName?: string;
  customerEmail?: string;
  themeColor?: string;
  onSuccess: (response: RazorpaySuccessCallbackPayload) => void | Promise<void>;
  onFailure: (error: RazorpayFailureCallbackPayload) => void;
  onDismiss: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (data: unknown) => void) => void;
      close: () => void;
    };
  }
}

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

let scriptLoadingPromise: Promise<boolean> | null = null;

/**
 * Safely loads the Razorpay Standard Checkout script.
 * Resolves true if loaded successfully, false if load failed (e.g. network failure).
 */
export async function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }

  if (window.Razorpay) {
    return true;
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise<boolean>((resolve) => {
    // Check if script tag is already in DOM
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      scriptLoadingPromise = null;
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      resolve(false);
    };

    document.body.appendChild(script);
  });

  return scriptLoadingPromise;
}

/**
 * Launches the customer Razorpay modal with supplied options.
 * Never logs payment credentials or customer card data.
 */
export async function launchRazorpayModal(config: OpenCheckoutConfig): Promise<boolean> {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    return false;
  }

  const options: Record<string, unknown> = {
    key: config.keyId,
    amount: config.amount,
    currency: config.currency,
    name: config.name || 'ReviewFlow',
    description: config.description || 'Subscription Access Plan',
    order_id: config.orderId,
    prefill: {
      name: config.customerName || '',
      email: config.customerEmail || '',
    },
    theme: {
      color: config.themeColor || '#4F46E5', // ReviewFlow primary indigo
    },
    modal: {
      ondismiss: () => {
        config.onDismiss();
      },
      escape: true,
      backdropclose: false,
    },
    handler: (response: RazorpaySuccessCallbackPayload) => {
      config.onSuccess(response);
    },
  };

  const instance = new window.Razorpay(options);

  if (typeof instance.on === 'function') {
    instance.on('payment.failed', (errData: unknown) => {
      config.onFailure(errData as RazorpayFailureCallbackPayload);
    });
  }

  instance.open();
  return true;
}
