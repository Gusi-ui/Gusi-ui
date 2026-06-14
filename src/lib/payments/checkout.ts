import { getPaymentsApi } from '@/lib/constants';
import { showNotification } from '@/lib/notifications';
import type { BillingPlan } from '@/data/services';

type StartCheckoutParams = {
  productSlug: string;
  billingPlan: BillingPlan;
  price: number;
  stripeEnabled: boolean;
};

export const startCheckout = async ({
  productSlug,
  billingPlan,
  price,
  stripeEnabled,
}: StartCheckoutParams): Promise<void> => {
  if (!stripeEnabled) {
    showNotification(
      'Pasarela de pago en configuración. Inténtalo de nuevo pronto o escríbenos por WhatsApp.',
      'error'
    );
    return;
  }

  if (typeof gtag !== 'undefined') {
    gtag('event', 'begin_checkout', {
      event_category: 'Payments',
      event_label: `${productSlug}_${billingPlan}`,
      value: price,
    });
  }

  const response = await fetch(getPaymentsApi('/checkout'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      productSlug,
      billingPlan,
      quantity: 1,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Error al iniciar el pago');
  }

  if (data.url) {
    window.location.href = data.url;
    return;
  }

  throw new Error('Respuesta de pago incompleta');
};
