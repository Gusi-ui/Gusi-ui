// Bump versions to force SW refresh
const CACHE_NAME = 'gusi-dev-v2.0.1';
const STATIC_CACHE = 'static-v2.0.1';
const DYNAMIC_CACHE = 'dynamic-v2.0.1';

// Recursos críticos para instalación inmediata
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.min.css',
  '/script.min.js',
  '/styles.css',
  '/script.js',
  '/images/proyectos/app-restaurante.jpg',
  '/images/proyectos/dashboard-analytics.jpg',
  '/images/proyectos/ecommerce-boutique.jpg',
  '/images/proyectos/plataforma-educativa.jpg',
  '/images/proyectos/portal-inmobiliario.jpg',
  '/imagen-gestion-citas.svg',
  '/tu-foto-perfil-optimizada.jpg',
  '/tu-foto-perfil.jpg',
  '/freelancer-icon-optimizado.png',
  '/favicon.ico',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Instalación del Service Worker - Estrategia Cache First
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(async cache => {
        console.log('Service Worker: Cacheando recursos estáticos (tolerante a fallos)');
        for (const url of urlsToCache) {
          try {
            // Intentar añadir cada recurso individualmente
            await cache.add(url);
          } catch (err) {
            console.warn('Service Worker: No se pudo cachear', url, err && err.message);
            // Continuar con el siguiente recurso
          }
        }
      })
      .then(() => self.skipWaiting())
  );
});

// Activación y limpieza de caches antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Eliminando cache antiguo', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Estrategia de caching avanzada - Stale While Revalidate
self.addEventListener('fetch', event => {
  // No cachear requests de analytics ni formularios
  if (event.request.url.includes('/analytics') || event.request.method !== 'GET') {
    return;
  }

  const isLocalhost = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

  // En desarrollo (localhost), usar estrategia Network-First para evitar caché obsoleta
  if (isLocalhost) {
    event.respondWith(
      fetch(event.request)
        .then(resp => {
          // Opcional: actualizar cache dinámica también en local
          if (resp && resp.status === 200) {
            const copy = resp.clone();
            caches.open(DYNAMIC_CACHE).then(c => c.put(event.request, copy));
          }
          return resp;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Producción: Stale-While-Revalidate simplificado
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then(cache => cache.put(event.request, responseToCache));
          }
          return networkResponse.clone();
        })
        .catch(() => cachedResponse);

      // Devuelve cache si existe rápidamente, y sino espera a la red
      return cachedResponse || fetchPromise;
    })
  );
});

// Manejo de mensajes para actualizaciones
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});