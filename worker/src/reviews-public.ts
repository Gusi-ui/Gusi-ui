/**
 * Proyección pública de una reseña.
 *
 * El objeto que se guarda en KV incluye email, ip y userAgent del autor. Son
 * datos personales y no deben salir nunca por un endpoint público, así que la
 * forma pública se construye campo a campo en lugar de con spread.
 */

export type StoredReview = {
  id: string;
  name: string;
  company?: string | null;
  rating: number;
  message: string;
  date: string;
  verified?: boolean;
  email?: string;
  ip?: string | null;
  userAgent?: string;
  approved?: boolean;
};

export type PublicReview = {
  id: string;
  name: string;
  company: string | null;
  rating: number;
  message: string;
  date: string;
  verified: boolean;
  source: 'web';
};

export const toPublicReview = (review: StoredReview): PublicReview => ({
  id: review.id,
  name: review.name,
  company: review.company ?? null,
  rating: review.rating,
  message: review.message,
  date: review.date,
  verified: review.verified === true,
  source: 'web',
});
