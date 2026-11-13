const CACHE_NAME = 'bicara-pecs-v2-cache-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((cacheName) => { if (cacheName !== CACHE_NAME) return caches.delete(cacheName); })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Hanya cache request GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => { cache.put(event.request, responseClone); });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
