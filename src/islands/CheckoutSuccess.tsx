import { useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { getPaymentsApi } from '@/lib/constants';
import { openCustomerPortal } from '@/lib/payments/customer-portal';
import { showNotification } from '@/lib/notifications';
import type { VerifySessionResponse } from '@/lib/payments/types';

const CheckoutSuccess = () => {
  const [status, setStatus] = useState<'loading' | 'paid' | 'pending' | 'error'>('loading');
  const [details, setDetails] = useState<VerifySessionResponse | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');

      if (!sessionId) {
        setStatus('error');
        return;
      }

      setSessionId(sessionId);

      try {
        const response = await fetch(
          `${getPaymentsApi('/verify-session')}?session_id=${encodeURIComponent(sessionId)}`
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          setStatus('error');
          return;
        }

        setDetails(data);
        setStatus(data.paid ? 'paid' : 'pending');

        if (data.paid && typeof gtag !== 'undefined') {
          gtag('event', 'purchase', {
            event_category: 'Payments',
            event_label: data.productSlug,
            value: data.amountTotal ? data.amountTotal / 100 : 0,
          });
        }
      } catch {
        setStatus('error');
      }
    };

    verify();
  }, []);

  const handleManageSubscription = async () => {
    setIsOpeningPortal(true);

    try {
      await openCustomerPortal({
        sessionId: sessionId ?? undefined,
      });
    } catch (error) {
      const err = error as Error;
      showNotification(err.message || 'No se pudo abrir el portal de gestión.', 'error');
    } finally {
      setIsOpeningPortal(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="checkout-status checkout-status-loading">
        <Icon name="spinner" spin />
        <p>Verificando tu pago...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="checkout-status checkout-status-error">
        <Icon name="exclamation-circle" />
        <h2>No pudimos confirmar el pago</h2>
        <p>Si crees que es un error, contáctanos y revisaremos tu caso.</p>
        <a href="/#contacto" className="btn btn-primary">
          Contactar
        </a>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="checkout-status checkout-status-pending">
        <Icon name="clock" />
        <h2>Pago en proceso</h2>
        <p>Estamos confirmando tu transacción. Recibirás un email cuando se complete.</p>
      </div>
    );
  }

  const isSubscription = details?.mode === 'subscription';
  const formattedAmount =
    details?.amountTotal != null
      ? `${(details.amountTotal / 100).toFixed(2)} ${(details.currency || 'eur').toUpperCase()}`
      : null;

  return (
    <div className="checkout-status checkout-status-success">
      <Icon name="check-circle" />
      <h2>{isSubscription ? '¡Suscripción activada!' : '¡Pago confirmado!'}</h2>
      {details?.productTitle && (
        <p className="checkout-product">
          <strong>{details.productTitle}</strong>
          {details.billingPlan === 'monthly' ? ' — Plan mensual' : ' — Pago único'}
        </p>
      )}
      {formattedAmount && <p className="checkout-amount">Total: {formattedAmount}</p>}
      <p>Gracias por confiar en alamia.es. Te contactaremos en breve para los siguientes pasos.</p>
      <div className="checkout-actions">
        {isSubscription && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleManageSubscription}
            disabled={isOpeningPortal}
          >
            <Icon name={isOpeningPortal ? 'spinner' : 'cog'} spin={isOpeningPortal} />
            {isOpeningPortal ? 'Abriendo portal...' : 'Gestionar o cancelar suscripción'}
          </button>
        )}
        <a href="/" className="btn btn-primary">
          <Icon name="home" /> Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
