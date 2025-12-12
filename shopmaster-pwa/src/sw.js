const CACHE_NAME = 'shopmaster-app-shell-v1';

// Главное: кэшируем App Shell — то, что нужно для отображения UI offline
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-512-maskable.png'
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Network-first для API
  if (request.url.includes('dummyjson.com')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first для статики
  event.respondWith(
    caches.match(request).then(cached => {
      return (
        cached ||
        fetch(request).catch(() => caches.match('/index.html'))
      );
    })
  );
});
