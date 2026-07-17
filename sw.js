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
  const isPage = e.request.mode === 'navigate'
    || new URL(e.request.url).pathname.endsWith('/index.html');
  if (isPage) {
    // Network-first for the page itself, so a new deploy is picked up on the
    // very next open. Cache-first here would pin the old page forever: the
    // stale page re-registers the old sw.js?v= URL, and no update can ever
    // break the loop. Offline falls back to the cached shell.
    e.respondWith(
      fetch(e.request).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
        return resp;
      }).catch(() => caches.match(e.request).then(hit => hit || caches.match('./')))
    );
    return;
  }
  // Static assets stay cache-first; the versioned cache name refreshes them.
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
      return resp;
    }).catch(() => caches.match('./')))
  );
});
