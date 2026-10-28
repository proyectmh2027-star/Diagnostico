/* Permite abrir los formularios sin señal después de la primera visita.
   Siempre intenta la red primero, así los cambios llegan en cuanto hay conexión. */
var CACHE = 'mh-formularios-v2';
var BASE = ['./', 'familia/', 'colonia/', 'manifest.webmanifest', 'assets/config.js', 'assets/esquemas.js',
            'assets/colonias.js', 'assets/app.js', 'assets/estilos.css'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(BASE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;                       // los envíos al Sheet no se tocan
  var url = new URL(req.url);
  var propio = url.origin === location.origin;
  var fuente = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!propio && !fuente) return;
  e.respondWith(fetch(req).then(function (r) {
    var copia = r.clone();
    caches.open(CACHE).then(function (c) { c.put(req, copia); });
    return r;
  }).catch(function () {
    return caches.match(req, { ignoreSearch: true });
  }));
});
