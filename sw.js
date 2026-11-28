const KEY = 'demon-pack-lab-f5605b6a1fda35';
const PATHS = ["/","/cards/","/guide/","/about/","/privacy/","/contact/","/terms/","/guide/apex/","/offline.html","/manifest.webmanifest","/assets/apex-prism.webp","/assets/app-icon-192.png","/assets/app-icon-512.png","/assets/demon-gacha-guide-binder.webp","/assets/demon-gacha-guide-foil.webp","/assets/demon-gacha-guide-pack.webp","/assets/demon-pack-lab-logo.webp","/assets/site-d20510b93d28/app.mjs","/assets/site-d20510b93d28/search.mjs","/assets/site-d20510b93d28/styles.css","/assets/site-d20510b93d28/data.mjs","/assets/site-d20510b93d28/release-state.mjs"];
self.addEventListener('install', event => event.waitUntil(caches.open(KEY).then(cache => cache.addAll(PATHS))));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys =>
  Promise.all(keys.filter(key => key.startsWith('demon-pack-lab-') && key !== KEY).map(key => caches.delete(key)))
).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () => {
      const cache = await caches.open(KEY);
      return await cache.match(url.pathname) || await cache.match('/offline.html') || Response.error();
    }));
  } else if (request.destination === 'image' && url.pathname.startsWith('/assets/cards/') && url.pathname.endsWith('.webp')) {
    event.respondWith(caches.open(KEY).then(async cache => {
      const cached = await cache.match(url.pathname);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok) await cache.put(url.pathname, response.clone()).catch(() => {});
      return response;
    }));
  } else if (PATHS.includes(url.pathname)) {
    event.respondWith(caches.open(KEY).then(async cache => await cache.match(url.pathname) || fetch(request)));
  }
});
