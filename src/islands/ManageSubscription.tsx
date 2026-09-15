import { useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { openCustomerPortal, requestPortalLink } from '@/lib/payments/customer-portal';
import { showNotification } from '@/lib/notifications';

type Vista = 'formulario' | 'enlaceEnviado' | 'abriendo' | 'vueltaDelPortal';

const ManageSubscription = () => {
  const [email, setEmail] = useState('');
  const [vista, setVista] = useState<Vista>('formulario');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('portal') === 'return') {
      setVista('vueltaDelPortal');
      return;
    }

    const token = params.get('token');
    if (!token) return;

    // El enlace solo sirve una vez: se quita de la barra de direcciones para que
    // no acabe en el historial ni en una captura compartida.
    window.history.replaceState({}, '', window.location.pathname);
    setVista('abriendo');

    openCustomerPortal({ token }).catch((error: Error) => {
      showNotification(error.message || 'No se pudo abrir el portal de gestión.', 'error');
      setVista('formulario');
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      showNotification('Introduce el email que usaste al contratar el mantenimiento.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const mensaje = await requestPortalLink(email.trim());
      setVista('enlaceEnviado');
      showNotification(mensaje, 'success');
    } catch (error) {
      const err = error as Error;
      showNotification(err.message || 'No se pudo enviar el enlace.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-status checkout-status-manage">
      <Icon name="shield-halved" />

      <h2>Gestionar tu mantenimiento</h2>

      {vista === 'vueltaDelPortal' && (
        <p className="checkout-manage-return">
          Has vuelto desde el portal de Stripe. Si cancelaste la suscripción, seguirá activa hasta
          fin de periodo facturado.
        </p>
      )}

      {vista === 'abriendo' && (
        <p className="checkout-manage-return">
          <Icon name="spinner" spin />
          <span> Abriendo el portal seguro de Stripe...</span>
        </p>
      )}

      {vista === 'enlaceEnviado' && (
        <p className="checkout-manage-return">
          Revisa tu correo. Si hay una suscripción activa con ese email, recibirás un enlace de
          acceso. Caduca en 15 minutos y solo funciona una vez.
        </p>
      )}

      {vista === 'formulario' && (
        <>
          <p>
            Te enviamos un enlace de acceso al email con el que contrataste el mantenimiento. Desde
            ahí entrarás al portal seguro de Stripe para cancelar, cambiar tarjeta o ver facturas.
          </p>

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
              <Icon name={isLoading ? 'spinner' : 'envelope'} spin={isLoading} />
              <span>{isLoading ? 'Enviando enlace...' : 'Enviarme el enlace de acceso'}</span>
            </button>
          </form>

          <p className="checkout-manage-note">
            El mantenimiento mensual solo admite tarjeta. Bizum está disponible en los proyectos de
            pago único.
          </p>
        </>
      )}

      <a href="/#servicios" className="btn btn-secondary checkout-manage-back">
        Volver a servicios
      </a>
    </div>
  );
};

export default ManageSubscription;
