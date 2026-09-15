import { getPaymentsApi } from '@/lib/constants';

type OpenCustomerPortalParams = {
  /** Token de un solo uso recibido por email. */
  token?: string;
  /** Sesión de checkout recién completada, para entrar sin pedir enlace. */
  sessionId?: string;
};

/** Pide que se envíe un enlace de acceso al email de la suscripción. */
export const requestPortalLink = async (email: string): Promise<string> => {
  const response = await fetch(getPaymentsApi('/portal-request'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'No se pudo enviar el enlace');
  }

  return data.message as string;
};

export const openCustomerPortal = async ({
  token,
  sessionId,
}: OpenCustomerPortalParams): Promise<void> => {
  const response = await fetch(getPaymentsApi('/customer-portal'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ token, sessionId }),
  });

  const data = await response.json();

  if (!response.ok || !data.success || !data.url) {
    throw new Error(data.message || 'No se pudo abrir el portal de gestión');
  }

  window.location.href = data.url;
};
