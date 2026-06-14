export type BillingPlan = 'one_time' | 'monthly';
export type CheckoutMode = 'payment' | 'subscription';

export type ProductSlug =
  | 'desarrollo-web'
  | 'optimizacion-web'
  | 'backend-apis'
  | 'mantenimiento';

export const PRODUCT_SLUGS: ProductSlug[] = [
  'desarrollo-web',
  'optimizacion-web',
  'backend-apis',
  'mantenimiento',
];

export const PRODUCT_TITLES: Record<ProductSlug, string> = {
  'desarrollo-web': 'Desarrollo Web',
  'optimizacion-web': 'Optimización Web',
  'backend-apis': 'Backend & APIs',
  mantenimiento: 'Mantenimiento Web',
};

const ALLOWED_PLANS: Record<ProductSlug, BillingPlan[]> = {
  'desarrollo-web': ['one_time'],
  'optimizacion-web': ['one_time'],
  'backend-apis': ['one_time'],
  mantenimiento: ['monthly'],
};

type CatalogEntry = {
  priceEnvKey: string;
  mode: CheckoutMode;
};

const CATALOG: Record<ProductSlug, Partial<Record<BillingPlan, CatalogEntry>>> = {
  'desarrollo-web': {
    one_time: { priceEnvKey: 'STRIPE_PRICE_DESARROLLO_WEB_ONETIME', mode: 'payment' },
  },
  'optimizacion-web': {
    one_time: { priceEnvKey: 'STRIPE_PRICE_OPTIMIZACION_WEB_ONETIME', mode: 'payment' },
  },
  'backend-apis': {
    one_time: { priceEnvKey: 'STRIPE_PRICE_BACKEND_APIS_ONETIME', mode: 'payment' },
  },
  mantenimiento: {
    monthly: { priceEnvKey: 'STRIPE_PRICE_MANTENIMIENTO_MONTHLY', mode: 'subscription' },
  },
};

export const isValidProductSlug = (slug: string): slug is ProductSlug =>
  PRODUCT_SLUGS.includes(slug as ProductSlug);

export const isValidBillingPlan = (plan: string): plan is BillingPlan =>
  plan === 'one_time' || plan === 'monthly';

export const isBillingPlanAllowed = (productSlug: ProductSlug, billingPlan: BillingPlan): boolean =>
  ALLOWED_PLANS[productSlug]?.includes(billingPlan) ?? false;

export const resolveCheckoutConfig = (
  env: Record<string, string | undefined>,
  productSlug: ProductSlug,
  billingPlan: BillingPlan
): { priceId: string; mode: CheckoutMode; productTitle: string } | null => {
  if (!isBillingPlanAllowed(productSlug, billingPlan)) {
    return null;
  }

  const entry = CATALOG[productSlug]?.[billingPlan];
  if (!entry) return null;

  const priceId = env[entry.priceEnvKey];
  if (!priceId) return null;

  return {
    priceId,
    mode: entry.mode,
    productTitle: PRODUCT_TITLES[productSlug],
  };
};
