import { useEffect, useState, useCallback } from 'react';
import Icon from '@/components/ui/Icon';
import { fetchReviews, updateSchemaOrg, generateStars, type Review } from '@/lib/reviews';
import { getReviewsApi } from '@/lib/constants';
import { isValidEmail } from '@/lib/utils';
import { showNotification } from '@/lib/notifications';

type Props = {
  googleReviewsUrl: string;
};

const ReviewsSection = ({ googleReviewsUrl }: Props) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '', consent: false });

  const loadReviews = useCallback(async () => {
    try {
      const data = await fetchReviews();
      setReviews(data);
      updateSchemaOrg(data);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  const handleCarousel = (direction: 'prev' | 'next') => {
    const container = document.getElementById('testimonials-container');
    if (!container) return;
    const firstCard = container.querySelector('.testimonial-card') as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(container).gap) || 32;
    const scrollAmount = firstCard ? firstCard.offsetWidth + gap : 400;
    container.scrollBy({ left: direction === 'prev' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !rating || !form.message || !form.consent) {
      showNotification('Por favor, completa todos los campos obligatorios', 'error');
      return;
    }
    if (!isValidEmail(form.email)) {
      showNotification('Por favor, introduce un email válido', 'error');
      return;
    }
    if (form.message.length < 10) {
      showNotification('La reseña debe tener al menos 10 caracteres', 'error');
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
      setForm({ name: '', email: '', company: '', message: '', consent: false });
      setRating(0);
      showNotification(
        data.requiresApproval
          ? '¡Gracias! Tu reseña será revisada antes de publicarse.'
          : '¡Gracias! Tu reseña ha sido publicada.',
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
    new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <div className="testimonials-actions">
        <button
          className="btn btn-primary"
          aria-label="Dejar una reseña"
          type="button"
          onClick={() => setModalOpen(true)}
        >
          <Icon name="star" />
          <span>Dejar una Reseña</span>
        </button>
        <a
          href={googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-google"
          aria-label="Dejar reseña en Google"
        >
          <Icon name="google" />
          <span>Reseñar en Google</span>
        </a>
      </div>

      <div className="testimonials-carousel-wrapper">
        <button
          className="carousel-btn prev-btn"
          aria-label="Reseña anterior"
          type="button"
          onClick={() => handleCarousel('prev')}
        >
          <Icon name="chevron-left" />
        </button>
        <div className="testimonials-carousel" id="testimonials-container">
          {loading && <p className="text-center text-muted">Cargando reseñas...</p>}
          {!loading && reviews.length === 0 && (
            <p className="text-center text-muted">No se pudieron cargar las reseñas.</p>
          )}
          {reviews.slice(0, 15).map((review) => {
            const isGoogle = review.source === 'google';
            return (
              <div key={review.id || `${review.name}-${review.date}`} className="testimonial-card">
                <div className={`review-badge ${isGoogle ? 'google' : 'web'}`}>
                  <Icon name={isGoogle ? 'google' : 'globe'} />
                  <span>{isGoogle ? 'Google' : 'Web'}</span>
                </div>
                <div className="testimonial-content">
                  <div
                    className="stars"
                    aria-label={`${review.rating} de 5 estrellas`}
                    dangerouslySetInnerHTML={{ __html: generateStars(review.rating) }}
                  />
                  <p>&quot;{review.message}&quot;</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <Icon name={isGoogle ? 'google' : 'user'} />
                  </div>
                  <div className="author-info">
                    <h4>{review.name}</h4>
                    <p>{review.company || (isGoogle ? 'Usuario de Google' : 'Cliente')}</p>
                    <span className="review-date">{formatDate(review.date)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          className="carousel-btn next-btn"
          aria-label="Siguiente reseña"
          type="button"
          onClick={() => handleCarousel('next')}
        >
          <Icon name="chevron-right" />
        </button>
      </div>

      <div className="testimonials-stats" id="testimonials-stats">
        <div className="stat-item">
          <div className="stat-number" id="avg-rating">
            {avgRating}
          </div>
          <div className="stat-label">Valoración Promedio</div>
        </div>
        <div className="stat-item">
          <div className="stat-number" id="total-reviews">
            {reviews.length}
          </div>
          <div className="stat-label">Reseñas Totales</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">100%</div>
          <div className="stat-label">Clientes Satisfechos</div>
        </div>
      </div>

      <div
        id="review-modal"
        className={`review-modal${modalOpen ? ' active' : ''}`}
        role="dialog"
        aria-labelledby="review-modal-title"
        aria-hidden={!modalOpen}
      >
        <div
          className="review-modal-overlay"
          onClick={() => setModalOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setModalOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Cerrar modal"
        />
        <div className="review-modal-content">
          <button
            className="review-modal-close"
            aria-label="Cerrar formulario de reseña"
            type="button"
            onClick={() => setModalOpen(false)}
          >
            <Icon name="times" />
          </button>
          <h2 id="review-modal-title" className="review-modal-title">
            Deja tu Reseña
          </h2>
          <p className="review-modal-subtitle">Tu opinión es muy importante para nosotros</p>

          <form className="review-form" onSubmit={handleSubmitReview}>
            <div style={{ display: 'none' }} aria-hidden="true">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value="" readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="review-name">Nombre *</label>
              <input
                type="text"
                id="review-name"
                required
                placeholder="Tu nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="review-email">Email *</label>
              <input
                type="email"
                id="review-email"
                required
                placeholder="tu@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="review-company">Empresa / Cargo (opcional)</label>
              <input
                type="text"
                id="review-company"
                placeholder="Ej: CEO de Mi Empresa"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Valoración *</label>
              <div className="rating-input" role="radiogroup" aria-label="Seleccionar valoración">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`rating-star${rating >= star ? ' illuminated' : ''}`}
                    aria-label={`${star} estrellas`}
                    onClick={() => setRating(star)}
                  >
                    <Icon name="star" />
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="review-message">Tu Reseña *</label>
              <textarea
                id="review-message"
                required
                rows={5}
                placeholder="Comparte tu experiencia trabajando conmigo..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  required
                  checked={form.consent}
                  onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                />
                <span>Acepto que mi reseña sea publicada en el sitio web</span>
              </label>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
              <Icon name={submitting ? 'spinner' : 'paper-plane'} spin={submitting} />
              <span>{submitting ? 'Publicando...' : 'Publicar Reseña'}</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReviewsSection;
