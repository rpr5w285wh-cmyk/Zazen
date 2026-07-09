// Service worker for the Just Sitting zazen app.
// Caches the app shell so it loads fully offline once visited.
// The cache name tracks the version passed by the page as ?v=NN, so each app
// update creates a fresh cache and old ones are cleared on activate.
const VERSION = new URL(location).searchParams.get('v') || '0';
const CACHE = 'zazen-v' + VERSION;
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg',
  './apple-touch-icon.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
      return resp;
    }).catch(() => caches.match('./')))
  );
});
