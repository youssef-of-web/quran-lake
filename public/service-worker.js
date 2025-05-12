const CACHE_NAME = 'HOLY_QURAN_V1';

async function cacheCoreAssets() {
  const cache = await caches.open(CACHE_NAME);
  return cache.addAll(['/', '/mushaf.svg', '/mushaf.png', '/reciter.png']);
}

self.addEventListener('install', (event) => {
  event.waitUntil(cacheCoreAssets());
  self.skipWaiting();
});

async function clearOldCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames
      .filter((name) => name !== CACHE_NAME)
      .map((name) => caches.delete(name))
  );
}

self.addEventListener('activate', (event) => {
  event.waitUntil(clearOldCaches());
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);
  event.respondWith(fetch(event.request));
});
