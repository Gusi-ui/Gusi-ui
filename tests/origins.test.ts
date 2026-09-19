import { describe, it, expect } from 'vitest';
import {
  PRODUCTION_ORIGIN,
  matchAllowedOrigin,
  resolveCorsOrigin,
  siteOriginFrom,
} from '../worker/src/origins';

const requestWithOrigin = (origin: string | null): Request =>
  new Request('https://alamia.es/api/resenas', {
    headers: origin ? { Origin: origin } : {},
  });

describe('matchAllowedOrigin', () => {
  it('acepta el origen de producción', () => {
    expect(matchAllowedOrigin('https://alamia.es')).toBe('https://alamia.es');
  });

  it('acepta localhost y 127.0.0.1 en cualquier puerto', () => {
    expect(matchAllowedOrigin('http://localhost:4321')).toBe('http://localhost:4321');
    expect(matchAllowedOrigin('http://127.0.0.1:8787')).toBe('http://127.0.0.1:8787');
  });

  it('rechaza dominios que solo empiezan por un origen permitido', () => {
    // El fallo original: startsWith('http://localhost') aceptaba estos.
    expect(matchAllowedOrigin('http://localhost.atacante.com')).toBeNull();
    expect(matchAllowedOrigin('https://alamia.es.atacante.com')).toBeNull();
    expect(matchAllowedOrigin('http://127.0.0.1.atacante.com')).toBeNull();
  });

  it('rechaza subdominios y esquemas no previstos', () => {
    expect(matchAllowedOrigin('https://localhost:443')).toBeNull();
    expect(matchAllowedOrigin('http://alamia.es')).toBeNull();
    expect(matchAllowedOrigin('https://sub.alamia.es')).toBeNull();
  });

  it('rechaza valores vacíos o no parseables', () => {
    expect(matchAllowedOrigin(null)).toBeNull();
    expect(matchAllowedOrigin('')).toBeNull();
    expect(matchAllowedOrigin('no-es-una-url')).toBeNull();
  });
});

describe('resolveCorsOrigin', () => {
  it('nunca refleja un origen no permitido', () => {
    expect(resolveCorsOrigin(requestWithOrigin('http://localhost.atacante.com'))).toBe(
      PRODUCTION_ORIGIN
    );
  });

  it('cae a producción cuando no hay cabecera Origin', () => {
    expect(resolveCorsOrigin(requestWithOrigin(null))).toBe(PRODUCTION_ORIGIN);
    expect(resolveCorsOrigin(null)).toBe(PRODUCTION_ORIGIN);
  });

  it('refleja un origen permitido', () => {
    expect(resolveCorsOrigin(requestWithOrigin('http://localhost:4321'))).toBe(
      'http://localhost:4321'
    );
  });
});

describe('origen por entorno (staging)', () => {
  const STAGING = 'https://dev.alamia.es';

  it('siteOriginFrom lee SITE_ORIGIN y cae a producción si falta o no es válido', () => {
    expect(siteOriginFrom({ SITE_ORIGIN: STAGING })).toBe(STAGING);
    expect(siteOriginFrom({})).toBe(PRODUCTION_ORIGIN);
    expect(siteOriginFrom(null)).toBe(PRODUCTION_ORIGIN);
    expect(siteOriginFrom({ SITE_ORIGIN: 'http://dev.alamia.es' })).toBe(PRODUCTION_ORIGIN);
    expect(siteOriginFrom({ SITE_ORIGIN: 'https://dev.alamia.es/' })).toBe(PRODUCTION_ORIGIN);
    expect(siteOriginFrom({ SITE_ORIGIN: 'no-es-una-url' })).toBe(PRODUCTION_ORIGIN);
  });

  it('staging acepta su origen y rechaza el de producción', () => {
    expect(matchAllowedOrigin(STAGING, STAGING)).toBe(STAGING);
    expect(matchAllowedOrigin(PRODUCTION_ORIGIN, STAGING)).toBeNull();
    expect(matchAllowedOrigin('https://dev.alamia.es.atacante.com', STAGING)).toBeNull();
    expect(matchAllowedOrigin('http://localhost:4321', STAGING)).toBe('http://localhost:4321');
  });

  it('producción rechaza el origen de staging', () => {
    expect(matchAllowedOrigin(STAGING)).toBeNull();
  });

  it('resolveCorsOrigin cae al origen del entorno', () => {
    expect(resolveCorsOrigin(requestWithOrigin('https://atacante.com'), STAGING)).toBe(STAGING);
    expect(resolveCorsOrigin(null, STAGING)).toBe(STAGING);
  });
});
