const CACHE = 'gb-v1';
const ASSETS = [
  '/', '/index.html','/recipes.html','/calculator.html','/workouts.html','/mindfulness.html','/contact.html',
  '/styles.css','/app.js','/recipes.js','/workouts.js','/assets/logo.png','/manifest.webmanifest'
];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(r=> r || fetch(e.request))
  );
});
