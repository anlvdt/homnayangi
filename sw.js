const CACHE_NAME = 'homnayangi-v47';

// Vỏ ứng dụng + phông. Phông nằm trong danh sách cài đặt sẵn vì nếu thiếu,
// lần chạy offline đầu tiên sẽ rơi về phông hệ thống — dấu tiếng Việt lệch
// và cả giao diện xô chữ. Ảnh món không cài sẵn để tránh tải toàn kho trên
// kết nối di động; ảnh chưa từng xem có thể không có khi offline.
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './images/credits.html',
    './images/commons-food-sources.json',
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
    const url = new URL(event.request.url);
    // Never store third-party content (including user-provided image links).
    if (url.origin !== self.location.origin) return;

    const isImage = url.pathname.includes('/images/');
    const isShellAsset = urlsToCache.some(path => new URL(path, self.registration.scope).pathname === url.pathname);
    const requestFresh = () => fetch(event.request).then(response => {
        if (response.ok && (isImage || isShellAsset)) {
            const copy = response.clone();
            event.waitUntil(caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, copy))
                .catch(() => {}));
        }
        return response;
    });

    event.respondWith(
        isImage
            ? caches.match(event.request).then(cached => cached || requestFresh())
            : requestFresh().catch(async () => {
                const exact = await caches.match(event.request);
                if (exact) return exact;
                if (isShellAsset) return caches.match(url.pathname, { ignoreSearch: true });
                if (event.request.mode === 'navigate') return caches.match(new URL('./index.html', self.registration.scope).href);
                return Response.error();
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
                        .filter(name => name.startsWith('homnayangi-') && name !== CACHE_NAME)
                        .map(name => caches.delete(name))
                );
            })
        ])
    );
});
