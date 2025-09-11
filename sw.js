const CACHE_NAME = 'gusi-dev-v2.0.0';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

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
      .then(cache => {
        console.log('Service Worker: Cacheando recursos estáticos');
        return cache.addAll(urlsToCache);
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
  if (event.request.url.includes('/analytics') || 
      event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Siempre hacer fetch para actualizar cache
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            // Cachear respuesta válida para futuras requests
            if (networkResponse.status === 200) {
              caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  cache.put(event.request, networkResponse.clone());
                });
            }
            return networkResponse;
          })
          .catch(error => {
            console.log('Fetch failed; returning offline page instead.', error);
          });

        // Return cached response if available, otherwise wait for network
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