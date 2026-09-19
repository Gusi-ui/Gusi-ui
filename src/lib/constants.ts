export const SITE_URL = 'https://alamia.es';
export const SITE_NAME = 'alamia.es';
export const CONTACT_EMAIL = 'info@alamia.es';
export const WHATSAPP_URL = 'https://wa.me/34619027645';
export const WHATSAPP_PHONE = '+34 619 027 645';
export const GA_ID = 'G-165E9VQDD8';
export const GOOGLE_REVIEWS_URL =
  'https://search.google.com/local/writereview?placeid=ChIJSadCmoe1pBIRcuyJg--BusU';

/**
 * Base de la API. En el navegador es el mismo origen de la página (alamia.es en
 * producción, dev.alamia.es en staging), salvo en `pnpm dev`, que llama al worker
 * local. En el build (sin window) se usa producción.
 */
const getApiBase = (): string => {
  if (typeof window === 'undefined') return `${SITE_URL}/api`;
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8787/api';
  }
  return `${window.location.origin}/api`;
};

export const getReviewsApi = (): string => `${getApiBase()}/resenas`;

export const getContactApi = (): string => `${getApiBase()}/contacto`;

export const getAdminReviewsApi = (): string => `${getApiBase()}/admin/resenas`;

export const getPaymentsApi = (path = ''): string => {
  const base = `${getApiBase()}/payments`;
  return path ? `${base}${path.startsWith('/') ? path : `/${path}`}` : base;
};
