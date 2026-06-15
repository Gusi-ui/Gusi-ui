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
      className="maintenance-band"
      itemScope
      itemType="https://schema.org/Service"
      aria-labelledby={service.id}
    >
      <span className="maintenance-badge">Suscripción mensual</span>

      <div className="maintenance-band__intro">
        <div className="maintenance-band__icon" aria-hidden="true">
          <Icon name={service.icon} />
        </div>
        <div className="maintenance-band__headings">
          <h3 className="service-title" itemProp="name" id={service.id}>
            {service.title}
          </h3>
          <p className="service-description" itemProp="description">
            {service.description}
          </p>
          <p className="maintenance-value-anchor">{service.valueAnchor}</p>
          <a href={`/servicios/${service.slug}/`} className="service-card__detail-link">
            Ver detalles del servicio
          </a>
        </div>
      </div>

      <ul className="maintenance-band__features">
        {service.features.map((feature) => (
          <li className="maintenance-feature" key={feature}>
            <Icon name="check" />
            <span itemProp="serviceType">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="maintenance-band__pricing">
        <div
          className="service-price maintenance-price"
          itemProp="offers"
          itemScope
          itemType="https://schema.org/Offer"
        >
          <meta itemProp="priceCurrency" content="EUR" />
          <span itemProp="priceCurrency">€</span>
          <span itemProp="price">{service.price}</span>
          <span className="price-period">/mes</span>
        </div>
        <p className="price-hint">{service.priceHint}</p>

        <button
          type="button"
          className="service-btn service-btn-primary maintenance-cta"
          onClick={handleCheckout}
          onMouseEnter={prefetchStripe}
          onFocus={prefetchStripe}
          disabled={isCheckingOut}
          aria-label={
            isCheckingOut ? 'Procesando pago...' : `Activar ${service.title}`
          }
        >
          <Icon name={isCheckingOut ? 'spinner' : 'credit-card'} spin={isCheckingOut} />
          <span>{isCheckingOut ? 'Procesando...' : 'Activar mantenimiento'}</span>
        </button>

        <a href="/mantenimiento/gestionar/" className="maintenance-manage-link">
          ¿Ya eres cliente? Gestionar o cancelar suscripción
        </a>
      </div>
    </article>
  );
};

export default MaintenanceCard;
