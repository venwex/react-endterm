const CACHE_NAME = "app-cache-v1";

const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/assets/index-D8YVPN-w.js",
  "/assets/index-BU5mAHJ0.css"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.mode === "navigate") {
    event.respondWith(
      caches.match("/index.html")
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      return cached || fetch(req).catch(() => cached);
    })
  );

});
