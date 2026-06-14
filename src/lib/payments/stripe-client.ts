import { loadStripe, type Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = (): Promise<Stripe | null> => {
  const key = import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) return Promise.resolve(null);

  if (!stripePromise) {
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

export const isStripeConfigured = (): boolean =>
  Boolean(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY);
