import { useState } from 'react';
import type { ProjectService } from '@/data/services';
import { BADGE_LABELS } from '@/data/services';
import { startCheckout } from '@/lib/payments/checkout';
import { showNotification } from '@/lib/notifications';

type ServiceCardProps = {
  service: ProjectService;
  stripeEnabled: boolean;
};

const ServiceCard = ({ service, stripeEnabled }: ServiceCardProps) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const cardClassName = [
    'service-card',
    service.highlight === 'featured' ? 'service-card--featured' : '',
    service.badge === 'best-value' ? 'service-card--best-value' : '',
    service.badge === 'best-seller' ? 'service-card--best-seller' : '',
  ]
    .filter(Boolean)
    .join(' ');

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
      className={cardClassName}
      itemScope
      itemType="https://schema.org/Service"
      aria-labelledby={service.id}
    >
      {service.badge && (
        <span className={`service-badge service-badge--${service.badge}`}>
          {BADGE_LABELS[service.badge]}
        </span>
      )}

      <div className="service-icon" aria-hidden="true">
        <i className={service.icon} />
      </div>

      <h3 className="service-title" itemProp="name" id={service.id}>
        {service.title}
      </h3>

      <p className="service-description" itemProp="description">
        {service.description}
      </p>

      <div className="service-features">
        {service.features.map((feature) => (
          <div className="feature-item" key={feature}>
            <i className="fas fa-check" aria-hidden="true" />
            <span itemProp="serviceType">{feature}</span>
          </div>
        ))}
      </div>

      <div className="service-footer">
        <div
          className="service-price"
          itemProp="offers"
          itemScope
          itemType="https://schema.org/Offer"
        >
          <meta itemProp="priceCurrency" content="EUR" />
          <span itemProp="priceCurrency">€</span>
          <span itemProp="price">{service.price}</span>
          <span className="price-period">pago único</span>
        </div>

        <p className="price-hint">{service.priceHint}</p>

        <button
          type="button"
          className="service-btn service-btn-primary"
          onClick={handleCheckout}
          disabled={isCheckingOut}
          aria-label={
            isCheckingOut ? 'Procesando pago...' : `Contratar ${service.title} con pago único`
          }
        >
          <i
            className={`fas ${isCheckingOut ? 'fa-spinner fa-spin' : 'fa-credit-card'}`}
            aria-hidden="true"
          />
          <span>{isCheckingOut ? 'Procesando...' : 'Contratar ahora'}</span>
        </button>
      </div>
    </article>
  );
};

export default ServiceCard;
