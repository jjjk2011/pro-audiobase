const cacheName = 'audiobase-v1';
const assets = ['./', './index.html', './delay.html', './projeto.html', './fase.html', './gerador.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});