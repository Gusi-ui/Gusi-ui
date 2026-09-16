import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Se quitan los comentarios: hablan de reglas que ya no existen y falsearían
// las comprobaciones estructurales de más abajo.
const css = readFileSync(
  fileURLToPath(new URL('../src/styles/legacy.css', import.meta.url)),
  'utf8'
).replace(/\/\*[\s\S]*?\*\//g, '');

/** Extrae los tokens `--nombre: #hex;` del primer bloque que abre con el selector dado. */
const tokensDe = (selector: string): Record<string, string> => {
  const inicio = css.indexOf(`${selector} {`);
  if (inicio === -1) throw new Error(`No se encontró el bloque ${selector}`);
  const bloque = css.slice(inicio, css.indexOf('}', inicio));

  const tokens: Record<string, string> = {};
  for (const [, nombre, hex] of bloque.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    tokens[nombre] = hex.toLowerCase();
  }
  return tokens;
};

const luminancia = (hex: string): number => {
  const canales = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * canales[0] + 0.7152 * canales[1] + 0.0722 * canales[2];
};

const contraste = (a: string, b: string): number => {
  const [claro, oscuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (oscuro + 0.05);
};

const claro = tokensDe(':root');
const oscuro = tokensDe('.dark');

const AA_TEXTO_NORMAL = 4.5;

describe('contraste de los tokens de tema', () => {
  it('reconoce el algoritmo con los extremos conocidos', () => {
    expect(contraste('#000000', '#ffffff')).toBeCloseTo(21, 1);
    expect(contraste('#ffffff', '#ffffff')).toBeCloseTo(1, 5);
  });

  describe.each([
    ['claro', claro],
    ['oscuro', oscuro],
  ])('tema %s', (_nombre, tokens) => {
    it.each(['text-primary', 'text-secondary', 'text-light', 'primary-text'])(
      '--%s cumple AA sobre --bg-primary y --bg-card',
      (token) => {
        expect(contraste(tokens[token], tokens['bg-primary'])).toBeGreaterThanOrEqual(
          AA_TEXTO_NORMAL
        );
        expect(contraste(tokens[token], tokens['bg-card'])).toBeGreaterThanOrEqual(
          AA_TEXTO_NORMAL
        );
      }
    );

    // El hero es una conversación: el texto tiene que leerse dentro de las dos
    // burbujas, no solo sobre el fondo de la página.
    it.each(['burbuja-cliente', 'burbuja-jose'])(
      '--text-primary y --text-secondary cumplen AA sobre --%s',
      (burbuja) => {
        for (const texto of ['text-primary', 'text-secondary']) {
          expect(contraste(tokens[texto], tokens[burbuja])).toBeGreaterThanOrEqual(
            AA_TEXTO_NORMAL
          );
        }
      }
    );

    it('el texto blanco del botón de WhatsApp cumple AA', () => {
      expect(contraste('#ffffff', tokens['whatsapp-boton'])).toBeGreaterThanOrEqual(
        AA_TEXTO_NORMAL
      );
    });

    it.each(['boton-fondo', 'boton-fondo-hover'])(
      'el texto blanco sobre --%s cumple AA',
      (fondo) => {
        expect(contraste('#ffffff', tokens[fondo])).toBeGreaterThanOrEqual(AA_TEXTO_NORMAL);
      }
    );

    it('el botón principal se distingue del fondo de la página (3:1, WCAG 1.4.11)', () => {
      expect(contraste(tokens['boton-fondo'], tokens['bg-primary'])).toBeGreaterThanOrEqual(3);
    });
  });
});

describe('un único origen de verdad para el tema', () => {
  it('no redefine tokens dentro de @media (prefers-color-scheme)', () => {
    // El bug original: los tokens se redefinían en un @media sin guardar, así que
    // elegir el modo claro con el sistema en oscuro dejaba fondos oscuros con
    // componentes claros. La clase .dark debe ser el único interruptor.
    const bloquesMedia = css.match(/@media[^{]*prefers-color-scheme[^{]*\{/g) ?? [];
    expect(bloquesMedia).toHaveLength(0);
  });

  it('no usa !important en los tokens de tema oscuro', () => {
    const inicio = css.indexOf('.dark {');
    expect(css.slice(inicio, css.indexOf('}', inicio))).not.toContain('!important');
  });
});
