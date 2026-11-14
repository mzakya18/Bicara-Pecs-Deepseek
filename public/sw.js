const CACHE_NAME = 'bicara-pecs-v4';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => { if (key !== CACHE_NAME) return caches.delete(key); })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Offline-first: Kembalikan dari cache dulu jika ada
      if (cached) return cached;
      
      // Jika tidak ada di cache, ambil dari network
      return fetch(event.request).then((response) => {
        // Jangan simpan response error ke cache
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        // Fallback jika offline
        return caches.match('/Bicara-Pecs-Deepseek/index.html');
      });
    })
  );
});
