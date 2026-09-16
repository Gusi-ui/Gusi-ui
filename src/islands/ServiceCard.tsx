import { useState } from 'react';
import type { ProjectService } from '@/data/services';
import { BADGE_LABELS } from '@/data/services';
import Icon from '@/components/ui/Icon';
import { startCheckout } from '@/lib/payments/checkout';
import { prefetchStripe } from '@/lib/payments/stripe-client';
import { showNotification } from '@/lib/notifications';

type ServiceCardProps = {
  service: ProjectService;
  stripeEnabled: boolean;
};

// Una tarifa: suelta en la página de cada servicio, o como fila dentro de la
// lista `.tarifas` de la home. El CSS decide la disposición según el contexto.
const ServiceCard = ({ service, stripeEnabled }: ServiceCardProps) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    try {
      await startCheckout({
        productSlug: service.slug,
        billingPlan: 'one_time',
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
      className="tarifa"
      itemScope
      itemType="https://schema.org/Service"
      aria-labelledby={service.id}
    >
      <div className="tarifa__cabeza">
        <h3 className="tarifa__nombre" itemProp="name" id={service.id}>
          {service.title}
        </h3>
        {service.badge && <span className="tarifa__sello">{BADGE_LABELS[service.badge]}</span>}
      </div>

      <p className="tarifa__resumen" itemProp="description">
        {service.description}
      </p>

      <ul className="tarifa__incluye">
        {service.features.map((feature) => (
          <li key={feature}>
            <Icon name="check" />
            <span itemProp="serviceType">{feature}</span>
          </li>
        ))}
      </ul>

      <a href={`/servicios/${service.slug}/`} className="tarifa__detalle">
        Ver qué incluye
      </a>

      <div className="tarifa__compra">
        <p className="tarifa__precio" itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <meta itemProp="priceCurrency" content="EUR" />
          <span itemProp="price" content={String(service.price)}>
            {service.price}
          </span>{' '}
          €
        </p>
        <p className="tarifa__pago">{service.priceHint}</p>

        <button
          type="button"
          className="btn btn-primary tarifa__boton"
          onClick={handleCheckout}
          onMouseEnter={prefetchStripe}
          onFocus={prefetchStripe}
          disabled={isCheckingOut}
          aria-label={
            isCheckingOut ? 'Procesando pago...' : `Contratar ${service.title} con pago único`
          }
        >
          {isCheckingOut && <Icon name="spinner" spin />}
          <span>{isCheckingOut ? 'Procesando...' : 'Contratar'}</span>
        </button>
      </div>
    </article>
  );
};

export default ServiceCard;
