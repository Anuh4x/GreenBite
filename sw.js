/* GreenBite Service Worker */
const CACHE_VERSION = 'gb-v2';
const PRECACHE = `precache-${CACHE_VERSION}`;
const RUNTIME = `runtime-${CACHE_VERSION}`;

// Use the SW scope as the base URL to avoid absolute path issues
const toURL = (u) => new URL(u, self.registration.scope).toString();

const PRECACHE_URLS = [
  './',                     // folder index (some hosts need this)
  './index.html',
  './recipes.html',
  './calculator.html',
  './workouts.html',
  './mindfulness.html',
  './contact.html',

  // CSS & JS
  './styles.css',
  './app.js',
  './recipes.js',
  './workout.js',          // <-- correct filename (was workouts.js before)

  // Manifest & icons
  './manifest.webmanifest',
  './icons/favicon-16.png',
  './icons/favicon-32.png',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-192.png',
  './icons/maskable-512.png',

  // Media used on pages (optional but helps offline)
  './Logo_original_high_quality.webp',
  './Background_Optimized_original_high_quality.webp',
  './Rain.mp3'
].map(toURL);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => ![PRECACHE, RUNTIME].includes(k))
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Strategy:
// - HTML navigations: try network, fall back to cache, then to index.html offline
// - Static assets: cache-first, fall back to network
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle same-origin requests
  if (new URL(req.url).origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const net = await fetch(req);
          // update runtime cache
          const cache = await caches.open(RUNTIME);
          cache.put(req, net.clone());
          return net;
        } catch {
          const cached = await caches.match(req);
          if (cached) return cached;
          // last resort: app shell
          return caches.match(toURL('./index.html'));
        }
      })()
    );
    return;
  }

  // For assets: cache-first
  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const net = await fetch(req);
        // Put a copy in runtime cache (avoid caching POST, etc.)
        if (req.method === 'GET' && net && net.ok) {
          const cache = await caches.open(RUNTIME);
          cache.put(req, net.clone());
        }
        return net;
      } catch {
        return cached; // if network fails and we had it in cache
      }
    })()
  );
});
