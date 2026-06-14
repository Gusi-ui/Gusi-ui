import { useState, type FormEvent } from 'react';
import Icon from '@/components/ui/Icon';
import { getContactApi } from '@/lib/constants';
import { sanitizeText, isValidEmail } from '@/lib/utils';
import { showNotification } from '@/lib/notifications';

const GRACIAS_ROUTES: Record<string, string> = {
  web: '/gracias/web',
  mobile: '/gracias/mobile',
  ecommerce: '/gracias/ecommerce',
  maintenance: '/gracias/mantenimiento',
  other: '/gracias/otros',
};

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = sanitizeText(formData.get('name') as string);
    const email = sanitizeText(formData.get('email') as string);
    const service = sanitizeText(formData.get('service') as string);
    const message = sanitizeText(formData.get('message') as string);

    if (!name || !email || !service || !message) {
      showNotification('Por favor, completa todos los campos', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showNotification('Por favor, introduce un email válido', 'error');
      return;
    }

    const sanitizedName = sanitizeText(name);
    const sanitizedEmail = sanitizeText(email);
    const sanitizedService = sanitizeText(service);
    const sanitizedMessage = sanitizeText(message);

    if (!sanitizedName || !sanitizedEmail || !sanitizedService || !sanitizedMessage) {
      showNotification('Por favor, completa todos los campos correctamente', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit_start', {
          event_category: 'Contact',
          event_label: service,
          custom_parameter_1: 'contact_form',
        });
      }

      const response = await fetch(getContactApi(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: sanitizedName,
          email: sanitizedEmail,
          service: sanitizedService,
          message: sanitizedMessage,
        }),
      });

      if (response.ok) {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_submit_success', {
            event_category: 'Contact',
            event_label: service,
            value: 1,
          });
        }
        const redirectUrl = GRACIAS_ROUTES[service] || '/gracias';
        window.location.href = redirectUrl;
        return;
      }

      const errorText = await response.text();
      throw new Error(`Error del servidor (${response.status}): ${errorText}`);
    } catch (error) {
      const err = error as Error;
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit_error', {
          event_category: 'Contact',
          event_label: service,
          custom_parameter_2: err.message,
        });
      }
      sessionStorage.setItem(
        'formError',
        JSON.stringify({
          message: err.message,
          service,
          timestamp: new Date().toISOString(),
        })
      );
      window.location.href = '/error';
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} aria-labelledby="contacto-titulo">
      <div style={{ display: 'none' }} aria-hidden="true">
        <label>
          No llenar este campo: <input name="_gotcha" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="form-group">
        <label htmlFor="name" className="sr-only">
          Nombre
        </label>
        <input type="text" id="name" name="name" placeholder="Tu nombre" required aria-required="true" />
      </div>
      <div className="form-group">
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input type="email" id="email" name="email" placeholder="Tu email" required aria-required="true" />
      </div>
      <div className="form-group">
        <label htmlFor="service" className="sr-only">
          Servicio
        </label>
        <select id="service" name="service" required aria-required="true" defaultValue="">
          <option value="" disabled>
            Selecciona un servicio
          </option>
          <option value="web">Desarrollo Web</option>
          <option value="mobile">App Móvil</option>
          <option value="ecommerce">E-Commerce</option>
          <option value="maintenance">Mantenimiento</option>
          <option value="other">Otro</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="message" className="sr-only">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Cuéntame sobre tu proyecto..."
          rows={5}
          required
          aria-required="true"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-full"
        aria-label="Enviar mensaje de contacto"
        disabled={isSubmitting}
      >
        <Icon name={isSubmitting ? 'spinner' : 'paper-plane'} spin={isSubmitting} />
        <span>{isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}</span>
      </button>
    </form>
  );
};

export default ContactForm;
