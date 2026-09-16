import { useEffect, useState, useCallback, useRef } from 'react';
import Icon from '@/components/ui/Icon';
import { fetchReviews, type Review } from '@/lib/reviews';
import { getReviewsApi } from '@/lib/constants';
import { isValidEmail } from '@/lib/utils';
import { showNotification } from '@/lib/notifications';

type Props = {
  googleReviewsUrl: string;
};

const FORMULARIO_VACIO = { name: '', email: '', company: '', message: '', consent: false };

const Estrellas = ({ rating }: { rating: number }) => (
  <span className="opinion__estrellas" role="img" aria-label={`${rating} de 5 estrellas`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} className={Math.round(rating) >= n ? undefined : 'apagada'}>
        <Icon name="star" />
      </span>
    ))}
  </span>
);

const ReviewsSection = ({ googleReviewsUrl }: Props) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [form, setForm] = useState(FORMULARIO_VACIO);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listaRef = useRef<HTMLUListElement>(null);

  const loadReviews = useCallback(async () => {
    try {
      setReviews(await fetchReviews());
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // <dialog> nativo: atrapa el foco, cierra con Escape y lo devuelve al botón.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (modalOpen && !dialog.open) dialog.showModal();
    if (!modalOpen && dialog.open) dialog.close();
  }, [modalOpen]);

  const media =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toLocaleString('es-ES', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
      : null;

  const desplazar = (direction: 'prev' | 'next') => {
    const lista = listaRef.current;
    if (!lista) return;
    const primera = lista.querySelector('li');
    const gap = parseFloat(getComputedStyle(lista).columnGap) || 16;
    const paso = primera ? primera.offsetWidth + gap : lista.clientWidth;
    lista.scrollBy({ left: direction === 'prev' ? -paso : paso, behavior: 'smooth' });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !rating || !form.message || !form.consent) {
      showNotification('Completa los campos obligatorios y elige una valoración', 'error');
      return;
    }
    if (!isValidEmail(form.email)) {
      showNotification('Revisa el email: no parece válido', 'error');
      return;
    }
    if (form.message.length < 10) {
      showNotification('La reseña necesita al menos 10 caracteres', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(getReviewsApi(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim() || null,
          rating,
          message: form.message.trim(),
          consent: true,
          website: '',
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Error al publicar' }));
        throw new Error(err.message || 'Error al publicar la reseña');
      }

      const data = await response.json();
      setModalOpen(false);
      setForm(FORMULARIO_VACIO);
      setRating(0);
      showNotification(
        data.requiresApproval
          ? 'Gracias. La reviso y la publico en cuanto pueda.'
          : 'Gracias. Tu reseña ya está publicada.',
        'success'
      );
      await loadReviews();
    } catch (error) {
      showNotification((error as Error).message || 'Error al publicar la reseña', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });

  return (
    <>
      <div className="opiniones__resumen">
        <p className="opiniones__media" aria-live="polite">
          {loading
            ? 'Cargando reseñas…'
            : media
              ? `${media} de 5 de media en ${reviews.length} ${reviews.length === 1 ? 'reseña' : 'reseñas'}`
              : 'Aquí aún no hay reseñas que mostrar.'}
        </p>
        <div className="opiniones__acciones">
          <button className="btn btn-secondary" type="button" onClick={() => setModalOpen(true)}>
            Dejar una reseña
          </button>
          <a href={googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="opiniones__google">
            Ver y dejar reseñas en Google
          </a>
        </div>
      </div>

      {reviews.length > 0 && (
        <div
          className={`opiniones__carrusel${reviews.length <= 3 ? ' opiniones__carrusel--caben' : ''}`}
        >
          <ul className="opiniones__lista" ref={listaRef} aria-label="Reseñas">
            {reviews.slice(0, 15).map((review) => {
              const isGoogle = review.source === 'google';
              return (
                <li key={review.id || `${review.name}-${review.date}`} className="opinion">
                  <figure className="opinion__burbuja">
                    <Estrellas rating={review.rating} />
                    <blockquote className="opinion__texto">
                      <p>{review.message}</p>
                    </blockquote>
                    <figcaption className="opinion__autor">
                      <strong>{review.name}</strong>
                      {review.company && <span>{review.company}</span>}
                      <span className="opinion__origen">
                        {isGoogle ? 'En Google' : 'En esta web'} · {formatDate(review.date)}
                      </span>
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
          {reviews.length > 1 && (
            <div className="opiniones__flechas">
              <button type="button" aria-label="Reseñas anteriores" onClick={() => desplazar('prev')}>
                <Icon name="chevron-left" />
              </button>
              <button type="button" aria-label="Más reseñas" onClick={() => desplazar('next')}>
                <Icon name="chevron-right" />
              </button>
            </div>
          )}
        </div>
      )}

      <dialog
        ref={dialogRef}
        className="resena-dialogo"
        aria-labelledby="resena-titulo"
        onClose={() => setModalOpen(false)}
        onClick={(e) => {
          // Clic en el fondo (fuera del contenido) cierra.
          if (e.target === e.currentTarget) setModalOpen(false);
        }}
      >
        <div className="resena-dialogo__contenido">
          <div className="resena-dialogo__cabeza">
            <h2 id="resena-titulo">Deja tu reseña</h2>
            <button
              className="resena-dialogo__cerrar"
              aria-label="Cerrar"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              <Icon name="times" />
            </button>
          </div>
          <p className="resena-dialogo__entrada">
            Si hemos trabajado juntos, me ayuda mucho que cuentes cómo fue.
          </p>

          <form className="formulario" onSubmit={handleSubmitReview}>
            <div hidden aria-hidden="true">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value="" readOnly />
            </div>
            <div className="formulario__campo">
              <label htmlFor="review-name">Nombre</label>
              <input
                type="text"
                id="review-name"
                autoComplete="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="formulario__campo">
              <label htmlFor="review-email">
                Email <span className="formulario__nota">(no se publica)</span>
              </label>
              <input
                type="email"
                id="review-email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="formulario__campo">
              <label htmlFor="review-company">
                Negocio o cargo <span className="formulario__nota">(opcional)</span>
              </label>
              <input
                type="text"
                id="review-company"
                autoComplete="organization"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>
            <fieldset className="formulario__campo formulario__valoracion">
              <legend>Valoración</legend>
              <div className="formulario__estrellas">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={rating >= star ? 'encendida' : undefined}
                    aria-label={`${star} de 5`}
                    aria-pressed={rating === star}
                    onClick={() => setRating(star)}
                  >
                    <Icon name="star" />
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="formulario__campo">
              <label htmlFor="review-message">Tu reseña</label>
              <textarea
                id="review-message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <label className="formulario__casilla">
              <input
                type="checkbox"
                required
                checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
              />
              <span>Acepto que mi reseña se publique en esta web</span>
            </label>
            <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
              {submitting && <Icon name="spinner" spin />}
              <span>{submitting ? 'Publicando…' : 'Publicar reseña'}</span>
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default ReviewsSection;
