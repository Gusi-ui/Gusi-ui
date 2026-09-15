import { describe, it, expect } from 'vitest';
import { toPublicReview, type StoredReview } from '../worker/src/reviews-public';

const stored: StoredReview = {
  id: '1718000000000',
  name: 'Ana Ruiz',
  company: 'Panadería Ruiz',
  rating: 5,
  message: 'Rehizo la web y las reservas online funcionan solas.',
  date: '2026-04-02T10:15:00.000Z',
  verified: false,
  approved: true,
  email: 'ana@panaderiaruiz.es',
  ip: '81.32.44.10',
  userAgent: 'Mozilla/5.0',
};

describe('toPublicReview', () => {
  it('no expone email, ip, userAgent ni approved', () => {
    const publico = toPublicReview(stored) as Record<string, unknown>;

    expect(publico.email).toBeUndefined();
    expect(publico.ip).toBeUndefined();
    expect(publico.userAgent).toBeUndefined();
    expect(publico.approved).toBeUndefined();
  });

  it('expone exactamente los campos públicos previstos', () => {
    expect(Object.keys(toPublicReview(stored)).sort()).toEqual([
      'company',
      'date',
      'id',
      'message',
      'name',
      'rating',
      'source',
      'verified',
    ]);
  });

  it('conserva el contenido visible de la reseña', () => {
    const publico = toPublicReview(stored);

    expect(publico.name).toBe('Ana Ruiz');
    expect(publico.company).toBe('Panadería Ruiz');
    expect(publico.rating).toBe(5);
    expect(publico.source).toBe('web');
  });

  it('normaliza company ausente a null y verified a booleano', () => {
    const { company: _company, verified: _verified, ...sinOpcionales } = stored;
    const publico = toPublicReview(sinOpcionales as StoredReview);

    expect(publico.company).toBeNull();
    expect(publico.verified).toBe(false);
  });
});
