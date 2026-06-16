import { getReviewsApi } from '@/lib/constants';

export type Review = {
  id?: string;
  name: string;
  email?: string;
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

import { iconSvgHtml } from '@/lib/icons';

export const generateStars = (rating: number): string => {
  let html = '';
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) html += iconSvgHtml('star');
    else if (i === fullStars && hasHalf) html += iconSvgHtml('star-half');
    else html += iconSvgHtml('star-outline');
  }
  return html;
};
