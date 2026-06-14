export type BillingPlan = 'one_time' | 'monthly';

export type CheckoutRequest = {
  productSlug: string;
  billingPlan: BillingPlan;
  quantity?: number;
};

export type CheckoutResponse = {
  sessionId: string;
  url?: string;
};

export type VerifySessionResponse = {
  paid: boolean;
  productSlug?: string;
  billingPlan?: BillingPlan;
  productTitle?: string;
  amountTotal?: number;
  currency?: string;
  mode?: 'payment' | 'subscription';
  customerId?: string | null;
};
