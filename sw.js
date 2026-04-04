const cacheName = 'audiobase-v3';
const assets = [
  './',
  './index.html',
  './delay.html',
  './projeto.html',
  './fase.html',
  './gerador.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assets))
  );
  self.skipWaiting(); // Força a instalação imediata do novo service worker
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        // Deleta os caches antigos se o nome não for o atual
        if (key !== cacheName) return caches.delete(key);
      }));
    })
  );
  self.clients.claim(); // Assume o controle da página imediatamente
});

// Estratégia "Network First" (Rede Primeiro, Cache como fallback)
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(respostaDaRede => {
        // Se conseguiu baixar da rede, atualiza o cache com a versão mais nova
        const clone = respostaDaRede.clone();
        caches.open(cacheName).then(cache => {
          cache.put(e.request, clone);
        });
        return respostaDaRede;
      })
      .catch(() => {
        // Se deu erro (sem internet), puxa do cache salvo
        return caches.match(e.request);
      })
  );
});
