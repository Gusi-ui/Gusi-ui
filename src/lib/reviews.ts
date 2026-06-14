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

export const updateSchemaOrg = (reviews: Review[]): void => {
  if (reviews.length === 0) return;

  const schemaScript = document.getElementById('schema-business');
  if (!schemaScript?.textContent) return;

  try {
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = (totalRating / reviews.length).toFixed(1);
    const schema = JSON.parse(schemaScript.textContent);

    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      ratingCount: reviews.length.toString(),
      bestRating: '5',
      worstRating: '1',
    };

    const recentReviews = [...reviews]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    schema.review = recentReviews.map((review) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: review.name },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating.toString(),
        bestRating: '5',
        worstRating: '1',
      },
      reviewBody: review.message,
      datePublished: review.date,
    }));

    schemaScript.textContent = JSON.stringify(schema, null, 2);
  } catch {
    // non-critical
  }
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
