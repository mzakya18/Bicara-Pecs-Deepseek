const CACHE_NAME = 'bicara-pecs-v2-cache-v2'; // Versi dinaikkan agar cache lama terhapus

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Hapus cache lama
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Gunakan strategi Network First (Ambil dari internet dulu, baru cache)
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Jika berhasil ambil dari internet, simpan ke cache
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Jika offline/gagal, ambil dari cache
        return caches.match(event.request);
      })
  );
});
