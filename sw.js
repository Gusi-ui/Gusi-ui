const CACHE_NAME = 'gusi-dev-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.min.css',
  '/script.min.js',
  '/images/proyectos/app-restaurante.jpg',
  '/images/proyectos/dashboard-analytics.jpg',
  '/images/proyectos/ecommerce-boutique.jpg',
  '/images/proyectos/plataforma-educativa.jpg',
  '/images/proyectos/portal-inmobiliario.jpg',
  '/imagen-gestion-citas.svg',
  '/tu-foto-perfil.jpg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch de recursos
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el recurso en caché o realiza la petición
        return response || fetch(event.request);
      })
  );
});