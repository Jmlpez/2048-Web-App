let cacheName = "2048-PWA";
let filesToCache = [
    "https://jmlpez.github.io/2048-Web-App/",
    "https://jmlpez.github.io/2048-Web-App/index.html",
    "https://jmlpez.github.io/2048-Web-App/css/style.css",
    "https://jmlpez.github.io/2048-Web-App/app.js",
    "https://jmlpez.github.io/2048-Web-App/main.js",
];

/* Start the service worker and cache all of the app's content */
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});

/* Serve cached content when offline */
self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
