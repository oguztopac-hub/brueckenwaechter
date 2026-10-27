/* Service Worker: legt alle Dateien beim ersten Laden ab, danach läuft das Spiel offline.
   Neue Fassung veröffentlichen: CACHE hochzählen (und VERSION in spiel.js). */
const CACHE = 'bw-v2';
const DATEIEN = [
  './',
  'index.html',
  'stil.css',
  'spiel.js',
  'szenen.js',
  'level1.js',
  'level2.js',
  'level3.js',
  'manifest.webmanifest',
  'schriften/fraunces-latin.woff2',
  'schriften/atkinson-400-latin.woff2',
  'schriften/atkinson-700-latin.woff2',
  'bilder/icon-192.png',
  'bilder/icon-512.png',
  'bilder/icon-maskable-512.png'
];

self.addEventListener('install', (e) => {
  // cache: 'reload' umgeht den HTTP-Cache, damit wirklich die neue Fassung abgelegt wird
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(DATEIEN.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((namen) => Promise.all(namen.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((treffer) => treffer || fetch(e.request).then((antwort) => {
      if (antwort.ok) {
        const kopie = antwort.clone();
        caches.open(CACHE).then((c) => c.put(e.request, kopie));
      }
      return antwort;
    }))
  );
});
