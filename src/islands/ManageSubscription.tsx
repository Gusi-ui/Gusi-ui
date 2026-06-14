import { useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { openCustomerPortal } from '@/lib/payments/customer-portal';
import { showNotification } from '@/lib/notifications';

const ManageSubscription = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [returnedFromPortal, setReturnedFromPortal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('portal') === 'return') {
      setReturnedFromPortal(true);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      showNotification('Introduce el email que usaste al contratar el mantenimiento.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      await openCustomerPortal({ email: email.trim() });
    } catch (error) {
      const err = error as Error;
      showNotification(err.message || 'No se pudo abrir el portal de gestión.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-status checkout-status-manage">
      <Icon name="shield-halved" />

      <h2>Gestionar tu mantenimiento</h2>

      {returnedFromPortal ? (
        <p className="checkout-manage-return">
          Has vuelto desde el portal de Stripe. Si cancelaste la suscripción, seguirá activa hasta
          fin de periodo facturado.
        </p>
      ) : (
        <p>
          Introduce el email con el que contrataste el mantenimiento mensual. Te llevaremos al
          portal seguro de Stripe para cancelar, cambiar tarjeta o ver facturas.
        </p>
      )}

      <form className="checkout-manage-form" onSubmit={handleSubmit}>
        <label htmlFor="manage-email" className="checkout-manage-label">
          Email de la suscripción
        </label>
        <input
          id="manage-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="tu@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isLoading}
          className="checkout-manage-input"
        />
        <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
          <Icon name={isLoading ? 'spinner' : 'external-link'} spin={isLoading} />
          <span>{isLoading ? 'Abriendo portal...' : 'Gestionar o cancelar suscripción'}</span>
        </button>
      </form>

      <p className="checkout-manage-note">
        El mantenimiento mensual solo admite tarjeta. Bizum está disponible en los proyectos de
        pago único.
      </p>

      <a href="/#servicios" className="btn btn-secondary checkout-manage-back">
        Volver a servicios
      </a>
    </div>
  );
};

export default ManageSubscription;
