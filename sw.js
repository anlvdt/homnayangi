const CACHE_NAME = 'homnayangi-v25';

// Vỏ ứng dụng + phông. Phông nằm trong danh sách cài đặt sẵn vì nếu thiếu,
// lần chạy offline đầu tiên sẽ rơi về phông hệ thống — dấu tiếng Việt lệch
// và cả giao diện xô chữ. Ảnh món KHÔNG cài sẵn (3,7 MB cho 149 món) mà được
// cache dần khi người dùng lật tới, theo chiến lược network-first bên dưới.
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-maskable-192.png',
    './icons/icon-maskable-512.png',
    './icons/author.png',
    './fonts/bevietnampro-400-latin.woff2',
    './fonts/bevietnampro-400-vietnamese.woff2',
    './fonts/bevietnampro-500-latin.woff2',
    './fonts/bevietnampro-500-vietnamese.woff2',
    './fonts/bevietnampro-600-latin.woff2',
    './fonts/bevietnampro-600-vietnamese.woff2',
    './fonts/bevietnampro-700-latin.woff2',
    './fonts/bevietnampro-700-vietnamese.woff2',
    './fonts/bevietnampro-800-latin.woff2',
    './fonts/bevietnampro-800-vietnamese.woff2',
];

// Install event - skip waiting to activate immediately
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Fetch event - Network First strategy
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Clone and cache the fresh response
                if (response.ok) {
                    const responseClone = response.clone();
                    // Keep the worker alive until the write finishes without delaying
                    // the fresh network response shown to the user.
                    event.waitUntil(
                        caches.open(CACHE_NAME)
                            .then(cache => cache.put(event.request, responseClone))
                            .catch(() => {})
                    );
                }
                return response;
            })
            .catch(() => {
                // Offline - fallback to cache
                return caches.match(event.request);
            })
    );
});

// Activate event - claim clients and clear old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name !== CACHE_NAME)
                        .map(name => caches.delete(name))
                );
            })
        ])
    );
});
