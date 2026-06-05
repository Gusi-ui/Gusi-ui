export const SITE_URL = 'https://alamia.es';
export const SITE_NAME = 'alamia.es';
export const CONTACT_EMAIL = 'info@alamia.es';
export const WHATSAPP_URL = 'https://wa.me/34619027645';
export const WHATSAPP_PHONE = '+34 619 027 645';
export const GA_ID = 'G-165E9VQDD8';
export const GOOGLE_REVIEWS_URL =
  'https://search.google.com/local/writereview?placeid=ChIJSadCmoe1pBIRcuyJg--BusU';

export const getReviewsApi = (): string => {
  if (typeof window === 'undefined') return `${SITE_URL}/api/resenas`;
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8787/api/resenas';
  }
  return `${SITE_URL}/api/resenas`;
};

export const getContactApi = (): string => {
  if (typeof window === 'undefined') return `${SITE_URL}/api/contacto`;
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8787/api/contacto';
  }
  return `${SITE_URL}/api/contacto`;
};
