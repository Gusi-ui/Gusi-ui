import { getPaymentsApi } from '@/lib/constants';

type OpenCustomerPortalParams = {
  email?: string;
  sessionId?: string;
};

export const openCustomerPortal = async ({
  email,
  sessionId,
}: OpenCustomerPortalParams): Promise<void> => {
  const response = await fetch(getPaymentsApi('/customer-portal'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, sessionId }),
  });

  const data = await response.json();

  if (!response.ok || !data.success || !data.url) {
    throw new Error(data.message || 'No se pudo abrir el portal de gestión');
  }

  window.location.href = data.url;
};
