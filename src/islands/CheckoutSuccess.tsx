import { useEffect, useState } from 'react';
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
        <i className="fas fa-spinner fa-spin" aria-hidden="true" />
        <p>Verificando tu pago...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="checkout-status checkout-status-error">
        <i className="fas fa-exclamation-circle" aria-hidden="true" />
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
        <i className="fas fa-clock" aria-hidden="true" />
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
      <i className="fas fa-check-circle" aria-hidden="true" />
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
            <i
              className={`fas ${isOpeningPortal ? 'fa-spinner fa-spin' : 'fa-cog'}`}
              aria-hidden="true"
            />
            {isOpeningPortal ? 'Abriendo portal...' : 'Gestionar o cancelar suscripción'}
          </button>
        )}
        <a href="/" className="btn btn-primary">
          <i className="fas fa-home" aria-hidden="true" /> Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
