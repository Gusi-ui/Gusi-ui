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
      showNotification('Completa todos los campos para poder responderte', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showNotification('Revisa el email: no parece válido', 'error');
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
    <form className="formulario contacto__formulario" onSubmit={handleSubmit} aria-labelledby="formulario-titulo">
      <h3 id="formulario-titulo" className="formulario__titulo">
        Cuéntamelo por escrito
      </h3>
      <div hidden aria-hidden="true">
        <label>
          No llenar este campo: <input name="_gotcha" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="formulario__campo">
        <label htmlFor="name">Nombre</label>
        <input type="text" id="name" name="name" autoComplete="name" required />
      </div>
      <div className="formulario__campo">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" autoComplete="email" required />
      </div>
      <div className="formulario__campo">
        <label htmlFor="service">¿Qué necesitas?</label>
        <select id="service" name="service" required defaultValue="">
          <option value="" disabled>
            Elige una opción
          </option>
          <option value="web">Una web</option>
          <option value="ecommerce">Una tienda online</option>
          <option value="mobile">Una app móvil</option>
          <option value="maintenance">Mantenimiento de mi web</option>
          <option value="other">Otra cosa</option>
        </select>
      </div>
      <div className="formulario__campo">
        <label htmlFor="message">Tu mensaje</label>
        <textarea
          id="message"
          name="message"
          placeholder="Qué negocio tienes y qué te gustaría conseguir"
          rows={5}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
        {isSubmitting && <Icon name="spinner" spin />}
        <span>{isSubmitting ? 'Enviando…' : 'Enviar mensaje'}</span>
      </button>
    </form>
  );
};

export default ContactForm;
