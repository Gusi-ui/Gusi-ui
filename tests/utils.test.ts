import { describe, it, expect } from 'vitest';

const sanitizeText = (text: string | null | undefined): string => {
  if (!text) return '';
  return String(text)
    .replace(/[\uD800-\uDFFF]/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

describe('sanitizeText', () => {
  it('trims whitespace', () => {
    expect(sanitizeText('  hello  ')).toBe('hello');
  });

  it('returns empty for null', () => {
    expect(sanitizeText(null)).toBe('');
  });

  it('removes control characters', () => {
    expect(sanitizeText('hello\x00world')).toBe('helloworld');
  });
});

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('test@alamia.es')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});
