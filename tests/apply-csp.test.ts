import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
// @ts-expect-error -- script de build en JS sin tipos
import { hashesDeScriptsInline, construirCsp, insertarCsp } from '../scripts/apply-csp.mjs';

const sha256 = (cuerpo: string) =>
  `'sha256-${createHash('sha256').update(cuerpo, 'utf8').digest('base64')}'`;

const pagina = (cuerpo: string) => `<!DOCTYPE html><html><head>${cuerpo}</head><body></body></html>`;

describe('hashesDeScriptsInline', () => {
  it('calcula el hash del contenido exacto del script', () => {
    const codigo = 'console.log("hola");';
    expect(hashesDeScriptsInline(pagina(`<script>${codigo}</script>`))).toEqual([sha256(codigo)]);
  });

  it('ignora los scripts con src, que la CSP cubre con self', () => {
    expect(hashesDeScriptsInline(pagina('<script src="/app.js"></script>'))).toEqual([]);
  });

  it('ignora los bloques de datos como application/ld+json', () => {
    const html = pagina('<script type="application/ld+json">{"@type":"Person"}</script>');
    expect(hashesDeScriptsInline(html)).toEqual([]);
  });

  it('ignora los scripts vacíos', () => {
    expect(hashesDeScriptsInline(pagina('<script>   </script>'))).toEqual([]);
  });

  it('no repite el hash de dos scripts idénticos', () => {
    const html = pagina('<script>const a=1;</script><script>const a=1;</script>');
    expect(hashesDeScriptsInline(html)).toHaveLength(1);
  });

  it('recoge varios scripts distintos', () => {
    const html = pagina('<script>const a=1;</script><script type="module">const b=2;</script>');
    expect(hashesDeScriptsInline(html)).toHaveLength(2);
  });
});

describe('construirCsp', () => {
  const csp = construirCsp([sha256('x')]);

  it('bloquea por defecto lo que no sea del propio sitio', () => {
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
  });

  it('nunca permite scripts inline arbitrarios', () => {
    expect(csp).not.toContain("script-src 'self' 'unsafe-inline'");
    expect(csp.split('script-src')[1].split(';')[0]).not.toContain("'unsafe-inline'");
    expect(csp).not.toContain("'unsafe-eval'");
  });

  it('incluye los hashes recibidos', () => {
    expect(csp).toContain(sha256('x'));
  });

  it('permite los orígenes que el sitio necesita de verdad', () => {
    expect(csp).toContain('https://js.stripe.com');
    expect(csp).toContain('https://www.googletagmanager.com');
    expect(csp).toContain('https://api.stripe.com');
  });
});

describe('insertarCsp', () => {
  it('coloca la meta dentro del head', () => {
    const resultado = insertarCsp(pagina('<title>x</title>'));
    expect(resultado).toMatch(/<head><meta http-equiv="Content-Security-Policy"/);
  });

  it('cubre los scripts de la propia página', () => {
    const codigo = 'const a=1;';
    const resultado = insertarCsp(pagina(`<script>${codigo}</script>`));
    expect(resultado).toContain(sha256(codigo).replaceAll("'", "'"));
  });

  it('es idempotente: aplicarla dos veces no duplica la meta', () => {
    const una = insertarCsp(pagina('<script>const a=1;</script>'));
    const dos = insertarCsp(una);
    expect(dos.match(/Content-Security-Policy/g)).toHaveLength(1);
    expect(dos).toBe(una);
  });

  it('falla si la página no tiene head, en vez de publicarla sin CSP', () => {
    expect(() => insertarCsp('<html><body>hola</body></html>')).toThrow(/<head>/);
  });
});
