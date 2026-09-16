import { getReviewsApi } from '@/lib/constants';

export type Review = {
  id?: string;
  name: string;
  company?: string | null;
  rating: number;
  message: string;
  date: string;
  source?: 'google' | 'web';
};

export const fetchReviews = async (): Promise<Review[]> => {
  try {
    const response = await fetch(getReviewsApi(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      const apiReviews: Review[] = data.reviews || [];
      return apiReviews.map((r) => ({ ...r, source: r.source || 'web' }));
    }
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
  }
  return [];
};
