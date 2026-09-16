import { useState } from 'react';
import type { MaintenanceService } from '@/data/services';
import Icon from '@/components/ui/Icon';
import { startCheckout } from '@/lib/payments/checkout';
import { prefetchStripe } from '@/lib/payments/stripe-client';
import { showNotification } from '@/lib/notifications';

type MaintenanceCardProps = {
  service: MaintenanceService;
  stripeEnabled: boolean;
};

const MaintenanceCard = ({ service, stripeEnabled }: MaintenanceCardProps) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    try {
      await startCheckout({
        productSlug: service.slug,
        billingPlan: 'monthly',
        price: service.price,
        stripeEnabled,
      });
    } catch (error) {
      const err = error as Error;
      showNotification(err.message || 'No se pudo iniciar el pago. Inténtalo de nuevo.', 'error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <article
      className="mantenimiento"
      itemScope
      itemType="https://schema.org/Service"
      aria-labelledby={service.id}
    >
      <div className="mantenimiento__texto">
        <h3 className="mantenimiento__nombre" itemProp="name" id={service.id}>
          {service.title}
        </h3>
        <p className="mantenimiento__resumen" itemProp="description">
          {service.description}
        </p>
        <a href={`/servicios/${service.slug}/`} className="tarifa__detalle">
          Ver qué incluye
        </a>
      </div>

      <ul className="mantenimiento__incluye">
        {service.features.map((feature) => (
          <li key={feature}>
            <Icon name="check" />
            <span itemProp="serviceType">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mantenimiento__compra">
        <p
          className="tarifa__precio"
          itemProp="offers"
          itemScope
          itemType="https://schema.org/Offer"
        >
          <meta itemProp="priceCurrency" content="EUR" />
          <span itemProp="price" content={String(service.price)}>
            {service.price}
          </span>{' '}
          € <span className="tarifa__periodo">al mes</span>
        </p>
        <p className="tarifa__pago">
          {service.priceHint}. {service.valueAnchor}.
        </p>

        <button
          type="button"
          className="btn btn-primary tarifa__boton"
          onClick={handleCheckout}
          onMouseEnter={prefetchStripe}
          onFocus={prefetchStripe}
          disabled={isCheckingOut}
          aria-label={isCheckingOut ? 'Procesando pago...' : `Activar ${service.title}`}
        >
          {isCheckingOut && <Icon name="spinner" spin />}
          <span>{isCheckingOut ? 'Procesando...' : 'Activar'}</span>
        </button>

        <a href="/mantenimiento/gestionar/" className="mantenimiento__gestionar">
          ¿Ya eres cliente? Gestiona o cancela tu suscripción
        </a>
      </div>
    </article>
  );
};

export default MaintenanceCard;
