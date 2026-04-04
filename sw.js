const CACHE_NAME = 'audiobase-pro-cache'; // Sem números de versão!

const URLs_INICIAIS = [
  './',
  './index.html',
  './delay.html',
  './projeto.html',
  './fase.html',
  './gerador.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// 1. INSTALAÇÃO: Salva os arquivos básicos na primeira vez que o usuário entra
self.addEventListener('install', evento => {
  self.skipWaiting(); // Força o Service Worker a assumir o controle na hora
  evento.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLs_INICIAIS))
  );
});

// 2. ATIVAÇÃO: Limpa qualquer cache antigo perdido e assume o app
self.addEventListener('activate', evento => {
  evento.waitUntil(self.clients.claim());
});

// 3. INTERCEPTADOR (A Mágica da Automação)
self.addEventListener('fetch', evento => {
  evento.respondWith(
    // TENTA BUSCAR NA INTERNET PRIMEIRO
    fetch(evento.request)
      .then(respostaDaRede => {
        // Se deu certo (tem internet), ele clona a resposta nova
        const clone = respostaDaRede.clone();
        
        // Abre o cache e atualiza com o arquivo fresquinho que acabou de baixar
        caches.open(CACHE_NAME).then(cache => {
          cache.put(evento.request, clone);
        });
        
        // Entrega a página atualizada para o usuário
        return respostaDaRede;
      })
      .catch(() => {
        // SE DER ERRO (SEM INTERNET / OFFLINE)
        // Ele ignora o erro e entrega o que está salvo no cache
        return caches.match(evento.request);
      })
  );
});
