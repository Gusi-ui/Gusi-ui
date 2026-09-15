import { describe, it, expect } from 'vitest';
import {
  PORTAL_TOKEN_TTL_SECONDS,
  createPortalToken,
  hashPortalToken,
  isWellFormedPortalToken,
  portalTokenKey,
} from '../worker/src/portal-tokens';

describe('createPortalToken', () => {
  it('genera tokens distintos en cada llamada', () => {
    const tokens = new Set(Array.from({ length: 200 }, createPortalToken));
    expect(tokens.size).toBe(200);
  });

  it('produce tokens seguros para una query string', () => {
    for (let i = 0; i < 50; i++) {
      const token = createPortalToken();
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(encodeURIComponent(token)).toBe(token);
    }
  });

  it('genera tokens que el validador acepta', () => {
    for (let i = 0; i < 50; i++) {
      expect(isWellFormedPortalToken(createPortalToken())).toBe(true);
    }
  });
});

describe('hashPortalToken', () => {
  it('es determinista', async () => {
    const token = createPortalToken();
    expect(await hashPortalToken(token)).toBe(await hashPortalToken(token));
  });

  it('da hashes distintos para tokens distintos', async () => {
    expect(await hashPortalToken(createPortalToken())).not.toBe(
      await hashPortalToken(createPortalToken())
    );
  });

  it('devuelve un SHA-256 en hexadecimal', async () => {
    expect(await hashPortalToken('token-de-prueba')).toMatch(/^[0-9a-f]{64}$/);
  });

  it('coincide con el SHA-256 conocido de una cadena vacía', async () => {
    expect(await hashPortalToken('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    );
  });

  it('nunca deja el token en claro dentro de la clave de KV', async () => {
    const token = createPortalToken();
    expect(portalTokenKey(await hashPortalToken(token))).not.toContain(token);
  });
});

describe('isWellFormedPortalToken', () => {
  it('rechaza lo que no puede ser un token nuestro', () => {
    expect(isWellFormedPortalToken(undefined)).toBe(false);
    expect(isWellFormedPortalToken('')).toBe(false);
    expect(isWellFormedPortalToken('corto')).toBe(false);
    expect(isWellFormedPortalToken('a'.repeat(200))).toBe(false);
    expect(isWellFormedPortalToken('con espacios dentro del token largo!!')).toBe(false);
    expect(isWellFormedPortalToken(12345)).toBe(false);
  });
});

describe('caducidad', () => {
  it('mantiene la ventana en 15 minutos', () => {
    expect(PORTAL_TOKEN_TTL_SECONDS).toBe(900);
  });
});
