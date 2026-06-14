import { useState } from 'react';
import type { MaintenanceService } from '@/data/services';
import { startCheckout } from '@/lib/payments/checkout';
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
          <i className={service.icon} />
        </div>
        <div className="maintenance-band__headings">
          <h3 className="service-title" itemProp="name" id={service.id}>
            {service.title}
          </h3>
          <p className="service-description" itemProp="description">
            {service.description}
          </p>
          <p className="maintenance-value-anchor">{service.valueAnchor}</p>
        </div>
      </div>

      <ul className="maintenance-band__features">
        {service.features.map((feature) => (
          <li className="maintenance-feature" key={feature}>
            <i className="fas fa-check" aria-hidden="true" />
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
          disabled={isCheckingOut}
          aria-label={
            isCheckingOut ? 'Procesando pago...' : `Activar ${service.title}`
          }
        >
          <i
            className={`fas ${isCheckingOut ? 'fa-spinner fa-spin' : 'fa-credit-card'}`}
            aria-hidden="true"
          />
          <span>{isCheckingOut ? 'Procesando...' : 'Activar mantenimiento'}</span>
        </button>
      </div>
    </article>
  );
};

export default MaintenanceCard;
